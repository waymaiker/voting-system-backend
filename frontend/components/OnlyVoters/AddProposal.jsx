import { Card, Flex, Button, Input, FormControl, FormLabel, useToast, FormHelperText } from "@chakra-ui/react";
import { ethers } from "ethers";
import { useState } from "react";
import { useSigner } from "wagmi";

import useEventsProvider from "@/hooks/useEventsProvider";
import { contract } from "@/utils/constants";
import { toastError, toastSuccess } from "@/utils/methods";

export default function AddProposal () {
const [description, setDescription] = useState("")
  const { getEvents } = useEventsProvider()
  const { data: signer } = useSigner()
  const toast = useToast()
  
  const addProposal = async () => {
    try {
      const contractInstance = new ethers.Contract(contract.address, contract.abi, signer)
      let transaction = await contractInstance.addProposal(description)
      await transaction.wait()
  
      await getEvents()
      toast(toastSuccess("Add proposal", "Transaction successful")) 
    } catch (error) {
      toastError("Add proposal", error.reason)
    }
  }  

  return (
    <Card direction="column" p="5" m="2" backgroundColor="white" borderRadius="10" variant='outline'>
      <Button isDisabled={description.length == 0} onClick={() => addProposal()} colorScheme='blue' variant='solid' marginTop="2" marginBottom="10">
        Add a Proposal
      </Button>
      <Flex direction='column'>
        <FormControl>
          <FormLabel>Description</FormLabel>
          <Input onChange={(e) => setDescription(e.target.value)} placeholder="Do you want to set the age retirement to 64 yo ?" />
          <FormHelperText>Description can't be empty</FormHelperText>
        </FormControl>
      </Flex>
    </Card>
  )
}