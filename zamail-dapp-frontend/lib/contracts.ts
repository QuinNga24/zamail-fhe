// Zamail Contract Configuration
export const ZAMAIL_CONTRACT = {
  ADDRESS: "0xaAfce2e6De48D2F7ACd0279Fd67A37EB6e47e076", // Original Zamail (hash-only mode)
  NETWORK: {
    chainId: 11155111,
    name: "Sepolia",
  },
  ABI_PATH: "/abis/Zamail.json",
  FEES: {
    REGISTER_EMAIL: "1000000000000000", // 0.001 ETH
    SEND_MAIL: "100000000000000", // 0.0001 ETH
  },
};

export const RPC_ENDPOINT = "https://sepolia.infura.io/v3/860368e83d3540639350f5b975a8eec1";

export const ETHERSCAN_URL = "https://sepolia.etherscan.io";
