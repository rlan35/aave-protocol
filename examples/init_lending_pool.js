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

// Ready - proxy address: 0x7298D913a7D9B898844dc937f8Ad70b854A2b7aE
async function init() {
  let res = await addrProvider.methods.setLendingPoolImpl("0x920648895d821e2bb40b962bc4a985be5d5573d1").send(options);
  
  console.log(res.transaction);

  let poolAddr = await addrProvider.methods.getLendingPool().call(options);

  console.log("LendingPoolAddressesProvider-LendingPool " + poolAddr);
}
init().then(() => {
    process.exit(0);
});



const poolJson = require("../build/contracts/LendingPool.json");
const poolAddr = "0x7298D913a7D9B898844dc937f8Ad70b854A2b7aE";
const pool = hmy.contracts.createContract(
  poolJson.abi,
  poolAddr
);

pool.wallet.addByPrivateKey(process.env.USER_PRI_KEY);

async function reset() {
  // let res = await contract.methods.approve("0x043b5db4774a6d61b96453dae2b5bdfe8a5d4d74", "62955125448371603261882368").send(options);
  
  // console.log(res.transaction);

  res = await pool.methods.initialize("0xa92E6188E59dEC1714d6cCd40eeEca2F39075486").send(options);
  console.log(res);

  // options.value = new Unit(10).asOne().toWei();
  // res = await pool.methods.deposit(BUSDaddr, "1000", 0).send(options);  // 10 BUSD
  
  // console.log(res.transaction);
}

// reset().then(() => {
//   process.exit();
// });
