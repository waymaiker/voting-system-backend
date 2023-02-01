import AddProposal from "../OnlyVoters/AddProposal";
import GetOneProposal from "../OnlyVoters/GetOneProposal";
import ProposalsContent from "../Proposals/ProposalsContent";

import { WORKFLOW_STATUS_VALUE } from "@/utils/constants";

export default function ProposalsRegistrationStartedView() {
  const { workflowStatus, proposalsListId } = useEventsProvider()
  return (
    <Flex justifyContent="center">
      { WORKFLOW_STATUS_VALUE[workflowStatus.previousStatus] == "ProposalsRegistrationStarted" 
        &&  <AddProposal /> 
      }
      { 
        workflowStatus.previousStatus >= 1 
        && workflowStatus.previousStatus <= 4 
        && proposalsListId.length > 0 
        && <Flex direction="column">
            <GetOneProposal /> 
            <ProposalsContent proposalsListId={proposalsListId} />
          </Flex>
      }                
    </Flex>     
  )
}