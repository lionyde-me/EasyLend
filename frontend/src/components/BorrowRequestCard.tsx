"use client";

import { useState } from "react";
import { BorrowRequest } from "../types";

export function BorrowRequestCard({ 
  request, 
  currentUserAddress, 
  onLend 
}: { 
  request: BorrowRequest, 
  currentUserAddress?: string | null,
  onLend?: (amount: string) => void
}) {
  const [showReviews, setShowReviews] = useState(false);
  const isMine = request.borrower === currentUserAddress || request.isMine;

  return (
    <div className={`bg-slate-900/50 border ${isMine ? "border-blue-500/50" : "border-slate-800"} p-6 rounded-2xl space-y-4 hover:border-slate-700 transition-colors relative`}>
      {isMine && (
        <span className="absolute -top-3 left-6 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full shadow-lg shadow-blue-900/40">
          My Request
        </span>
      )}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold text-blue-400">{request.title}</h3>
          <p className="text-sm text-slate-500 font-mono">Borrower: {request.borrower}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-emerald-400">{request.amount}</div>
          <p className="text-xs text-slate-500">Repay by: {request.promisedDate}</p>
        </div>
      </div>

      <p className="text-slate-300">{request.purpose}</p>

      <div className="flex items-center gap-4 py-2 border-y border-slate-800/50">
        <div className="flex flex-col">
          <span className="text-xs text-slate-500 uppercase tracking-wider">Social Credit</span>
          <span className="text-lg font-bold text-amber-400">{request.creditScore}</span>
        </div>
        <div className="h-8 w-px bg-slate-800"></div>
        <button 
          onClick={() => setShowReviews(!showReviews)}
          className="text-sm text-slate-400 hover:text-white transition-colors"
        >
          {request.reviews.length} Reviews {showReviews ? "↑" : "↓"}
        </button>
      </div>

      {showReviews && (
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-tight">What people say:</h4>
          {request.reviews.length > 0 ? (
            request.reviews.map((review, idx) => (
              <div key={idx} className="bg-slate-950/50 p-3 rounded-lg border border-slate-800/30">
                <p className="text-sm text-slate-300 italic">&quot;{review.comment}&quot;</p>
                <p className="text-xs text-slate-500 mt-1">— {review.user}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500 italic">No reviews yet for this borrower.</p>
          )}
        </div>
      )}

      <button 
        disabled={isMine}
        onClick={() => onLend && onLend(request.amount)}
        className={`w-full py-3 rounded-xl font-bold shadow-lg transition-all mt-2 ${
          isMine 
          ? "bg-slate-800 text-slate-500 cursor-not-allowed" 
          : "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/20"
        }`}
      >
        {isMine ? "You cannot lend to yourself" : `Lend ${request.amount}`}
      </button>
    </div>
  );
}
