"use client";

import { useState, useEffect } from "react";
import { BorrowRequestCard } from "../../components/BorrowRequestCard";
import { BorrowRequest, Loan } from "../../types";

const MOCK_REQUESTS: BorrowRequest[] = [
  {
    id: "1",
    borrower: "GABC...1234",
    title: "Small Business Expansion",
    purpose: "Buying new equipment for my local bakery to increase production capacity.",
    amount: "500 XLM",
    promisedDate: "2026-12-31",
    creditScore: 780,
    reviews: [
      { user: "GD...5678", comment: "Very reliable borrower, paid back on time last time." },
      { user: "GA...9012", comment: "Active community member and great baker!" }
    ]
  },
  {
    id: "2",
    borrower: "GDEF...5678",
    title: "Emergency Home Repair",
    purpose: "Fixing a leaking roof before the rainy season starts.",
    amount: "1200 XLM",
    promisedDate: "2026-09-15",
    creditScore: 650,
    reviews: [
      { user: "GB...3456", comment: "Honest person, helped me with my garden last year." }
    ]
  },
  {
    id: "3",
    borrower: "GHIJ...9012",
    title: "Education Fees",
    purpose: "Paying for the final semester of my computer science degree.",
    amount: "2000 XLM",
    promisedDate: "2027-01-20",
    creditScore: 820,
    reviews: [
      { user: "GC...7890", comment: "Top student, very dedicated and trustworthy." },
      { user: "GE...1234", comment: "I've vouched for them before, never had issues." }
    ]
  }
];

export default function LendPage() {
  const [hasHydrated, setHasHydrated] = useState(false);
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [poolBalance, setPoolBalance] = useState<number>(0);

  useEffect(() => {
    setHasHydrated(true);
    const storedBalance = localStorage.getItem("lendingPoolBalance");
    if (!storedBalance) {
      localStorage.setItem("lendingPoolBalance", "50000");
      setPoolBalance(50000);
    } else {
      setPoolBalance(parseFloat(storedBalance));
    }

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

  const handleLend = (request: BorrowRequest) => {
    const amount = parseFloat(request.amount.split(" ")[0]);
    if (isNaN(amount)) return;

    if (amount > poolBalance) {
      alert("Insufficient funds in the lending pool!");
      return;
    }

    const newBalance = poolBalance - amount;
    setPoolBalance(newBalance);
    localStorage.setItem("lendingPoolBalance", newBalance.toString());

    // Create a new loan entry
    const newLoan: Loan = {
      id: `L-${Date.now()}`,
      title: request.title,
      borrower: request.borrower,
      lender: userAddress || "YOU",
      amount: request.amount,
      dueDate: request.promisedDate,
      status: "active",
      type: "lending"
    };

    const existingLoans = JSON.parse(localStorage.getItem("activeLoans") || "[]");
    localStorage.setItem("activeLoans", JSON.stringify([newLoan, ...existingLoans]));

    // Remove the borrow request as it is now funded
    const existingRequests = JSON.parse(localStorage.getItem("borrowRequests") || "[]");
    const updatedRequests = existingRequests.filter((r: BorrowRequest) => r.id !== request.id);
    localStorage.setItem("borrowRequests", JSON.stringify(updatedRequests));

    alert(`Successfully lent ${amount} XLM! The lending pool has been updated and the loan is now active.`);
    
    // Refresh the page or state to show updated requests
    window.location.reload();
  };

  const requests: BorrowRequest[] = hasHydrated 
    ? [...JSON.parse(localStorage.getItem("borrowRequests") || "[]"), ...MOCK_REQUESTS]
    : MOCK_REQUESTS;

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold">Lend to the Community</h2>
          <p className="text-slate-400">Support your peers and earn interest by providing liquidity to trusted borrowers.</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl text-right min-w-[200px]">
          <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Available Pool</p>
          <p className="text-2xl font-bold text-emerald-400">{poolBalance.toLocaleString()} XLM</p>
        </div>
      </header>

      <div className="grid gap-6">
        {requests.map((request) => (
          <BorrowRequestCard 
            key={request.id} 
            request={request} 
            currentUserAddress={userAddress} 
            onLend={() => handleLend(request)}
          />
        ))}
      </div>
    </div>
  );
}
