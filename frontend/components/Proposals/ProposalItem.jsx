import { Text, Image, Card, CardBody, Stack, Heading } from '@chakra-ui/react'

export default function ProposalItem ({proposal, index}) {
  return (
    <Card
      direction={{ base: 'column', sm: 'row' }}
      overflow='hidden'
      variant='outline'
      mt={index != 0 ? "5" : "" }
      p="5"
    >
      <Image
        objectFit='cover'
        maxW={{ base: '100%', sm: '200px' }}
        src='/simple_logo.png'
        alt='Caffe Latte'
      />
      <Stack>
        <CardBody>
          <Heading size='md'>Proposal number {proposal.id} </Heading>
          <Text fontSize="xl" fontWeight='medium' > {proposal.description}</Text>
          <Text fontSize="xl" fontWeight='medium' > Vote count: {proposal.voteCount}</Text>
        </CardBody>
      </Stack>
    </Card>
  )
}