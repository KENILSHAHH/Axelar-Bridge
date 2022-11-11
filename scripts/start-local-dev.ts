import { createAndExport } from "@axelar-network/axelar-local-dev";
import { Network } from "@axelar-network/axelar-local-dev/dist/Network";
import { wallet } from "../config/constants";

// deploy network
createAndExport({
  accountsToFund: [wallet.address],
  chains: ['Fantom', 'Polygon'],
  chainOutputPath: "config/testnet.json",
  async callback(network: Network) {
    if (network.name === "Fantom") {
      await network.giveToken(
        wallet.address,
        "aUSDC",
        BigInt("100000000000000"),
      );
    }
  },
});
