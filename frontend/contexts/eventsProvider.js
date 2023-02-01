import { useEffect, createContext, useState } from "react";
import { useAccount } from 'wagmi'
import { ethers } from "ethers";

import { contract } from "@/utils/constants";
import { useToast } from "@chakra-ui/react";

const EventsContext = createContext(null)

export const EventsProvider = ({ children }) => {
  const { isConnected } = useAccount()
  const toast = useToast()

  const [isLoading, setIsLoading] = useState(false)

  //State Handling Events
  const [workflowStatus, setWorkflowStatus] = useState({ previousStatus: 0, nextStatus: 1})
  const [registeredVotersList, setRegisteredVoters] = useState([])
  const [proposalsListId, setProposalsListId] = useState([])
  const [votedList, setVoted] = useState([])

  //States
  const [proposal, setProposal] = useState({})
  const [voter, setVoter] = useState({})
  const [winningProposalId, setWinningProposalId] = useState(0)


  const resetDatas = () => {
    setWorkflowStatus({ previousStatus: 0, nextStatus: 1 })
    setRegisteredVoters([])
    setProposalsListId([])
    setVoted([])
  }

  const getEvents = async () => {
    const filter = { address: contract.address, fromBlock: 0 }
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const contractInstance = new ethers.Contract(contract.address, contract.abi, provider)
    const events = await contractInstance.queryFilter(filter)

    resetDatas()

    events.forEach((event) => {
      try {
        catchWorkflowStatusChangeEvent(event, setWorkflowStatus, setIsLoading)
        catchVoterRegisteredEvent(event, setRegisteredVoters, setIsLoading)
        catchProposalEvent(event, setProposalsListId, setIsLoading)
        catchVotedEvent(event, setVoted, setIsLoading)
      } catch (error) {
        toast({
          title: "Error - "+event.event,
          description: error.reason,
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      }
    })
  }

  useEffect(() => {
    if(isConnected){ 
      getEvents()
    }
  }, [isConnected])

  return (
    <EventsContext.Provider value={{
      isLoading,
      setIsLoading,
      workflowStatus,
      setWorkflowStatus,
      registeredVotersList,
      proposalsListId,
      votedList,
      proposal, 
      setProposal,
      voter, 
      setVoter,
      getEvents,
      winningProposalId, 
      setWinningProposalId
    }}>
      {children}
    </EventsContext.Provider>
  )
}

export default EventsContext;

const catchVoterRegisteredEvent = (event, setRegisteredVoters, setIsLoading) => {
  if(event.event === "VoterRegistered"){
    setRegisteredVoters(registeredVotersList => {
      return [{
        title: "Voter Added",
        address: event.args.voterAddress,
      }, ...registeredVotersList]
    })
    setIsLoading(false)
  }
}

const catchWorkflowStatusChangeEvent = (event, setWorkflowStatus, setIsLoading) => {
  if(event.event === "WorkflowStatusChange"){
    setIsLoading(false)
    setWorkflowStatus({
      previousStatus: event.args[0]+1,
      nextStatus: event.args[1]+1,      
    })
  }
}

const catchProposalEvent = (event, setProposalsListId, setIsLoading) => {
  if(event.event === "ProposalRegistered"){
    setIsLoading(false)
    setProposalsListId(proposalsListId => [
      ...proposalsListId, parseInt(event.args.proposalId)
    ])
  }
}

const catchVotedEvent = (event, setVoted, setIsLoading) => {
  if(event.event === "Voted"){
    setIsLoading(false)
    setVoted(votedList => [{
        voterAddress: event.args.voter,
        proposalId: parseInt(event.args.proposalId),
      }, ...votedList]
    )
  }
}