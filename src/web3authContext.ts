// src/web3authContext.ts
import type { Web3AuthOptions } from "@web3auth/modal";
import type { Web3AuthContextConfig } from "@web3auth/modal/react";
import { CHAIN_NAMESPACES } from "@web3auth/base";        // ✅ đúng package
import { clusterApiUrl } from "@solana/web3.js";

const network = (import.meta.env.VITE_WEB3AUTH_NETWORK || "sapphire_devnet") as
  | "sapphire_devnet"
  | "sapphire_mainnet"
  | "cyan"
  | string;

const web3AuthOptions: Web3AuthOptions = {
  clientId: import.meta.env.VITE_WEB3AUTH_CLIENT_ID!,      // lấy từ .env
  web3AuthNetwork: network,

  // 👇 ép cấu hình Solana Devnet
  chainConfig: {
    chainNamespace: CHAIN_NAMESPACES.SOLANA,
    chainId: "0x3", // 0x1 mainnet, 0x2 testnet, 0x3 devnet
    rpcTarget:
      (import.meta.env.VITE_SOLANA_RPC as string) || clusterApiUrl("devnet"),
    displayName: "Solana Devnet",
    ticker: "SOL",
    tickerName: "Solana",
  },

  uiConfig: {
    appName: "OnboardX",
    appLogo: import.meta.env.VITE_APP_LOGO || undefined,   // có cũng được
    mode: "auto",
  },
};

const web3AuthContextConfig: Web3AuthContextConfig = {
  web3AuthOptions,
};

export default web3AuthContextConfig;
