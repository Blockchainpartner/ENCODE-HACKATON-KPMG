# SPDX-License-Identifier: MIT
# OpenZeppelin Cairo Contracts v0.1.0 (token/erc20/interfaces/IERC20.cairo)

%lang starknet

from starkware.cairo.common.uint256 import Uint256

@contract_interface
namespace IBCPToken:
    func Mint_tokens_on_l2(recipient : felt, amount : Uint256):
    end

    func Burn_tokens_on_l2(recipient : felt, amount : Uint256):
    end
end
