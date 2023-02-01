import { ethers } from 'ethers'
import { useSigner } from 'wagmi'

import { ArrowRightIcon } from '@chakra-ui/icons'
import { Flex, Text, Badge, Button, useToast } from '@chakra-ui/react'

import useOwnerProvider from '@/hooks/useOwnerProvider'
import { contract, WORKFLOW_STATUS_LABEL } from '@/utils/constants'
import useEventsProvider from '@/hooks/useEventsProvider'
import { toastSuccess } from '@/utils/methods'

export default function WorkflowStatus() {
  const { isOwnerConnected } = useOwnerProvider()
  const { workflowStatus, isLoading, setIsLoading, getEvents, setWinningProposalId } = useEventsProvider()
  const { data: signer } = useSigner()
  const toast = useToast()

  const setWorkflowStatus = async () => {
      setIsLoading(true)
      
      try {
        const contractInstance = new ethers.Contract(contract.address, contract.abi, signer)
        let transaction; 
        let winningProposalId; 

        switch (workflowStatus.nextStatus) {
          case 1:
            transaction = await contractInstance.startProposalsRegistering()
            break;
          case 2:
            transaction = await contractInstance.endProposalsRegistering()
          break;
          case 3:
            transaction = await contractInstance.startVotingSession()
          break;
          case 4:
            transaction = await contractInstance.endVotingSession()
          break;
          case 5:
            transaction = await contractInstance.tallyVotes()
            winningProposalId = await contractInstance.winningProposalID.call()
            setWinningProposalId(winningProposalId)
          break;
          default:
            if(workflowStatus.previousStatus == 5){
              winningProposalId = await contractInstance.winningProposalID.call()                        
              setWinningProposalId(parseInt(winningProposalId))              

              toast(toastSuccess("Get Winning Proposal Id", "Transaction successful"))
            } else {
              throw new Error("Invalid workflowStatus")        
            }
        }

        await getEvents()

      } catch (error) {
        setIsLoading(false)
        toast({
          title: 'Error - Change WorkflowStatus',
          description: error.reason,
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      }
    }
  

  return (
    <Flex justifyContent="center">
      <Text fontSize='xl' fontWeight='bold' p="10">
        <Badge p="2" ml='1' fontSize='xl' colorScheme='green' borderRadius="10">
          {WORKFLOW_STATUS_LABEL[workflowStatus.previousStatus]}
        </Badge>
        {
          isOwnerConnected
          ? <Button
              isLoading={isLoading}
              colorScheme='teal'
              variant='outline'
              marginInline="2"
              leftIcon={ workflowStatus.previousStatus < 5 && <ArrowRightIcon />}
              rightIcon={ workflowStatus.previousStatus < 5 && <ArrowRightIcon />}
              onClick={() => setWorkflowStatus()}
            >
              {workflowStatus.previousStatus >= 5 ?  <Text> Get Winning Proposal Id </Text>  : <Text> Next status </Text> } 
            </Button>
          : <ArrowRightIcon marginInline="5" />
        }
        <Badge p="2" ml='1' fontSize='xl' borderRadius="10" colorScheme={workflowStatus.nextStatus < 5 ? 'yellow' : 'red'}>
          {WORKFLOW_STATUS_LABEL[workflowStatus.nextStatus]}
        </Badge>
      </Text>
    </Flex>
  )
}