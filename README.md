# Confidential Diary

A privacy-preserving digital diary application built on blockchain technology using Fully Homomorphic Encryption (FHE). Write your most personal thoughts with complete confidence that they remain truly private, even on a public blockchain.

## Overview

Confidential Diary is a decentralized application (dApp) that leverages cutting-edge cryptographic technology to provide unparalleled privacy for personal journaling. Unlike traditional digital diaries that store data on centralized servers or regular blockchain applications where all data is publicly visible, Confidential Diary uses Fully Homomorphic Encryption (FHE) to ensure your diary entries remain encrypted at all times - even during computation on the blockchain.

The application combines the transparency and immutability of blockchain technology with the privacy guarantees of advanced encryption, creating a diary that is both permanently preserved and completely confidential.

## Key Features

### Privacy-First Architecture
- **End-to-End Encryption**: Diary content and titles are encrypted client-side before being submitted to the blockchain
- **FHE-Protected Keys**: Encryption keys are stored using Fully Homomorphic Encryption, allowing the smart contract to work with encrypted data without ever decrypting it
- **Zero Knowledge**: Even blockchain validators and network participants cannot read your diary entries
- **User-Controlled Access**: Only you can decrypt and read your entries using your wallet signature

### Blockchain Benefits
- **Permanent Storage**: Your diary entries are stored immutably on the blockchain
- **Censorship Resistant**: No central authority can delete or modify your entries
- **Portable**: Your diary is tied to your Ethereum address, accessible from anywhere
- **Verifiable Timestamps**: Each entry has a cryptographically verifiable creation time

### User-Friendly Experience
- **Modern Web Interface**: Clean, intuitive React-based UI
- **Wallet Integration**: Connect using popular Web3 wallets via RainbowKit
- **Automatic Encryption**: The app handles all encryption/decryption transparently
- **Entry Management**: Easy browsing and viewing of all your diary entries

## Technologies Used

### Smart Contract Layer
- **Solidity (v0.8.27)**: Smart contract programming language
- **FHEVM by Zama**: Fully Homomorphic Encryption Virtual Machine for confidential smart contracts
  - `@fhevm/solidity`: FHE operations library
  - `@zama-fhe/oracle-solidity`: Decryption oracle for accessing encrypted data
- **Hardhat**: Ethereum development environment
  - `@fhevm/hardhat-plugin`: FHEVM integration for Hardhat
  - `hardhat-deploy`: Deployment management
  - `hardhat-gas-reporter`: Gas usage optimization
- **TypeChain**: TypeScript bindings for smart contracts
- **OpenZeppelin Contracts**: Security-audited contract libraries

### Frontend Layer
- **React (v19.1.1)**: UI framework with hooks and modern patterns
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and dev server
- **Web3 Integration**:
  - **wagmi (v2.17.0)**: React hooks for Ethereum
  - **viem (v2.37.6)**: Lightweight Ethereum interface
  - **RainbowKit (v2.2.8)**: Wallet connection UI
  - **ethers.js (v6.15.0)**: Ethereum library
  - **TanStack React Query**: Async state management
- **Zama Relayer SDK**: Client-side FHE operations

### Development & Testing
- **Mocha + Chai**: Testing framework
- **Chai-As-Promised**: Async testing utilities
- **Hardhat Network**: Local blockchain for development
- **Sepolia Testnet**: Ethereum test network deployment
- **ESLint + Prettier**: Code quality and formatting
- **Solhint**: Solidity linting
- **Solidity Coverage**: Test coverage analysis

### Cryptography
- **TFHE (Torus Fully Homomorphic Encryption)**: Core encryption scheme
- **Client-Side XOR Encryption**: Additional layer for title/content
- **Zero-Knowledge Proofs**: For encrypted input verification

## Architecture

### System Overview

```
┌─────────────┐      ┌──────────────────┐      ┌─────────────────┐
│   React UI  │────▶ │  FHEVM Contract  │────▶ │ Sepolia Network │
│  (Browser)  │      │  ConfidentialDia │      │   (Blockchain)  │
└─────────────┘      └──────────────────┘      └─────────────────┘
       │                      │
       │                      │
       ▼                      ▼
┌─────────────┐      ┌──────────────────┐
│ Zama Relayer│      │  FHE Encryption  │
│     SDK     │      │     Library      │
└─────────────┘      └──────────────────┘
```

### Smart Contract Architecture

The `ConfidentialDiary.sol` contract implements four main functions:

