require('dotenv').config()
const { Harmony } = require("@harmony-js/core");
const { ChainID, ChainType, hexToNumber, Unit } = require("@harmony-js/utils");
const hmy = new Harmony(
  // let's assume we deploy smart contract to this end-point URL
  "https://api.s0.b.hmny.io",
  {
    chainType: ChainType.Harmony,
    chainId: ChainID.HmyTestnet,
  }
);
const hmy_local = new Harmony(
  // let's assume we deploy smart contract to this end-point URL
  "http://127.0.0.1:9500",
  {
    chainType: ChainType.Harmony,
    chainId: ChainID.HmyTestnet,
  }
);

const ownerAddr = "0x15a128e599b74842BCcBa860311Efa92991bffb5"
const userAddr = "0x49De839C3616A43523E50F2Af6f7FcBB56DB9cc8"

const LendingPoolJson = require("../build/contracts/LendingPool.json");

const MockUSDTJson = require("../build/contracts/MockUSDT.json");
const MockLINKJson = require("../build/contracts/MockLINK.json");
const ATokenJson = require("../build/contracts/Atoken.json");

const LendingPoolCoreJson = require("../build/contracts/LendingPoolCore.json");


coreProxy = process.env.CORE
lendingPoolProxy = process.env.POOL
usdtAddr = process.env.USDT
linkAddr = process.env.LINK


const options = { gasPrice: 1000000000, gasLimit: 6721900 };

var client = hmy
async function check_balance() {
  const core = client.contracts.createContract(
    LendingPoolCoreJson.abi,
    coreProxy
  );
  const lendingPool = client.contracts.createContract(
    LendingPoolJson.abi,
    lendingPoolProxy
  );
  lendingPool.wallet.addByPrivateKey(process.env.PRIVATE_KEY);
  lendingPool.wallet.setSigner(userAddr)

  const usdtContract = client.contracts.createContract(
    MockUSDTJson.abi,
    usdtAddr
  );
  const linkContract = client.contracts.createContract(
    MockLINKJson.abi,
    linkAddr
  );
  lendingPool.wallet.addByPrivateKey(process.env.USER_PRI_KEY);
  lendingPool.wallet.setSigner(userAddr)


  aUSDTAddr = await core.methods.getReserveATokenAddress(usdtAddr).call(options);
  //console.log("aUSDT address at " + aUSDTAddr)

  const aUSDTContract = client.contracts.createContract(
    ATokenJson.abi,
    aUSDTAddr
  );


  lendingPool.wallet.setSigner(ownerAddr)
  aLINKAddr = await core.methods.getReserveATokenAddress(linkAddr).call(options);
  //console.log("aLINK address at " + aLINKAddr)

  const aLINKContract = client.contracts.createContract(
    ATokenJson.abi,
    aLINKAddr
  );
 


  // Display
  // res = await lendingPool.methods.getReserves().call(options);
  // console.log("getReserves:");
  // console.log(res);
  // res = await lendingPool.methods.getReserveConfigurationData(usdtAddr).call(options);
  // console.log("getReserveConfigurationData:");
  // console.log(res);
  // res = await lendingPool.methods.getReserveData(usdtAddr).call(options);
  // console.log("getReserveData:");
  // console.log(res);

  // res = await dataProvider.methods.calculateUserGlobalData(ownerAddr).call(options);
  //   console.log("calculateUserGlobalData:");
  // console.log(res);

  // res = await dataProvider.methods.calculateUserGlobalData(ownerAddr).call(options);
  //   console.log("calculateUserGlobalData2:");
  // console.log(res);

  lendingPool.wallet.setSigner(ownerAddr)
  console.log("Borrowing 88 USDT on address: " + ownerAddr)
  response = await lendingPool.methods.borrow(usdtAddr, 88000000, 1, 0).send(options);
  if (response.transaction.receipt.status == "0x1") {
    console.log("borrowed successfully")
  } else {
    console.log("borrow failed!")
    process.exit(0);
  }


  // res1 = await dataProvider.methods.calculateUserGlobalData(ownerAddr).call(options);
  // console.log("calculateUserGlobalData3:");
  // console.log(res1);
}

check_balance().then(() => {process.exit(0);})