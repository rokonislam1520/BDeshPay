const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BDeshSavings", function () {
  let savings, mockCUSD, owner, user1, user2;
  const POT_ID = ethers.keccak256(ethers.toUtf8Bytes("eid-savings"));
  const AMOUNT = ethers.parseUnits("10", 18);

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    // Deploy mock cUSD ERC20
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    mockCUSD = await MockERC20.deploy("Celo Dollar", "cUSD");
    await mockCUSD.mint(user1.address, ethers.parseUnits("1000", 18));
    await mockCUSD.mint(user2.address, ethers.parseUnits("1000", 18));

    const BDeshSavings = await ethers.getContractFactory("BDeshSavings");
    savings = await BDeshSavings.deploy(await mockCUSD.getAddress());
  });

  describe("Pot Management", function () {
    it("should create a pot", async function () {
      await savings.connect(user1).createPot(POT_ID, "ঈদ সেভিংস", "🌙");
      const pot = await savings.getPot(user1.address, POT_ID);
      expect(pot.name).to.equal("ঈদ সেভিংস");
      expect(pot.exists).to.be.true;
    });

    it("should fail creating duplicate pot", async function () {
      await savings.connect(user1).createPot(POT_ID, "ঈদ সেভিংস", "🌙");
      await expect(
        savings.connect(user1).createPot(POT_ID, "Duplicate", "❌")
      ).to.be.revertedWithCustomError(savings, "PotAlreadyExists");
    });

    it("should track user count", async function () {
      expect(await savings.totalUsers()).to.equal(0);
      await savings.connect(user1).createPot(POT_ID, "Test", "🏦");
      expect(await savings.totalUsers()).to.equal(1);
      // Same user, no increment
      const POT_ID_2 = ethers.keccak256(ethers.toUtf8Bytes("pot2"));
      await savings.connect(user1).createPot(POT_ID_2, "Test2", "💰");
      expect(await savings.totalUsers()).to.equal(1);
    });
  });

  describe("Deposits & Withdrawals", function () {
    beforeEach(async function () {
      await savings.connect(user1).createPot(POT_ID, "Test", "🏦");
      await mockCUSD.connect(user1).approve(await savings.getAddress(), ethers.MaxUint256);
    });

    it("should deposit cUSD", async function () {
      await savings.connect(user1).deposit(POT_ID, AMOUNT);
      const pot = await savings.getPot(user1.address, POT_ID);
      expect(pot.balance).to.equal(AMOUNT);
    });

    it("should withdraw cUSD", async function () {
      await savings.connect(user1).deposit(POT_ID, AMOUNT);
      const before = await mockCUSD.balanceOf(user1.address);
      await savings.connect(user1).withdraw(POT_ID, AMOUNT);
      const after = await mockCUSD.balanceOf(user1.address);
      expect(after - before).to.equal(AMOUNT);
    });

    it("should revert on insufficient balance", async function () {
      await savings.connect(user1).deposit(POT_ID, AMOUNT);
      await expect(
        savings.connect(user1).withdraw(POT_ID, AMOUNT * 2n)
      ).to.be.revertedWithCustomError(savings, "InsufficientBalance");
    });

    it("should emit events", async function () {
      await expect(savings.connect(user1).deposit(POT_ID, AMOUNT))
        .to.emit(savings, "Deposited")
        .withArgs(user1.address, POT_ID, AMOUNT, AMOUNT);
    });
  });
});
