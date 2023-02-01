
import useEventsProvider from '@/hooks/useEventsProvider'
import { Flex, Text, Wrap } from '@chakra-ui/react'
import ProposalItem from './ProposalItem'

export default function ProposalsContent ({proposalsListId}) {
  const { proposal } = useEventsProvider()
  return (
    <Flex direction="column" mt='10'>
      <Text fontWeight='medium' fontSize='xl'> Proposals ids available</Text>
       <Wrap justifyContent='center'>
        {proposalsListId.map((id, index) => (<Text key={index} fontWeight='bold' fontSize='2xl' > {id}, </Text>) )}
      </Wrap>
      {proposal.voteCount != undefined && <ProposalItem proposal={proposal}/>}    
    </Flex>     
  )
}