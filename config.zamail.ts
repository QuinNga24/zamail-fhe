// config/zamail.config.ts
// Frontend configuration for Zamail dApp

export const ZAMAIL_CONFIG = {
  // Contract address (set after deployment on Sepolia)
  CONTRACT_ADDRESS: process.env.VITE_ZAMAIL_ADDRESS || "0x...",

  // Network configuration
  SEPOLIA: {
    chainId: 11155111,
    chainName: "Sepolia Testnet",
    nativeCurrency: {
      name: "Sepolia ETH",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrl: process.env.VITE_SEPOLIA_RPC || "https://sepolia.infura.io/v3/860368e83d3540639350f5b975a8eec1",
    blockExplorerUrl: "https://sepolia.etherscan.io",
  },

  // Fees (in wei)
  FEES: {
    REGISTER_EMAIL: "1000000000000000", // 0.001 ETH
    SEND_MAIL: "100000000000000",       // 0.0001 ETH
  },

  // FHE Relayer configuration
  RELAYER: {
    baseUrl: process.env.VITE_RELAYER_URL || "https://relayer.zamail.io",
    endpoints: {
      encrypt: "/encrypt",
      decrypt: "/userDecrypt",
      attestation: "/attestation",
    },
  },

  // Email validation
  EMAIL_PATTERN: /^[a-zA-Z0-9]+@zamail\.com$/,
  EMAIL_MIN_LENGTH: 3,
  EMAIL_MAX_LENGTH: 50,

  // Message limits
  MESSAGE_MAX_SIZE: 10000, // characters
  SUBJECT_MAX_LENGTH: 200,
  BODY_MAX_LENGTH: 5000,

  // UI configuration
  UI: {
    CONFIRM_TIMEOUT: 30000, // 30 seconds
    LOAD_TIMEOUT: 15000,    // 15 seconds
    TOAST_DURATION: 5000,   // 5 seconds
  },

  // Gas settings (for ethers.js)
  GAS: {
    register: "50000",
    sendMail: "80000",
    withdraw: "30000",
  },
};

// Helper to format amounts
export const formatAmount = (wei: string): string => {
  const ethValue = parseFloat(wei) / 1e18;
  return ethValue.toFixed(6);
};

// Helper to get contract address with checksum
export const getChecksumedAddress = (address: string): string => {
  try {
    // This will validate and checksum the address
    return address.toLowerCase(); // Simplified, use ethers.getAddress() in production
  } catch {
    throw new Error("Invalid contract address");
  }
};

// ABI import path (relative to your frontend)
export const ABI_PATH = "/abis/Zamail.json";
