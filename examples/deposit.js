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
async function deposit() {
  const core = client.contracts.createContract(
    LendingPoolCoreJson.abi,
    coreProxy
  );
  const lendingPool = client.contracts.createContract(
    LendingPoolJson.abi,
    lendingPoolProxy
  );
  lendingPool.wallet.addByPrivateKey(process.env.PRIVATE_KEY);

  const usdtContract = client.contracts.createContract(
    MockUSDTJson.abi,
    usdtAddr
  );
  const linkContract = client.contracts.createContract(
    MockLINKJson.abi,
    linkAddr
  );
  lendingPool.wallet.addByPrivateKey(process.env.USER_PRI_KEY);


  lendingPool.wallet.setSigner(ownerAddr)
  console.log("depositing 800 LINK from from address: " + ownerAddr)
  response = await lendingPool.methods.deposit(linkAddr, new Unit(800).asOne().toWei(), 0).send(options);
  if (response.transaction.receipt.status == "0x1") {
    console.log("deposited successfully")
  } else {
    console.log("deposit failed!")
    process.exit(0);
  }


  lendingPool.wallet.setSigner(userAddr)
  console.log("depositing 2000 USDT from address: " + userAddr)
  response = await lendingPool.methods.deposit(usdtAddr, 2000000000, 0).send(options);
  if (response.transaction.receipt.status == "0x1") {
    console.log("deposited successfully")
  } else {
    console.log("deposit failed!")
    process.exit(0);
  }

}

deposit().then(() => {process.exit(0);})