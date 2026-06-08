# EasyLend

Community Lending Pool with Social Credit leveraging Soroban for decentralized trust.

## Problem
Pure collateral-based DeFi excludes individuals who lack significant crypto assets, meaning social trust—a powerful tool for financial inclusion—is not captured on-chain. This is especially relevant in regions like the Philippines where community-based lending (like "paluwagan") is common but lacks a formal credit-building mechanism.

## How It Works
1. **Lending**: Lenders provide capital to a community pool.
2. **Social Vouching**: Community members vouch for borrowers they trust.
3. **Borrowing**: Borrowers request loans; their borrowing limit is determined by their on-chain credit score and the number of vouches they receive.
4. **Credit Scoring**: Repayment history and social reputation are aggregated into a dynamic credit score.
5. **Accountability**: If a borrower defaults, the vouchers are penalized (slashed), incentivizing honest community assessment.

## How It Uses Stellar
- **Soroban Smart Contracts**: Implements the lending logic, the vouching mechanism, and the automated credit scoring system.
- **Stellar Accounts**: Serves as the unique identity for borrowers and vouchers.
- **Speed & Efficiency**: Utilizes Stellar’s low fees and fast finality to make micro-loans economically viable.

## Track
Track 2: Financial Inclusion & Everyday Payments

## Tech Stack
- Framework: [Next.js / React]
- Stellar SDK: `@stellar/stellar-sdk`
- Smart Contracts: Soroban (Rust)
- Network: Testnet

## Setup & Run

```bash
git clone [your-repo-url]
cd EasyLend
npm install
# Configure environment variables (e.g., CONTRACT_ID, RPC_URL)
npm run dev
```

## Network Details
- Network: Testnet
- RPC URL: https://soroban-testnet.stellar.org
- Contract IDs: [TBD]

## Team DAR
- [Gabriel Balang] - @[lionyde-me]
- [Ron Michael Legaspi] - @[legaspi-ronmichael]
- [Avril Lavigne Pascua] - @[vril10]

## License
MIT
