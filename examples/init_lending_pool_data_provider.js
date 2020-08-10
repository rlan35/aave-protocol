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

const addrProviderJson = require("../build/contracts/LendingPoolAddressesProvider.json");
const addrProviderAddr = "0xeae2c52c7670bedda7b86466558619887d9acc62";
const addrProvider = hmy.contracts.createContract(
  addrProviderJson.abi,
  addrProviderAddr
);

addrProvider.wallet.addByPrivateKey(process.env.PRIVATE_KEY);

const options = {
  gasPrice: process.env.GAS_PRICE,
  gasLimit: process.env.GAS_LIMIT,
};

// Ready - proxy address: 0xDA96975277a3a8722F5b30A42B731116De8626Ee
async function init() {
  let res = await addrProvider.methods.setLendingPoolDataProviderImpl("0x5de499aa26bed1a06b5b852ad8207282a8228d13").send(options);
  
  console.log(res.transaction);

  let poolAddr = await addrProvider.methods.getLendingPoolDataProvider().call(options);

  console.log("LendingPoolAddressesProvider-LendingPoolDataProvider " + poolAddr);
}
// init().then(() => {
//     process.exit(0);
// });



const BUSDaddr = "0x2d47d492c0978143171CB577224be39aA1dff5ce"
const dataProviderJson = require("../build/contracts/LendingPoolDataProvider.json");
const dataProviderAddr = "0xDA96975277a3a8722F5b30A42B731116De8626Ee";
const dataProvider = hmy.contracts.createContract(
  dataProviderJson.abi,
  dataProviderAddr
);

addrProvider.wallet.addByPrivateKey(process.env.PRIVATE_KEY);

// Ready - proxy address: 0xDA96975277a3a8722F5b30A42B731116De8626Ee
async function info() {
  let res = await dataProvider.methods.core().call(options);
  
  console.log(res);
  res = await dataProvider.methods.addressesProvider().call(options);
  
  console.log(res);
  res = await dataProvider.methods.HEALTH_FACTOR_LIQUIDATION_THRESHOLD().call(options);
  
  console.log(res);
  res = await dataProvider.methods.DATA_PROVIDER_REVISION().call(options);
  
  console.log(res);
  res = await dataProvider.methods.getReserveConfigurationData(BUSDaddr).call(options);
  
  console.log(res);
  res = await dataProvider.methods.getHealthFactorLiquidationThreshold().call(options);
  
  console.log(res);

  res = await dataProvider.methods.balanceDecreaseAllowed(BUSDaddr, "0x49De839C3616A43523E50F2Af6f7FcBB56DB9cc8", 1000).call(options);
  
  console.log(res);

  // res = await dataProvider.methods.initialize("0xa92E6188E59dEC1714d6cCd40eeEca2F39075486").send(options);
  
  // console.log(res.transaction);
}
info().then(() => {
    process.exit(0);
});