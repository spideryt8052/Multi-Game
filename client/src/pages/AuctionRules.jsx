import React, { useState } from 'react';
import { useTranslation } from '../context/LanguageContext';
import { BookOpen, ShieldCheck, AlertCircle, CheckCircle, Zap } from 'lucide-react';

const AuctionRules = () => {
  const { t } = useTranslation();
  const [selectedGame, setSelectedGame] = useState('bgmi');

  const rulesData = {
    bgmi: {
      title: 'BGMI (Battlegrounds Mobile India) Regulations',
      squadFormat: '4 Active Starters + 1 Substitute Player',
      budgetLimit: '₹50,000 Total Team Purse',
      basePrice: '₹2,500 - ₹5,000 depending on Tier',
      increments: 'Minimum ₹250 increment up to ₹10,000; Minimum ₹500 increment above ₹10,000',
      roleConstraints: [
        'Each roster must have at least 1 designated In-Game Leader (IGL).',
        'Maximum 2 dedicated Snipers / DMR specialists per team.',
        'At least 2 Assaulters must be acquired.',
      ],
      hammerClock: '30 seconds per lot with automatic +15s anti-snipe extension on bids placed in the final 10 seconds.',
    },
    valorant: {
      title: 'Valorant Riot Esports Regulations',
      squadFormat: '5 Active Agents + 1 Coach / Substitute',
      budgetLimit: '60,000 VCT Points Budget',
      basePrice: '3,000 VCT Points Base Lot',
      increments: 'Minimum 500 points increment',
      roleConstraints: [
        'Strict Role Capping: Maximum 2 Duelists per roster.',
        'Mandatory Sentinel Slot: Team must have at least 1 signed Sentinel.',
        'Mandatory Controller Slot: Team must have at least 1 signed Controller.',
        'Any team failing role balance cannot compete in official tournament matches.',
      ],
      hammerClock: '30 seconds per lot. 3 hammer strikes (Going Once, Going Twice, SOLD).',
    },
    freefire: {
      title: 'Free Fire MAX League Rules',
      squadFormat: '4 Active Mobile Players',
      budgetLimit: '₹40,000 Clan Purse',
      basePrice: '₹1,500 Base Price',
      increments: 'Minimum ₹150 increment',
      roleConstraints: [
        'Maximum 1 designated Sniper per squad.',
        'At least 1 Rusher slot required.',
        'Clan must retain at least ₹1,500 buffer until 4 player slots are filled.',
      ],
      hammerClock: '20 seconds accelerated blitz bidding clock.',
    },
    fifa: {
      title: 'FIFA / EA Sports FC 24 Pro Club Rules',
      squadFormat: '1 Main Competitor + 1 Reserve Athlete',
      budgetLimit: '₹25,000 Solo Purse',
      basePrice: '₹2,000 Base',
      increments: 'Minimum ₹200 increment',
      roleConstraints: [
        'Athletes must be verified in Elite Division or FUT Champions Weekend League (16+ wins).',
        'Direct 1v1 franchise rights for the competitive season.',
      ],
      hammerClock: '45 seconds deliberate negotiation clock.',
    },
  };

  const currentRule = rulesData[selectedGame] || rulesData.bgmi;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-emerald/15 border border-brand-emerald/30 text-brand-emerald text-xs font-bold uppercase tracking-wider">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Official Rulebook</span>
        </div>
        <h1 className="font-gaming text-4xl sm:text-5xl font-extrabold text-slate-100 uppercase tracking-wide">
          {t('nav.rules')}
        </h1>
        <p className="text-sm text-slate-400">
          Arena Auctions does not use a generic one-size-fits-all rule engine. Each game enforces custom squad limits, role restrictions, and purse allocations.
        </p>
      </div>

      {/* Game Selector Tabs */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2">
        {Object.keys(rulesData).map((gameKey) => (
          <button
            key={gameKey}
            type="button"
            onClick={() => setSelectedGame(gameKey)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
              selectedGame === gameKey
                ? 'bg-brand-emerald text-black shadow-glow-emerald'
                : 'bg-dark-card border border-dark-border text-slate-400 hover:text-slate-100'
            }`}
          >
            {gameKey.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Rules Content Box */}
      <div className="bg-dark-card border border-dark-border rounded-3xl p-6 sm:p-10 space-y-8">
        <div>
          <h2 className="font-gaming text-2xl sm:text-3xl font-extrabold text-slate-100 uppercase">
            {currentRule.title}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Server enforces these constraints dynamically during live bidding. Bids violating these caps fail server validation.
          </p>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-dark-surface p-4 rounded-xl border border-dark-border/60">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Squad Format</span>
            <span className="font-gaming text-lg font-bold text-slate-100 mt-0.5 block">{currentRule.squadFormat}</span>
          </div>

          <div className="bg-dark-surface p-4 rounded-xl border border-dark-border/60">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Team Purse Limit</span>
            <span className="font-gaming text-lg font-bold text-brand-emerald mt-0.5 block">{currentRule.budgetLimit}</span>
          </div>

          <div className="bg-dark-surface p-4 rounded-xl border border-dark-border/60">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Base Price & Increment</span>
            <span className="font-gaming text-lg font-bold text-brand-gold mt-0.5 block">{currentRule.basePrice}</span>
          </div>
        </div>

        {/* Role constraints */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-gaming flex items-center gap-2">
            <Zap className="w-4 h-4 text-brand-emerald" />
            <span>Role Formation & Roster Rules</span>
          </h3>
          <ul className="space-y-2">
            {currentRule.roleConstraints.map((constraint, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                <CheckCircle className="w-4 h-4 text-brand-emerald shrink-0 mt-0.5" />
                <span>{constraint}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Hammer & Anti-Snipe Clock */}
        <div className="bg-brand-crimson/10 border border-brand-crimson/30 rounded-2xl p-5 space-y-2">
          <div className="flex items-center gap-2 text-brand-crimson font-gaming text-base font-bold uppercase">
            <AlertCircle className="w-4 h-4" />
            <span>Live Hammer Clock & Anti-Snipe Policy</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {currentRule.hammerClock}
          </p>
        </div>

        {/* General Auction Ethics */}
        <div className="border-t border-dark-border pt-6 flex items-start gap-3 text-xs text-slate-400">
          <ShieldCheck className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
          <p>
            All bids submitted in the Live Room are binding contracts. Withdrawing a bid or attempting ghost bidding leads to automatic clan disqualification and wallet forfeiture under platform terms.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuctionRules;

