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
const addrProviderAddr = "0xeae2c52c7670bedda7b86466558619887d9acc62"; //testnet "0xa92E6188E59dEC1714d6cCd40eeEca2F39075486"; local: "0x660a4de91307f84b7de28057c25135d409015f2c"; 
const addrProvider = hmy.contracts.createContract(
  addrProviderJson.abi,
  addrProviderAddr
);

addrProvider.wallet.addByPrivateKey(process.env.PRIVATE_KEY);

const options = {
  gasPrice: process.env.GAS_PRICE,
  gasLimit: process.env.GAS_LIMIT,
};

// Ready - proxy address: 0xEF38fB09c26a4Bf4c0306A320afCA8a648f7150C
async function init() {
  let res = await addrProvider.methods.setLendingPoolCoreImpl("0xf9f94c822cf4be2930aaec31ad13bdffe5ceeaf2").send(options);
  
  console.log(res.transaction);

  let poolAddr = await addrProvider.methods.getLendingPoolCore().call(options);

  console.log("LendingPoolAddressesProvider-LendingPoolCore " + poolAddr);
}
init().then(() => {
    process.exit(0);
});
