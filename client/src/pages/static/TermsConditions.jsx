import React from 'react';

const TermsConditions = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-6 text-slate-300 text-xs leading-relaxed">
      <h1 className="font-gaming text-3xl font-extrabold text-slate-100 uppercase">Terms & Conditions</h1>
      <p className="text-slate-400">Effective Date: January 1, 2026</p>
      
      <div className="space-y-4 bg-dark-card border border-dark-border p-6 rounded-2xl">
        <h2 className="text-sm font-bold text-slate-100 uppercase font-gaming">1. Binding Auction Bids</h2>
        <p>
          By clicking a Bid button or executing an automated increment in an active Live Auction Room, the team owner or designated representative enters into a binding contract to secure the lot.
        </p>

        <h2 className="text-sm font-bold text-slate-100 uppercase font-gaming">2. Budget Compliance</h2>
        <p>
          Bidding amounts that exceed your verified clan purse allocation will be rejected automatically by the server-side validator. Attempting to circumvent purse checks or exploit network delays will result in immediate disqualification.
        </p>

        <h2 className="text-sm font-bold text-slate-100 uppercase font-gaming">3. Code of Conduct</h2>
        <p>
          Harassment, collusion between opposing clans, or unsportsmanlike conduct in the live room is strictly prohibited and subject to permanent account blacklisting.
        </p>
      </div>
    </div>
  );
};

export default TermsConditions;

