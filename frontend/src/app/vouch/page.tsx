"use client";

import { useState, useEffect } from "react";
import { Review } from "../../types";

const MOCK_MY_REVIEWS: Review[] = [
  { user: "GD...5678", comment: "Fast repayment and great communication. A+ borrower." },
  { user: "GA...9012", comment: "Provided liquidity when I needed it most. Very helpful." },
  { user: "GB...3456", comment: "Trusted community member, highly recommend." }
];

export default function VouchPage() {
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [hasHydrated, setHasHydrated] = useState(false);
  const [creditScore] = useState(720); // In a real app, this would be fetched from a contract/API
  const [vouchCount] = useState(12);

  useEffect(() => {
    setHasHydrated(true);
    const checkConnection = async () => {
      try {
        const { isConnected, getAddress } = await import("@stellar/freighter-api");
        if (await isConnected()) {
          const { address } = await getAddress();
          setUserAddress(address);
        }
      } catch (error) {
        console.error("Freighter not connected:", error);
      }
    };
    checkConnection();
  }, []);

  if (!hasHydrated) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <header className="space-y-4 text-center">
        <h2 className="text-4xl font-bold">Your Reputation</h2>
        <p className="text-slate-400">Your standing in the community determines your borrowing power and trust level.</p>
        {userAddress && (
          <div className="inline-block bg-slate-900 border border-slate-800 px-4 py-1 rounded-full text-xs font-mono text-blue-400">
            {userAddress}
          </div>
        )}
      </header>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl flex flex-col items-center justify-center space-y-4 shadow-xl">
          <span className="text-slate-400 uppercase tracking-widest text-sm font-semibold">Credit Score</span>
          <div className="relative">
             <div className="w-32 h-32 rounded-full border-4 border-slate-800 flex items-center justify-center">
                <span className="text-4xl font-bold text-emerald-400">{creditScore}</span>
             </div>
             <div className="absolute inset-0 rounded-full border-t-4 border-emerald-500 animate-[spin_3s_linear_infinite]" style={{ clipPath: 'polygon(50% 50%, 0 0, 100% 0, 100% 50%)' }}></div>
          </div>
          <p className="text-xs text-slate-500 text-center">Calculated based on repayment history and community trust.</p>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl flex flex-col items-center justify-center space-y-4 shadow-xl">
          <span className="text-slate-400 uppercase tracking-widest text-sm font-semibold">Social Credit</span>
          <div className="flex items-baseline gap-2">
            <span className="text-6xl font-bold text-blue-400">{vouchCount}</span>
            <span className="text-slate-500 text-xl font-medium">Vouches</span>
          </div>
          <p className="text-xs text-slate-500 text-center">The number of unique community members who have vouched for you.</p>
          <button className="mt-4 px-6 py-2 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-lg transition-all text-sm font-semibold">
            Request a Vouch
          </button>
        </div>
      </div>

      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h3 className="text-2xl font-bold text-slate-200">Reviews & Messages</h3>
          <span className="bg-slate-800 text-slate-400 px-3 py-1 rounded-full text-xs font-medium">
            {MOCK_MY_REVIEWS.length} Feedbacks
          </span>
        </div>

        <div className="grid gap-4">
          {MOCK_MY_REVIEWS.map((review, idx) => (
            <div key={idx} className="bg-slate-900/40 border border-slate-800/50 p-6 rounded-2xl space-y-3 hover:bg-slate-900/60 transition-colors">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 opacity-80"></div>
                  <span className="font-mono text-sm text-slate-300">{review.user}</span>
                </div>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-amber-400 text-xs">★</span>
                  ))}
                </div>
              </div>
              <p className="text-slate-300 italic font-medium leading-relaxed">
                &quot;{review.comment}&quot;
              </p>
              <div className="flex items-center gap-4 pt-2">
                <span className="text-[10px] text-slate-500 uppercase tracking-tighter">Verified interaction</span>
                <div className="h-px flex-1 bg-slate-800/50"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
