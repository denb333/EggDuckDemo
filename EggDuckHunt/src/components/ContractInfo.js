import {
    getContractBalanceInETH,
    getContractOwner,
    getUserBalanceInETH
} from "../Ultils/contractServices"; // Đảm bảo đúng path

const balanceSpan = document.getElementById("contractBalance");
const accountSpan = document.getElementById("connectedAccount");
const ownerSpan = document.getElementById("contractOwner");

// Giả sử bạn đang sử dụng MetaMask để kết nối ví
//   async function getConnectedAccount() {
//     if (window.ethereum) {
//       const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
//       return accounts[0];
//     } else {
//       alert("Please install MetaMask!");
//       return null;
//     }
//   }
async function getConnectedAccount() {
    const savedAccount = sessionStorage.getItem("userAddress");
    if (savedAccount) {
        return savedAccount;
    }

    // Nếu không có thì fallback gọi MetaMask
    if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        return accounts[0] || null;
    } else {
        alert("Please install MetaMask!");
        return null;
    }
}


async function updateContractInfo() {
    try {
        const balance = await getContractBalanceInETH();
        const owner = await getContractOwner();
        const account = await getConnectedAccount();

        balanceSpan.textContent = balance;
        ownerSpan.textContent = owner;
        accountSpan.textContent = account;
    } catch (error) {
        console.error("Error fetching contract info:", error);
    }
}

updateContractInfo();
