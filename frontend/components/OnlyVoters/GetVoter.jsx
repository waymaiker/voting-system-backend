import { Card, Flex, Button, Input, FormControl, FormLabel, useToast } from "@chakra-ui/react";
import { ethers } from "ethers";
import { useState } from "react";
import { useSigner } from "wagmi";

import useEventsProvider from "@/hooks/useEventsProvider";
import { contract } from "@/utils/constants";
import { toastError, toastSuccess } from "@/utils/methods";

export default function GetVoter () {
  const [voterAddress, setVoterAddress] = useState("0x")
  const { getEvents, setVoter } = useEventsProvider()
  const { data: signer } = useSigner()
  const toast = useToast() 

  const getVoter = async () => {
    try {
      const contractInstance = new ethers.Contract(contract.address, contract.abi, signer)
      let transaction = await contractInstance.getVoter(voterAddress)
  
      setVoter({
        hasVoted: transaction.hasVoted,
        votedProposalId: parseInt(transaction.votedProposalId),
        address: voterAddress,      
      })
  
      await getEvents()
      toast(toastSuccess("Get a voter", "Transaction successful"))      
    } catch (error) {
      toastError("Get a voter", error.reason)
    }
    console.log(voterAddress);
  }

  return (
    <Card direction="column" p="5" m="2" backgroundColor="white" borderRadius="10" variant='outline'>
      <Button isDisabled={voterAddress.length != 42} onClick={() => getVoter()} colorScheme='blue' variant='solid' marginTop="2" marginBottom="10">
        Get information on a Voter
      </Button>
      <Flex direction='column'>
        <FormControl>
          <FormLabel>User address</FormLabel>
          <Input onChange={(e) => setVoterAddress(e.target.value)} placeholder="0x976EA74026E726554dB657fA54763abd0C3a0aa9" />
        </FormControl>
      </Flex>
    </Card>
  )
}