const Token = artifacts.require("Token.sol");
const VaultToken = artifacts.require("VaultToken.sol");
const Vault = artifacts.require("VaultContract.sol");

const starknetCore_address = "0xde29d060D45901Fb19ED6C6e959EB22d8626708e";

module.exports = function (deployer) {
  deployer.deploy(Vault, Token_address, VaultToken_address);
};

module.exports = async function (deployer) {
  await deployer.deploy(Token, "BCPToken", "BCPT", BigInt(1e23));
  const token = await Token.deployed();
  await deployer.deploy(VaultToken, "stakedBCPToken", "stBCPT");
  const vaultToken = await VaultToken.deployed();
  await deployer.deploy(Vault, token.address, vaultToken.address, starknetCore_address);
};