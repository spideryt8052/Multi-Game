import React from 'react';
import { ShieldCheck, Trophy, Zap, Users } from 'lucide-react';

const AboutUs = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      <div className="text-center space-y-3">
        <h1 className="font-gaming text-4xl sm:text-5xl font-extrabold text-slate-100 uppercase">
          About Arena Auctions
        </h1>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          The next-generation live bidding infrastructure designed for esports organizations, organizers, and competitive athletes.
        </p>
      </div>

      <div className="bg-dark-card border border-dark-border rounded-3xl p-8 space-y-6 text-sm text-slate-300 leading-relaxed">
        <p>
          Founded by esports veterans and software engineers, Arena Auctions was built to solve the fragmentation in competitive player drafts. Traditional esports tournaments relied on error-prone spreadsheets, manual Discord bidding, and delayed budget calculations.
        </p>
        <p>
          Arena Auctions brings the thrilling, high-production atmosphere of premier sports leagues (like the IPL) directly into competitive gaming. With dedicated sub-second WebSockets, game-specific role validations (for titles like BGMI, Valorant, Free Fire, and CS2), and automated wallet deduction, teams and tournament organizers can conduct high-stakes drafts with zero room for error.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-dark-card border border-dark-border p-6 rounded-2xl space-y-2 text-center">
          <Zap className="w-8 h-8 text-brand-emerald mx-auto" />
          <h3 className="font-gaming text-lg font-bold text-slate-100">Sub-Second Sync</h3>
          <p className="text-xs text-slate-400">Atomic real-time bidding prevents collision between simultaneous offers.</p>
        </div>
        <div className="bg-dark-card border border-dark-border p-6 rounded-2xl space-y-2 text-center">
          <ShieldCheck className="w-8 h-8 text-brand-cyan mx-auto" />
          <h3 className="font-gaming text-lg font-bold text-slate-100">Anti-Cheat Bidding</h3>
          <p className="text-xs text-slate-400">Strict server-side validation checks purse limits and roster caps.</p>
        </div>
        <div className="bg-dark-card border border-dark-border p-6 rounded-2xl space-y-2 text-center">
          <Trophy className="w-8 h-8 text-brand-gold mx-auto" />
          <h3 className="font-gaming text-lg font-bold text-slate-100">Official Roster Lock</h3>
          <p className="text-xs text-slate-400">Instantly sign contracts and lock rosters for the championship season.</p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;

