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

const lendingRateOracleJson = require("../build/contracts/LendingRateOracle.json");
const lendingRateOracleAddr = "0x4ca9eec11968de6e1215b49db0f81a292f4b25f0";
const lendingRateOracle = hmy.contracts.createContract(
  lendingRateOracleJson.abi,
  lendingRateOracleAddr
);

lendingRateOracle.wallet.addByPrivateKey(process.env.PRIVATE_KEY);

const options = {
  gasPrice: process.env.GAS_PRICE,
  gasLimit: process.env.GAS_LIMIT,
};


const BUSDaddr = "0x2d47d492c0978143171CB577224be39aA1dff5ce"

// Ready - proxy address: 0x4Ca9EEC11968De6E1215B49Db0f81a292F4B25f0
async function init(reserve) {
  let res = await lendingRateOracle.methods.getMarketBorrowRate(reserve).call(options);
  
  console.log(res);

  res = await lendingRateOracle.methods.setMarketBorrowRate(reserve, 1000000000).send(options);
  
  console.log(res.transaction);

  res = await lendingRateOracle.methods.getMarketBorrowRate(reserve).call(options);
  
  console.log(res);


  res = await lendingRateOracle.methods.getMarketLiquidityRate(reserve).call(options);
  
  console.log(res);

  res = await lendingRateOracle.methods.setMarketLiquidityRate(reserve, 1000000000).send(options);
  
  console.log(res.transaction);

  res = await lendingRateOracle.methods.getMarketLiquidityRate(reserve).call(options);
  
  console.log(res);


  // res = await addrProvider.methods.setLendingRateOracle("0x4ca9eec11968de6e1215b49db0f81a292f4b25f0").send(options);
  
  // console.log(res.transaction);

  // let lendingRateOracleAddr = await addrProvider.methods.getLendingRateOracle().call(options);

  // console.log("LendingPoolAddressesProvider-LendingRateOracle " + lendingRateOracleAddr);
}
init(BUSDaddr).then(() => {
    process.exit(0);
});
