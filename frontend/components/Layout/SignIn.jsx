import { Flex } from '@chakra-ui/react'
import { useAccount } from 'wagmi'
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function SignIn() {
  const { isConnected } = useAccount()
  return (
    <Flex 
      direction="column" 
      grow={isConnected ? "0" : "1"} 
      alignItems="center" 
      justifyContent="center"
    >
      <ConnectButton label='Sign in' />
    </Flex>    
  )
}