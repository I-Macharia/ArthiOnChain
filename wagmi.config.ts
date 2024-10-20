import { useContract } from 'wagmi';
import LandTitleRegistry from "./artifacts/contracts/titledeeds.sol/LandTitleRegistry.json";

// ...

const { data, error, isLoading } = useContract({
  address: '0xYOUR_CONTRACT_ADDRESS',
  abi: LandTitleRegistry.abi,
  functionName: 'getLandTitleOwner',
  args: ['landTitleId'],
});


