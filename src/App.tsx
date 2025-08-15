import React, { useMemo, useState } from "react";
import {
  useWeb3Auth,
  useWeb3AuthConnect,
  useWeb3AuthDisconnect,
  useWeb3AuthUser,
} from "@web3auth/modal/react";
import { useSolanaWallet } from "@web3auth/modal/react/solana";
import {
  Connection,
  PublicKey,
  LAMPORTS_PER_SOL,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";

// RPC: nên thay bằng Helius/Alchemy khi devnet quá tải
const RPC =
  (import.meta.env.VITE_SOLANA_RPC as string) ||
  "https://api.devnet.solana.com";

// Uint8Array -> hex (tránh dùng Buffer trong browser)
const toHex = (u8: Uint8Array) =>
  Array.from(u8).map((b) => b.toString(16).padStart(2, "0")).join("");

// Helper chờ 1 điều kiện đúng
const waitFor = async (test: () => boolean, timeoutMs = 10000) => {
  const start = Date.now();
  while (!test()) {
    if (Date.now() - start > timeoutMs) return false;
    await new Promise((r) => setTimeout(r, 150));
  }
  return true;
};

export default function App() {
  const { status } = useWeb3Auth();               // "loading" | "ready" | ...
  const { connect } = useWeb3AuthConnect();
  const { disconnect } = useWeb3AuthDisconnect();
  const { user } = useWeb3AuthUser();
  const { address, signMessage, signAndSendTransaction } = useSolanaWallet();

  const connection = useMemo(() => new Connection(RPC, "confirmed"), []);
  const [balance, setBalance] = useState<number | null>(null);
  const [log, setLog] = useState("Ready");
  const [busy, setBusy] = useState(false);

  // Đảm bảo đã login & đã có address trước khi chạy action
  const ensureLoggedIn = async () => {
    if (address) return true;
    try {
      setLog("Opening login modal...");
      await connect(); // mở PnP modal (email/social)
      const ok = await waitFor(() => !!address, 10000);
      if (!ok) {
        setLog("Wallet not ready yet. Try again.");
        return false;
      }
      setLog("✅ Logged in");
      return true;
    } catch (e: any) {
      setLog(`❌ Login failed: ${e?.message || e}`);
      return false;
    }
  };

  // Wrapper có auth + chống spam
  const withAuth = (fn: () => Promise<void>) => async () => {
    if (busy) return;
    setBusy(true);
    try {
      const ok = await ensureLoggedIn();
      if (!ok) return;
      await fn();
    } finally {
      setBusy(false);
    }
  };

  const handleLogout = async () => {
    try {
      setBusy(true);
      await disconnect();
      setBalance(null);
      setLog("✅ Logged out");
    } catch (e: any) {
      setLog(`❌ Logout error: ${e?.message || e}`);
    } finally {
      setBusy(false);
    }
  };

  const showAddressBalance = withAuth(async () => {
    const lamports = await connection.getBalance(new PublicKey(address!));
    setBalance(lamports / LAMPORTS_PER_SOL);
    setLog("✅ Address & balance fetched");
  });

  const airdrop = withAuth(async () => {
    setLog("Requesting airdrop 0.1 SOL…");
    const sig = await connection.requestAirdrop(
      new PublicKey(address!),
      Math.floor(0.1 * LAMPORTS_PER_SOL)
    );
    await connection.confirmTransaction(sig, "confirmed");
    await showAddressBalance();
    setLog(`✅ Airdrop done: ${sig}`);
  });

  const sendTx = withAuth(async () => {
    const from = new PublicKey(address!);
    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash("finalized");
    const tx = new Transaction({
      feePayer: from,
      blockhash,
      lastValidBlockHeight,
    }).add(
      SystemProgram.transfer({
        fromPubkey: from,
        toPubkey: from, // demo: tự gửi cho mình
        lamports: Math.floor(0.01 * LAMPORTS_PER_SOL),
      })
    );
    const res = await signAndSendTransaction(tx); // ký + gửi qua Embedded Wallet
    await connection.confirmTransaction(res.signature, "confirmed");
    await showAddressBalance();
    setLog(`✅ Sent 0.01 SOL: ${res.signature}`);
  });

  const signMsg = withAuth(async () => {
    const bytes = new TextEncoder().encode("Hello from OnboardX (PnP)");
    const sig = await signMessage(bytes);
    setLog(`✅ Signed: ${toHex(sig).slice(0, 18)}…`);
  });

  if (status === "loading") {
    return (
      <div className="page">
        <div className="card"><p className="loading">Initializing wallet…</p></div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="card">
        <h1>OnboardX — MetaMask Embedded (PnP) + Solana</h1>

        <div className="row">
          <button onClick={withAuth(async () => setLog("✅ Logged in"))} disabled={busy}>
            🔐 Login
          </button>
          <button onClick={handleLogout} disabled={busy}>
            🔓 Logout
          </button>
          <button onClick={showAddressBalance} disabled={busy}>
            💳 Show Address/Balance
          </button>
          <button onClick={airdrop} disabled={busy}>
            🪂 Airdrop 0.1 SOL
          </button>
          <button onClick={signMsg} disabled={busy}>
            ✍️ Sign Message
          </button>
          <button onClick={sendTx} disabled={busy}>
            💸 Send 0.01 SOL
          </button>
        </div>

        <div className="info">
          <p><b>SDK status:</b> {status}</p>
          <p><b>User:</b> {user?.email || user?.name || "-"}</p>
          <p><b>Address:</b> {address || "-"}</p>
          <p><b>Balance:</b> {balance === null ? "-" : `${balance.toFixed(4)} SOL`}</p>
          <p><b>Log:</b> {log}</p>
        </div>
      </div>
    </div>
  );
}
