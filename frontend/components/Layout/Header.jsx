import { Flex, Text, Image } from "@chakra-ui/react";
import { useAccount } from 'wagmi'

import Connect from "./SignIn";

export default function Header() {
  const { isConnected } = useAccount()

  return (<>{isConnected ? <Connected/> : <NonConnected/>}</>)
}

const Connected = () => {
  return(
    <Flex justifyContent="space-between" padding="10" backgroundColor="white">
      <Image src='/full_logo.png' alt="Alyra | L'école de la blochain" w="10%" marginEnd="3"/>
      <Connect />      
    </Flex>
  )
}

const NonConnected = () => {
  return(
    <Flex justifyContent="center" alignItems="center" padding="10"  backgroundColor="white">
      <Image src='/full_logo.png' alt="Alyra | L'école de la blochain" w="10%" marginEnd="3"/>
        <Text p='2' fontSize="xl"> l'Ecole de la Blockchain</Text>
    </Flex>
  )
}