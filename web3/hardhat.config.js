require("@nomicfoundation/hardhat-toolbox");
const dotenv = require("dotenv")

dotenv.config()

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  defaultNetwork: "sepolia",
  networks: {
    hardhat: {},
    sepolia: {
      url: "https://sepolia.drpc.org",
      accounts: [`0x${process.env.PRIVATE_KEY}`]
    }
  }
};
