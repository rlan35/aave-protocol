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
const hmy_local = new Harmony(
  // let's assume we deploy smart contract to this end-point URL
  "http://127.0.0.1:9500",
  {
    chainType: ChainType.Harmony,
    chainId: ChainID.HmyTestnet,
  }
);

// Address Directory
// LendingPoolAddressesProvider: 0xeae2c52c7670bedda7b86466558619887d9acc62
// LendingPoolCore: 0xf9f94c822cf4be2930aaec31ad13bdffe5ceeaf2
// LendingPoolParametersProvider: 0xd099dbe118c476c659a90874f470686dbde0dd2b
// FeeProvider: 0x156429d6ccf03fd701b939baa595c251923901f3
// LendingPool: 0x920648895d821e2bb40b962bc4a985be5d5573d1
// LendingPoolConfigurator: 0xd8f8c24dd7db591cb1fc636c2671776bc0c34691
// LendingPoolDataProvider: 0x5de499aa26bed1a06b5b852ad8207282a8228d13
// LendingPoolLiquidationManager: 0x2c49cb1ec8020c9799186cc7240dad42640f58c6
// PriceOracle: 0x356bb5b09bf00bdc9630c0b7bef9321c0339e589
// LendingRateOracle: 0x4ca9eec11968de6e1215b49db0f81a292f4b25f0
// TokenDistributor: 0x3e557ca3253f05810c6fb8776c7540a194396041


// Libs:
// CoreLibrary: 0x0ef253f6e26a5a6c65587dd34dde2cce4a5298e4

const ownerAddr = "0x15a128e599b74842BCcBa860311Efa92991bffb5"
const userAddr = "0x49De839C3616A43523E50F2Af6f7FcBB56DB9cc8"

const BUSDaddr = "0x2d47d492c0978143171CB577224be39aA1dff5ce"
const ONEaddr = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"


const CoreLibraryJson = require("../build/contracts/CoreLibrary.json");
const LendingPoolAddressesProviderJson = require("../build/contracts/LendingPoolAddressesProvider.json");
const LendingPoolCoreJson = require("../build/contracts/LendingPoolCore.json");
const LendingPoolParametersProviderJson = require("../build/contracts/LendingPoolParametersProvider.json");
const FeeProviderJson = require("../build/contracts/FeeProvider.json");
const LendingPoolJson = require("../build/contracts/LendingPool.json");
const LendingPoolConfiguratorJson = require("../build/contracts/LendingPoolConfigurator.json");
const LendingPoolDataProviderJson = require("../build/contracts/LendingPoolDataProvider.json");
const LendingPoolLiquidationManagerJson = require("../build/contracts/LendingPoolLiquidationManager.json");
const PriceOracleJson = require("../build/contracts/PriceOracle.json");
const LendingRateOracleJson = require("../build/contracts/LendingRateOracle.json");
const TokenDistributorJson = require("../build/contracts/TokenDistributor.json");
const DefaultReserveInterestRateStrategyJson = require("../build/contracts/DefaultReserveInterestRateStrategy.json");
const ATokenJson = require("../build/contracts/Atoken.json");

const MockUSDTJson = require("../build/contracts/MockUSDT.json");
const MockLINKJson = require("../build/contracts/MockLINK.json");

const options = { gasPrice: 1000000000, gasLimit: 6721900 };

var coreLibAddr = ""

