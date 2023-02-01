import React, { useState, useEffect, createContext } from "react";
import { useAccount } from 'wagmi'
import { ethers } from "ethers";

import { contract } from "@/utils/constants";

const OwnerContext = createContext(null)

export const OwnerProvider = ({ children }) => {
  const [isOwnerConnected, setIsOwnerConnected] = useState(false)
  const { address, isConnected } = useAccount()

  const setUserCurrentlyConnected = async () => {
    const ethersProvider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = ethersProvider.getSigner()
    const contractInstance = new ethers.Contract(contract.address, contract.abi, signer)
    const contractOwner =  await contractInstance.owner()

    if(address == contractOwner){
      setIsOwnerConnected(true)
    } else {
      setIsOwnerConnected(false)
    }
  }

  useEffect(()=>{
    if(isConnected){
      setUserCurrentlyConnected()
    }
  }, [isConnected, address])

  return (
    <OwnerContext.Provider value={{ isOwnerConnected }}>
      {children}
    </OwnerContext.Provider>
  )
}

export default OwnerContext;