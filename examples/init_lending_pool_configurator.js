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

// Ready - proxy address: 0xD4dB11fA4b797fa789B8743fd175b6191a594303
async function init() {
  let res = await addrProvider.methods.setLendingPoolConfiguratorImpl("0xd8f8c24dd7db591cb1fc636c2671776bc0c34691").send(options);
  
  console.log(res.transaction);

  let poolAddr = await addrProvider.methods.getLendingPoolConfigurator().call(options);

  console.log("LendingPoolAddressesProvider-LendingPoolConfigurator " + poolAddr);
}
init().then(() => {
    process.exit(0);
});


const configJson = require("../build/contracts/LendingPoolConfigurator.json");
const configAddr = "0xD4dB11fA4b797fa789B8743fd175b6191a594303";
const config = hmy.contracts.createContract(
  configJson.abi,
  configAddr
);

config.wallet.addByPrivateKey(process.env.PRIVATE_KEY);

const BUSDaddr = "0x2d47d492c0978143171CB577224be39aA1dff5ce"

async function set() {
  let res = await config.methods.setReserveInterestRateStrategyAddress(BUSDaddr, "0x2c5cb1911ae8a24bfd175c17253a2a626833d1db").send(options);
  
  console.log(res.transaction);
}
// set().then(() => {
//     process.exit(0);
// });