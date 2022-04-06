# SPDX-License-Identifier: MIT

%lang starknet

from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.starknet.common.syscalls import (get_caller_address)
from starkware.cairo.common.uint256 import (
    Uint256, uint256_le, uint256_add, uint256_sub)
from starkware.cairo.common.alloc import alloc
from contracts.openzeppelin.utils.constants import TRUE
from starkware.starknet.common.messages import send_message_to_l1
from contracts.openzeppelin.access.ownable import (
    Ownable_initializer, Ownable_only_owner, Ownable_owner, Ownable_get_owner)

from contracts.Token.IBCPToken import IBCPToken

@constructor
func constructor{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        _owner_address : felt):
    Ownable_initializer(_owner_address)
    return ()
end

# ###### STORAGE #######

@storage_var
func l2_token_storage() -> (token_address : felt):
end

@storage_var
func l1_token_storage() -> (token_address : felt):
end

@storage_var
func l1_bridge_storage() -> (bridge_address : felt):
end

@storage_var
func balance(l1_user : felt) -> (amount : Uint256):
end

# ####### GETTERS #########

@view
func L2_token_address{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}() -> (
        l2_token : felt):
    let (l2_token) = l2_token_storage.read()
    return (l2_token)
end

@view
func L1_bridge_address{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}() -> (
        l1_bridge : felt):
    let (l1_bridge) = l1_bridge_storage.read()
    return (l1_bridge)
end

@view
func L1_token_address{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}() -> (
        l1_token : felt):
    let (l1_token) = l1_token_storage.read()
    return (l1_token)
end

@view
func Owner{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}() -> (owner : felt):
    let (owner) = Ownable_get_owner()
    return (owner)
end

@view
func get_balance{
        syscall_ptr : felt*, pedersen_ptr : HashBuiltin*,
        range_check_ptr}(l1_user : felt) -> (balance : Uint256):
    let (res) = balance.read(l1_user=l1_user)
    return (res)
end

# ##### EXTERNAL #######

@external
func Set_l1_token{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        _l1_token_address : felt):
    Ownable_only_owner()
    l1_token_storage.write(_l1_token_address)
    return ()
end

@external
func Set_l2_token{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        _l2_token_address : felt):
    Ownable_only_owner()
    l2_token_storage.write(_l2_token_address)
    return ()
end

@external
func Set_l1_vault{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        _l1_bridge_address : felt):
    Ownable_only_owner()
    l1_bridge_storage.write(_l1_bridge_address)
    return ()
end

@external
func withdraw{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        l1_user : felt, amount : Uint256):
    alloc_locals
    
    let (l2_user) = get_caller_address()
    let (available_balance: Uint256) = balance.read(l1_user=l1_user)

    # Verify that the amount to withdraw is lower than the available balance
    # assert (uint256_le(amount, available_balance))

    # Compute and update the new balance
    let (new_balance: Uint256) = uint256_sub(available_balance, amount)
    balance.write(l1_user, new_balance)

    # Burn ERC20 token for L2 user
    let (l2_token_address) = l2_token_storage.read()
    IBCPToken.Burn_tokens_on_l2(contract_address=l2_token_address, recipient=l2_user, amount=amount)

    # Send message to L1
    let (message_payload : felt*) = alloc()
    assert message_payload[0] = l1_user
    assert message_payload[1] = amount.low
    assert message_payload[2] = amount.high

    let (l1_bridge_address) = l1_bridge_storage.read()
    send_message_to_l1(to_address=l1_bridge_address, payload_size=3, payload=message_payload)
    return()
end

# ##### MESSAGING ######

@l1_handler
func BCPT_mint{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        from_address : felt, l1_user : felt, l2_user : felt, amount_low : felt, amount_high : felt):
    let (l1_bridge) = l1_bridge_storage.read()
    assert from_address = l1_bridge
    
    let amount : Uint256 = cast((low=amount_low, high=amount_high), Uint256)

    # Updade balance for L1 User
    let (available_balance) = balance.read(l1_user=l1_user)
    let (new_balance: Uint256, carry: felt) = uint256_add(available_balance, amount)
    assert carry = 0
    balance.write(l1_user, new_balance)

    # Mint ERC20 token for L2 user 
    let (l2_token_address) = l2_token_storage.read()
    IBCPToken.Mint_tokens_on_l2(contract_address=l2_token_address, recipient=l2_user, amount=amount)
    return ()
end
