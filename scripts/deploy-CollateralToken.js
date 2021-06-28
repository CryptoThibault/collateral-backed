const { ethers } = require('ethers');
const hre = require('hardhat');
const { deployed } = require('./deployed');

async function main() {
  const CollateralToken = await hre.ethers.getContractFactory('CollateralToken');
  const collateralToken = await CollateralToken.deploy(ethers.utils.parseEther('1000000'));
  await collateralToken.deployed();
  await deployed('CollateralToken', hre.network.name, collateralToken.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
