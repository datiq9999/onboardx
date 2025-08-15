
# OnboardX – MetaMask Embedded (Web3Auth Plug and Play) + Solana

This is a demo application showcasing **Web3Auth Plug and Play (PnP)** with **MetaMask Embedded** and **Solana Web3.js** integration.  
It is designed for educational purposes, such as HackQuest challenges.

## Features
- **Login / Logout** with Web3Auth PnP (MetaMask Embedded)
- **Show Wallet Address and Balance** on Solana Devnet
- **Airdrop 0.1 SOL** to the connected wallet (Devnet only)
- **Sign arbitrary messages** with the wallet
- **Send 0.01 SOL** to a recipient address

## Tech Stack
- [React](https://react.dev/) + [Vite](https://vitejs.dev/) + TypeScript
- [Web3Auth](https://web3auth.io/) PnP SDK
- [Solana Web3.js](https://solana-labs.github.io/solana-web3.js/)
- TailwindCSS for styling

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/onboardx.git
cd onboardx
````

### 2. Install dependencies

```bash
npm install

### 3. Environment variables

Create a `.env` file in the project root based on `.env.example`:

```env
VITE_WEB3AUTH_CLIENT_ID=YOUR_WEB3AUTH_CLIENT_ID
VITE_WEB3AUTH_NETWORK=sapphire_devnet
VITE_SOLANA_RPC=https://api.devnet.solana.com
```

> **Important:** Do not commit your `.env` file.

### 4. Run locally

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

## Project Structure

```
src/
 ├── App.tsx          # Main component (UI + event handlers)
 ├── index.tsx        # React entry point
 ├── components/      # UI components (buttons, display, etc.)
 └── utils/           # Solana & Web3Auth helper functions
```

## Deployment

You can deploy this project on [Vercel](https://vercel.com/) or [Netlify](https://www.netlify.com/).
Make sure to add your environment variables in the hosting platform settings.

## License

MIT

```

---
