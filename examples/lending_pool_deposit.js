require("dotenv").config();
const { Harmony } = require("@harmony-js/core");
const { ChainID, ChainType } = require("@harmony-js/utils");
const hmy = new Harmony(
  // let's assume we deploy smart contract to this end-point URL
  "https://api.s0.b.hmny.io",
  {
    chainType: ChainType.Harmony,
    chainId: ChainID.HmyTestnet,
  }
);

const lendingPoolJson = require("../build/contracts/LendingPool.json");
const lendingPoolAddr = "0x3B553974FF19E632dDFCF85575288bBF6DdAc1Aa";
const lendingPool = hmy.contracts.createContract(
  lendingPoolJson.abi,
  lendingPoolAddr
);

lendingPool.wallet.addByPrivateKey(process.env.PRIVATE_KEY);

const options = {
  gasPrice: process.env.GAS_PRICE,
  gasLimit: process.env.GAS_LIMIT,
};

// Ready - proxy address: 0x3B553974FF19E632dDFCF85575288bBF6DdAc1Aa
async function init() {
  let res = await lendingPool.methods.setLendingPoolConfiguratorImpl("0x43e6c2a7b765bf2f305be9ee3de6d7dd8748bba9").send(options);
  
  console.log(res.transaction);

  let poolAddr = await lendingPool.methods.getLendingPoolConfigurator().call(options);

  console.log("LendingPoolAddressesProvider-LendingPoolConfigurator " + poolAddr);
}
init().then(() => {
    process.exit(0);
});
