const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Collateral Backed Token', async function () {
  let CT, ct, CBT, cbt, dev, alice, bob;
  const NAME = 'Collateral Backed Token';
  const SYMBOL = 'CBT';
  const SUPPLY = ethers.utils.parseEther('1000000');
  const AMOUNT = ethers.utils.parseEther('10');
  beforeEach(async function () {
    [dev, alice, bob] = await ethers.getSigners();
    CT = await ethers.getContractFactory('CollateralToken');
    ct = await CT.connect(dev).deploy(SUPPLY);
    await ct.deployed();
    CBT = await ethers.getContractFactory('CollateralBackedToken');
    cbt = await CBT.connect(dev).deploy();
    await cbt.deployed();
    await ct.connect(alice).approve(cbt.address, SUPPLY);
  });
  it('should be the good name', async function () {
    expect(await cbt.name()).to.equal(NAME);
  });
  it('should be the good symbol', async function () {
    expect(await cbt.symbol()).to.equal(SYMBOL);
  });
  describe('Deposit', async function () {
    let DEPOSIT;
    beforeEach(async function () {
      DEPOSIT = await cbt.connect(alice).deposit(AMOUNT);
    });
    it('should change token balances', async function () {
      expect(DEPOSIT).to.changeTokenBalances(ct, [alice, cbt], [AMOUNT.mul(-1), AMOUNT]);
    });
    it('should mint CBT to sender', async function () {
      expect(await cbt.balanceOf(alice.address)).to.equal(AMOUNT.div(2));
    });
    it('should read the good locked balance', async function () {
      expect(await cbt.connect(alice).balanceLocked(AMOUNT));
    });
  });
  describe('Withdraw', async function () {
    let WITHDRAW;
    beforeEach(async function () {
      await cbt.connect(alice).deposit(AMOUNT);
      WITHDRAW = await cbt.connect(alice).withdraw(AMOUNT);
    });
    it('should change token balances', async function () {
      expect(WITHDRAW).to.changeTokenBalances(ct, [cbt, alice], [AMOUNT.mul(-1), AMOUNT]);
    });
    it('should burn CBT from sender', async function () {
      expect(await cbt.balanceOf(alice.address)).to.equal(0);
    });
    it('should revert when amount exceeds balance', async function () {
      await expect(cbt.connect(bob).withdraw(AMOUNT)).to.revertedWith('ERC20: burn amount exceeds balance');
    });
  });
});