import { useWallet } from 'wagmi';
import { useWriteContract } from 'wagmi';


function App() {
  const { connect, disconnect, isConnected } = useWallet();

  if (!isConnected) {
    return (
      <div>
        <button onClick={() => connect()}>Connect Wallet</button>
      </div>
    );
  }

  return (
    <div>
      <button onClick={() => disconnect()}>Disconnect Wallet</button>
    </div>
  );
}


function App() {
  const { writeContract } = useWriteContract({
    address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
    abi: [...], // Your ABI file
    functionName: 'mint',
    args: [BigInt(tokenId)],
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const tokenId = formData.get('tokenId') as string;
    writeContract();
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="tokenId" placeholder="69420" required />
      <button type="submit">Mint</button>
    </form>
  );
}
