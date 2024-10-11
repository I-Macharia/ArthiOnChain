import { defineConfig } from '@wagmi/cli';

export default defineConfig({
  out: 'src/generated.ts',
  contracts: [
    {
      name: 'Login',
      abi: './artifacts/Contract1.abi.json',
    },
    {
      name: 'LandTitleRegistry',
      abi: './artifacts/Contract2.abi.json',
    },
    {
      name: 'TitleDeedTokenization',
      abi: './artifacts/contracts/tokenize/TitleDeedTokenization.json',
    },
  ],
  plugins: [],
});