import { defineConfig } from '@wagmi/cli';

export default defineConfig({
  out: 'src/generated.ts',
  contracts: [
    {
      name: 'Contract1',
      abi: './artifacts/Contract1.abi.json',
    },
    {
      name: 'Contract2',
      abi: './artifacts/Contract2.abi.json',
    },
    {
      name: 'TitleDeedTokenization',
      abi: './artifacts/contracts/tokenize.sol/TitleDeedTokenization.json',
    },
  ],
  plugins: [],
});