import { BrowserProvider, Contract, parseEther, formatEther } from "ethers";
import Lock_ABI from "./Lock_ABI.json";
import { CONTRACT_ADDRESS } from "./constants";

let provider;
let signer;
let contract;

let currentAccount = null;

// Hàm khởi tạo provider, signer, và contract
export const initialize = async () => {
  if (typeof window.ethereum !== "undefined") {
    provider = new BrowserProvider(window.ethereum);
    signer = await provider.getSigner();
    contract = new Contract(CONTRACT_ADDRESS, Lock_ABI, signer);
  } else {
    throw new Error("Please install MetaMask!");
  }
};

export const getContract = () => contract;
// Đảm bảo contract được khởi tạo trước khi dùng
const ensureInitialized = async () => {
  if (!provider || !signer || !contract) {
    await initialize();
  }
};

// Yêu cầu tài khoản từ MetaMask
export const requestAccount = async () => {
  try {
    await ensureInitialized();
    const accounts = await provider.send("eth_requestAccounts", []);
    currentAccount = accounts[0];
    sessionStorage.setItem("connectedAccount", currentAccount); // Optional
    return currentAccount;
  } catch (error) {
    console.error("Error requesting account:", error.message);
    return null;
  }
};
export const getCurrentAccount = async () => {
  if (currentAccount) return currentAccount;
  const saved = sessionStorage.getItem("connectedAccount");
  if (saved) {
    currentAccount = saved;
    return currentAccount;
  }
  return await requestAccount(); // fallback
};

// Kiểm tra chủ sở hữu contract
// export const getContractOwner = async () => {
//   try {
//     await ensureInitialized();
//     const ownerAddress = await contract.owner();
//     return ownerAddress;
//   } catch (error) {
//     console.error("Error getting contract owner:", error.message);
//     return null;
//   }
// };
export const getContractOwner = async () => {
  try {
    await ensureInitialized();
    const ownerAddress = await contract.getOwner(); 
    return ownerAddress;
  } catch (error) {
    console.error("Error getting contract owner:", error.message);
    return null;
  }
};
export const getUserBalanceInETH = async () => {
  try {
    await ensureInitialized();
    const account = await getCurrentAccount();
    if (!account) return "0";

    const balanceWei = await contract.getUserBalance(account);
    return formatEther(balanceWei);
  } catch (error) {
    console.error("Error getting user balance:", error.message);
    return "0";
  }
};

// Kiểm tra xem tài khoản hiện tại có phải là owner không
export const isOwner = async () => {
  try {
    const owner = await getContractOwner();
    const account = await requestAccount();
    return account?.toLowerCase() === owner?.toLowerCase();
  } catch (error) {
    console.error("Error checking ownership:", error.message);
    return false;
  }
};

// Lấy số dư của contract
export const getContractBalanceInETH = async () => {
  try {
    await ensureInitialized();
    const balanceWei = await provider.getBalance(CONTRACT_ADDRESS);
    return formatEther(balanceWei);
  } catch (error) {
    console.error("Error getting contract balance:", error.message);
    return "0";
  }
};

// Gửi ETH vào contract
export const depositFund = async (depositValue) => {
  try {
    await ensureInitialized();
    const ethValue = parseEther(depositValue);
    const deposit = await contract.deposit({ value: ethValue });
    await deposit.wait();
    console.log(`Deposited ${depositValue} ETH successfully`);
  } catch (error) {
    console.error("Error depositing funds:", error.message);
  }
};
export const convertTokenToETH = async (amount) => {
  await ensureInitialized();
  const account = await requestAccount();
  if (!account) throw new Error("No connected account!");

  const tx = await contract.convertTokenToETH(amount);

  await tx.wait();
};
export const collectEgg = async () => {
  try {
    await ensureInitialized();
    const tx = await contract.collectEgg();
    await tx.wait();
    console.log("Egg collected! +1 token");
  } catch (error) {
    console.error("Error collecting egg:", error.message);
  }
};

// Gọi hàm collectDuck từ smart contract
// export const collectDuck = async () => {
//   try {
//     await ensureInitialized();
//     const tx = await contract.collectDuck();
//     await tx.wait();
//     console.log("Duck collected! +3 tokens");
//   } catch (error) {
//     console.error("Error collecting duck:", error.message);
//   }
// };


export const withdrawFund = async (amount) => {
  try {
    await ensureInitialized();
    const account = await requestAccount();
    if (!account) throw new Error("No account connected!");

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      throw new Error("Invalid withdrawal amount");
    }

    const amountInWei = parseEther(amount.toString());
    console.log("Calling withdraw with amount:", amountInWei.toString());

    const withdrawTx = await contract.withdraw(amountInWei);
    await withdrawTx.wait();

    console.log(`Successfully withdrew ${amount} ETH to ${account}`);
  } catch (error) {
    console.error("Error withdrawing funds:", error.message);
    throw error;
  }
};

export const getUserTokenBalance = async () => {
  try {
    await ensureInitialized(); // Đảm bảo contract đã được khởi tạo

    const account = await requestAccount();
    if (!account) throw new Error("No accounts found");

    const balance = await contract.getUserTokenBalance(account); // Đúng cú pháp của ethers.js
    return balance.toString();
  } catch (error) {
    console.error("Error fetching token balance:", error);
    return "0";
  }
  
};
export const buyDuck = async (duckType, quantity) => {
  //(duckType, quantity, pricePerDuckWei)
  try {
    await ensureInitialized();
    const account = await getCurrentAccount();
    if (!account) throw new Error("No account connected");

   // const totalCostWei = BigInt(quantity) * BigInt(pricePerDuckWei);

    const tx = await contract.buyDuck(duckType, quantity,{
      gasLimit: 300000, // optional
    });
    await tx.wait();

    //console.log(`Bought ${quantity} ${duckType} duck(s) for ${totalCostWei} wei`);
  } catch (error) {
    console.error("Error buying duck:", error.message);
    throw error;
  }
};
export const getDuckCount = async (duckType) => {
  try {
    await ensureInitialized();
    const account = await getCurrentAccount();
    if (!account) throw new Error("No account connected");

    const count = await contract.getDuckCount(account, duckType);
    return count.toString();
  } catch (error) {
    console.error("Error getting duck count:", error.message);
    return "0";
  }
};



