import { Flex, Text } from '@chakra-ui/react'

export default function Footer() {
    return (
      <Flex h="10vh" p="2rem" justifyContent="center">
          <Text> © by Watson {new Date().getFullYear()} </Text>
      </Flex>
    )
}