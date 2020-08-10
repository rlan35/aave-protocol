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

// Ready - proxy address: 0x2C49Cb1eC8020C9799186Cc7240DAD42640f58C6
async function init() {
  let res = await addrProvider.methods.setLendingPoolLiquidationManager("0x2c49cb1ec8020c9799186cc7240dad42640f58c6").send(options);
  
  console.log(res.transaction);

  let poolAddr = await addrProvider.methods.getLendingPoolLiquidationManager().call(options);

  console.log("LendingPoolAddressesProvider-LendingPoolLiquidationManager " + poolAddr);
}
init().then(() => {
    process.exit(0);
});
