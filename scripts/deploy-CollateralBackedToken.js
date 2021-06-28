const hre = require('hardhat');
const { deployed } = require('./deployed');
const { readFile } = require('fs/promises');

async function main() {
  const CONTRACTS_DEPLOYED = JSON.parse(await readFile('./scripts/deployed.json', 'utf-8'));
  const TOKEN_CONTRACT = CONTRACTS_DEPLOYED.collateralToken[hre.network.name].address;

  const CollateralBackedToken = await hre.ethers.getContractFactory('CollateralBackedToken');
  const collateralBackedToken = await CollateralBackedToken.deploy(TOKEN_CONTRACT, 2);
  await collateralBackedToken.deployed();
  await deployed('CollateralToken', hre.network.name, collateralBackedToken.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
