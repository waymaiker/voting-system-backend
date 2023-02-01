import { Flex, Text } from "@chakra-ui/react";

import useEventsProvider from "@/hooks/useEventsProvider";
import { WORKFLOW_STATUS_VALUE } from "@/utils/constants";


export default function RegisteringVotersStatusView(){
  const { workflowStatus } = useEventsProvider()
  return(
    WORKFLOW_STATUS_VALUE[workflowStatus.previousStatus] == "RegisteringVoters" &&  
      <Flex grow="1" direction="column" justifyContent="center" alignItems="center">
        <Text fontSize="2xl" fontWeight="bold">You have been registered </Text> 
        <Text fontSize="2xl" fontWeight="bold">Please, wait for the organizer to launch the next phase, to participate </Text> 
      </Flex>     
  )
}