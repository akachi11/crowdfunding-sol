import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'

import { contractABI, contractAddress } from '../utils/constants'

export const CrowdFundingContext = React.createContext();

const { ethereum } = window;

const provider = new ethers.BrowserProvider(ethereum)
const signer = await provider.getSigner();

const getCrowdFundingContract = async () => {
    const CrowdFundingContract = new ethers.Contract(contractAddress, contractABI, signer)

    return CrowdFundingContract
}

export const CrowdFundingProvider = ({ children }) => {
    const [currentAccount, setCurrentAccount] = useState()

    const checkIfWalletIsConnected = async () => {
        try {
            if (!ethereum) return alert("Please install Metamask");

            const accounts = await ethereum.request({ method: "eth_accounts" });

            if (accounts.length) {
                setCurrentAccount(accounts[0])
            } else {
                console.log("No accounts found")
            }
        } catch (error) {
            console.log(error)
        }
    }

    const connectWallet = async () => {
        try {
            if (!ethereum) return alert("Please install metamask.");

            const accounts = await ethereum.request({ method: "eth_requestAccounts", });

            setCurrentAccount(accounts[0]);
        } catch (error) {
            console.log(error)

            throw new Error("No ethereum object")
        }
    }

    const publishCampaign = async (form) => {
        try {
            if (ethereum) {
                const crowdFundingContract = await getCrowdFundingContract();
                try {
                    const data = await crowdFundingContract.createCampaign(
                        currentAccount,
                        form.title,
                        form.description,
                        form.target,
                        (new Date(form.deadline).getTime()) / 1000,
                        form.image
                    );

                    await data.wait()
                    console.log(data)
                } catch (error) {
                    console.log(error)
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    const getCampaigns = async () => {
        try {
            if (ethereum) {
                const crowdFundingContract = await getCrowdFundingContract();
                try {
                    const data = await crowdFundingContract.getCampaigns();
                    const campaigns = data.map((campaign, i) => ({
                        owner: campaign[0].toLowerCase(),
                        title: campaign[1],
                        description: campaign[2],
                        target: ethers.formatEther(campaign[3].toString()),
                        deadline: parseInt(campaign[4]),
                        amountCollected: ethers.formatEther(campaign[5].toString()),
                        image: campaign[6],
                        pid: i
                    }))
                    return campaigns
                } catch (error) {
                    console.log(error)
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    const getFilteredCampaigns = async () => {
        try {
            if (ethereum) {
                const allCampaigns = await getCampaigns();
                const filteredCampaigns = allCampaigns.filter((campaign) => campaign.owner === currentAccount);
                return filteredCampaigns
            } else {
                console.log("No eth")
            }
        } catch (error) {
            console.log(error)
        }
    }

    const donate = async (pId, amount) => {
        try {
            if (ethereum) {
                const crowdFundingContract = await getCrowdFundingContract();
                console.log(pId)
                try {
                    const data = await crowdFundingContract.donateToCampaign(pId, { value: ethers.parseEther(amount) });
                    console.log(data)
                    return data
                } catch (error) {
                    console.log(error)
                }
            } else {
                console.log("No eth")
            }
        } catch (error) {
            console.log(error)
        }
    }

    const getDonations = async (pId) => {
        try {
            if (ethereum) {
                const crowdFundingContract = await getCrowdFundingContract();
                try {
                    const donations = await crowdFundingContract.getDonators(pId);
                    const numberOfDonations = donations[0].length;

                    const parsedDonations = [];

                    for (let i = 0; i < numberOfDonations; i++) {
                        parsedDonations.push({
                            donator: donations[0][i],
                            donation: ethers.formatEther(donations[1][i].toString())
                        })
                    }

                    return parsedDonations;
                } catch (error) {
                    console.log(error)
                }
            } else {
                console.log("No eth")
            }
        } catch (error) {
            console.log(error)
        }
    }

    const disconnectWallet = async () => {
        provider.removeAllListeners()
        setCurrentAccount()
    }

    useEffect(() => {
        checkIfWalletIsConnected()
        getCrowdFundingContract()
    }, [])

    return (
        <CrowdFundingContext.Provider value={{ connectWallet, currentAccount, publishCampaign, getCampaigns, getFilteredCampaigns, donate, getDonations, disconnectWallet }}>
            {children}
        </CrowdFundingContext.Provider>
    )
}