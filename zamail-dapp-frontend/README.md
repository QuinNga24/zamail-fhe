# Zamail - Encrypted Email dApp

A decentralized, privacy-focused email application built on **Ethereum Sepolia testnet** with **end-to-end encryption**.

## 🌟 Features

- **Register Email**: Create a unique email address on-chain
- **Send Encrypted Emails**: All emails are encrypted locally before storage
- **Reply to Emails**: Direct reply functionality within the inbox
- **Local Storage**: Emails stored in browser localStorage (encrypted)
- **Off-chain Encryption**: XOR-based encryption for demo purposes
- **MetaMask Integration**: Connect wallet for authentication
- **Zero Gas for Emails**: Only registration requires ETH (0.001 ETH)

## 🏗️ Tech Stack

### Frontend
- **Next.js 15.5.6** - React framework with App Router
- **React 19** - UI library
- **Tailwind CSS 4.1.16** - Styling
- **ethers.js v6** - Blockchain interaction
- **TypeScript** - Type safety
- **Radix UI** - Accessible UI components

### Smart Contract
- **Solidity 0.8.24**
- **Deployed on Sepolia Testnet**
- **Contract Address**: `0xaAfce2e6De48D2F7ACd0279Fd67A37EB6e47e076`

## 🚀 Getting Started

### Prerequisites

- Node.js >= 20
- MetaMask or Web3 wallet
- Sepolia testnet ETH (for email registration)

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd zamail-dapp-frontend

# Install dependencies
npm install
# or
yarn install
```

### Running Locally

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## 📖 User Guide

### 1. Connect Wallet
1. Click **"Connect Wallet"** button in the top-right
2. Approve the connection in MetaMask
3. Ensure you're on **Sepolia testnet**

### 2. Register Email
1. Click **"Register Email"** tab
2. Enter your email (format: `yourname@zamail.com`)
3. Pay **0.001 ETH** registration fee
4. Wait for transaction confirmation

### 3. Send Email
1. Click **"Compose"** tab
2. Enter recipient email (must be registered)
3. Add subject and message
4. Click **"Send"**
5. Email will be encrypted and stored locally
6. ✅ **No gas fee required!**

### 4. Read Emails
1. Click **"Inbox"** tab
2. See all received emails
3. Click an email to read full content
4. Click **"Reply"** to respond

### 5. View Sent Emails
1. Click **"Outbox"** tab
2. View all emails you've sent

## 🔐 Security & Privacy

- **Client-side Encryption**: All emails encrypted in browser before storage
- **No Plaintext on-chain**: Only registration data stored on blockchain
- **LocalStorage**: Encrypted emails stored in browser (per-browser instance)
- **XOR Encryption**: Current implementation uses XOR for demo
  - *Production: Replace with AES-GCM or libsodium*

## 📋 Smart Contract Details

### Contract Address
```
0xaAfce2e6De48D2F7ACd0279Fd67A37EB6e47e076
```

### Key Functions

```solidity
// Register email
function registerEmail(string calldata email) external payable

// Send mail (requires hash + proof, currently skipped for off-chain)
function sendMail(
    string calldata recipientEmail,
    bytes32 contentHash
) external payable

// Get registered email
function getMyEmail() external view returns (string memory)

// Get inbox handles
function getInboxHandles() external view returns (bytes32[] memory)

// Get outbox handles
function getOutboxHandles() external view returns (bytes32[] memory)
```

### Fees
- **Email Registration**: 0.001 ETH
- **Send Email**: 0.0001 ETH (off-chain, no gas)
- **Read Email**: Free

## 🗂️ Project Structure

```
zamail-dapp-frontend/
├── app/
│   ├── layout.tsx           # Root layout with global styles
│   ├── page.tsx             # Main page
│   └── globals.css
├── components/
│   ├── inbox.tsx            # Inbox with reply feature
│   ├── compose-mail.tsx     # Email composer
│   ├── register-email.tsx   # Email registration
│   ├── outbox.tsx           # Sent emails
│   └── ui/                  # Reusable UI components
├── lib/
│   ├── contracts.ts         # Contract configuration
│   ├── zamail-utils.ts      # Contract interaction functions
│   ├── offchain-storage.ts  # Encryption & localStorage
│   └── mock-mails.ts        # Mock data
├── hooks/
│   ├── use-toast.ts         # Toast notifications
│   └── useZamailContract.ts # Contract hook
├── public/
│   └── abis/
│       ├── Zamail.json      # Contract ABI
│       └── ZamailSimple.json # Simple contract ABI (backup)
├── next.config.mjs
├── tsconfig.json
├── tailwind.config.ts
└── package.json
```

## 🌐 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Select your GitHub repository
   - Click "Deploy"

3. **Environment Variables** (if needed)
   - No environment variables required for frontend
   - Contract address is hardcoded in `lib/contracts.ts`

### Local Deployment with Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🔌 Contract Integration

### Contract Configuration

Edit `lib/contracts.ts` to change contract address:

```typescript
export const ZAMAIL_CONTRACT = {
  ADDRESS: "0xaAfce2e6De48D2F7ACd0279Fd67A37EB6e47e076",
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
```

### Adding New Contract Functions

1. Update ABI in `public/abis/Zamail.json`
2. Add function to `lib/zamail-utils.ts`:
   ```typescript
   export async function myNewFunction(contract, param) {
     return await contract.myNewFunction(param);
   }
   ```
3. Use in components

## 🚧 Future Enhancements

- [ ] Real FHE encryption with Zama SDK (@zama-fhe/relayer-sdk)
- [ ] IPFS/Arweave for off-chain storage
- [ ] Email threading with replies
- [ ] Archive/Spam/Trash folders
- [ ] Search functionality
- [ ] Email attachments
- [ ] Contact management
- [ ] Dark/Light theme toggle
- [ ] Multi-language support

## 🔄 Migration to Real FHE

Currently using XOR encryption for demo. To integrate **Zama FHEVM**:

1. Install Zama SDK:
   ```bash
   npm install @zama-fhe/relayer-sdk
   ```

2. Update `lib/offchain-storage.ts`:
   ```typescript
   import { createInstance } from '@zama-fhe/relayer-sdk/web'
   
   const instance = await createInstance({ network: 'sepolia' })
   const { externalValue, attestation } = await instance.encrypt({...})
   ```

3. Update contract to validate FHE proofs
4. Deploy new contract

## 🧪 Testing

### Register Test Email
```
Email: test@zamail.com
```

### Send Test Email
- Recipient: Another registered email
- Subject: "Test email"
- Message: "This is a test"

## 📞 Support

For issues or questions:
1. Check [Smart Contract on Etherscan](https://sepolia.etherscan.io/address/0xaAfce2e6De48D2F7ACd0279Fd67A37EB6e47e076)
2. Review the code in `lib/` folder
3. Open an issue on GitHub

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Blockchain interaction via [ethers.js](https://docs.ethers.org/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Inspiration from [Zama FHEVM](https://docs.zama.ai/fhevm)

---

**Happy emailing! 📧🔐**
