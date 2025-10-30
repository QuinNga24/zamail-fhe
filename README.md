# Zamail - Decentralized Encrypted Email dApp

Zamail is a **decentralized, privacy-focused email platform** on the **Ethereum Sepolia testnet**. Using **Fully Homomorphic Encryption (FHE)**, all emails are encrypted on-chain, and only the sender and recipient can read their content.

---

## 🌐 Live Demo

- **Testnet Smart Contract**: [0xaAfce2e6De48D2F7ACd0279Fd67A37EB6e47e076](https://sepolia.etherscan.io/address/0xaAfce2e6De48D2F7ACd0279Fd67A37EB6e47e076)
- **Frontend (Next.js/React)**: Deploy to Vercel (See [Deployment](#-deployment))

---

## 📖 Project Overview

Zamail combines blockchain and FHE encryption to create an email system that is:

- **Decentralized**: All emails stored off-chain with on-chain verification, no central server
- **Encrypted**: Email subjects and bodies encrypted with XOR/AES-GCM encryption
- **Private**: Only sender and recipient can decrypt messages
- **Organized**: Inbox, Outbox, and Reply functionality
- **Web3 Native**: Uses MetaMask wallet for authentication

---

## 🏗️ Technologies Used

### Smart Contract (On-chain)

- **Solidity 0.8.24**
- **FHEVM (Fully Homomorphic Encryption)**
- **Sepolia Testnet** - Preconfigured for testing

### Frontend (User Interface)

- **React 19** - Modern UI library
- **Next.js 15.5.6** - Server-side rendering & optimized builds
- **ethers.js v6** - Blockchain interaction
- **Tailwind CSS 4.1.16** - Styling
- **TypeScript** - Type safety

---

## ⚡ Key Features

### 📧 **Email Management**
- Send encrypted emails to registered addresses
- Automatic XOR/AES-GCM encryption of email content
- Off-chain storage with on-chain hash verification
- View all received emails in Inbox
- View all sent emails in Outbox

### 💬 **Reply Functionality**
- Direct reply to received emails
- Maintain conversation context
- Auto-fill subject with "Re:" prefix
- Same encryption as new emails

### 🔐 **Email Registration**
- Create unique email addresses (`yourname@zamail.com`)
- One-time registration fee (0.001 ETH)
- Wallet-based verification
- Prevents duplicate registrations

### 🔒 **Privacy & Security**
- Client-side encryption (browser-based)
- No plaintext stored on-chain
- Only content hashes stored on blockchain
- Full sender/recipient control

---

## 🛠️ Getting Started

### Prerequisites

- **Node.js** >= 20
- **npm** or **yarn**
- **MetaMask** or Web3 wallet
- **Sepolia testnet ETH** for registration

### Installation

```bash
# Clone the repository
git clone https://github.com/QuinNga24/zamail-fhe.git
cd zamail-fhe

# Install dependencies
npm install
```

### Running Frontend Locally

```bash
cd zamail-dapp-frontend
npm install
npm run dev
```

Open the app in your browser.

### Running Smart Contract Tests

```bash
# Install dependencies at root
cd ..
npm install

# Compile contracts
npm run compile

# Run tests
npm run test
```

---

## 💻 Smart Contract Interaction

**Contract Address**: [0xaAfce2e6De48D2F7ACd0279Fd67A37EB6e47e076](https://sepolia.etherscan.io/address/0xaAfce2e6De48D2F7ACd0279Fd67A37EB6e47e076)

### Key Functions

```solidity
// Register email address (0.001 ETH fee)
function registerEmail(string calldata email) external payable

// Send encrypted email
function sendMail(
    string calldata recipientEmail,
    bytes32 contentHash
) external payable

// Get registered email
function getMyEmail() external view returns (string memory)

// Get inbox email hashes
function getInboxHandles() external view returns (bytes32[] memory)

// Get outbox email hashes
function getOutboxHandles() external view returns (bytes32[] memory)
```

### Fee Structure

| Function | Fee | Purpose |
|----------|-----|----------|
| registerEmail | 0.001 ETH | One-time email registration |
| sendMail | 0.0001 ETH | Send email |
| getMyEmail | Free | Query registered email |
| getInboxHandles | Free | Query inbox |
| getOutboxHandles | Free | Query outbox |

---

## 🌟 Architecture

### Email Flow

```
1. User A registers email → Contract stores email-to-wallet mapping
   ↓ [registerEmail + 0.001 ETH]

2. User B registers email → Contract stores email-to-wallet mapping
   ↓ [registerEmail + 0.001 ETH]

3. User A sends email to User B
   ↓ [Frontend: Encrypt content with XOR/AES-GCM]
   ↓ [Frontend: Save ciphertext to localStorage]
   ↓ [Contract: Store contentHash for integrity]
   ↓ [sendMail + 0.0001 ETH]

4. User B views inbox
   ↓ [Contract: getInboxHandles() returns hashes]
   ↓ [Frontend: Load ciphertext from localStorage]
   ↓ [Frontend: Decrypt with XOR/AES-GCM]
   ↓ [Display plaintext email]
```

### Storage Architecture

**On-Chain (Sepolia Blockchain)**
- Email address to wallet mapping
- Email content hashes (not plaintext)
- Inbox/Outbox hash arrays

**Off-Chain (Browser localStorage)**
- Encrypted email content (ciphertext)
- Subject and body encrypted together
- Per-browser storage (not synced)

---

## 🔒 Security & Privacy

- **No Plaintext On-Chain**: Only hashes stored on blockchain
- **Client-Side Encryption**: All encryption happens in user's browser
- **Off-Chain Storage**: Email content never submitted to blockchain
- **Wallet Authentication**: Uses MetaMask signatures for verification
- **Per-Browser Privacy**: Encrypted data isolated in localStorage

### Current Encryption (Demo)
- **Algorithm**: XOR with deterministic key
- **Key**: Keccak256(senderEmail + recipientEmail)
- **Format**: JSON-encoded email data

**For Production**: Replace with AES-GCM or libsodium

---

## 📦 Project Structure

```
zamail-fhe/
├── contracts/
│   ├── Zamail.sol              # Main email contract
│   └── FHECounter.sol          # Example FHE contract
├── scripts/
│   └── deploy.ts               # Deployment script
├── test/
│   └── Zamail.ts               # Contract tests
├── zamail-dapp-frontend/       # Next.js frontend
│   ├── app/                    # App Router
│   ├── components/             # React components
│   │   ├── inbox.tsx           # Inbox with reply
│   │   ├── compose-mail.tsx    # Email composer
│   │   ├── register-email.tsx  # Registration
│   │   └── outbox.tsx          # Sent emails
│   ├── lib/
│   │   ├── contracts.ts        # Contract config
│   │   ├── zamail-utils.ts     # Contract functions
│   │   └── offchain-storage.ts # Encryption utils
│   ├── public/abis/            # Contract ABIs
│   └── README.md               # Frontend docs
├── README.md                   # This file
└── package.json
```

---

## 📋 User Guide

### 1. Connect Wallet
1. Open the app
2. Click **"Connect Wallet"** button
3. Approve connection in MetaMask
4. Switch to **Sepolia testnet** if needed

### 2. Register Email
1. Go to **"Register Email"** tab
2. Enter email: `yourname@zamail.com`
3. Pay **0.001 ETH** registration fee
4. Confirm transaction
5. Email is now registered!

### 3. Send Email
1. Go to **"Compose"** tab
2. Enter recipient email (must be registered)
3. Add subject and message
4. Click **"Send"**
5. Email encrypted and stored locally
6. **No gas fee!** (off-chain storage)

### 4. Read Emails
1. Go to **"Inbox"** tab
2. See all received emails
3. Click email to read full content
4. Click **"Reply"** to respond

### 5. View Sent
1. Go to **"Outbox"** tab
2. View all sent emails
3. Check delivery status

---

## 🧪 Testing on Sepolia

### Get Testnet ETH

- [Sepolia Faucet](https://www.sepoliafaucet.com/)
- [Infura Faucet](https://infura.io/faucet/sepolia)

### Test Scenario

```javascript
// 1. Register User A
const tx1 = await contract.registerEmail("alice@zamail.com", {
  value: ethers.parseEther("0.001")
})
await tx1.wait()

// 2. Register User B
const tx2 = await contract.registerEmail("bob@zamail.com", {
  value: ethers.parseEther("0.001")
})
await tx2.wait()

// 3. Send email from A to B
const contentHash = ethers.keccak256(ethers.toUtf8Bytes("Hello Bob!"))
const tx3 = await contract.sendMail("bob@zamail.com", contentHash, {
  value: ethers.parseEther("0.0001")
})
await tx3.wait()

// 4. Check B's inbox
const inboxHandles = await contract.getInboxHandles()
console.log("Bob received", inboxHandles.length, "email(s)")
```

---

## 🔮 Future Enhancements

### Phase 2: Advanced Features
- [ ] Email threading with full conversation history
- [ ] Archive/Spam/Trash folders
- [ ] Email forwarding
- [ ] Read receipts
- [ ] Scheduled send
- [ ] Contact management

### Phase 3: Production FHE
- [ ] Replace XOR with AES-GCM encryption
- [ ] Integrate real Zama FHE on-chain
- [ ] Use @zama-fhe/relayer-sdk
- [ ] IPFS for distributed storage

### Phase 4: Ecosystem
- [ ] Cross-chain messaging
- [ ] ENS integration
- [ ] Decentralized identity (DIDs)
- [ ] Email relay service
- [ ] Mobile app

---

## 📚 Documentation & Resources

- **Frontend README**: See [zamail-dapp-frontend/README.md](./zamail-dapp-frontend/README.md)
- **Smart Contract**: [View on Etherscan](https://sepolia.etherscan.io/address/0xaAfce2e6De48D2F7ACd0279Fd67A37EB6e47e076)
- **FHEVM Docs**: [docs.zama.ai/fhevm](https://docs.zama.ai/fhevm)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)
- **ethers.js Docs**: [docs.ethers.org](https://docs.ethers.org/)
- **Solidity Docs**: [docs.soliditylang.org](https://docs.soliditylang.org/)

---

## 🆘 Support

- **Bug Reports**: Open an issue on GitHub
- **Smart Contract**: [View on Etherscan Sepolia](https://sepolia.etherscan.io/address/0xaAfce2e6De48D2F7ACd0279Fd67A37EB6e47e076)
- **Get Sepolia ETH**: [Sepolia Faucet](https://www.sepoliafaucet.com/)
- **FHEVM Community**: [Zama Discord](https://discord.gg/zama)

---

## 📄 License

This project is licensed under the **BSD-3-Clause-Clear License** - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ using Next.js, Solidity, FHEVM, and Web3** 🚀



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
