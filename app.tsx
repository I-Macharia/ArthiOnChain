import { useWallet } from 'wagmi';

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

