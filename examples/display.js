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

const paramProviderJson = require("../build/contracts/LendingPoolParametersProvider.json");
const paramProviderAddr = "0x2bAa94683991120c202b2D83e22f8735a567B763";
const paramProvider = hmy.contracts.createContract(
  paramProviderJson.abi,
  paramProviderAddr
);

const options = {
  gasPrice: process.env.GAS_PRICE,
  gasLimit: process.env.GAS_LIMIT,
};

async function display() {
  let poolAddr = await addrProvider.methods.getLendingPool().call(options);
  let maxStableRateBorrowSizePercent = await paramProvider.methods.getMaxStableRateBorrowSizePercent().call(options);

  console.log("LendingPoolAddressesProvider is deployed at address " + addrProvider.address);
  console.log("LendingPoolAddressesProvider: " + poolAddr);
  console.log("getMaxStableRateBorrowSizePercent: " + maxStableRateBorrowSizePercent);
}
display().then(() => {
    process.exit(0);
});
