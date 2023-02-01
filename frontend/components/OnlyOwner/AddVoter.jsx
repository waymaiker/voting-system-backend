import { Flex, Button, Input, useToast } from "@chakra-ui/react";
import { ethers } from "ethers";
import { useState } from "react";
import { useSigner } from "wagmi";

import { contract } from "@/utils/constants";
import useEventsProvider from "@/hooks/useEventsProvider";

export const AddVoter = () => {
  const [userAddress, setUserAddress] = useState(0)
  const { data: signer } = useSigner()
  const { isLoading, setIsLoading, getEvents } = useEventsProvider() 
  const toast = useToast()

  const addVoter = async () => {
    setIsLoading(true)
    try {
      const contractInstance = new ethers.Contract(contract.address, contract.abi, signer)
      let transaction = await contractInstance.addVoter(userAddress)
      await transaction.wait()

      await getEvents()
      
    } catch (error) {
      setIsLoading(false)
      toast({
        title: 'Error - Add a Voter',
        description: error.reason,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  return (
    <Flex p="5" backgroundColor="white" borderRadius="10" alignItems="center">
      <Button p="7" mr="5" isLoading={isLoading} loadingText='Submitting' onClick={() => addVoter()} colorScheme='blue'>
        Register a Voter 
      </Button>
      <Input p="7" onChange={(e) => setUserAddress(e.target.value)} placeholder="0x5QDS54SDFH65HF54...1" />
    </Flex>
  )
}