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

const priceOracleJson = require("../build/contracts/PriceOracle.json");
const priceOracleAddr = "0x356Bb5b09bF00BdC9630C0B7Bef9321C0339E589";
const priceOracle = hmy.contracts.createContract(
  priceOracleJson.abi,
  priceOracleAddr
);

priceOracle.wallet.addByPrivateKey(process.env.PRIVATE_KEY);

const options = {
  gasPrice: process.env.GAS_PRICE,
  gasLimit: process.env.GAS_LIMIT,
};

const BUSDaddr = "0x2d47d492c0978143171CB577224be39aA1dff5ce"

// Ready - proxy address: 0x356Bb5b09bF00BdC9630C0B7Bef9321C0339E589
async function init(reserve) {
  let res = await priceOracle.methods.getEthUsdPrice().call(options);
  
  console.log(res);

  res = await priceOracle.methods.setEthUsdPrice(395).send(options);
  
  console.log(res.transaction);

  res = await priceOracle.methods.getEthUsdPrice().call(options);
  
  console.log(res);

  res = await priceOracle.methods.getAssetPrice(reserve).call(options);
  
  console.log(res);

  res = await priceOracle.methods.setAssetPrice(reserve, 1).send(options);
  
  console.log(res.transaction);

  res = await priceOracle.methods.getAssetPrice(reserve).call(options);
  
  console.log(res);


  // res = await addrProvider.methods.setPriceOracle("0x356bb5b09bf00bdc9630c0b7bef9321c0339e589").send(options);
  
  // console.log(res.transaction);

  // let PriceOracleAddr = await addrProvider.methods.getPriceOracle().call(options);

  // console.log("LendingPoolAddressesProvider-PriceOracle " + PriceOracleAddr);
}
init(BUSDaddr).then(() => {
    process.exit(0);
});
