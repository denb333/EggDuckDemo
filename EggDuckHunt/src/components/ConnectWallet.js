import { initialize, getContract } from "../Ultils/contractServices.js";
//import { toast } from "react-toastify";


document.addEventListener('DOMContentLoaded', function () {
    const connectButton = document.getElementById('connectButton');
    const loginContainer = document.getElementById('loginContainer');
    const userProfile = document.getElementById('userProfile');
    const userName = document.getElementById('userName');
    const nameInput = document.getElementById('nameInput');
    const tooltip = document.getElementById('tooltip');
    const shortAddress = document.getElementById('shortAddress');
    const balanceElement = document.getElementById('balance');
    const logoutButton = document.getElementById('logoutButton');
    const avatar = document.getElementById('avatar');

    let account = '';
    let walletName = '';
    let balance = '0';
    let web3;

    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
    }

    async function requestAccount() {
        if (!window.ethereum) {
            alert("Vui lòng cài đặt MetaMask!");
            throw new Error("MetaMask not installed");
        }

        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        
        return accounts[0];
    }

    async function connectWallet() {
        try {
            await initialize();
            const account = await requestAccount();
            if (!account) return;
           
            console.log("Account received:", account);

            
            const contract = getContract();
            const duckCount = await contract.getDuckCount(account, "white");

            console.log("Duck đã được khởi tạo:", duckCount);

            sessionStorage.setItem("userAddress", account);
            sessionStorage.setItem("shortAddress", shortenAddress(account));

            if (Number(duckCount) > 0) {
                console.log("Duck đã được khởi tạo:", duckCount);
                // Chuyển hướng sau khi kiểm tra và xác nhận thông tin thành công
                window.location.href = "src/index.html";

            } else {
                console.log("Chưa có duck, gọi init...");
                const tx = await contract.initDuck();
                await tx.wait();  // Đảm bảo giao dịch đã hoàn tất trước khi chuyển hướng
                console.log("Duck đã được khởi tạo, chuyển hướng...");
                window.location.href = "src/index.html";
  // Chuyển hướng sau khi khởi tạo duck thành công
            }
        } catch (error) {
            console.error("Kết nối ví thất bại:", error);
        }
    }
    

     // Connect to MetaMask
            // const connectMetaMask = async () => {
            //     if (window.ethereum) {
            //         try {
            //             await window.ethereum.request({ method: 'eth_requestAccounts' });
            //             const accounts = await web3.eth.getAccounts();
            //             account = accounts[0];
            //             checkWalletName(account);
            //             getBalance(account);
            //             showUserProfile();

            //             // Redirect to game page after successful login
            //             setTimeout(() => {
            //                 window.location.href = "src/index.html";
            //             }, 1000);
            //         } catch (error) {
            //             console.error("Lỗi khi kết nối MetaMask:", error);
            //             alert("Đã xảy ra lỗi khi kết nối MetaMask. Vui lòng thử lại.");
            //         }
            //     } else {
            //         alert('Vui lòng cài đặt MetaMask để sử dụng ứng dụng này.');
            //     }
            // };

            // // Get wallet balance
            // const getBalance = async (address) => {
            //     const weiBalance = await web3.eth.getBalance(address);
            //     const ethBalance = web3.utils.fromWei(weiBalance, 'ether');
            //     balance = parseFloat(ethBalance).toFixed(4);
            //     balanceElement.textContent = balance;

            //     // Store balance in sessionStorage for use in the game page
            //     sessionStorage.setItem('userBalance', balance);
            //     sessionStorage.setItem('userAddress', address);
            // };

            // // Check if wallet name exists in localStorage
            // const checkWalletName = (address) => {
            //     const savedName = localStorage.getItem(`walletName_${address}`);
            //     if (savedName) {
            //         walletName = savedName;
            //         userName.textContent = savedName;
            //         setAvatarInitial(savedName);

            //         // Store name in sessionStorage for use in the game page
            //         sessionStorage.setItem('userName', savedName);
            //     } else {
            //         const enteredName = prompt("Nhập tên của bạn:");
            //         if (enteredName) {
            //             localStorage.setItem(`walletName_${address}`, enteredName);
            //             walletName = enteredName;
            //             userName.textContent = enteredName;
            //             setAvatarInitial(enteredName);

            //             // Store name in sessionStorage for use in the game page
            //             sessionStorage.setItem('userName', enteredName);
            //         }
            //     }
            // };

    function shortenAddress(address) {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    }

    function setAvatarInitial(name) {
        if (!name) return;
        const initial = name.charAt(0).toUpperCase();
        avatar.textContent = initial;
        sessionStorage.setItem('userInitial', initial);
    }

    function showUserProfile(account) {
        loginContainer.style.display = 'none';
        userProfile.style.display = 'flex';
        shortAddress.textContent = shortenAddress(account);
        sessionStorage.setItem('shortAddress', shortenAddress(account));
    }

    function handleLogout() {
        userProfile.style.display = 'none';
        loginContainer.style.display = 'block';
        sessionStorage.clear();
        account = '';
        walletName = '';
        balance = '0';
    }

    function enableEditName() {
        userName.style.display = 'none';
        nameInput.style.display = 'block';
        nameInput.value = walletName;
        nameInput.focus();
    }

    function saveName() {
        const newName = nameInput.value.trim();
        if (newName) {
            walletName = newName;
            userName.textContent = newName;
            localStorage.setItem(`walletName_${account}`, newName);
            sessionStorage.setItem('userName', newName);
            setAvatarInitial(newName);
        }
        nameInput.style.display = 'none';
        userName.style.display = 'block';
    }

    function showTooltip() {
        tooltip.style.display = 'block';
        setTimeout(() => {
            tooltip.style.transform = 'translateY(0)';
            tooltip.style.opacity = '1';
        }, 50);
    }

    function hideTooltip() {
        tooltip.style.transform = 'translateY(10px)';
        tooltip.style.opacity = '0';
        setTimeout(() => {
            tooltip.style.display = 'none';
        }, 300);
    }

    connectButton.addEventListener('click', connectWallet);
    connectButton.addEventListener('mousedown', () => connectButton.style.transform = 'scale(0.95)');
    connectButton.addEventListener('mouseup', () => connectButton.style.transform = 'scale(1)');

    logoutButton.addEventListener('click', handleLogout);
    userName.addEventListener('dblclick', enableEditName);

    nameInput.addEventListener('blur', saveName);
    nameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') saveName();
    });

    userProfile.addEventListener('mouseenter', showTooltip);
    userProfile.addEventListener('mouseleave', hideTooltip);
});
