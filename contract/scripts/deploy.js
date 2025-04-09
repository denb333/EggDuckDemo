async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying with account:", deployer.address);
  
    const Lock = await ethers.getContractFactory("Lock");
    const lock = await Lock.deploy(); // Thêm constructor args nếu có
  
    console.log("Contract deployed at:", lock.address);
  }
  
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
  