import '@/styles/globals.css'
import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { hardhat, goerli } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { ChakraProvider } from '@chakra-ui/react'

import { OwnerProvider } from '@/contexts/ownerProvider';
import { EventsProvider } from '@/contexts/eventsProvider';

const { chains, provider } = configureChains(
  [goerli],
  [ publicProvider() ]
);

const { connectors } = getDefaultWallets({
  appName: 'Voting App',
  chains
});

const wagmiClient = createClient({
  autoConnect: false,
  connectors,
  provider
})

export default function App({ Component, pageProps }) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}  modalSize="compact">
        <ChakraProvider>
          <OwnerProvider>
            <EventsProvider>
              <Component {...pageProps} />              
            </EventsProvider>
          </OwnerProvider>
        </ChakraProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  )
}
