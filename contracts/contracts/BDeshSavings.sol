// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title BDeshSavings
 * @notice Tracks user savings pots on Celo for BDeshPay app
 * @dev Each user can create named pots and deposit/withdraw cUSD
 */
contract BDeshSavings is Ownable, ReentrancyGuard {
    IERC20 public immutable cUSD;

    struct Pot {
        string name;
        string emoji;
        uint256 balance;
        uint256 createdAt;
        bool exists;
    }

    // user => potId => Pot
    mapping(address => mapping(bytes32 => Pot)) public pots;
    // user => list of pot IDs
    mapping(address => bytes32[]) public userPotIds;

    uint256 public totalDeposited;
    uint256 public totalUsers;
    mapping(address => bool) public hasInteracted;

    // ---- Events ----
    event PotCreated(address indexed user, bytes32 indexed potId, string name, string emoji);
    event Deposited(address indexed user, bytes32 indexed potId, uint256 amount, uint256 newBalance);
    event Withdrawn(address indexed user, bytes32 indexed potId, uint256 amount, uint256 newBalance);
    event PotDeleted(address indexed user, bytes32 indexed potId);

    // ---- Errors ----
    error PotAlreadyExists(bytes32 potId);
    error PotNotFound(bytes32 potId);
    error InsufficientBalance(uint256 requested, uint256 available);
    error ZeroAmount();
    error EmptyName();

    constructor(address _cUSD) Ownable(msg.sender) {
        cUSD = IERC20(_cUSD);
    }

    // ---- External functions ----

    /**
     * @notice Create a new savings pot
     * @param potId Unique identifier (keccak256 of a string from frontend)
     * @param name Display name (Bengali or English)
     * @param emoji Single emoji for the pot
     */
    function createPot(
        bytes32 potId,
        string calldata name,
        string calldata emoji
    ) external {
        if (bytes(name).length == 0) revert EmptyName();
        if (pots[msg.sender][potId].exists) revert PotAlreadyExists(potId);

        if (!hasInteracted[msg.sender]) {
            hasInteracted[msg.sender] = true;
            totalUsers++;
        }

        pots[msg.sender][potId] = Pot({
            name: name,
            emoji: emoji,
            balance: 0,
            createdAt: block.timestamp,
            exists: true
        });
        userPotIds[msg.sender].push(potId);

        emit PotCreated(msg.sender, potId, name, emoji);
    }

    /**
     * @notice Deposit cUSD into a pot
     * @param potId The pot to deposit into
     * @param amount Amount in wei (18 decimals)
     */
    function deposit(bytes32 potId, uint256 amount) external nonReentrant {
        if (amount == 0) revert ZeroAmount();
        Pot storage pot = pots[msg.sender][potId];
        if (!pot.exists) revert PotNotFound(potId);

        cUSD.transferFrom(msg.sender, address(this), amount);
        pot.balance += amount;
        totalDeposited += amount;

        emit Deposited(msg.sender, potId, amount, pot.balance);
    }

    /**
     * @notice Withdraw cUSD from a pot
     * @param potId The pot to withdraw from
     * @param amount Amount in wei (18 decimals)
     */
    function withdraw(bytes32 potId, uint256 amount) external nonReentrant {
        if (amount == 0) revert ZeroAmount();
        Pot storage pot = pots[msg.sender][potId];
        if (!pot.exists) revert PotNotFound(potId);
        if (pot.balance < amount) revert InsufficientBalance(amount, pot.balance);

        pot.balance -= amount;
        cUSD.transfer(msg.sender, amount);

        emit Withdrawn(msg.sender, potId, amount, pot.balance);
    }

    /**
     * @notice Delete a pot (must be empty)
     */
    function deletePot(bytes32 potId) external {
        Pot storage pot = pots[msg.sender][potId];
        if (!pot.exists) revert PotNotFound(potId);

        // Auto-withdraw remaining balance
        if (pot.balance > 0) {
            uint256 bal = pot.balance;
            pot.balance = 0;
            cUSD.transfer(msg.sender, bal);
        }

        delete pots[msg.sender][potId];

        // Remove from array
        bytes32[] storage ids = userPotIds[msg.sender];
        for (uint256 i = 0; i < ids.length; i++) {
            if (ids[i] == potId) {
                ids[i] = ids[ids.length - 1];
                ids.pop();
                break;
            }
        }

        emit PotDeleted(msg.sender, potId);
    }

    // ---- View functions ----

    function getPot(address user, bytes32 potId) external view returns (Pot memory) {
        return pots[user][potId];
    }

    function getUserPotIds(address user) external view returns (bytes32[] memory) {
        return userPotIds[user];
    }

    function getUserTotalBalance(address user) external view returns (uint256 total) {
        bytes32[] memory ids = userPotIds[user];
        for (uint256 i = 0; i < ids.length; i++) {
            total += pots[user][ids[i]].balance;
        }
    }

    function getContractBalance() external view returns (uint256) {
        return cUSD.balanceOf(address(this));
    }
}
