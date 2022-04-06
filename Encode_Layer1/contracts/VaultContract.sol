// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import "./VaultToken.sol";
import "./Token.sol";

import "./interfaces/IStarknetCore.sol";
import "@openzeppelin/contracts/token/ERC20//utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 *  Implementation of the VaultContract .
 *
 * This Smart Contract is an implementation of a vault that allows a user to deposit an ERC20 token in exchage of a ProofToken provided by the vault.
 * The the conversion rate ProofToken/ Token increases by time. So basicly the user is staking his token to get some rewards
 * The users are allowed to withdraw their Token by providing the ProofToken.
 *
 */

contract VaultContract is Ownable {
    using SafeERC20 for Token;

    // the current balance of Proof Tokens minted for each user
    mapping(address => uint256) balance;
    // the current balance of deposited Tokens for each user
    mapping(address => uint256) deposit;

    Token public token;
    VaultToken public vaultToken;
    IStarknetCore public starknetCore;
    // the exact time when the contract is deployed
    uint256 startingTime;
    uint256 l2_bridge_address;
    uint256 l2_selector;

    event Deposit(address from, uint256 amount);
    event DepositL2(address from, uint256 amount, uint256 l2_user, bytes32 message);
    event Witdhraw(address from, uint256 amount);

    constructor(
        address token_address,
        address VaultToken_address,
        address starknetCore_address
    ) {
        token = Token(token_address);
        vaultToken = VaultToken(VaultToken_address);
        starknetCore = IStarknetCore(starknetCore_address);
        startingTime = block.timestamp;
    }

    function setL2Bridge(uint256 _address) external onlyOwner {
        l2_bridge_address = _address;
    }

    function setL2Selector(uint256 selector) external onlyOwner {
        l2_selector = selector;
    }

    /**
     * this function takes in parameter the amount that the user wants to deposit, transfer it
     *  to the smart contract and then mint to ProofToken equivalent to that amount
     */

    function depositToken(uint256 amount) external {
        require(
            amount > 0 && token.balanceOf(msg.sender) >= amount,
            " insufficient balance"
        );

        /* We should ask for the  "approval" of the user  */

        token.safeTransferFrom(msg.sender, address(this), amount);
        uint256 toMint = getProofTokensValue(amount);
        vaultToken.mint(msg.sender, toMint);
        deposit[msg.sender] += amount;
        balance[msg.sender] += toMint;
        emit Deposit(msg.sender, amount);
    }

    /**
     * this function takes in parameter the amount that the user wants to withdraw, transfer it
     * to the user wallet and then burn to ProofToken equivalent to that amount
     */

    function withdrawToken(uint256 amount) external {
        uint256 value = getProofTokensValue(amount);
        require(
            vaultToken.balanceOf(msg.sender) >= value,
            "not enough tokens "
        );
        balance[msg.sender] -= value;
        if (amount >= deposit[msg.sender]) {
            deposit[msg.sender] = 0;
        } else {
            deposit[msg.sender] -= amount;
        }
        vaultToken.burn(msg.sender, value);
        token.safeTransfer(msg.sender, amount);
        emit Witdhraw(msg.sender, amount);
    }

    /**
     * this function takes in parameter an  amount of Tokens, and convert it to the  equivalent  amount of the
     * ProofToken at the time of calling the function
     */

    function getProofTokensValue(uint256 amount) public view returns (uint256) {
        uint256 time = (block.timestamp - startingTime);
        uint256 rate = (600 * (10**18)) / time;
        uint256 newValue = (amount * rate) / 10**18;
        return newValue;
    }

    /**
     * this function takes in parameter an  address of a user , and calculate the reward of staking by subtracting the actual balance
     * of Proof Tokens ( converted to the amount of token) from the total amount of the deposited tokens.
     */

    function getUserReward(address user) public view returns (uint256) {
        uint256 time = (block.timestamp - startingTime) * 10**18;
        uint256 rate = time / 600;
        uint256 value = (balance[user] * rate) / 10**18;
        uint256 reward = value - deposit[user];

        return reward;
    }

    /**
     * this function takes in parameter an  address of a user , and returns the  total amount of the deposited tokens.
     */

    function getUserDeposit(address user) public view returns (uint256) {
        return deposit[user];
    }

    /**
     * L2 version of deposit function
     */

    function depositTokenL2(uint256 amount, uint256 l2_user) external {
        require(
            amount > 0 && token.balanceOf(msg.sender) >= amount,
            " insufficient balance"
        );

        /* We should ask for the  "approval" of the user  */

        token.safeTransferFrom(msg.sender, address(this), amount);
        uint256 toMint = getProofTokensValue(amount);
        deposit[msg.sender] += amount;
        balance[msg.sender] += toMint;

		uint256 amountLow = amount % 2**128;
		uint256 amountHigh = amount / 2**128;

        /* Send message to L2  */
        uint256[] memory payload = new uint256[](3);
        payload[0] = uint256(uint160(msg.sender));
        payload[1] = l2_user;
        payload[2] = amountLow;
        payload[3] = amountHigh;
        bytes32 message = starknetCore.sendMessageToL2(l2_bridge_address, l2_selector, payload);
        emit DepositL2(msg.sender, amount, l2_user, message);
    }

    /**
     * L2 version of withdraw function
     */

    function withdrawTokenL2(uint256 amount) external {
        uint256 amountLow = amount % 2**128;
        uint256 amountHigh = amount / 2**128;

        uint256[] memory payload = new uint256[](3);
        payload[0] = uint256(uint160(msg.sender));
        payload[1] = amountLow;
        payload[2] = amountHigh;
        starknetCore.consumeMessageFromL2(l2_bridge_address, payload);

        uint256 value = getProofTokensValue(amount);
        require(balance[msg.sender] >= value, "not enough tokens ");
        balance[msg.sender] -= value;
        if (amount >= deposit[msg.sender]) {
            deposit[msg.sender] = 0;
        } else {
            deposit[msg.sender] -= amount;
        }
        token.safeTransfer(msg.sender, amount);
        emit Witdhraw(msg.sender, amount);
    }
}