1. **submitDiary**: Stores a new encrypted diary entry
   - Accepts FHE-encrypted key + proof
   - Stores client-encrypted title and content
   - Records timestamp
   - Emits DiarySubmitted event
   - Grants decryption permissions

2. **getDiary**: Retrieves a specific diary entry
   - Returns encrypted data structure
   - Requires index validation

3. **listDiaries**: Returns all entries for a user
   - Batch retrieval for efficient loading

4. **getDiaryCount**: Returns total entry count for a user
   - Used for pagination and validation

### Data Structure

Each diary entry contains:
```solidity
struct DiaryEntry {
    euint32 encryptedKey;      // FHE-encrypted 8-digit key
    string encryptedTitle;      // XOR-encrypted title (base64)
    string encryptedContent;    // XOR-encrypted content (base64)
    uint256 createdAt;          // Block timestamp
}
```

### Encryption Flow

**Writing an Entry:**
1. User writes title and content in UI
2. Frontend generates random 8-digit key
3. Title and content are XOR-encrypted with the key
4. Key is FHE-encrypted using Zama SDK
5. All encrypted data submitted to smart contract
6. Smart contract stores encrypted data on-chain

**Reading an Entry:**
1. User requests their entries
2. Smart contract returns encrypted data
3. FHE-encrypted key is decrypted using user's wallet signature
4. Decrypted key is used to XOR-decrypt title and content
5. Plain text displayed to user

## Problems Solved

### 1. Privacy in Digital Journaling
**Problem**: Traditional digital diaries store data on centralized servers where administrators, hackers, or government entities can access your private thoughts.

**Solution**: Confidential Diary uses client-side encryption combined with FHE, ensuring no one except you can read your entries - not even the blockchain validators or smart contract operators.

### 2. Data Permanence and Control
**Problem**: Cloud-based diary services can shut down, delete your data, or deny access to your account at any time.

**Solution**: Blockchain storage ensures your diary entries exist permanently and immutably. As long as you control your private key, you control your diary.

### 3. Blockchain Transparency vs. Privacy
**Problem**: Traditional blockchain applications expose all data publicly, making them unsuitable for private content like diary entries.

**Solution**: FHEVM technology enables confidential smart contracts that can process encrypted data without ever decrypting it, combining blockchain benefits with true privacy.

### 4. Centralization Risks
**Problem**: Centralized diary apps represent single points of failure for data breaches, censorship, and service discontinuation.

**Solution**: Decentralized architecture ensures no single entity controls the diary infrastructure. Your data is distributed across the Ethereum network.

### 5. Lack of Verifiable Timestamps
**Problem**: Traditional digital diaries can have their timestamps manipulated or backdated.

**Solution**: Blockchain timestamps are cryptographically verifiable and cannot be altered, providing authentic proof of when each entry was written.

### 6. Key Management Complexity
**Problem**: End-to-end encrypted apps often require users to manage complex encryption keys, creating usability barriers.

**Solution**: The app automatically generates and manages encryption keys, storing them securely using FHE. Users only need their Web3 wallet for access.

## Installation and Setup

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js**: Version 20 or higher
- **npm**: Version 7.0.0 or higher
- **Git**: For cloning the repository
- **MetaMask or compatible Web3 wallet**: For interacting with the dApp

### Backend Setup (Smart Contract)

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd confidential-dairy
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   # Set your wallet mnemonic (use a test wallet, never your main wallet)
   npx hardhat vars set MNEMONIC

   # Set your Infura API key for network access
   npx hardhat vars set INFURA_API_KEY

   # Optional: Set Etherscan API key for contract verification
   npx hardhat vars set ETHERSCAN_API_KEY
   ```

4. **Compile contracts**
   ```bash
   npm run compile
   ```

5. **Run tests**
   ```bash
   # Run local tests with FHEVM mock
   npm run test

   # Run tests on Sepolia testnet
   npm run test:sepolia
   ```

6. **Deploy to local network**
   ```bash
   # Terminal 1: Start local Hardhat node
   npm run chain

   # Terminal 2: Deploy contracts
   npm run deploy:localhost
   ```

7. **Deploy to Sepolia testnet**
   ```bash
   # Deploy
   npm run deploy:sepolia

   # Verify on Etherscan (optional)
   npm run verify:sepolia <CONTRACT_ADDRESS>
   ```

### Frontend Setup (React UI)

1. **Navigate to UI directory**
   ```bash
   cd ui
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   Create a `.env` file in the `ui` directory:
   ```env
   VITE_CONFIDENTIAL_DIARY_ADDRESS=0xYourDeployedContractAddress
   ```

