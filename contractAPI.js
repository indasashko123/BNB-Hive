const web3 = new Web3('http://localhost:8545');
const gasPriseRegistration = 250000;
const gasBuy = 900000;
const HiveAddress = "";
const VaultAddress = "";

const hiveAbi = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_devAddress",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "_address",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "ethAmount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "honeyAmount",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "inviter",
          "type": "address"
        }
      ],
      "name": "Deposit",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "_address",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "honeyAmount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "beesCount",
          "type": "uint256"
        }
      ],
      "name": "Reinvest",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "_address",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "honeyAmount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "bnbAmount",
          "type": "uint256"
        }
      ],
      "name": "Withdraw",
      "type": "event"
    },
    {
      "stateMutability": "payable",
      "type": "fallback"
    },
    {
      "inputs": [],
      "name": "DEV_FEE_PERCENT",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "HONEY_TO_CLAIM_ONE_BEE",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "INCOME_PERCENT",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "MAX_DEPOSIT_STEP",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "MAX_REF_LEVEL",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "MIN_DEPOSIT",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "ONE_DAY",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "ONE_WEEK",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "RATIO_MULTIPLIER",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "REF_LEVEL_PERCENT",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "REWARD_EPOCH_SECONDS",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "TOTAL_REF_PERCENT",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "VAULT_FEE_PERCENT",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_address",
          "type": "address"
        }
      ],
      "name": "bnbRewards",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_address",
          "type": "address"
        }
      ],
      "name": "calculateDailyIncome",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "eth",
          "type": "uint256"
        }
      ],
      "name": "calculateHoneyBuy",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "honey",
          "type": "uint256"
        }
      ],
      "name": "calculateHoneySell",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address payable",
          "name": "inviter",
          "type": "address"
        }
      ],
      "name": "deposit",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "devAddress",
      "outputs": [
        {
          "internalType": "address payable",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        }
      ],
      "name": "extraFund",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getAll",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getBalance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_address",
          "type": "address"
        }
      ],
      "name": "getBees",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_address",
          "type": "address"
        }
      ],
      "name": "getHoney",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_address",
          "type": "address"
        }
      ],
      "name": "getHoneySinceLastClaim",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_address",
          "type": "address"
        }
      ],
      "name": "getMaxDeposit",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "level",
          "type": "uint256"
        }
      ],
      "name": "getRefLevelPercent",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_address",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "level",
          "type": "uint256"
        }
      ],
      "name": "getReferralsCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_address",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "level",
          "type": "uint256"
        }
      ],
      "name": "getReferralsIncome",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "initialized",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "initializedAt",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "marketHoney",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "referrers",
      "outputs": [
        {
          "internalType": "address payable",
          "name": "inviter",
          "type": "address"
        },
        {
          "internalType": "address payable",
          "name": "ref",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "reinvest",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "seedMarket",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_newDevAddress",
          "type": "address"
        }
      ],
      "name": "setDevAddress",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_vaultAddress",
          "type": "address"
        }
      ],
      "name": "setVaultAddress",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "top",
      "outputs": [
        {
          "internalType": "address payable",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "users",
      "outputs": [
        {
          "internalType": "address",
          "name": "_address",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "totalDeposit",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "totalRefIncome",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "totalRefs",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "hiredBees",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "claimedHoney",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "lastClaim",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "vaultAddress",
      "outputs": [
        {
          "internalType": "address payable",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "withdraw",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "stateMutability": "payable",
      "type": "receive"
    }
  ];

const vaultAbi = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_hiveAddress",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "stateMutability": "payable",
      "type": "fallback"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "fundHive",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getAll",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getBalance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "stateMutability": "payable",
      "type": "receive"
    }
  ];


  async function connect() {
    const accounts = await ethereum.request({
        method: "eth_requestAccounts",
    });
    metaAdress = accounts[0];
    if (typeof window.ethereum !== "undefined") 
    {
        try 
        {
            await window.ethereum.request
            ({
                method: "wallet_switchEthereumChain",
                params: 
                [{
                    chainId: "0x38",
                },],
            });
        } catch (switchError) 
        {
            if (switchError.code === 4902) {
                console.log("4902");
                try 
                {
                    await window.ethereum.request
                    ({
                        method: "wallet_addEthereumChain",
                        params: 
                        [{
                            chainId: "0x38",
                            chainName: "Smart Chain",
                            rpcUrls: ["https://bsc-dataseed.binance.org/"],
                        },],
                    });
                } 
                catch (addError) 
                {
                    console.log(addError);
                }
            }
        }
    } 
    else 
    {

    }
}


const HiveContract = new web3.eth.Contract(hiveAbi, HiveAddress);
const VaultContract = new web3.eth.Contract(vaultAbi, VaultAddress);




async function getMaxDeposit()
{
    const accounts = await ethereum.request({
        method: "eth_requestAccounts",
    });
    metaAdress = accounts[0];
    let maxDep = await HiveContract.methods.getMaxDeposit().call({
        from: metaAdress,
    });
    return maxDep;
}


///  Возвращает общий баланс контракта
async function getBalance()
{
    const accounts = await ethereum.request({
        method: "eth_requestAccounts",
    });
    metaAdress = accounts[0];
    let balance = await HiveContract.methods.getBalance().call({
        from: metaAdress,
    });
    return balance;
}
/// Возвращает баланс кошелька пользователя
async function getUserBalance()
{
    const accounts = await ethereum.request({
        method: "eth_requestAccounts",
    });
    metaAdress = accounts[0];
    let balance =await eth.getBalance(metaAdress )
    return balance;
}
/// Возвращает общую сумму депозита пользователя
async function getUserDeposite()
{
    const accounts = await ethereum.request({
        method: "eth_requestAccounts",
    });
    metaAdress = accounts[0];
    let balance = await HiveContract.methods.getUserDeposite(metaAdress).call({
    from: metaAdress,
    });
    return balance;
}
/// Возвращает количество рефералов на уровне, принимет номер уровня
async function getReferralsCount(number)
{
    const accounts = await ethereum.request({
        method: "eth_requestAccounts",
    });
    metaAdress = accounts[0];
    let count = await HiveContract.methods.getReferralsCount(metaAdress, number).call({
        from: metaAdress,
    });
    return count;
}

/// Возвращает доход с рефералов на уровне, принимает номер уровня
async function getReferralsIncome(number)
{
    const accounts = await ethereum.request({
        method: "eth_requestAccounts",
    });
    metaAdress = accounts[0];
    let count = await HiveContract.methods.getReferralsIncome(metaAdress, number).call({
        from: metaAdress,
    });
    return count;
}
/// Возвращает процент вознаграждения с уровня, принимает номер уровня
async function getRefLevelPercent(number)
{
    const accounts = await ethereum.request({
        method: "eth_requestAccounts",
    });
    metaAdress = accounts[0];
    let count = await HiveContract.methods.getRefLevelPercent(number).call({
        from: metaAdress,
    });
    return count;
}
/// Конвертирует мед в BNB
async function calculateHoneySell(number)
{
    const accounts = await ethereum.request({
        method: "eth_requestAccounts",
    });
    metaAdress = accounts[0];
    let honeySell = await HiveContract.methods.calculateHoneySell(number).call({
        from: metaAdress,
    });
    return honeySell;
}
/// Конвертирует BNB в мед
async function calculateHoneyBuy(number)
{
    const accounts = await ethereum.request({
        method: "eth_requestAccounts",
    });
    metaAdress = accounts[0];
    let honeySell = await HiveContract.methods.calculateHoneyBuy(number).call({
        from: metaAdress,
    });
    return honeySell;
}

/// Вознаграджение за день
async function calculateDailyIncome()
{
    const accounts = await ethereum.request({
        method: "eth_requestAccounts",
    });
    metaAdress = accounts[0];
    let income = await HiveContract.methods.calculateDailyIncome(metaAdress).call({
        from: metaAdress,
    });
    return income;
}

/// Количество пчел у пользователя
async function getBees()
{
    const accounts = await ethereum.request({
        method: "eth_requestAccounts",
    });
    metaAdress = accounts[0];
    let income = await HiveContract.methods.getBees(metaAdress).call({
        from: metaAdress,
    });
    return income;
}

/// Общий доход + доход копилки в виде Меда
async function getHoney()
{
    const accounts = await ethereum.request({
        method: "eth_requestAccounts",
    });
    metaAdress = accounts[0];
    let honey = await HiveContract.methods.getHoney(metaAdress).call({
        from: metaAdress,
    });
    return honey;
}

/// Доход копилки в виде меда
async function getHoneySinceLastClaim()
{
    const accounts = await ethereum.request({
        method: "eth_requestAccounts",
    });
    metaAdress = accounts[0];
    let honey = await HiveContract.methods.getHoneySinceLastClaim(metaAdress).call({
        from: metaAdress,
    });
    return honey;
}

/// Общий доход + доход копилки в виде БНБ
async function bnbRewards()
{
    const accounts = await ethereum.request({
        method: "eth_requestAccounts",
    });
    metaAdress = accounts[0];
    let reward = await HiveContract.methods.bnbRewards(metaAdress).call({
        from: metaAdress,
    });
    return reward;
}

/// Баланс хранилища
async function getVaultBalance()
{
    const accounts = await ethereum.request({
        method: "eth_requestAccounts",
    });
    metaAdress = accounts[0];
    let balance = await VaultContract.methods.getBalance().call({
        from: metaAdress,
    });
    return balance;
}
/// Время старта фармилки
async function getTimeStart()
{
    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });
    metaAdress = accounts[0];
    let time = await HiveContract.methods.getTimeStart().call({
    from: metaAdress,
     });
    return time;
}
/// Адрес если нет реферала
async function getTop()
{
    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });
    metaAdress = accounts[0];
    let top = await HiveContract.methods.getTop().call({
    from: metaAdress,
     });
    return top;
}




async function reinvest()
{
    const accounts = await ethereum.request({
        method: "eth_requestAccounts",
    });
    metaAdress = accounts[0];
    await HiveContract.methods.reinvest().call({
        from: metaAdress
    });
}

async function deposite(referalAddress, bnbValue)
{
    const accounts = await ethereum.request({
        method: "eth_requestAccounts",
    });
    metaAdress = accounts[0];
    await HiveContract.methods.deposit(referalAddress).send({
        from: metaAdress,
        value: bnbValue,
         gas: gasBuy,
    });
}

async function withdraw()
{
    const accounts = await ethereum.request({
        method: "eth_requestAccounts",
    });
    metaAdress = accounts[0];
    await HiveContract.methods.withdraw().call({
        from: metaAdress
    });
}