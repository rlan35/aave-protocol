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
const contractJson = require("../build/contracts/LendingPoolConfigurator.json");
const contractAddr = "0xD4dB11fA4b797fa789B8743fd175b6191a594303";
const contract = hmy.contracts.createContract(
  contractJson.abi,
  contractAddr
);

contract.wallet.addByPrivateKey(process.env.PRIVATE_KEY);

const options = {
  gasPrice: process.env.GAS_PRICE,
  gasLimit: process.env.GAS_LIMIT,
};



const coreJson = require("../build/contracts/LendingPoolCore.json");
const coreAddr = "0xEF38fB09c26a4Bf4c0306A320afCA8a648f7150C";
const core = hmy.contracts.createContract(
  coreJson.abi,
  coreAddr
);

const BUSDaddr = "0x2d47d492c0978143171CB577224be39aA1dff5ce"
const H20addr = "0xbd45460AE8fFAeA54579cE3b60aEB3d2E573Eaa2"
const one_eth = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"

const strategyAddr = "0x2c5cb1911ae8a24bfd175c17253a2a626833d1db"
async function init() {
  let res = await contract.methods.initReserveWithData(one_eth, "Ether", "ETH", 18, "0x821a723424cb0fbdb31a232b008d611285ca9cdf").send(options);
  
  console.log(res.transaction);

  let reserves = await core.methods.getReserves().call(options);

  console.log("Reserves " + reserves);
}
init().then(() => {
    process.exit(0);
});

async function info(reserve) {
  let res = await core.methods.getReserveIsFreezed(reserve).call(options);
  console.log("isReserveFreezed: " + res);

  res = await core.methods.getReserveIsActive(reserve).call(options);
  console.log("isReserveActive: " + res);

  res = await core.methods.getReserveIsStableBorrowRateEnabled(reserve).call(options);
  console.log("getReserveIsStableBorrowRateEnabled: " + res);

  res = await core.methods.isReserveUsageAsCollateralEnabled(reserve).call(options);
  console.log("isReserveUsageAsCollateralEnabled: " + res);

  res = await core.methods.isReserveBorrowingEnabled(reserve).call(options);
  console.log("isReserveBorrowingEnabled: " + res);

  res = await core.methods.getReserveDecimals(reserve).call(options);
  console.log("getReserveDecimals: " + res);

  res = await core.methods.getReserveATokenAddress(reserve).call(options);
  console.log("getReserveATokenAddress:");
  console.log(res);

  res = await core.methods.getReserveTotalLiquidity(reserve).call(options);
  console.log("getReserveTotalLiquidity: " + res);

  res = await core.methods.getUserUnderlyingAssetBalance(reserve, "0x49De839C3616A43523E50F2Af6f7FcBB56DB9cc8").call(options);
  console.log("getUserUnderlyingAssetBalance######: " + res);


  res = await core.methods.getReserveConfiguration(reserve).call(options);
  console.log("getReserveConfiguration: ");
  console.log(res);

  res = await core.methods.getReserveIsStableBorrowRateEnabled(reserve).call(options);
  console.log("getReserveIsStableBorrowRateEnabled: " + res);

  res = await core.methods.isReserveBorrowingEnabled(reserve).call(options);
  console.log("isReserveBorrowingEnabled: " + res);

  res = await core.methods.getReserveIsActive(reserve).call(options);
  console.log("getReserveIsActive: " + res);

  res = await core.methods.getReserveLiquidationBonus(reserve).call(options);
  console.log("getReserveLiquidationBonus: " + res);

  res = await core.methods.getReserveInterestRateStrategyAddress(reserve).call(options);
  console.log("getReserveInterestRateStrategyAddress: " + res);

  res = await core.methods.getReserveTotalLiquidity(reserve).call(options);
  console.log("getReserveTotalLiquidity: " + res);

  res = await core.methods.getReserveAvailableLiquidity(reserve).call(options);
  console.log("getReserveAvailableLiquidity: " + res);

  res = await core.methods.getReserveTotalBorrowsStable(reserve).call(options);
  console.log("getReserveTotalBorrowsStable: " + res);

  res = await core.methods.getReserveTotalBorrowsVariable(reserve).call(options);
  console.log("getReserveTotalBorrowsVariable: " + res);

  res = await core.methods.getReserveCurrentLiquidityRate(reserve).call(options);
  console.log("getReserveCurrentLiquidityRate: " + res);

  res = await core.methods.getReserveCurrentVariableBorrowRate(reserve).call(options);
  console.log("getReserveCurrentVariableBorrowRate: " + res);

  res = await core.methods.getReserveCurrentStableBorrowRate(reserve).call(options);
  console.log("getReserveCurrentStableBorrowRate: " + res);

  res = await core.methods.getReserveCurrentAverageStableBorrowRate(reserve).call(options);
  console.log("getReserveCurrentAverageStableBorrowRate: " + res);

  res = await core.methods.getReserveUtilizationRate(reserve).call(options);
  console.log("getReserveUtilizationRate: " + res);

  res = await core.methods.getReserveLiquidityCumulativeIndex(reserve).call(options);
  console.log("getReserveLiquidityCumulativeIndex: " + res);
  res = await core.methods.getReserveVariableBorrowsCumulativeIndex(reserve).call(options);
  console.log("getReserveVariableBorrowsCumulativeIndex: " + res);
  res = await core.methods.getReserveATokenAddress(reserve).call(options);
  console.log("getReserveATokenAddress: " + res);
  res = await core.methods.getReserveLastUpdate(reserve).call(options);
  console.log("getReserveLastUpdate: " + res);
  res = await core.methods.getUserBasicReserveData(reserve, "0x49De839C3616A43523E50F2Af6f7FcBB56DB9cc8").call(options);
  console.log("getUserBasicReserveData: ");
  console.log(res);
  res = await core.methods.getUserUnderlyingAssetBalance(reserve, "0x49De839C3616A43523E50F2Af6f7FcBB56DB9cc8").call(options);
  console.log("getUserUnderlyingAssetBalance: " + res);

}
// info(BUSDaddr).then(() => {
// 	process.exit();
// });