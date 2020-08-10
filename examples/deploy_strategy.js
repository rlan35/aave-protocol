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

const contractJson = require("../build/contracts/DefaultReserveInterestRateStrategy.json");
let contract = hmy.contracts.createContract(contractJson.abi);
contract.wallet.addByPrivateKey(process.env.PRIVATE_KEY);

const usdt_eth = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
let options2 = { gasPrice: 1000000000, gasLimit: 6721900 };

linkedCode = link(contractJson.bytecode, "CoreLibrary", "0x0ef253f6e26a5a6c65587dd34dde2cce4a5298e4")
let options3 = { arguments: [usdt_eth, "0xeae2c52c7670bedda7b86466558619887d9acc62", "295BE96E64066972000000", "14ADF4B7320334B90000000", "295BE96E640669720000000", "14ADF4B7320334B90000000", "295BE96E640669720000000"], data: linkedCode };

contract.methods
  .contractConstructor(options3)
  .send(options2)
  .then((response) => {
    console.log(
        response.transaction
    );
    process.exit(0);
  });



function link(bytecode, libName, libAddress) {
  let symbol = "__" + libName + "_".repeat(40 - libName.length - 2);
  return bytecode.split(symbol).join(libAddress.toLowerCase().substr(2))
}

// BUSD Deployed at: 0x2c5cb1911ae8a24bfd175c17253a2a626833d1db
// ONE Deployed at: 0x821a723424cb0fbdb31a232b008d611285ca9cdf
// With params: 0.05 * 1e27, 0.4 * 1e27, 0.8 * 1e27, 0.4 * 1e27, 0.8 * 1e27