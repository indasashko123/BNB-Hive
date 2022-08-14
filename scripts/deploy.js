const hre = require("hardhat");
const ethers = hre.ethers;

let owner;
async function main ()
{  
  const Hive = await ethers.getContractFactory("BNBHive", owner);
  hive = await Hive.deploy(owner.address);
  await hive.deployed();
  hiveAddres = hive.address;

  const Vault = await ethers.getContractFactory("BNBHiveVault", owner);
  vault = await vault.deploy(hiveAddres);
  await vault.deployed();
  vaultAddres = vault.address;

  let tx  = hive.setVaultAddress(vaultAddres);
  await tx.wait();
  let tx1  = hive.seedMarket();
  await tx1.wait();

  console.log(`Hive address - ${hiveAddres}`);
  console.log(`Vault address - ${vaultAddres}`);
}


main()
   .then(() => 
        {
        process.exit(0);
        })
   .catch((error)=> 
        {
        console.error(error);
        process.exit(1);
        });