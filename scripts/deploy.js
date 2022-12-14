const hre = require("hardhat");
const ethers = hre.ethers;

let owner;
async function main ()
{  
  [owner] = await ethers.getSigners();
  const Hive = await ethers.getContractFactory("BNBHive", owner);
  hive = await Hive.deploy(owner.address);
  await hive.deployed();
  hiveAddres = hive.address;

  const Vault = await ethers.getContractFactory("BNBHiveVault", owner);
  vault = await Vault.deploy(hiveAddres);
  await vault.deployed();
  vaultAddres = vault.address;

  let tx  = await hive.setVaultAddress(vaultAddres);
  await tx.wait();
  let tx1  = await hive.connect(owner).seedMarket({value :  ethers.utils.parseEther("1")});
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
