import { depositFund, withdrawFund, getUserBalanceInETH, convertTokenToETH, getUserTokenBalance, getDuckCount, buyDuck,collectEgg } from "../Ultils/contractServices.js";
import { toast } from "react-toastify";

// Khởi tạo state
let state = {
    amount: "",
    action: "deposit",
    userBalance: "0",
    convertAmount: "",
    tokenBalance: "0",
    duckAmount: "",
    duckColorSelect:"",
    duckCount: {
        yellow: "0",
        red: "0",
        white: "0"
    },
};

// Hàm để cập nhật state
const setState = (newState) => {
    state = { ...state, ...newState };
    updateUI(); // Cập nhật giao diện sau khi state thay đổi
};

// Cập nhật giao diện (UI) dựa trên state
const updateUI = () => {
    // Cập nhật userBalance
    const userBalanceElement = document.getElementById("userBalance");
    if (userBalanceElement) {
        userBalanceElement.textContent = state.userBalance;
    }

    const userBalance1Element = document.getElementById("userBalance1");
    if (userBalance1Element) {
        userBalance1Element.textContent = state.userBalance;
    }

    const userBalance2Element = document.getElementById("userBalance2");
    if (userBalance2Element) {
        userBalance2Element.textContent = state.userBalance;
    }
    // Cập nhật tokenBalance
    const tokenBalanceElement = document.getElementById("tokenBalance");
    if (tokenBalanceElement) {
        tokenBalanceElement.textContent = state.tokenBalance;
    }

    const tokenBalance1Element = document.getElementById("tokenBalance1");
    if (tokenBalance1Element) {
        tokenBalance1Element.textContent = state.tokenBalance;
    }
    //get colorDuck
    const duckRadios = document.querySelectorAll('input[name="duckColor"]');
    duckRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.checked) {
                setState({ duckColorSelect: radio.value });
                console.log("Màu: ", radio.value.toString());
            }
        });
    });

    // Cập nhật nút actionButton dựa trên action
    const actionButton = document.getElementById("actionButton");
    if (actionButton) {
        actionButton.textContent = state.action === "deposit" ? "Deposit Funds" : "Withdraw Funds";
    }

    const { yellow, red, white } = state.duckCount || {};
    const yellowElement = document.getElementById("yellowDuckCount");
    const redElement = document.getElementById("redDuckCount");
    const whiteElement = document.getElementById("whiteDuckCount");
  
    if (yellowElement) yellowElement.textContent = yellow || "0";
    if (redElement) redElement.textContent = red || "0";
    if (whiteElement) whiteElement.textContent = white || "0";
};

const updateDuckCount = async () => {
  try {
const [yellowCount, redCount, whiteCount] = await Promise.all([
      getDuckCount("yellow"),
      getDuckCount("red"),
      getDuckCount("white"),
    ]);

    setState({
      duckCount: {
        yellow: yellowCount,
        red: redCount,
        white: whiteCount,
      },
    });
  } catch (error) {
    console.error("Error updating duck count by type:", error.message);
  }
};

// Cập nhật số dư user
const updateUserBalance = async () => {
    try {
        const balance = await getUserBalanceInETH();
        setState({ userBalance: balance });
    } catch (error) {
        console.error("Error fetching user balance:", error);
    }
};

// Cập nhật số dư token
const updateTokenBalance = async () => {
    try {
        const balance = await getUserTokenBalance();
        if (balance !== undefined) {
            console.log("Token Balance:", balance.toString());
            setState({ tokenBalance: balance });
        } else {
            console.warn("Token balance is undefined, contract might not be initialized.");
        }
    } catch (error) {
        console.error("Error fetching token balance:", error);
    }
};

