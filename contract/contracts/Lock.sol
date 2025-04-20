// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

contract Lock {
    address public owner;
    uint256 public unlockTime;

    mapping(address => uint256) public tokenBalances; // Xu của người chơi
    mapping(address => uint256) public ethBalances;   // ETH đã quy đổi (chờ rút)

    mapping(address => mapping(string => uint256)) public userDucks; // Số lượng duck theo loại cho từng user
    mapping(address => bool) public duckInitialized; // Đánh dấu user đã khởi tạo duck mặc định

    event TokenEarned(address indexed user, uint256 amount);
    event Converted(address indexed user, uint256 tokenSpent, uint256 ethGained);
    event Withdrawal(address indexed from, uint amount, uint when);
    event Deposit(address indexed from, uint amount, uint when);
    event Received(address sender, uint amount);
    event DuckBought(address indexed user, string duckType, uint256 quantity);

    constructor(uint _unlockTime) payable {
        require(
            block.timestamp < _unlockTime,
            "Unlock time should be in the future"
        );

        unlockTime = _unlockTime;
        owner = payable(msg.sender);
    }

    // Nhặt trứng → +1 xu
    function collectEgg() external {
        tokenBalances[msg.sender] += 1;
        emit TokenEarned(msg.sender, 1);
    }

    // Nhặt vịt → +3 xu
    //function collectDuck() external {
    //    tokenBalances[msg.sender] += 3;
    //    emit TokenEarned(msg.sender, 3);
    //}

    // Modifier để đảm bảo user luôn có 3 vịt trắng khi liên kết
    modifier ensureInitDuck() {
        if (!duckInitialized[msg.sender]) {
            userDucks[msg.sender]["white"] = 3;
            userDucks[msg.sender]["yellow"] = 0;
            userDucks[msg.sender]["red"] = 0;
            duckInitialized[msg.sender] = true;
        }
        _;
    }

    function initDuck() public ensureInitDuck {
    // Hàm không làm gì thêm vì ensureInitDuck đã khởi tạo sẵn
    }

    function hasInitDuck(address user) public view returns (bool) {
        return duckInitialized[user];
    }

    // Mua vịt (trừ ETH trong contract)
    function buyDuck(string memory duckType, uint256 quantity) public ensureInitDuck {
        // uint256 pricePerDuckWei
        //uint256 totalCost = quantity * pricePerDuckWei;
        uint256 totalCost = 0.005 * 1 ether;
        require(ethBalances[msg.sender] >= totalCost, "Not enough ETH balance");

        ethBalances[msg.sender] -= totalCost;
        userDucks[msg.sender][duckType] += quantity;

        emit DuckBought(msg.sender, duckType, quantity);
    }

    // Quy đổi xu thành ETH (10 xu = 1 ETH)
    function convertTokenToETH() external {
        uint256 tokenAmount = tokenBalances[msg.sender];
        require(tokenAmount >= 10, "Need at least 10 tokens to convert");

        uint256 ethAmount = tokenAmount / 10; // Phần nguyên
        uint256 tokensToSpend = ethAmount * 10;

        require(address(this).balance >= ethAmount * 1 ether, "Not enough ETH in contract");

        tokenBalances[msg.sender] -= tokensToSpend;
        ethBalances[msg.sender] += ethAmount * 1 ether;

        emit Converted(msg.sender, tokensToSpend, ethAmount * 1 ether);
    }

    // Rút ETH đã quy đổi
     function withdraw(uint256 amount) public payable {
        require(block.timestamp >= unlockTime, "You can't withdraw yet");
        require(ethBalances[msg.sender] >= amount, "Not enough balance");
        require(amount > 0, "Withdraw amount must be greater than zero");

        ethBalances[msg.sender] -= amount; // Trừ số dư trước khi chuyển ETH
        payable(msg.sender).transfer(amount); // Gửi ETH về ví của user

        emit Withdrawal(msg.sender, amount, block.timestamp);
    }   

    // Nạp ETH vào contract để quy đổi
     function deposit() public payable {
        require(msg.value > 0, "Deposit amount must be greater than zero");

        ethBalances[msg.sender] += msg.value; // Cập nhật số dư user

        emit Deposit(msg.sender, msg.value, block.timestamp);
    }

    // Xem số lượng duck theo loại
    function getDuckCount(address user, string memory duckType) public view returns (uint256) {
        return userDucks[user][duckType];
    }

    // Xem số dư xu
    function getUserTokenBalance(address user) external view returns (uint256) {
        return tokenBalances[user];
    }

    // Xem số dư ETH đã quy đổi
    function getUserBalance(address user) external view returns (uint256) {
        return ethBalances[user];
    }

    // Xem số dư ETH trong contract
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    // Nhận ETH trực tiếp
    receive() external payable {
        emit Received(msg.sender, msg.value);
    }

    // Lấy owner
    function getOwner() public view returns (address) {
        return owner;
    }
}