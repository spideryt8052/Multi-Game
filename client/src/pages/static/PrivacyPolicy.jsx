import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-6 text-slate-300 text-xs leading-relaxed">
      <h1 className="font-gaming text-3xl font-extrabold text-slate-100 uppercase">Privacy Policy</h1>
      <p className="text-slate-400">Effective Date: January 1, 2026</p>
      
      <div className="space-y-4 bg-dark-card border border-dark-border p-6 rounded-2xl">
        <h2 className="text-sm font-bold text-slate-100 uppercase font-gaming">1. Information We Collect</h2>
        <p>
          We collect registration credentials including your Full Name, Email, Mobile Number, Country, and verified In-Game Identifiers (such as BGMI UID, Riot ID, or Steam ID) necessary to validate tournament eligibility.
        </p>

        <h2 className="text-sm font-bold text-slate-100 uppercase font-gaming">2. Auction Bidding Telemetry</h2>
        <p>
          All actions in the Live Auction Room, including bids placed, connection timestamps, and chat transmissions, are logged immutably for anti-tamper compliance and audit verification.
        </p>

        <h2 className="text-sm font-bold text-slate-100 uppercase font-gaming">3. Data Protection</h2>
        <p>
          User passwords are encrypted with bcrypt salt rounds. Authentication tokens are transmitted exclusively over encrypted SSL/TLS channels.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

