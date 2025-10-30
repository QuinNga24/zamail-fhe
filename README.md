# Zamail - Encrypted Email dApp

A **decentralized, privacy-focused email application** built on **Ethereum Sepolia testnet** with **end-to-end encryption**. Zamail revolutionizes traditional email by combining blockchain technology with cryptographic privacy, ensuring that only you and your recipient can read your messages.

Unlike centralized email providers that can access, scan, and monetize your private communications, Zamail puts you in complete control. Your emails are encrypted locally in your browser before any transmission, stored off-chain for privacy, and authenticated on-chain for integrity.

## 🎯 Why Zamail?

### Complete Privacy
- **No Third-Party Access**: Not even we can read your emails
- **Client-Side Encryption**: Messages encrypted in your browser before leaving your device
- **Off-Chain Storage**: Email content never stored on public blockchain
- **Wallet-Based Identity**: No personal information required for registration

### True Ownership
- **Your Keys, Your Data**: Control your email through your Web3 wallet
- **Decentralized**: No central server can shut down or censor your communications
- **Blockchain Authentication**: Email addresses verified and registered on-chain
- **Permanent Access**: Access your emails from any device with your wallet

### Cost Effective
- **One-Time Registration**: Pay 0.001 ETH once, use forever
- **Free Email Sending**: No recurring fees or subscriptions
- **Testnet Available**: Test fully on Sepolia before mainnet

## 🌟 Features

### 📧 Email Management

#### **Register Email Address**
- Create unique email addresses in format `yourname@zamail.com`
- One email per wallet address
- Stored on-chain for verification and discovery
- Protected against duplicate registrations
- **Fee**: 0.001 ETH (one-time)

#### **Send Encrypted Emails**
- Compose emails with subject and body
- Automatic encryption using XOR algorithm (demo) or AES-GCM (production)
- Recipient validation before sending
- Email stored locally in encrypted format
- Content hash stored on-chain for integrity
- **Fee**: Free (off-chain storage)

#### **Inbox Management**
- View all received emails
- Automatic decryption of email content
- See sender, subject, timestamp
- Click to read full email body
- Emails sorted by received date
- Filter by sender (coming soon)

#### **Reply to Emails**
- Direct reply button within email view
- Auto-fill subject with "Re:" prefix
- Maintain conversation context
- Same encryption as new emails
- Reply stored in sender's outbox

#### **Outbox/Sent Mail**
- View all emails you've sent
- Track delivery status
- Review sent message history
- Access sent email content

### 🔐 Security Features

#### **End-to-End Encryption**
- **Algorithm**: XOR encryption (demo), AES-GCM recommended for production
- **Key Derivation**: Deterministic from sender + recipient emails
- **Format**: JSON-encoded email data (subject, body, metadata)
- **Storage**: Browser localStorage (encrypted)

#### **Blockchain Authentication**
- Email addresses verified on Sepolia testnet
- Smart contract prevents duplicate registrations
- Wallet signature required for all actions
- Transaction history publicly auditable

#### **Privacy Protection**
- No plaintext email content on blockchain
- Only content hashes stored on-chain
- LocalStorage isolated per browser/device
- No email content shared with third parties

### 🎨 User Interface

#### **Vintage Email Client Design**
- Classic email interface aesthetics
- Familiar inbox/compose/outbox layout
- Clean, distraction-free reading experience
- Responsive design for mobile and desktop

#### **Wallet Integration**
- MetaMask and Web3 wallet support
- One-click wallet connection
- Automatic network detection
- Seamless Sepolia testnet switching

#### **Real-Time Feedback**
- Toast notifications for all actions
- Loading states during encryption/transactions
- Error messages with helpful guidance
- Transaction status tracking

### 🚀 Advanced Features

#### **Off-Chain Storage Architecture**
- Encrypted emails stored in browser localStorage
- Reduces on-chain storage costs to near-zero
- Instant email retrieval without blockchain queries
- Content hash verification for integrity

#### **Gas Optimization**
- Only registration requires on-chain transaction
- Email sending uses off-chain encryption
- Free email reading (no gas costs)
- Batch operations supported

#### **Developer Friendly**
- Full TypeScript support
- Modular architecture
- Well-documented code
- Easy contract integration
- Comprehensive test suite

## 🏗️ Tech Stack

### Smart Contract
- **Solidity 0.8.24**
- **FHEVM** (Fully Homomorphic Encryption)
- **Deployed on Sepolia**: `0xaAfce2e6De48D2F7ACd0279Fd67A37EB6e47e076`

### Frontend
- **Next.js 15.5.6** - React framework
- **ethers.js v6** - Blockchain interaction
- **Tailwind CSS 4.1.16** - Styling
- **TypeScript** - Type safety

## 🚀 Quick Start

### Prerequisites

