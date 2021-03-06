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

// Ready - proxy address: 0xCAB72Ec55a64703595f421d768C9A6b2De14Ab5F
async function init() {
  let res = await addrProvider.methods.setLendingPoolParametersProviderImpl("0xd099dbe118c476c659a90874f470686dbde0dd2b").send(options);
  
  console.log(res.transaction);

  let poolAddr = await addrProvider.methods.getLendingPoolParametersProvider().call(options);

  console.log("LendingPoolAddressesProvider-LendingPoolParametersProvider " + poolAddr);
}
init().then(() => {
    process.exit(0);
});
