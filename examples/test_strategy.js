require('dotenv').config()
const { Harmony } = require("@harmony-js/core");
const { ChainID, ChainType, hexToNumber } = require("@harmony-js/utils");
const hmy = new Harmony(
  // let's assume we deploy smart contract to this end-point URL
  "https://api.s0.b.hmny.io",
  {
    chainType: ChainType.Harmony,
    chainId: ChainID.HmyTestnet,
  }
);


// Address Directory
// BUSD: 0x2d47d492c0978143171CB577224be39aA1dff5ce
const contractJson = require("../build/contracts/DefaultReserveInterestRateStrategy.json");
const strategyAddr = "0x821a723424cb0fbdb31a232b008d611285ca9cdf"
const contract = hmy.contracts.createContract(
  contractJson.abi,
  strategyAddr
);

contract.wallet.addByPrivateKey(process.env.PRIVATE_KEY);

const options = {
  gasPrice: process.env.GAS_PRICE,
  gasLimit: process.env.GAS_LIMIT,
};

const BUSDaddr = "0x2d47d492c0978143171CB577224be39aA1dff5ce"
const H20addr = "0xbd45460AE8fFAeA54579cE3b60aEB3d2E573Eaa2"
const usdt_eth = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"

async function info() {
  let res = await contract.methods.calculateInterestRates(usdt_eth, 0, 0, 0, 0).call(options);
  
  console.log(res);
}
info().then(() => {
    process.exit(0);
});