4. **Update contract configuration**
   After deploying the contract, update `ui/src/config/contracts.ts` with:
   - Contract address from deployment
   - Contract ABI from `deployments/sepolia/ConfidentialDiary.json`

5. **Run development server**
   ```bash
   npm run dev
   ```

6. **Build for production**
   ```bash
   npm run build
   ```

7. **Preview production build**
   ```bash
   npm run preview
   ```

### Accessing the Application

1. **Ensure you have Sepolia ETH**
   - Get testnet ETH from [Sepolia Faucet](https://sepoliafaucet.com/)

2. **Connect your wallet**
   - Open the application in your browser
   - Click "Connect Wallet"
   - Select your wallet provider (MetaMask, WalletConnect, etc.)
   - Approve the connection

3. **Write your first entry**
   - Navigate to "New Entry" tab
   - Enter a title and content
   - Click "Submit Entry"
   - Approve the transaction in your wallet
   - Wait for blockchain confirmation

4. **View your entries**
   - Navigate to "My Entries" tab
   - Your entries will be automatically decrypted and displayed

## Available Scripts

### Backend (Root Directory)

| Script | Description |
|--------|-------------|
| `npm run compile` | Compile all Solidity contracts and generate TypeScript types |
| `npm run test` | Run all tests on local Hardhat network |
| `npm run test:sepolia` | Run tests on Sepolia testnet |
| `npm run coverage` | Generate test coverage report |
| `npm run lint` | Run linting checks on Solidity and TypeScript |
| `npm run lint:sol` | Run Solidity linting only |
| `npm run lint:ts` | Run TypeScript linting only |
| `npm run prettier:check` | Check code formatting |
| `npm run prettier:write` | Auto-format code |
| `npm run clean` | Remove build artifacts and regenerate types |
| `npm run chain` | Start local Hardhat node |
| `npm run deploy:localhost` | Deploy to local network |
| `npm run deploy:sepolia` | Deploy to Sepolia testnet |
| `npm run verify:sepolia` | Verify contract on Etherscan |

### Custom Hardhat Tasks

```bash
# Get deployed contract address
npx hardhat task:address

# Submit a diary entry via CLI
npx hardhat task:submit-diary \
  --title "encrypted-base64-title" \
  --content "encrypted-base64-content" \
  --key 12345678

# Decrypt a diary entry key
npx hardhat task:decrypt-key \
  --user 0xUserAddress \
  --index 0
```

### Frontend (ui/ Directory)

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite development server with hot reload |
| `npm run build` | Build optimized production bundle |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint checks on frontend code |

## Project Structure

```
confidential-dairy/
├── contracts/                      # Solidity smart contracts
│   └── ConfidentialDiary.sol      # Main diary contract
├── deploy/                         # Deployment scripts
│   └── deploy.ts                  # Contract deployment logic
├── tasks/                          # Custom Hardhat tasks
│   ├── accounts.ts                # Account management utilities
│   └── confidentialDiary.ts       # Diary-specific tasks
├── test/                           # Test files
│   ├── ConfidentialDiary.ts       # Local network tests
│   └── ConfidentialDiarySepolia.ts # Sepolia testnet tests
├── ui/                             # React frontend application
│   ├── public/                    # Static assets
│   ├── src/
│   │   ├── components/            # React components
│   │   │   ├── Header.tsx         # App header with wallet connection
│   │   │   ├── DiaryApp.tsx       # Main app container
│   │   │   ├── DiaryComposer.tsx  # Entry creation form
│   │   │   └── DiaryEntries.tsx   # Entry list viewer
│   │   ├── config/                # Configuration files
│   │   │   ├── contracts.ts       # Contract ABI and address
│   │   │   ├── wagmi.ts           # Wagmi configuration
│   │   │   └── publicClient.ts    # Viem public client setup
│   │   ├── hooks/                 # Custom React hooks
│   │   │   ├── useZamaInstance.ts # Zama FHE instance hook
│   │   │   └── useEthersSigner.ts # Ethers signer hook
│   │   ├── utils/                 # Utility functions
│   │   │   └── diaryCrypto.ts     # Encryption/decryption helpers
│   │   ├── styles/                # CSS stylesheets
│   │   ├── App.tsx                # Root application component
│   │   └── main.tsx               # Application entry point
│   ├── index.html                 # HTML template
│   ├── package.json               # Frontend dependencies
│   └── vite.config.ts             # Vite configuration
├── hardhat.config.ts               # Hardhat configuration
├── package.json                    # Backend dependencies
├── tsconfig.json                   # TypeScript configuration
├── .gitignore                      # Git ignore rules
└── README.md                       # This file
```

## Security Considerations

### Current Implementation
- **Client-Side Encryption**: Title and content are encrypted in the browser using XOR cipher
- **FHE Key Protection**: 8-digit encryption keys are protected using Fully Homomorphic Encryption
- **Access Control**: Only the diary owner can decrypt their entries using wallet signatures
- **Input Validation**: Smart contract validates all inputs before storage
- **Zero-Knowledge Proofs**: FHE inputs are verified without revealing plaintext

### Important Limitations
1. **XOR Cipher**: The current XOR encryption is simple and suitable for demonstration. For production use, consider AES-GCM or ChaCha20-Poly1305
2. **Key Length**: 8-digit keys provide approximately 26 bits of entropy. Production systems should use longer keys
3. **Frontend Key Storage**: Decrypted keys are temporarily held in memory. Ensure proper cleanup
4. **Smart Contract Immutability**: Once deployed, the contract cannot be upgraded. Thorough testing is essential
5. **Gas Costs**: FHE operations are gas-intensive. Monitor transaction costs

### Best Practices
- Never commit private keys or mnemonics to version control
- Use hardware wallets for mainnet deployments
- Audit smart contracts before production deployment
- Implement rate limiting in the frontend
- Regular security reviews of encryption implementation
- Keep dependencies updated for security patches

## Testing

### Local Testing
```bash
# Run all tests with FHEVM mock
npm run test

# Run with gas reporting
REPORT_GAS=true npm run test

# Run with coverage
npm run coverage
```

### Sepolia Testing
```bash
# Ensure INFURA_API_KEY is set
npx hardhat vars set INFURA_API_KEY

# Run Sepolia tests (requires deployed contract and testnet ETH)
npm run test:sepolia
```

### Test Coverage
The test suite covers:
- ✅ Diary entry submission with encrypted keys
- ✅ Entry retrieval and decryption
- ✅ Multiple entries per user
- ✅ Invalid index handling
- ✅ Access control verification
- ✅ Event emission
- ✅ Timestamp accuracy

## Future Roadmap

### Short-Term Enhancements
1. **Advanced Encryption**
   - Implement AES-256-GCM for title/content encryption
   - Increase key entropy to 128+ bits
   - Add authenticated encryption with associated data (AEAD)

2. **Entry Management**
   - Edit existing entries (append-only with version history)
   - Delete entries (zero out data or mark as deleted)
   - Search and filter functionality
   - Tags and categories for organization

3. **User Experience**
   - Rich text editor with markdown support
   - Image attachments (encrypted, stored on IPFS)
   - Export functionality (encrypted backup files)
   - Entry reminders and scheduled prompts
   - Mobile-responsive design improvements

4. **Performance Optimization**
   - Implement pagination for large diary collections
   - Client-side caching of decrypted entries
   - Lazy loading of entry content
   - Batch decryption operations

### Medium-Term Features
1. **Social Features (Privacy-Preserving)**
   - Shared entries with specific addresses
   - Anonymous sharing with time-limited access
   - Encrypted comments from approved readers
   - Private groups for shared journaling

2. **Advanced Privacy**
   - Zero-knowledge proof of entry existence without revealing content
   - Anonymous diary mode (entries not tied to address)
   - Stealth addresses for enhanced privacy
   - Multi-party computation for collaborative entries

3. **Cross-Chain Support**
   - Deploy to multiple EVM chains
   - Layer 2 solutions for reduced gas costs (Optimism, Arbitrum, zkSync)
   - Cross-chain entry synchronization
   - Choose storage chain per entry

4. **Data Management**
   - IPFS integration for large content storage
   - Arweave integration for permanent storage
   - Automatic blockchain/IPFS hybrid storage based on size
   - Compression before encryption

### Long-Term Vision
1. **Decentralized Identity Integration**
   - ENS (Ethereum Name Service) support
   - Lens Protocol profile integration
   - DID (Decentralized Identifiers) standard compliance
   - Portable identity across platforms

2. **AI-Powered Features (Privacy-Preserving)**
   - Sentiment analysis on encrypted data using FHE
   - Writing suggestions without exposing content
   - Mood tracking and insights
   - Pattern recognition in journaling habits

3. **Monetization & Sustainability**
   - Premium features (advanced encryption, more storage)
   - NFT diary entries (commemorative moments)
   - Tipping mechanism for shared entries
   - DAO governance for feature decisions

4. **Interoperability**
   - Export to standard journal formats
   - Import from existing diary applications
   - API for third-party integrations
   - Plugin system for community extensions

5. **Advanced Security**
   - Multi-signature access control
   - Time-locked entries (future reveal)
   - Dead man's switch (inheritance planning)
   - Quantum-resistant encryption migration path

6. **Ecosystem Expansion**
   - Developer SDK for building on Confidential Diary
   - White-label solution for organizations
   - Educational institutions use cases
   - Mental health journaling partnerships

## Contributing

Contributions are welcome! Here's how you can help:

### Reporting Bugs
- Use GitHub Issues to report bugs
- Include reproduction steps, expected behavior, and actual behavior
- Specify your environment (OS, Node version, browser)

### Suggesting Enhancements
- Open a GitHub Issue with the "enhancement" label
- Describe the feature and its use case
- Explain why it would be valuable to users

### Pull Requests
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm run test`)
5. Run linting (`npm run lint`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to your branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Development Guidelines
- Follow the existing code style
- Write tests for new features
- Update documentation for API changes
- Keep commits atomic and well-described
- Ensure all tests pass before submitting PR

## License

This project is licensed under the **BSD-3-Clause-Clear License**.

See the [LICENSE](LICENSE) file for full details.

## Acknowledgments

### Built With
- **[Zama](https://www.zama.ai/)**: For the groundbreaking FHEVM technology enabling confidential smart contracts
- **[Hardhat](https://hardhat.org/)**: Ethereum development environment
- **[React](https://react.dev/)**: UI framework
- **[RainbowKit](https://www.rainbowkit.com/)**: Beautiful wallet connection experience
- **[wagmi](https://wagmi.sh/)**: React hooks for Ethereum

### Inspiration
This project was inspired by the need for truly private digital spaces in an increasingly transparent blockchain world. It demonstrates that privacy and transparency can coexist through advanced cryptography.

### Special Thanks
- The Zama team for creating FHEVM and supporting developers
- The Ethereum community for building robust infrastructure
- All contributors and testers who help improve this project

## Support and Resources

### Documentation
- **[FHEVM Documentation](https://docs.zama.ai/fhevm)**: Learn about Fully Homomorphic Encryption
- **[Hardhat Guides](https://hardhat.org/tutorial)**: Ethereum development tutorials
- **[Wagmi Documentation](https://wagmi.sh/)**: React hooks for Ethereum reference

### Community
- **GitHub Issues**: [Report bugs or request features](https://github.com/your-username/confidential-dairy/issues)
- **Zama Discord**: [Join the community](https://discord.gg/zama)
- **Ethereum Stack Exchange**: [Ask development questions](https://ethereum.stackexchange.com/)

### Getting Help
If you encounter issues:
1. Check existing GitHub Issues
2. Review the documentation
3. Ask in the Zama Discord #fhevm channel
4. Open a new GitHub Issue with detailed information

## Frequently Asked Questions

**Q: Can anyone read my diary entries?**
A: No. Your entries are encrypted both at the application level (XOR cipher) and at the blockchain level (FHE). Only you can decrypt them using your wallet signature.

**Q: What happens if I lose my wallet's private key?**
A: Unfortunately, your diary entries will become permanently inaccessible. Always backup your wallet's recovery phrase securely. Consider implementing recovery mechanisms in future versions.

**Q: How much does it cost to write a diary entry?**
A: Gas costs vary based on network congestion. On Sepolia testnet (used for testing), ETH is free. On mainnet, expect to pay standard Ethereum gas fees for contract interactions.

**Q: Can I delete or edit entries?**
A: Currently, entries are immutable once submitted to the blockchain. Future versions may support editing through versioned entries or soft deletion.

**Q: Is this production-ready?**
A: This is currently a demonstration/educational project. While it implements real encryption, additional security hardening, auditing, and UX improvements are recommended before production use.

**Q: What networks are supported?**
A: Currently supports Sepolia testnet. The contract can be deployed to any EVM-compatible chain, though FHEVM features require Zama's infrastructure.

**Q: How private is "private"?**
A: Your diary content is encrypted end-to-end. However, metadata like transaction timing, entry count, and transaction patterns are visible on-chain. For maximum privacy, consider using privacy-enhancing techniques like varying transaction timing.

---

**Built with privacy in mind. Your thoughts, your control.**

For questions, suggestions, or collaboration opportunities, please open an issue or reach out through GitHub.

*Last updated: 2025*
