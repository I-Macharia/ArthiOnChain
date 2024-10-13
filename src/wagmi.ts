import { http, createConfig } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { coinbaseWallet } from 'wagmi/connectors';

export const config = createConfig({
  chains: [baseSepolia],
  connectors: [
    coinbaseWallet({
      appName: 'Create Wagmi',
      preference: 'smartWalletOnly',
    }),
  ],
  transports: {
    [baseSepolia.id]: http(),
  },
});

export const getConfig = () => config;

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}