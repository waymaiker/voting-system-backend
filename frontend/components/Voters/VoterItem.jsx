import { Text, Image, Card, CardBody, Stack, Heading } from '@chakra-ui/react'

export default function VoterItem ({voter, index}) {
  return (
    <Card
      direction={{ base: 'column', sm: 'row' }}
      overflow='hidden'
      variant='outline'
      mt={index != 0 ? "5" : "" }
    >
      <Image
        objectFit='cover'
        maxW={{ base: '100%', sm: '200px' }}
        src='/simple_logo.png'
        alt='Caffe Latte'
      />
      <Stack>
        <CardBody>
          <Heading size='md'>{voter.title}</Heading>
          <Text fontWeight='medium'> {voter.address}</Text>
          {
            voter.hasVoted
            ? <Text fontSize="xl" fontWeight='medium'> Voted for proposal {voter.votedProposalId}</Text>
            : <Text fontSize="xl" fontWeight='medium'> Not voted yet </Text>
          }
        </CardBody>
      </Stack>
    </Card>
  )
}