var client = hmy
async function deploy() {
  coreLibAddr = await deploy_contract(CoreLibraryJson)
  addrProviderAddr = await deploy_contract(LendingPoolAddressesProviderJson)
  const addrProvider = client.contracts.createContract(
    LendingPoolAddressesProviderJson.abi,
    addrProviderAddr
  );
  addrProvider.wallet.addByPrivateKey(process.env.PRIVATE_KEY);


  json = LendingPoolCoreJson
  coreAddr = await deploy_contract(json)
  coreProxy = ""
  // Set in address provider
  let response = await addrProvider.methods.setLendingPoolCoreImpl(coreAddr).send(options);
  if (response.transaction.receipt.status == "0x1") {
    console.log("Contract " + json.contractName + " address set successfully")
    let proxyAddr = await addrProvider.methods.getLendingPoolCore().call(options);
    coreProxy = proxyAddr
    console.log("Proxy address: " + proxyAddr);
  } else {
    console.log("Contract " + json.contractName + " set address failed!")
    process.exit(0);
  }
  const core = client.contracts.createContract(
    json.abi,
    coreProxy
  );

  json = LendingPoolParametersProviderJson
  paramProviderAddr = await deploy_contract(json)
  // Set in address provider
  response = await addrProvider.methods.setLendingPoolParametersProviderImpl(paramProviderAddr).send(options);
  if (response.transaction.receipt.status == "0x1") {
    console.log("Contract " + json.contractName + " address set successfully")
    let proxyAddr = await addrProvider.methods.getLendingPoolParametersProvider().call(options);
    console.log("Proxy address: " + proxyAddr);
  } else {
    console.log("Contract " + json.contractName + " set address failed!")
    process.exit(0);
  }


  json = FeeProviderJson
  feeProviderAddr = await deploy_contract(json)
  // Set in address provider
  response = await addrProvider.methods.setFeeProviderImpl(feeProviderAddr).send(options);
  if (response.transaction.receipt.status == "0x1") {
    console.log("Contract " + json.contractName + " address set successfully")
    let proxyAddr = await addrProvider.methods.getFeeProvider().call(options);
    console.log("Proxy address: " + proxyAddr);
  } else {
    console.log("Contract " + json.contractName + " set address failed!")
    process.exit(0);
  }

  json = LendingPoolConfiguratorJson
  configuratorAddr = await deploy_contract(json)
  configuratorProxy = ""
  // Set in address provider
  response = await addrProvider.methods.setLendingPoolConfiguratorImpl(configuratorAddr).send(options);
  if (response.transaction.receipt.status == "0x1") {
    console.log("Contract " + json.contractName + " address set successfully")
    let proxyAddr = await addrProvider.methods.getLendingPoolConfigurator().call(options);
    console.log("Proxy address: " + proxyAddr);
    configuratorProxy = proxyAddr
  } else {
    console.log("Contract " + json.contractName + " set address failed!")
    process.exit(0);
  }
  const configurator = client.contracts.createContract(
    json.abi,
    configuratorProxy
  );
  configurator.wallet.addByPrivateKey(process.env.PRIVATE_KEY);

  
  json = LendingPoolDataProviderJson
  dataProviderAddr = await deploy_contract(json)
  dataProviderProxy = ""
  // Set in address provider
  response = await addrProvider.methods.setLendingPoolDataProviderImpl(dataProviderAddr).send(options);
  if (response.transaction.receipt.status == "0x1") {
    console.log("Contract " + json.contractName + " address set successfully")
    let proxyAddr = await addrProvider.methods.getLendingPoolDataProvider().call(options);
    console.log("Proxy address: " + proxyAddr);
    dataProviderProxy = proxyAddr
  } else {
    console.log("Contract " + json.contractName + " set address failed!")
    process.exit(0);
  }
   const dataProvider = client.contracts.createContract(
    json.abi,
    dataProviderProxy
  );

  json = LendingPoolLiquidationManagerJson
  liquidationManagerAddr = await deploy_contract(json)
  // Set in address provider
  response = await addrProvider.methods.setLendingPoolLiquidationManager(liquidationManagerAddr).send(options);
  if (response.transaction.receipt.status == "0x1") {
    console.log("Contract " + json.contractName + " address set successfully")
    let proxyAddr = await addrProvider.methods.getLendingPoolLiquidationManager().call(options);
    console.log("Proxy address: " + proxyAddr);
  } else {
    console.log("Contract " + json.contractName + " set address failed!")
    process.exit(0);
  }

  json = PriceOracleJson
  priceOracleAddr = await deploy_contract(json)
  priceOracleProxy = ""
  // Set in address provider
  response = await addrProvider.methods.setPriceOracle(priceOracleAddr).send(options);
  if (response.transaction.receipt.status == "0x1") {
    console.log("Contract " + json.contractName + " address set successfully")
    let proxyAddr = await addrProvider.methods.getPriceOracle().call(options);
    console.log("Proxy address: " + proxyAddr);
    priceOracleProxy = proxyAddr
  } else {
    console.log("Contract " + json.contractName + " set address failed!")
    process.exit(0);
  }
  const priceOracle = client.contracts.createContract(
    json.abi,
    priceOracleProxy
  );
  priceOracle.wallet.addByPrivateKey(process.env.PRIVATE_KEY);


  json = LendingRateOracleJson
  lendingRateOracleAddr = await deploy_contract(json)
  lendingRateOracleProxy = ""
  // Set in address provider
  response = await addrProvider.methods.setLendingRateOracle(lendingRateOracleAddr).send(options);
  if (response.transaction.receipt.status == "0x1") {
    console.log("Contract " + json.contractName + " address set successfully")
    let proxyAddr = await addrProvider.methods.getLendingRateOracle().call(options);
    console.log("Proxy address: " + proxyAddr);
    lendingRateOracleProxy = proxyAddr
  } else {
    console.log("Contract " + json.contractName + " set address failed!")
    process.exit(0);
  }
  const lendingRateOracle = client.contracts.createContract(
    json.abi,
    lendingRateOracleProxy
  );
  lendingRateOracle.wallet.addByPrivateKey(process.env.PRIVATE_KEY);


  json = TokenDistributorJson
  tokenDistributorAddr = await deploy_contract(json)
  // Set in address provider
  response = await addrProvider.methods.setTokenDistributor(tokenDistributorAddr).send(options);
  if (response.transaction.receipt.status == "0x1") {
    console.log("Contract " + json.contractName + " address set successfully")
    let proxyAddr = await addrProvider.methods.getTokenDistributor().call(options);
    console.log("Proxy address: " + proxyAddr);
  } else {
    console.log("Contract " + json.contractName + " set address failed!")
    process.exit(0);
  }

  json = LendingPoolJson
  lendingPoolAddr = await deploy_contract(json)
  lendingPoolProxy = ""
  // Set in address provider
  response = await addrProvider.methods.setLendingPoolImpl(lendingPoolAddr).send(options);
  if (response.transaction.receipt.status == "0x1") {
    console.log("Contract " + json.contractName + " address set successfully")
    let proxyAddr = await addrProvider.methods.getLendingPool().call(options);
    console.log("Proxy address: " + proxyAddr);
    lendingPoolProxy = proxyAddr
  } else {
    console.log("Contract " + json.contractName + " set address failed!")
    process.exit(0);
  }
  const lendingPool = client.contracts.createContract(
    json.abi,
    lendingPoolProxy
  );
  lendingPool.wallet.addByPrivateKey(process.env.USER_PRI_KEY);

  response = await addrProvider.methods.setLendingPoolManager(ownerAddr).send(options);
  if (response.transaction.receipt.status == "0x1") {
    console.log("setLendingPoolManager successfully")
  } else {
    console.log("setLendingPoolManager failed!")
    process.exit(0);
  }

  response2 = await configurator.methods.refreshLendingPoolCoreConfiguration().send(options)
  if (response2.transaction.receipt.status == "0x1") {
    console.log("refreshLendingPoolCoreConfiguration successfully")
  } else {
    console.log("refreshLendingPoolCoreConfiguration failed!")
    process.exit(0);
  }



  usdtAddr = await deploy_usdt(coreProxy, lendingPoolProxy)


  linkAddr = await deploy_link(coreProxy, lendingPoolProxy)


  // Setup price oracle
  response = await priceOracle.methods.setEthUsdPrice(new Unit(395).asOne().toWei()).send(options);
  if (response.transaction.receipt.status == "0x1") {
    console.log("setEthUsdPrice successfully")
  } else {
    console.log("setEthUsdPrice failed!")
    process.exit(0);
  }

  response = await priceOracle.methods.setAssetPrice(usdtAddr, 1000000).send(options);
  if (response.transaction.receipt.status == "0x1") {
    console.log("setAssetPrice successfully")
  } else {
    console.log("setAssetPrice failed!")
    process.exit(0);
  }

  response = await priceOracle.methods.setAssetPrice(linkAddr, new Unit(12).asOne().toWei()).send(options);
  if (response.transaction.receipt.status == "0x1") {
    console.log("setAssetPrice successfully")
  } else {
    console.log("setAssetPrice failed!")
    process.exit(0);
  }

  
  // Setup lending rate oracle
  // response = await lendingRateOracle.methods.setMarketBorrowRate(reserve, 1000000000).send(options);
  // if (response.transaction.receipt.status == "0x1") {
  //   console.log("setMarketBorrowRate successfully")
  // } else {
  //   console.log("setMarketBorrowRate failed!")
  //   process.exit(0);
  // }

  // response = await lendingRateOracle.methods.setMarketLiquidityRate(reserve, 1000000000).send(options);
  // if (response.transaction.receipt.status == "0x1") {
  //   console.log("setMarketLiquidityRate successfully")
  // } else {
  //   console.log("setMarketLiquidityRate failed!")
  //   process.exit(0);
  // }

  json = DefaultReserveInterestRateStrategyJson
  // 0.05 * 1e27, 0.4 * 1e27, 0.8 * 1e27, 0.4 * 1e27, 0.8 * 1e27
  // e27 = 1000000000000000000000000000
  
  // let options3 = { arguments: [usdtAddr, addrProviderAddr, "295BE96E64066972000000", "14ADF4B7320334B90000000", "295BE96E640669720000000", "14ADF4B7320334B90000000", "295BE96E640669720000000"], data: json.bytecode };
  let options3 = { arguments: [usdtAddr, addrProviderAddr, 0,0,0,0,0], data: json.bytecode };
  
  let strategyContract = client.contracts.createContract(json.abi);
  strategyContract.wallet.addByPrivateKey(process.env.PRIVATE_KEY);
  strategyAddr = ""
  response = await strategyContract.methods
    .contractConstructor(options3)
    .send(options);
  if (response.transaction.receipt.status == "0x1") {
    console.log("Contract " + json.contractName + " deployed successfully at " + response.transaction.receipt.contractAddress)
    strategyAddr = response.transaction.receipt.contractAddress
  } else {
    console.log("Contract " + json.contractName + " deployment failed!")
    process.exit(0);
  }

  // let options4 = { arguments: [linkAddr, addrProviderAddr, "295BE96E64066972000000", "14ADF4B7320334B90000000", "295BE96E640669720000000", "14ADF4B7320334B90000000", "295BE96E640669720000000"], data: json.bytecode };
  let options4 = { arguments: [linkAddr, addrProviderAddr, 0,0,0,0,0], data: json.bytecode };
  
  strategyAddrLink = ""
  response = await strategyContract.methods
    .contractConstructor(options4)
    .send(options);
  if (response.transaction.receipt.status == "0x1") {
    console.log("Contract " + json.contractName + " deployed successfully at " + response.transaction.receipt.contractAddress)
    strategyAddrLink = response.transaction.receipt.contractAddress
  } else {
    console.log("Contract " + json.contractName + " deployment failed!")
    process.exit(0);
  }

  // Init reserve
  console.log("reserve " + usdtAddr + " strategy " + strategyAddr)
  configurator.wallet.setSigner(ownerAddr)
  response = await configurator.methods.initReserve(usdtAddr, 6, strategyAddr).send(options);
  if (response.transaction.receipt.status == "0x1") {
    console.log("initReserve successfully")
  } else {
    console.log("initReserve failed!")
    process.exit(0);
  }
    response = await configurator.methods.enableBorrowingOnReserve(usdtAddr, true).send(options);
  if (response.transaction.receipt.status == "0x1") {
    console.log("enableBorrowingOnReserve successfully")
  } else {
    console.log("enableBorrowingOnReserve failed!")
    process.exit(0);
  }
    response = await configurator.methods.enableReserveAsCollateral(usdtAddr, "14ADF4B7320334B90000000", "295BE96E640669720000000", 100).send(options);
  if (response.transaction.receipt.status == "0x1") {
    console.log("enableReserveAsCollateral successfully")
  } else {
    console.log("enableReserveAsCollateral failed!")
    process.exit(0);
  }

  response = await configurator.methods.initReserve(linkAddr, 18, strategyAddrLink).send(options);
  if (response.transaction.receipt.status == "0x1") {
    console.log("initReserve successfully")
  } else {
    console.log("initReserve failed!")
    process.exit(0);
  }
      response = await configurator.methods.enableBorrowingOnReserve(linkAddr, true).send(options);
  if (response.transaction.receipt.status == "0x1") {
    console.log("enableBorrowingOnReserve successfully")
  } else {
    console.log("enableBorrowingOnReserve failed!")
    process.exit(0);
  }
    response = await configurator.methods.enableReserveAsCollateral(linkAddr, "14ADF4B7320334B90000000", "295BE96E640669720000000", 100).send(options);
  if (response.transaction.receipt.status == "0x1") {
    console.log("enableReserveAsCollateral successfully")
  } else {
    console.log("enableReserveAsCollateral failed!")
    process.exit(0);
  }


  // aONEAddr = await core.methods.getReserveATokenAddress(ONEaddr).call(options);
  // console.log("aONE address at " + aONEAddr)

  // const aONEContract = client.contracts.createContract(
  //   ATokenJson.abi,
  //   aONEAddr
  // );

  // response = await aONEContract.methods.balanceOf(ownerAddr).call(options);;
  // console.log("My aONE balance: " + response)

  // response = await client.blockchain.getBalance({ address: ownerAddr })
  //   console.log("My ONE balance: ")
  //   console.log(response)
  
  // lendingPool.wallet.setSigner(ownerAddr)
  // options.value = new Unit(3000).asOne().toWei();
  // response = await lendingPool.methods.deposit(ONEaddr, options.value, 0).send(options);
  // if (response.transaction.receipt.status == "0x1") {
  //   console.log("deposit successfully")
  // } else {
  //   console.log("deposit failed!")
  //   process.exit(0);
  // }


  // response = await aONEContract.methods.balanceOf(ownerAddr).call(options);;
  // console.log("My aONE balance: " + response)

  // response = await client.blockchain.getBalance({ address: ownerAddr })
  //   console.log("My ONE balance: ")
  //   console.log(response)
  console.log(coreProxy)
  console.log(lendingPoolProxy)
  console.log(usdtAddr)
  console.log(linkAddr)
}


