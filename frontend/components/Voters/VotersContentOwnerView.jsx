import { Wrap } from '@chakra-ui/react'

import VoterItem from './VoterItem'
import VoterSkeleton from './VoterSkeleton'

export default function VotersContentOwnerView ({voters}) {
  return (
    <Wrap justify="center">
    { voters.length != 0
      ? voters.map((voter, index) => <VoterItem key={index} voter={voter} index={index}/>)
      : <VoterSkeleton />
    }
    </Wrap>
  )
}