// Khởi tạo
const initialize = async () => {
    await updateUserBalance();
    await updateTokenBalance();
    await updateDuckCount();
  

    // Gán sự kiện cho các phần tử HTML
    const amountInput = document.getElementById("amountInput");
    const duckAmount = document.getElementById("duckCount");
    const convertAmountInput = document.getElementById("convertAmountInput");
    const depositRadio = document.getElementById("depositRadio");
    const withdrawRadio = document.getElementById("withdrawRadio");
    const actionButton = document.getElementById("actionButton");
    const convertButton = document.getElementById("convertButton");
    const buyDuckButton = document.getElementById("buyDuckButton");

    if (amountInput) {
        amountInput.addEventListener("input", (e) => {
            setAmount(e.target.value);
        });
    }
    
    if (duckAmount) {
        duckAmount.addEventListener("input", (e) => {
            setDuckAmount(e.target.value);
        });
    }

    if (convertAmountInput) {
        convertAmountInput.addEventListener("input", (e) => {
            setConvertAmount(e.target.value);
        });
    }

    if (depositRadio) {
        depositRadio.addEventListener("change", () => {
            setAction("deposit");
        });
    }

    if (withdrawRadio) {
        withdrawRadio.addEventListener("change", () => {
            setAction("withdraw");
        });
    }

    if (actionButton) {
        actionButton.addEventListener("click", handleAction);
    }

    if (convertButton) {
         
         convertButton.addEventListener("click", handleConvert);
       
    }
    if (buyDuckButton) {
        console.log(state.duckColorSelect.toString(), state.duckAmount.toString());
        buyDuckButton.addEventListener("click", handleBuyDuck);
    }
};

// Xử lý hành động deposit/withdraw
const handleAction = async () => {
    try {
        if (!state.amount || isNaN(Number(state.amount)) || Number(state.amount) <= 0) {
            toast.error("Please enter a valid amount");
            return;
        }
        if (state.action === "withdraw" && Number(state.amount) > Number(state.userBalance)) {
            toast.error("Not enough balance!");
            return;
        }

        if (state.action === "deposit") {
            await depositFund(state.amount.toString());
            toast.success(`Deposited ${state.amount} ETH successfully!`);
        } else {
            await withdrawFund(state.amount.toString());
            toast.success(`Withdrew ${state.amount} ETH successfully!`);
        }
        setState({ amount: "" });
        const amountInput = document.getElementById("amountInput");
        if (amountInput) amountInput.value = ""; // Reset input
        await updateUserBalance();
    } catch (error) {
        const errorMessage = error?.data?.message || error?.reason || "Transaction failed";
        toast.error(errorMessage);
    }
};

// Xử lý sự kiện mua duck
const handleBuyDuck = async () => {
    try {
      await buyDuck(state.duckColorSelect.toString(), state.duckAmount.toString());
      toast.success("You bought a duck successfull)!");
      await updateTokenBalance();
      await updateDuckCount();
    } catch (error) {
      const message = error?.data?.message || error?.reason || "Failed to buy duck";
      toast.error(message);
    }
};
const handlecollectEgg = async () => {
    try {
      await collectEgg();
      toast.success("You bought a duck successfull)!");
      await updateTokenBalance();
    } catch (error) {
      const message = error?.data?.message || error?.reason || "Failed to buy duck";
      toast.error(message);
    }
};

// Xử lý convert token sang ETH
const handleConvert = async () => {
    try {
        if (!state.convertAmount || isNaN(Number(state.convertAmount)) || Number(state.convertAmount) <= 0) {
            toast.error("Please enter a valid amount");
            return;
        }
        console.log("Before Conversion - Token Balance:", state.tokenBalance.toString());

        await convertTokenToETH(state.convertAmount.toString());
        toast.success(`Converted ${state.convertAmount} tokens to ETH in contract!`);

        setState({ convertAmount: "" });
        const convertAmountInput = document.getElementById("convertAmountInput");
        if (convertAmountInput) convertAmountInput.value = ""; // Reset input
        await updateTokenBalance();
        await updateUserBalance();
    } catch (error) {
        const errorMessage = error?.data?.message || error?.reason || "Conversion failed";
        toast.error(errorMessage);
    }
};

// Hàm để gán giá trị từ input
const setAmount = (value) => {
    setState({ amount: value });
};

const setConvertAmount = (value) => {
    setState({ convertAmount: value });
};

const setDuckAmount = (value) => {
    setState({ duckAmount: value });
};

const setAction = (value) => {
    setState({ action: value });
};

// Khởi tạo khi trang tải
// document.addEventListener("DOMContentLoaded", () => {
//     initialize();
// });
window.addEventListener("DOMContentLoaded", () => {
    initialize().catch(console.error);
});


export {
    initialize,
    handleAction,
    handleConvert,
    setAmount,
    setConvertAmount,
    setAction,
    state,
    handleBuyDuck,
    setDuckAmount,
    handlecollectEgg
};