import { Contract, getDefaultProvider, Wallet } from "ethers";
import { defaultAbiCoder } from "ethers/lib/utils";
import { wallet } from "../config/constants";

const {
  utils: { deployContract },
} = require("@axelar-network/axelar-local-dev");

const chains = require("../config/chains");
const moonbeamChain = chains.find((chain: any) => chain.name === 'Moonbeam');
const avalancheChain = chains.find((chain: any) => chain.name === 'Avalanche');
const polygonChain  = chains.find((chain:any) => chain.name === 'Polygon');
const fantomChain  = chains.find((chain:any) => chain.name === 'Fantom');
const ethereumChain  = chains.find((chain:any) => chain.name === 'Ethereum');

// load contracts
const MessageSenderContract = require("../artifacts/contracts/MessageSender.sol/MessageSender.json");
const MessageReceiverContract = require("../artifacts/contracts/MessageReceiver.sol/MessageReceiver.json");

console.log({
  address: wallet.address,
});

async function main() {
  // call on destination chain
  const polygonProvider = getDefaultProvider(polygonChain.rpc);
  const polygonConnectedWallet = wallet.connect(polygonProvider);
  const destContract = new Contract(
    polygonChain.messageReceiver,
    MessageReceiverContract.abi,
    polygonConnectedWallet,
  );

  console.log({
    msg: await destContract.message(),
  });

  // call on source chain
  const ethProvider = getDefaultProvider(fantomChain.rpc);
  const ethConnectedWallet = wallet.connect(ethProvider);
  const sourceContract = new Contract(
    fantomChain.messageSender,
    MessageSenderContract.abi,
    ethConnectedWallet,
  );

  const tx = await sourceContract.sendMessage(
    "POlygon",
    polygonChain.messageReceiver,
    "hello world!",
    {
      value: BigInt(3000000),
    },
  );
  await tx.wait();

  const event = destContract.on("Executed", (from, value) => {
    if (value === "hello world!") destContract.removeAllListeners("Executed");
  });

  console.log({
    msg: await destContract.message(),
  });
}

main();