- **Node.js**: Version 20 or higher
- **MetaMask**: Browser wallet extension
- **Sepolia ETH**: For email registration ([Get from faucet](https://www.sepoliafaucet.com/))

### Installation

```bash
# Clone repository
git clone <your-repo-url>
cd zamail-fhe

# Install dependencies
npm install
```

### Run Frontend Locally

```bash
# Navigate to frontend
cd zamail-dapp-frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Deploy Smart Contract (Optional)

```bash
# Set environment variables
npx hardhat vars set MNEMONIC
npx hardhat vars set INFURA_API_KEY

# Compile contracts
npm run compile

# Run tests
npm run test

# Deploy to Sepolia
npx hardhat run scripts/deploy.ts --network sepolia
```

## 📁 Project Structure

```
zamail-fhe/
├── contracts/
│   ├── Zamail.sol          # Main email contract (deployed)
│   └── FHECounter.sol      # Example FHE contract
├── scripts/
│   └── deploy.ts           # Deployment script
├── test/                   # Smart contract tests
├── zamail-dapp-frontend/   # Next.js frontend app
│   ├── app/                # Next.js App Router
│   ├── components/         # React components
│   │   ├── inbox.tsx       # Inbox with reply
│   │   ├── compose-mail.tsx # Email composer
│   │   ├── register-email.tsx
│   │   └── outbox.tsx
│   ├── lib/
│   │   ├── contracts.ts    # Contract config
│   │   ├── zamail-utils.ts # Contract functions
│   │   └── offchain-storage.ts # Encryption
│   ├── public/abis/        # Contract ABIs
│   └── README.md           # Frontend docs
├── hardhat.config.ts
└── package.json
```

## 📖 User Guide

### 1. Connect Wallet
1. Open the app at [http://localhost:3000](http://localhost:3000)
2. Click **"Connect Wallet"** button
3. Approve connection in MetaMask
4. Switch to **Sepolia testnet** if prompted

### 2. Register Email
1. Click **"Register Email"** tab
2. Enter your email: `yourname@zamail.com`
3. Pay **0.001 ETH** registration fee
4. Wait for transaction confirmation
5. Your email is now registered!

### 3. Send Email
1. Click **"Compose"** tab
2. Enter recipient email (must be registered)
3. Add subject and message
4. Click **"Send"**
5. Email encrypted and stored locally
6. **No gas fee required!**

### 4. Read Emails
1. Click **"Inbox"** tab
2. See all received emails
3. Click email to read full content
4. Click **"Reply"** to respond

### 5. View Sent Emails
1. Click **"Outbox"** tab
2. View all emails you've sent

## 🔗 Smart Contract Details

### Deployed Contract
- **Address**: `0xaAfce2e6De48D2F7ACd0279Fd67A37EB6e47e076`
- **Network**: Sepolia Testnet (Chain ID: 11155111)
- **Explorer**: [View on Etherscan](https://sepolia.etherscan.io/address/0xaAfce2e6De48D2F7ACd0279Fd67A37EB6e47e076)

### Key Functions

```solidity
// Register email (0.001 ETH fee)
function registerEmail(string calldata email) external payable

// Send mail (off-chain encryption)
function sendMail(string calldata recipientEmail, bytes32 contentHash) external payable

// Get registered email
function getMyEmail() external view returns (string memory)

// Get inbox handles
function getInboxHandles() external view returns (bytes32[] memory)

// Get outbox handles
function getOutboxHandles() external view returns (bytes32[] memory)
```

### Fees
- **Email Registration**: 0.001 ETH
- **Send Email**: 0.0001 ETH (off-chain, no actual gas)
- **Read Email**: Free

## 🔐 Security & Privacy

- **Client-side Encryption**: All emails encrypted in browser
- **No Plaintext on-chain**: Only hashes stored on blockchain
- **LocalStorage**: Encrypted emails in browser (per-device)
- **XOR Encryption**: Demo implementation (replace with AES-GCM for production)

## 📦 Deployment

### Deploy to Vercel (Frontend)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Deploy Zamail dApp"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Select your GitHub repository
   - Root Directory: `./zamail-dapp-frontend`
   - Click "Deploy"

3. **Verify Deployment**
   - Test wallet connection
   - Test email registration
   - Test send/reply functionality

### Deploy Smart Contract

```bash
# Set environment variables
npx hardhat vars set MNEMONIC
npx hardhat vars set INFURA_API_KEY

# Deploy to Sepolia
npx hardhat run scripts/deploy.ts --network sepolia

# Verify on Etherscan
npx hardhat verify --network sepolia <CONTRACT_ADDRESS>
```

## 📚 Documentation

- **Frontend README**: See `zamail-dapp-frontend/README.md` for detailed frontend docs
- **Contract on Etherscan**: [View Contract](https://sepolia.etherscan.io/address/0xaAfce2e6De48D2F7ACd0279Fd67A37EB6e47e076)
- **FHEVM Documentation**: [docs.zama.ai/fhevm](https://docs.zama.ai/fhevm)
- **Next.js Documentation**: [nextjs.org/docs](https://nextjs.org/docs)
- **ethers.js Documentation**: [docs.ethers.org](https://docs.ethers.org/)

## 🧑‍💻 Development

### Smart Contract Scripts

| Script             | Description              |
| ------------------ | ------------------------ |
| `npm run compile`  | Compile all contracts    |
| `npm run test`     | Run all tests            |
| `npm run coverage` | Generate coverage report |
| `npm run lint`     | Run linting checks       |
| `npm run clean`    | Clean build artifacts    |

### Frontend Scripts

```bash
cd zamail-dapp-frontend

npm run dev      # Development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 📄 License

This project is licensed under the BSD-3-Clause-Clear License. See the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Smart Contract**: [View on Etherscan](https://sepolia.etherscan.io/address/0xaAfce2e6De48D2F7ACd0279Fd67A37EB6e47e076)
- **Sepolia Faucet**: [sepoliafaucet.com](https://www.sepoliafaucet.com/)
- **FHEVM Docs**: [docs.zama.ai](https://docs.zama.ai)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)

---

**Built with ❤️ using Zama FHEVM, Next.js, and ethers.js**
