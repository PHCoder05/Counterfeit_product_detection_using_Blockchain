const FakePro = artifacts.require("FakePro");

module.exports = function (deployer) {
  deployer.deploy(FakePro);
};
