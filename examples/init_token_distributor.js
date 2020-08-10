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

// Ready - proxy address: 0x3e557Ca3253f05810C6Fb8776c7540A194396041
async function init() {
  let res = await addrProvider.methods.setTokenDistributor("0x3e557ca3253f05810c6fb8776c7540a194396041").send(options);
  
  console.log(res.transaction.receipt);

  let poolAddr = await addrProvider.methods.getTokenDistributor().call(options);

  console.log("LendingPoolAddressesProvider-TokenDistributor " + poolAddr);
}
init().then(() => {
    process.exit(0);
});
