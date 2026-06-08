"use client";

import { useState, useEffect } from "react";
import { BorrowRequestCard } from "../../components/BorrowRequestCard";
import { BorrowRequest } from "../../types";

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
  }
];

export default function BorrowPage() {
  const [formData, setFormData] = useState({
    title: "",
    purpose: "",
    amount: "",
    promisedDate: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
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

  const requests: BorrowRequest[] = hasHydrated 
    ? [...JSON.parse(localStorage.getItem("borrowRequests") || "[]"), ...MOCK_REQUESTS]
    : MOCK_REQUESTS;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      let currentAddress = userAddress || "G_LOCAL_USER";
      if (!userAddress) {
        const { isConnected, getAddress } = await import("@stellar/freighter-api");
        if (await isConnected()) {
          const { address } = await getAddress();
          currentAddress = address;
          setUserAddress(address);
        }
      }

      const newRequest: BorrowRequest = {
        id: Date.now().toString(),
        borrower: currentAddress,
        ...formData,
        amount: `${formData.amount} XLM`,
        creditScore: 500, // Starting score for new requests
        reviews: [],
      };

      const existing = JSON.parse(localStorage.getItem("borrowRequests") || "[]");
      localStorage.setItem("borrowRequests", JSON.stringify([newRequest, ...existing]));
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      console.log("Borrow Request Saved:", newRequest);
      setSubmitted(true);
    } catch (error) {
      console.error("Failed to submit request:", error);
      alert("Failed to submit request. Please ensure Freighter is connected.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-6 py-12">
        <div className="text-6xl text-emerald-500">✓</div>
        <h2 className="text-3xl font-bold">Request Submitted!</h2>
        <p className="text-slate-400">
          Your borrow request for <span className="text-white font-semibold">{formData.amount} XLM</span> has been published to the community.
        </p>
        <div className="flex flex-col items-center gap-4">
          <button 
            onClick={() => setSubmitted(false)}
            className="text-blue-400 hover:underline"
          >
            Create another request
          </button>
          <button 
            onClick={() => window.location.reload()}
            className="bg-slate-800 px-6 py-2 rounded-lg hover:bg-slate-700 transition-colors"
          >
            View My Request
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="max-w-2xl mx-auto space-y-8">
        <header className="space-y-2">
          <h2 className="text-3xl font-bold">Request a Loan</h2>
          <p className="text-slate-400">Fill out the form below to share your request with potential lenders.</p>
        </header>

        <form onSubmit={handleSubmit} className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl space-y-6 shadow-xl">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Title</label>
            <input 
              required
              type="text" 
              placeholder="e.g., Small Business Expansion"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Purpose</label>
            <textarea 
              required
              placeholder="Explain why you need the funds and how they will be used..."
              rows={4}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none"
              value={formData.purpose}
              onChange={(e) => setFormData({...formData, purpose: e.target.value})}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Amount (XLM)</label>
              <input 
                required
                type="number" 
                placeholder="0.00"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Promised Date</label>
              <input 
                required
                type="date" 
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all color-scheme-dark"
                value={formData.promisedDate}
                onChange={(e) => setFormData({...formData, promisedDate: e.target.value})}
              />
            </div>
          </div>

          <button 
            disabled={isSubmitting}
            type="submit"
            className="w-full py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-bold text-lg shadow-lg shadow-emerald-900/20"
          >
            {isSubmitting ? "Submitting..." : "Submit Borrow Request"}
          </button>
        </form>
      </div>

      <div className="space-y-6">
        <header className="flex justify-between items-end border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-slate-200">Current Market</h3>
            <p className="text-slate-400 text-sm">See how your request compares to others in the community.</p>
          </div>
        </header>
        
        <div className="grid gap-6">
          {requests.map((request) => (
            <BorrowRequestCard key={request.id} request={request} currentUserAddress={userAddress} />
          ))}
        </div>
      </div>
    </div>
  );
}
