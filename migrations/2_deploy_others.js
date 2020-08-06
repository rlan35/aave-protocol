// libs
const CoreLibrary = artifacts.require("CoreLibrary");


const LendingPoolAddressesProvider = artifacts.require("LendingPoolAddressesProvider");
const LendingPoolParametersProvider = artifacts.require("LendingPoolParametersProvider");
const FeeProvider = artifacts.require("FeeProvider");
const LendingPool = artifacts.require("LendingPool");
const LendingPoolConfigurator = artifacts.require("LendingPoolConfigurator");
const LendingPoolCore = artifacts.require("LendingPoolCore");
const LendingPoolDataProvider = artifacts.require("LendingPoolDataProvider");
const LendingPoolLiquidationManager = artifacts.require("LendingPoolLiquidationManager");

module.exports = function(deployer) {
  deployer.deploy(CoreLibrary);
  console.log("CoreLibrary is deployed at address " + CoreLibrary.address);
  deployer.link(CoreLibrary, LendingPoolCore);

  deployer.deploy(LendingPoolAddressesProvider);
  console.log("LendingPoolAddressesProvider is deployed at address " + LendingPoolAddressesProvider.address);
  deployer.deploy(LendingPoolParametersProvider);
  console.log("LendingPoolParametersProvider is deployed at address " + LendingPoolParametersProvider.address);
  deployer.deploy(LendingPool);
  console.log("LendingPool is deployed at address " + LendingPool.address);
  deployer.deploy(LendingPoolConfigurator);
  console.log("LendingPoolConfigurator is deployed at address " + LendingPoolConfigurator.address);
  deployer.deploy(LendingPoolCore);
  console.log("LendingPoolCore is deployed at address " + LendingPoolCore.address);
  deployer.deploy(LendingPoolDataProvider);
  console.log("LendingPoolDataProvider is deployed at address " + LendingPoolDataProvider.address);
  deployer.deploy(LendingPoolLiquidationManager);
  console.log("LendingPoolLiquidationManager is deployed at address " + LendingPoolLiquidationManager.address);
};
