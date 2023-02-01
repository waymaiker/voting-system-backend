import useEventsProvider from '@/hooks/useEventsProvider'
import { Wrap, Flex, Text } from '@chakra-ui/react'

import VoterItem from './VoterItem'

export default function VotersContent () {
  const { voter, registeredVotersList } = useEventsProvider()
  
  console.log("voter *----");
  console.log(voter);
  return (
    <Flex direction="column" mt='10' maxWidth='50vh'>
      <Text fontWeight='medium' fontSize='xl'> Voters address available</Text>
      <Wrap justifyContent="center" mt="2">
        {registeredVotersList.map((voter, index) => (<Text key={index} fontWeight='bold'> {voter.address}, </Text>) )}
      </Wrap>
      {voter.address != undefined && <VoterItem voter={voter}/>}    
    </Flex>
  )
}