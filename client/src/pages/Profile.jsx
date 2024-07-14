import React, { useContext, useEffect, useState } from 'react'
import { CrowdFundingContext } from "../context/CrowdFundingContext"
import { DisplayCampaigns } from '../components';

const Profile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);

  const { currentAccount, getFilteredCampaigns } = useContext(CrowdFundingContext);



  const fetchCampaigns = async () => {
    setIsLoading(true);
    const data = await getFilteredCampaigns();
    setCampaigns(data);
    setIsLoading(false);
  }

  useEffect(() => {
    if (currentAccount) {
      fetchCampaigns();
    }
  }, []);

  return (
    <DisplayCampaigns
      title="Your Campaigns"
      isLoading={isLoading}
      campaigns={campaigns}
    />
  )
}

export default Profile
