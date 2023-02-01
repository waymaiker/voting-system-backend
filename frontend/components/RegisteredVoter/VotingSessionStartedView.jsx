import useEventsProvider from "@/hooks/useEventsProvider"

export default function VotingSessionStartedView() {
  const { workflowStatus } = useEventsProvider()

  return WORKFLOW_STATUS_VALUE[workflowStatus.previousStatus] == "VotingSessionStarted" 
  && <Flex direction="column" alignItems="center"> 
      <Flex alignItems="center"> 
        <AddVote /> 
        <GetVoter />
      </Flex> 
      <VotersContent />
    </Flex> 
}