async function deploy_contract(contractJson) {
  let contract = client.contracts.createContract(contractJson.abi);
  contract.wallet.addByPrivateKey(process.env.PRIVATE_KEY);

  linkedCode = link(contractJson.bytecode, "CoreLibrary", coreLibAddr)
  let contractOptions = { data: linkedCode };

  let response = await contract.methods.contractConstructor(contractOptions).send(options);
  
  if (response.transaction.receipt.status == "0x1") {
    console.log("Contract " + contractJson.contractName + " deployed at " + response.transaction.receipt.contractAddress)

    if (contractJson.contractName == "CoreLibrary") {
      coreLibAddr = response.transaction.receipt.contractAddress
    }
    return response.transaction.receipt.contractAddress
  } else {
    console.log("Contract " + contractJson.contractName + " deployment failed!")
    process.exit(0);
  }
  return response
  
}

async function deploy_usdt(coreProxy, poolProxy) {
  // Deploy USDT contract
  json = MockUSDTJson
  usdtAddr = await deploy_contract(json)

  usdtContract = client.contracts.createContract(
    json.abi,
    usdtAddr
  );
  usdtContract.wallet.addByPrivateKey(process.env.USER_PRI_KEY);


  usdtContract.wallet.setSigner(userAddr)


  response = await usdtContract.methods.mint(10000000000).send(options)  // 10000 USDT
  if (response.transaction.receipt.status == "0x1") {
    console.log("mint successfully")
  } else {
    console.log("mint failed!")
    process.exit(0);
  }
  
  response = await usdtContract.methods.approve(coreProxy, 10000000000).send(options)
  if (response.transaction.receipt.status == "0x1") {
    console.log("approve successfully")
  } else {
    console.log("approve failed!")
    process.exit(0);
  }
  response = await usdtContract.methods.approve(poolProxy, 10000000000).send(options)  // 10000 USDT
  if (response.transaction.receipt.status == "0x1") {
    console.log("approve successfully")
  } else {
    console.log("approve failed!")
    process.exit(0);
  }

  usdtContract.wallet.setSigner(ownerAddr)
  response = await usdtContract.methods.approve(coreProxy, 10000000000).send(options)
  if (response.transaction.receipt.status == "0x1") {
    console.log("approve successfully")
  } else {
    console.log("approve failed!")
    process.exit(0);
  }
  response = await usdtContract.methods.approve(poolProxy, 10000000000).send(options)  // 10000 USDT
  if (response.transaction.receipt.status == "0x1") {
    console.log("approve successfully")
  } else {
    console.log("approve failed!")
    process.exit(0);
  }

  response = await usdtContract.methods.allowance(userAddr, coreProxy).call(options)  // 10000 USDT
  console.log("allowance: " + response)

  response = await usdtContract.methods.allowance(userAddr, poolProxy).call(options)  // 10000 USDT
  console.log("allowance: " + response)
  response = await usdtContract.methods.allowance(ownerAddr, coreProxy).call(options)  // 10000 USDT
  console.log("allowance: " + response)

  response = await usdtContract.methods.allowance(ownerAddr, poolProxy).call(options)  // 10000 USDT
  console.log("allowance: " + response)
  return usdtAddr
}

