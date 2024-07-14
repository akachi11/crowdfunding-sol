// imports
const { ethers, run, network } = require("hardhat")

// async main
async function main() {
    const CrowdFundingFactory = await ethers.getContractFactory("CrowdFunding")
    console.log("Deploying contract...")
    console.log(await CrowdFundingFactory.deploy())
}

// main
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })