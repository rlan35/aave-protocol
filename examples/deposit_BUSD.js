require('dotenv').config()
const { Harmony } = require("@harmony-js/core");
const { ChainID, ChainType, hexToNumber, Unit } = require("@harmony-js/utils");
const hmy = new Harmony(
  // let's assume we deploy smart contract to this end-point URL
  "https://api.s0.b.hmny.io",
  {
    chainType: ChainType.Harmony,
    chainId: ChainID.HmyTestnet,
  }
);


// Address Directory
const BUSDaddr = "0x2d47d492c0978143171CB577224be39aA1dff5ce"
const ONEaddr = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
//const H20addr = "0xbd45460AE8fFAeA54579cE3b60aEB3d2E573Eaa2"


const contractJson = require("../build/contracts/ERC20.json");
const contractAddr = BUSDaddr;
const contract = hmy.contracts.createContract(
  contractJson.abi,
  contractAddr
);

contract.wallet.addByPrivateKey(process.env.USER_PRI_KEY);

const options = {
  gasPrice: process.env.GAS_PRICE,
  gasLimit: process.env.GAS_LIMIT,
};



const poolJson = require("../build/contracts/LendingPool.json");
const poolAddr = "0x7298D913a7D9B898844dc937f8Ad70b854A2b7aE";
const pool = hmy.contracts.createContract(
  poolJson.abi,
  poolAddr
);

pool.wallet.addByPrivateKey(process.env.USER_PRI_KEY);

async function deposit() {
  // let res = await contract.methods.approve("0x7298D913a7D9B898844dc937f8Ad70b854A2b7aE", "62955125448371603261882368").send(options);
  
  // console.log(res.transaction);


  // res = await contract.methods.allowance("0x49De839C3616A43523E50F2Af6f7FcBB56DB9cc8", "0xEF38fB09c26a4Bf4c0306A320afCA8a648f7150C").call(options);
  
  // console.log(res);

  // res = await pool.methods.getReserves().call(options);
  // console.log(res);
  // res = await pool.methods.getReserveConfigurationData(BUSDaddr).call(options);
  // console.log(res);
  // res = await pool.methods.getReserveData(BUSDaddr).call(options);
  // console.log(res);
  // res = await pool.methods.addressesProvider().call(options);
  // console.log(res);
  // res = await pool.methods.dataProvider().call(options);
  // console.log(res);
  // res = await pool.methods.core().call(options);
  // console.log(res);
  // res = await pool.methods.parametersProvider().call(options);
  // console.log(res);

  // options.value = new Unit(10).asOne().toWei();
  res = await pool.methods.deposit(BUSDaddr, 10000, 0).send(options);  // 10 BUSD
  
  console.log(res.transaction);
}

deposit().then(() => {
	process.exit();
});
