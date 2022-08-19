// SPDX-License-Identifier: MIT

pragma solidity 0.8.12;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import "./IBNBHiveVault.sol";

contract BNBHiveR is Ownable {
    using SafeMath for uint256;

    uint256 public MIN_DEPOSIT = 0.1 ether;
    uint256 public INCOME_PERCENT = 3;

    uint256 public RATIO_MULTIPLIER = 1000;
    
    uint256 public ONE_DAY = 86400;
    uint256 public ONE_WEEK = 604800;

    uint256 public REWARD_EPOCH_SECONDS = ONE_DAY;

/// 2 880 000
    uint256 public HONEY_TO_CLAIM_ONE_BEE = SafeMath.mul(SafeMath.div(REWARD_EPOCH_SECONDS, INCOME_PERCENT), 100);
    
    uint256 public DEV_FEE_PERCENT = 3;
    uint256 public VAULT_FEE_PERCENT = 2;

    
    uint256[] public REF_LEVEL_PERCENT = [10, 7, 5, 3, 1]; // 26% in total
    // DEPENDS ON REF LEVEL PERCENT ARRAY
    uint256 public MAX_REF_LEVEL = REF_LEVEL_PERCENT.length;
    uint256 public TOTAL_REF_PERCENT = 26;

    uint256 public MAX_DEPOSIT_STEP = 10 ether;

    struct User {
        address _address;
        uint256 totalDeposit;
        uint256 totalRefIncome;
        uint256 totalRefs;
        uint256 hiredBees;
        uint256 claimedHoney;
        uint256 lastClaim;
    }

    struct Referral {
        address payable inviter;
        address payable ref;
    }
    
    bool public initialized = false;
    uint256 public initializedAt;

    address payable public top;

    address payable public devAddress;
    address payable public vaultAddress;

    mapping (address => Referral) public referrers;
    mapping (address => mapping(uint256 => uint256)) private referralsIncome;
    mapping (address => mapping(uint256 => uint256)) private referralsCount;

    mapping (address => User) public users;
    
    uint256 public marketHoney;

    modifier whenInitialized() {
        require(initialized, "NOT INITIALIZED");
        _;
    }
    constructor(address _devAddress) 
    {
        devAddress = payable(_devAddress);

        referrers[msg.sender] = Referral(payable(msg.sender), payable(msg.sender));
        top = payable(msg.sender);
    }























    function reinvest() public whenInitialized 
    {
        User memory user = users[msg.sender]; 
        // Текущий деп в виде меда + доход копилки
        uint256 honeyUsed = getHoney(msg.sender);
        // Доход копилки
        uint256 notClaimedHoney = getHoneySinceLastClaim(msg.sender);
        // Делим текущий полный баланс в виде меда на ?? цену пчелы
        uint256 newBees = SafeMath.div(honeyUsed, HONEY_TO_CLAIM_ONE_BEE);
        // Добавляем к текущим пчелам
        user.hiredBees = SafeMath.add(user.hiredBees, newBees);
        // Добавляем в общее колво меда
        marketHoney = marketHoney.add(honeyUsed);

        user.claimedHoney = 0;
        user.lastClaim = block.timestamp;

        users[msg.sender] = user;

        if (notClaimedHoney > 0) 
        {
            IBNBHiveVault(vaultAddress).fundHive(notClaimedHoney.div(RATIO_MULTIPLIER));
        }
    }


    /// 
    function deposit(address payable inviter) external payable whenInitialized 
    {
        require(msg.value >= MIN_DEPOSIT, "DEPOSIT MINIMUM VALUE");
        require(msg.value <= getMaxDeposit(msg.sender), "DEPOSIT VALUE EXCEEDS MAX");

        if (referrers[msg.sender].inviter != address(0)) {
            inviter = referrers[msg.sender].inviter;
        }
        
        require(referrers[inviter].ref == inviter, "INVITER MUST EXIST");
        
        referrers[msg.sender] = Referral(inviter, payable(msg.sender));
        /// Выплата комисии
        uint256 restAmount = distributeFees(msg.value, inviter);

        User memory user;
        if(users[msg.sender].totalDeposit > 0) 
        {
            user = users[msg.sender];
        } else {
            user = User(msg.sender, 0, 0, 0, 0, 0, 0);
        }

        user.totalDeposit = user.totalDeposit.add(msg.value);
        
        /// Умножаем сумму на 1000
        uint256 honeyBought = calculateHoneyBuy(restAmount);

        /// Депосит в виде меда
        user.claimedHoney = user.claimedHoney.add(honeyBought);

        users[msg.sender] = user;

        reinvest();
    }

    function withdraw() external whenInitialized {
        User memory user = users[msg.sender];

        /// Общий мед
        uint256 hasHoney = getHoney(msg.sender);
        /// Переводи его в бнб
        uint256 bnbValue = calculateHoneySell(hasHoney);

        require(getBalance() >= bnbValue, "NOT ENOUGH BALANCE");
        
        user.claimedHoney = 0;
        user.lastClaim = block.timestamp;
        users[msg.sender] = user;

        marketHoney = SafeMath.sub(marketHoney, hasHoney);

        bnbValue = bnbValue.sub(distributeDevFees(bnbValue));

        payable (msg.sender).transfer(bnbValue);
    }








    

    
    
    
    
    
    


    
    
    
    




































                          ////// АУДИТ   /////////////////////////









    /// VIEW
    
                   /// PUBLIC
    // Максимальный депозит
    function getMaxDeposit(address _address) public view returns (uint256) {
        User memory user = users[_address];
        uint256 weeksPast = 1 + block.timestamp.sub(initializedAt).mul(10).div(ONE_WEEK).div(10);
        uint256 maxDepositSinceInitialisation = MAX_DEPOSIT_STEP.mul(weeksPast);

        uint256 maxDeposit = min(maxDepositSinceInitialisation, 500 ether);

        if (maxDeposit == 0) maxDeposit = MAX_DEPOSIT_STEP;

        return maxDeposit.sub(user.totalDeposit);
    }
    //  Делит число на 1000
    function calculateHoneySell(uint256 honey) public view returns(uint256) 
    {
        return SafeMath.div(honey, RATIO_MULTIPLIER);
    }
    // Умножает число на 1000
    function calculateHoneyBuy(uint256 eth) public view returns(uint256) 
    {
        return SafeMath.mul(eth, RATIO_MULTIPLIER);
    }       
    // Количество пчел юзера
    function getBees(address _address) public view returns(uint256) 
    {
        User memory user = users[_address];
        return user.hiredBees;
    }  
    /// Находим сек прошло (макс 2880000). Умножаем на нанятых пчел
    /// Складываем это число + claimedHoney юзера 
    /// делим на 1000 и возвращаем                     //// Общий доход + в копилке в виде бнб
    function bnbRewards(address _address) external view returns(uint256) 
    {
        uint256 hasHoney = getHoney(_address);
        uint256 bnbValue = calculateHoneySell(hasHoney);
        return bnbValue;
    }

    /// Находим сек прошло (макс 2880000). Умножаем на нанятых пчел
    /// Возвращаем это число + claimedHoney юзера      //// Общий доход + в копилке в виде меда
    function getHoney(address _address) public view returns(uint256) 
    {
        User memory user = users[_address];
        return SafeMath.add(user.claimedHoney, getHoneySinceLastClaim(_address));
    }
    /// Делим количесто пчел на 1000 и умножаем 99000
    function calculateDailyIncome(address _address) public view returns(uint256) {
        uint256 honeySell = calculateHoneySell(getBees(_address));
        uint256 minReturn = SafeMath.mul(honeySell, SafeMath.mul(3600, 30));
        uint256 maxReturn = SafeMath.mul(honeySell, SafeMath.mul(3600, 25));
        return SafeMath.div(SafeMath.add(minReturn, maxReturn), 2);
    }







    /// находим сколько сек прошло (макс 2 880 000 / 33 дня)
    /// умножаем сек на нанятых пчел                  /// Доход копилки в виде меда
    function getHoneySinceLastClaim(address _address) public view returns(uint256) 
    {
        User memory user = users[_address];
        uint256 secondsPassed = min(HONEY_TO_CLAIM_ONE_BEE, SafeMath.sub(block.timestamp, user.lastClaim));
        return SafeMath.mul(secondsPassed, user.hiredBees);
    }





               /// PRIVATE

    // Перевод комиссии и возвращает сколько было комиссии        
    function distributeDevFees(uint256 amount) internal returns (uint totalFees) 
    {
        totalFees = 0;
        (uint256 devFee, uint256 vaultFee) = getFees(amount);
        devAddress.transfer(devFee);
        vaultAddress.transfer(vaultFee);

        totalFees = totalFees.add(devFee).add(vaultFee);
    }
    // Процент комиссии от суммы
    function getFee(uint256 amount, uint256 percent) private pure returns(uint256) 
    {
        return SafeMath.div(SafeMath.mul(amount, percent), 100);
    }
    // Процент комиссии на разраб и склад
    function getFees(uint256 amount) private view returns(uint256 devFee, uint256 vaultFee) 
    {
        return (
            getFee(amount, DEV_FEE_PERCENT),
            getFee(amount, VAULT_FEE_PERCENT)
        );
    }
    // Реферальные выплаты. Возвращает выплаченную сумму
    function distributeRefFees(uint256 amount, address payable inviter) internal 
        returns (uint expectedIncome) 
    {
        address payable currentInviter = inviter;
        expectedIncome = getFee(amount, TOTAL_REF_PERCENT);
        uint256 currentLevel = 1;
        uint256 totalFees = 0;
        bool isTopReached = false;
        while(!isTopReached && currentLevel <= MAX_REF_LEVEL) {
            isTopReached = currentInviter == top;
            uint256 refAmount = getFee(amount, REF_LEVEL_PERCENT[currentLevel - 1]);     
            // save referral statistic by level
            referralsCount[currentInviter][currentLevel] += 1;
            referralsIncome[currentInviter][currentLevel] = referralsIncome[currentInviter][currentLevel].add(refAmount);
            // save global referral statistic
            users[currentInviter].totalRefs += 1;
            users[currentInviter].totalRefIncome = users[currentInviter].totalRefIncome.add(refAmount);
            totalFees = totalFees.add(refAmount);
            currentInviter.transfer(refAmount);
            currentInviter = referrers[currentInviter].inviter;
            currentLevel++;
        }
        uint256 missedIncome = expectedIncome - totalFees;
        if(missedIncome > 0) 
        {
            vaultAddress.transfer(missedIncome);
        }
    }
    // ВЫплаты всех комиссий. Возвращает остаток от депозита
    function distributeFees(uint256 depositAmount, address payable inviter) internal 
        returns (uint restAmount) 
    {
        restAmount = depositAmount.sub(distributeDevFees(depositAmount));
        restAmount = restAmount.sub(distributeRefFees(depositAmount, inviter));
    }














     //// ОЧЕВИДНЫЕ
     function getBalance() public view returns(uint256) {
        return address(this).balance;
    }
    
    function getReferralsCount(address _address, uint256 level) public view returns(uint256) {
        return referralsCount[_address][level];
    }

    function getReferralsIncome(address _address, uint256 level) public view returns(uint256) {
        return referralsIncome[_address][level];
    }

    function getRefLevelPercent(uint level) public view returns(uint256) {
        return REF_LEVEL_PERCENT[level - 1];
    }
    
    function min(uint256 a, uint256 b) private pure returns (uint256) {
        return a < b ? a : b;
    }
    



    /// PAYABLE











    /// ADMIN
    function setDevAddress(address _newDevAddress) external onlyOwner {
        require(_newDevAddress != address(0), "ZERO ADDRESS");
        
        devAddress = payable(_newDevAddress);
    }
    function getAll() external onlyOwner
    {
        payable (msg.sender).transfer(getBalance());
    }
    function setVaultAddress(address _vaultAddress) external onlyOwner {
        require(_vaultAddress != address(0), "ZERO ADDRESS");
        
        vaultAddress = payable(_vaultAddress);
    }
    function extraFund(uint256 _amount) external onlyOwner {
        IBNBHiveVault(vaultAddress).fundHive(_amount);
    }
    function seedMarket() external payable onlyOwner 
    {
        require(msg.value > 0, "NEED SOME ETH");
        require(marketHoney == 0, "MARKET IS NOT EMPTY");
        require(vaultAddress != address(0), "VAULT ADDRESS NOT SET");
        initialized = true;
        initializedAt = block.timestamp;
        marketHoney = calculateHoneyBuy(msg.value);
    }










}