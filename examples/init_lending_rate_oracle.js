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

const lendingRateOracleJson = require("../build/contracts/LendingRateOracle.json");
const lendingRateOracleAddr = "0x91384d3856678e7df8787d6fddc52f8797ac5833";
const lendingRateOracle = hmy.contracts.createContract(
  lendingRateOracleJson.abi,
  lendingRateOracleAddr
);

lendingRateOracle.wallet.addByPrivateKey(process.env.PRIVATE_KEY);

const options = {
  gasPrice: process.env.GAS_PRICE,
  gasLimit: process.env.GAS_LIMIT,
};
// Ready - proxy address: 0x91384D3856678E7DF8787d6fDdC52F8797AC5833
async function setAddresses() {
  let res = await lendingRateOracle.methods.getMarketBorrowRate("0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE").call(options);
  
  console.log(res);

  res = await lendingRateOracle.methods.setMarketBorrowRate("0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", 1000000000).send(options);
  
  console.log(res.transaction);

  res = await lendingRateOracle.methods.getMarketBorrowRate("0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE").call(options);
  
  console.log(res);


  res = await addrProvider.methods.setLendingRateOracle("0x91384d3856678e7df8787d6fddc52f8797ac5833").send(options);
  
  console.log(res.transaction);

  let lendingRateOracleAddr = await addrProvider.methods.getLendingRateOracle().call(options);

  console.log("LendingPoolAddressesProvider-LendingRateOracle " + lendingRateOracleAddr);
}
setAddresses().then(() => {
    process.exit(0);
});
