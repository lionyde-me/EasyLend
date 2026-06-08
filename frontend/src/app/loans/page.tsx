"use client";

import { useState, useEffect } from "react";
import { Loan } from "../../types";

const MOCK_LOANS: Loan[] = [
  {
    id: "L1",
    title: "Small Business Expansion",
    borrower: "YOU",
    lender: "GABC...1234",
    amount: "500 XLM",
    dueDate: "2026-12-31",
    status: "active",
    type: "borrowing"
  },
  {
    id: "L2",
    title: "Emergency Home Repair",
    borrower: "GDEF...5678",
    lender: "YOU",
    amount: "1200 XLM",
    dueDate: "2026-09-15",
    status: "active",
    type: "lending"
  },
  {
    id: "L3",
    title: "Education Fees",
    borrower: "GHIJ...9012",
    lender: "YOU",
    amount: "2000 XLM",
    dueDate: "2027-01-20",
    status: "active",
    type: "lending"
  }
];

export default function LoansPage() {
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [hasHydrated, setHasHydrated] = useState(false);

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

  const storedLoans: Loan[] = JSON.parse(localStorage.getItem("activeLoans") || "[]");
  const allLoans = [...storedLoans, ...MOCK_LOANS];

  const borrowingLoans = allLoans.filter(l => l.type === "borrowing");
  const lendingLoans = allLoans.filter(l => l.type === "lending");

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <header className="space-y-2">
        <h2 className="text-3xl font-bold">Your Active Loans</h2>
        <p className="text-slate-400">Manage your borrowings and the capital you&apos;ve deployed to the community.</p>
      </header>

      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-2 h-8 bg-blue-500 rounded-full"></div>
          <h3 className="text-2xl font-bold">Borrowed by You</h3>
          <span className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-xs font-bold">
            {borrowingLoans.length} Active
          </span>
        </div>
        
        <div className="grid gap-4">
          {borrowingLoans.map((loan) => (
            <LoanCard key={loan.id} loan={loan} currentUserAddress={userAddress} />
          ))}
          {borrowingLoans.length === 0 && (
            <div className="p-12 border-2 border-dashed border-slate-800 rounded-3xl text-center text-slate-500">
              You have no active borrow requests currently funded.
            </div>
          )}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-2 h-8 bg-emerald-500 rounded-full"></div>
          <h3 className="text-2xl font-bold">Lent to Others</h3>
          <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold">
            {lendingLoans.length} Active
          </span>
        </div>

        <div className="grid gap-4">
          {lendingLoans.map((loan) => (
            <LoanCard key={loan.id} loan={loan} currentUserAddress={userAddress} />
          ))}
          {lendingLoans.length === 0 && (
            <div className="p-12 border-2 border-dashed border-slate-800 rounded-3xl text-center text-slate-500">
              You haven&apos;t provided any loans to the community yet.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function LoanCard({ loan, currentUserAddress }: { loan: Loan, currentUserAddress: string | null }) {
  const isBorrowing = loan.type === "borrowing";
  
  return (
    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:border-slate-700 transition-colors group">
      <div className="space-y-1">
        <h4 className="text-lg font-bold group-hover:text-blue-400 transition-colors">{loan.title}</h4>
        <div className="flex items-center gap-2 text-sm text-slate-500 font-mono">
          <span>{isBorrowing ? "Lender:" : "Borrower:"}</span>
          <span className="text-slate-300">{isBorrowing ? loan.lender : loan.borrower}</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-8 md:gap-12">
        <div className="space-y-1">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Amount</p>
          <p className="text-xl font-bold text-slate-100">{loan.amount}</p>
        </div>

        <div className="space-y-1">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Due Date</p>
          <p className="text-sm font-medium text-slate-300">{loan.dueDate}</p>
        </div>

        <div className="space-y-1">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Status</p>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-sm font-bold text-emerald-400 capitalize">{loan.status}</span>
          </div>
        </div>

        <button className={`px-6 py-2 rounded-xl font-bold text-sm transition-all ${
          isBorrowing 
          ? "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20" 
          : "bg-slate-800 hover:bg-slate-700 text-slate-300"
        }`}>
          {isBorrowing ? "Repay Now" : "Manage Loan"}
        </button>
      </div>
    </div>
  );
}
