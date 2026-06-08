"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { isConnected, getAddress } from "@stellar/freighter-api";
export default function Home() {
  const [address, setAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [poolBalance, setPoolBalance] = useState<string>("50,000 XLM");
  const [activeLoansCount, setActiveLoansCount] = useState<number>(12);

  useEffect(() => {
    const storedBalance = localStorage.getItem("lendingPoolBalance");
    if (storedBalance) {
      setPoolBalance(`${parseFloat(storedBalance).toLocaleString()} XLM`);
    } else {
      localStorage.setItem("lendingPoolBalance", "50000");
    }

    const storedLoans = JSON.parse(localStorage.getItem("activeLoans") || "[]");
    setActiveLoansCount(storedLoans.length + 12); // Including the 12 mock loans

    const checkConnection = async () => {
      try {
        const { isConnected, getAddress } = await import("@stellar/freighter-api");
        if (await isConnected()) {
          const { address: userAddress } = await getAddress();
          setAddress(userAddress);
        }
      } catch (error) {
        console.error("Freighter not connected:", error);
      }
    };
    checkConnection();
  }, []);

  const connectWallet = async () => {
    setLoading(true);
    try {
      const { isConnected, getAddress } = await import("@stellar/freighter-api");
      if (await isConnected()) {
        const { address: userAddress } = await getAddress();
        setAddress(userAddress);
      } else {
        alert("Please install Freighter wallet");
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <header className="text-center space-y-4">
        <h2 className="text-5xl font-extrabold tracking-tight">
          Financial Inclusion via <span className="text-blue-500">Social Trust</span>
        </h2>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          Borrow against your reputation. Lend to your community. Built on Stellar Soroban.
        </p>
        {!address ? (
          <button
            onClick={connectWallet}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold transition-all shadow-lg shadow-blue-900/20"
          >
            {loading ? "Connecting..." : "Connect Wallet"}
          </button>
        ) : (
          <div className="text-emerald-400 font-mono bg-emerald-950/30 border border-emerald-900/50 py-2 px-4 rounded-lg inline-block">
            Connected: {address.slice(0, 6)}...{address.slice(-6)}
          </div>
        )}
      </header>

      <div className="grid md:grid-cols-3 gap-6 pt-12">
        <Card 
          title="Lending Pool" 
          value={poolBalance} 
          description="Total liquidity available for community loans."
          action="Deposit Assets"
          href="/lend"
        />
        <Card 
          title="My Credit Score" 
          value="720" 
          description="Your social trust score based on vouches and history."
          action="Build Credit"
          href="/lend"
        />
        <Card 
          title="Active Loans" 
          value={activeLoansCount.toString()} 
          description="Current loans being processed by the community."
          action="View Loans"
          href="/loans"
        />
      </div>
    </div>
  );
}

function Card({ title, value, description, action, href }: { title: string, value: string, description: string, action: string, href: string }) {
  return (
    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl space-y-4 hover:border-slate-700 transition-colors">
      <h3 className="text-slate-400 font-medium">{title}</h3>
      <div className="text-3xl font-bold">{value}</div>
      <p className="text-sm text-slate-500">{description}</p>
      <Link 
        href={href}
        className="block w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors font-medium text-center"
      >
        {action}
      </Link>
    </div>
  );
}
