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
const hmy2 = new Harmony(
  // let's assume we deploy smart contract to this end-point URL
  "http://127.0.0.1:9500",
  {
    chainType: ChainType.Harmony,
    chainId: ChainID.HmyTestnet,
  }
);


// Address Directory
// LendingPoolAddressesProvider: 0xa92E6188E59dEC1714d6cCd40eeEca2F39075486
// LendingPoolParametersProvider: 0x2bAa94683991120c202b2D83e22f8735a567B763
// FeeProvider: 0x5e0b9b64bc7e2d54ae8c369d51972d399a877664
// LendingPool: 0x043b5db4774a6d61b96453dae2b5bdfe8a5d4d74
// LendingPoolConfigurator: 0x43e6c2a7b765bf2f305be9ee3de6d7dd8748bba9
// LendingPoolCore: 0xc3a9b61ef5e017a30e531c26cfeba1509f30b66e
// LendingPoolDataProvider: 0x46d39fa83ff4fec3514f41ee5342ec7d879dbd04
// LendingPoolLiquidationManager: 0xb1419e30427e2b483df940c6aa24510891937abc
// PriceOracle: 0x7996558072d94972fab6c489faa5f2b3bcb8aca0
// LendingRateOracle: 0x91384d3856678e7df8787d6fddc52f8797ac5833
// TokenDistributor: 0xef945181db0c4d4f125d749108b5ff1ebdf0d19d

// Libs:
// CoreLibrary: 0x0ef253f6e26a5a6c65587dd34dde2cce4a5298e4


// core: 0x95a759428f9a8b4bc02e20086085f32b7a440463
// addr provider: 
const contractJson = require("../build/contracts/LendingPool.json");
let contract = hmy.contracts.createContract(contractJson.abi);
contract.wallet.addByPrivateKey(process.env.PRIVATE_KEY);

let options2 = { gasPrice: 1000000000, gasLimit: 6721900 };

linkedCode = link(contractJson.bytecode, "CoreLibrary", "0x0ef253f6e26a5a6c65587dd34dde2cce4a5298e4")
let options3 = { data: linkedCode };

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