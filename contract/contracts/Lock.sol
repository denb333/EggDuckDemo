// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

contract Lock {
    address public owner;
    uint256 public unlockTime;

    mapping(address => uint256) public tokenBalances; // Xu của người chơi
    mapping(address => uint256) public ethBalances;   // ETH đã quy đổi (chờ rút)
    mapping(address => mapping(string => uint256)) public userDucks; // Số lượng duck theo loại
    mapping(address => bool) public duckInitialized; // Đánh dấu user đã khởi tạo duck mặc định

    event TokenEarned(address indexed user, uint256 amount);
    event Converted(address indexed user, uint256 tokenSpent, uint256 ethGained);
    event Withdrawal(address indexed from, uint amount, uint when);
    event Deposit(address indexed from, uint amount, uint when);
    event Received(address sender, uint amount);
    event DuckBought(address indexed user, string duckType, uint256 quantity);

    constructor(uint _unlockTime) payable {
        require(block.timestamp < _unlockTime, "Unlock time should be in the future");

        unlockTime = _unlockTime;
        owner = payable(msg.sender);
    }

    // Nhặt trứng → +1 xu
    function collectEgg() external {
        tokenBalances[msg.sender] += 1;
        emit TokenEarned(msg.sender, 1);
    }

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

    // Khởi tạo vịt (gọi khi liên kết lần đầu)
    function initDuck() public ensureInitDuck {
        // Đã khởi tạo trong modifier
    }

    // Kiểm tra người dùng đã khởi tạo vịt chưa
    function hasInitDuck(address user) public view returns (bool) {
        return duckInitialized[user];
    }

    // Mua vịt bằng ETH đã nạp
    function buyDuck(string memory duckType, uint256 quantity) public ensureInitDuck {
        uint256 pricePerDuckWei;

        if (keccak256(bytes(duckType)) == keccak256(bytes("white"))) {
            pricePerDuckWei = 0.005 ether;
        } else if (keccak256(bytes(duckType)) == keccak256(bytes("yellow"))) {
            pricePerDuckWei = 0.01 ether;
        } else if (keccak256(bytes(duckType)) == keccak256(bytes("red"))) {
            pricePerDuckWei = 0.015 ether;
        } else {
            revert("Invalid duck type");
        }

        uint256 totalCost = pricePerDuckWei * quantity;
        require(ethBalances[msg.sender] >= totalCost, "Not enough ETH balance");

        ethBalances[msg.sender] -= totalCost;
        userDucks[msg.sender][duckType] += quantity;

        emit DuckBought(msg.sender, duckType, quantity);
    }

    // Quy đổi xu sang ETH (10 xu = 0.001 ETH, phí 5% cho owner)
    function convertTokenToETH(uint256 amount) external {
        require(amount >= 10, "Need at least 10 tokens to convert");
        require(tokenBalances[msg.sender] >= amount, "Not enough tokens");

        uint256 ethPerToken = 0.001 ether / 10; // Mỗi token = 0.0001 ETH
        uint256 ethAmount = amount * ethPerToken;

        require(address(this).balance >= ethAmount, "Not enough ETH in contract");

        uint256 fee = (ethAmount * 5) / 100; // 5% phí
        uint256 userReceives = ethAmount - fee;

        tokenBalances[msg.sender] -= amount;
        ethBalances[msg.sender] += userReceives;
        ethBalances[owner] += fee;

        emit Converted(msg.sender, amount, userReceives);
    }


    // Rút ETH đã quy đổi
    function withdraw(uint256 amount) public {
        require(block.timestamp >= unlockTime, "You can't withdraw yet");
        require(ethBalances[msg.sender] >= amount, "Not enough balance");
        require(amount > 0, "Withdraw amount must be greater than zero");

        ethBalances[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);

        emit Withdrawal(msg.sender, amount, block.timestamp);
    }

    // Nạp ETH vào contract
    function deposit() public payable {
        require(msg.value > 0, "Deposit amount must be greater than zero");

        ethBalances[msg.sender] += msg.value;

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
