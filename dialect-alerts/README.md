# Welcome to Dialect Alerts!

![Dialect Alerts App](assets/images//readme-cover.png)

A React Native starter app with Dialect Alerts and Solana Mobile Wallet Authentication (MWA) integration for Android devices. This project demonstrates how to connect, disconnect, and sign messages using mobile wallet apps.

Built on the [Infinite Red](https://infinite.red) Ignite boilerplate for React Native development.


## 📁 Project Structure

```tree
src
├── app
│   ├── _layout.tsx          # Dialect Alerts Web3 setup & crypto operations
│   └── index.tsx            # Entry component (Expo Router)
├── store
│   ├── features
│   │   └── authSlice.ts     # Authentication state management
│   └── store.ts             # Redux store configuration
└── utils
    └── walletUtils.ts       # Standalone wallet interaction functions
```

## 🔧 Core Components

- **`_layout.tsx`** - Configures Dialect Alerts Web3.js and cryptographic operations
- **`index.tsx`** - Main entry point using Expo Router
- **`authSlice.ts`** - Redux slice for wallet authentication state
- **`walletUtils.ts`** - Standalone functions for MWA wallet interactions

- This template uses expo router so index.tsx marks as the entry component that will be loaded on app startup.

- The Redux storage management is setup in the store folder.

## 🚀 Getting Started

### Prerequisites

- Android development environment
- Setup Device/Emulator
- Install a MWA compliant Wallet app (Solflare/Phantom)

### Installation

```bash
yarn install
yarn start
```

> Important Note: Currently the Moblile Wallet Adapter only supports android devices and there is an existing issue with Phantom wallet actions.

