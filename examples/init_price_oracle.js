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


//mint account address
//test account with 100 ONEs
//one1c93pn8x6a2j6stcqv5wag5m0t5k5ya79ge86sg
//1f054c21a0f57ebc402c00e14bd1707ddf45542d4ed9989933dbefc4ea96ca68
//0xc162199cDaeAa5a82f00651dd4536F5d2d4277C5

const addrProviderJson = require("../build/contracts/LendingPoolAddressesProvider.json");
const addrProviderAddr = "0xa92E6188E59dEC1714d6cCd40eeEca2F39075486";
const addrProvider = hmy.contracts.createContract(
  addrProviderJson.abi,
  addrProviderAddr
);

addrProvider.wallet.addByPrivateKey(process.env.PRIVATE_KEY);

const priceOracleJson = require("../build/contracts/PriceOracle.json");
const priceOracleAddr = "0x7996558072d94972fab6c489faa5f2b3bcb8aca0";
const priceOracle = hmy.contracts.createContract(
  priceOracleJson.abi,
  priceOracleAddr
);

priceOracle.wallet.addByPrivateKey(process.env.PRIVATE_KEY);

const options = {
  gasPrice: process.env.GAS_PRICE,
  gasLimit: process.env.GAS_LIMIT,
};

// Ready - proxy address: 0x7996558072D94972fab6c489Faa5f2B3BCb8aCA0
async function setAddresses() {
  let res = await priceOracle.methods.getEthUsdPrice().call(options);
  
  console.log(res);

  res = await priceOracle.methods.setEthUsdPrice(395).send(options);
  
  console.log(res.transaction);

  res = await priceOracle.methods.getEthUsdPrice().call(options);
  
  console.log(res);


  res = await addrProvider.methods.setPriceOracle("0x7996558072d94972fab6c489faa5f2b3bcb8aca0").send(options);
  
  console.log(res.transaction);

  let PriceOracleAddr = await addrProvider.methods.getPriceOracle().call(options);

  console.log("LendingPoolAddressesProvider-PriceOracle " + PriceOracleAddr);
}
setAddresses().then(() => {
    process.exit(0);
});