async function deploy_link(coreProxy, poolProxy) {
  // Deploy LINK contract
  json = MockLINKJson
  linkAddr = await deploy_contract(json)

  linkContract = client.contracts.createContract(
    json.abi,
    linkAddr
  );
  linkContract.wallet.addByPrivateKey(process.env.USER_PRI_KEY);


  linkContract.wallet.setSigner(ownerAddr)

  twoK = new Unit(2000).asOne().toWei()
  response = await linkContract.methods.mint(twoK).send(options)  // 2000 link
  if (response.transaction.receipt.status == "0x1") {
    console.log("mint successfully")
  } else {
    console.log("mint failed!")
    process.exit(0);
  }
  
  response = await linkContract.methods.approve(coreProxy, twoK).send(options)
  if (response.transaction.receipt.status == "0x1") {
    console.log("approve successfully")
  } else {
    console.log("approve failed!")
    process.exit(0);
  }
  response = await linkContract.methods.approve(poolProxy, twoK).send(options) 
  if (response.transaction.receipt.status == "0x1") {
    console.log("approve successfully")
  } else {
    console.log("approve failed!")
    process.exit(0);
  }

  response = await linkContract.methods.allowance(ownerAddr, coreProxy).call(options)
  console.log("allowance: " + response)

  response = await linkContract.methods.allowance(ownerAddr, poolProxy).call(options)
  console.log("allowance: " + response)
  response = await linkContract.methods.allowance(userAddr, coreProxy).call(options)
  console.log("allowance: " + response)

  response = await linkContract.methods.allowance(userAddr, poolProxy).call(options)
  console.log("allowance: " + response)
  return linkAddr
}

async function set_address(addrProviderAddr) {

  let res = await addrProvider.methods.setLendingPoolCoreImpl("0xf9f94c822cf4be2930aaec31ad13bdffe5ceeaf2").send(options);
  
  console.log(res.transaction);

  let poolAddr = await addrProvider.methods.getLendingPoolCore().call(options);

  console.log("LendingPoolAddressesProvider-LendingPoolCore " + poolAddr);
}

function link(bytecode, libName, libAddress) {
  let symbol = "__" + libName + "_".repeat(40 - libName.length - 2);
  return bytecode.split(symbol).join(libAddress.toLowerCase().substr(2))
}

deploy().then(() => {process.exit(0);})
