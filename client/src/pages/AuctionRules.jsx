import React, { useState } from 'react';
import { useTranslation } from '../context/LanguageContext';
import { BookOpen, ShieldCheck, AlertCircle, CheckCircle, Zap } from 'lucide-react';

const AuctionRules = () => {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSport, setSelectedSport] = useState('cricket');

  const rulesData = {
    // Physical Sports
    cricket: {
      category: 'physical_sports',
      title: 'Cricket (IPL & Box Cricket League) Regulations',
      squadFormat: '11 Active Players + 4 Reserve Players (Squad of 15)',
      budgetLimit: '₹1,00,000 Total Team Purse Cap',
      basePrice: '₹5,000 - ₹10,000 Base Player Price',
      increments: 'Minimum ₹500 increment up to ₹25,000; Minimum ₹1,000 increment above ₹25,000',
      roleConstraints: [
        'Mandatory Wicketkeeper: Every franchise must draft at least 1 verified Wicketkeeper.',
        'Bowling Quota: Minimum 4 specialist Bowlers (Pace / Spin) must be signed.',
        'All-Rounder Balance: At least 2 All-Rounders required for squad qualification.',
        'Franchises must retain at least ₹5,000 reserve until 11 core slots are filled.',
      ],
      hammerClock: '30 seconds per lot with automatic +15s extension on bids placed in the final 10 seconds.',
    },
    football: {
      category: 'physical_sports',
      title: 'Football / Turf Soccer Championship Regulations',
      squadFormat: '7 Active Players + 3 Substitutes (Turf Format)',
      budgetLimit: '₹80,000 Total Club Purse',
      basePrice: '₹4,000 Base Player Price',
      increments: 'Minimum ₹400 increment',
      roleConstraints: [
        'Mandatory Goalkeeper slot: Teams cannot participate without an acquired GK.',
        'Defensive Cap: Minimum 2 Defenders must be acquired.',
        'Attack Cap: Maximum 3 Strikers/Wingers per roster.',
      ],
      hammerClock: '25 seconds fast-paced draft timer.',
    },
    kabaddi: {
      category: 'physical_sports',
      title: 'Pro Kabaddi State League Regulations',
      squadFormat: '7 Mat Starters + 3 Substitutes (Squad of 10)',
      budgetLimit: '₹60,000 Club Purse',
      basePrice: '₹3,000 Base Lot Price',
      increments: 'Minimum ₹500 increment',
      roleConstraints: [
        'At least 3 dedicated Raiders (including 1 Do-or-Die specialist).',
        'At least 3 specialist Defenders (Corner & Cover).',
        'Balanced team composition verified before tournament license approval.',
      ],
      hammerClock: '30 seconds contact sport bidding clock.',
    },

    // Esports
    bgmi: {
      category: 'esports',
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
      category: 'esports',
      title: 'Valorant Riot Esports Regulations',
      squadFormat: '5 Active Agents + 1 Coach / Substitute',
      budgetLimit: '60,000 VCT Points Budget',
      basePrice: '3,000 VCT Points Base Lot',
      increments: 'Minimum 500 points increment',
      roleConstraints: [
        'Strict Role Capping: Maximum 2 Duelists per roster.',
        'Mandatory Sentinel Slot: Team must have at least 1 signed Sentinel.',
        'Mandatory Controller Slot: Team must have at least 1 signed Controller.',
      ],
      hammerClock: '30 seconds per lot. 3 hammer strikes (Going Once, Going Twice, SOLD).',
    },
    freefire: {
      category: 'esports',
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
  };

  const currentRule = rulesData[selectedSport] || rulesData.cricket;

  const sportKeys = Object.keys(rulesData).filter((key) => {
    if (selectedCategory === 'all') return true;
    return rulesData[key].category === selectedCategory;
  });

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
          Arena Auctions enforces sport-specific tournament constraints. Explore rules for Cricket, Football, Kabaddi, and competitive Esports titles.
        </p>

        {/* Category Pills */}
        <div className="flex items-center justify-center gap-2 pt-3">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedCategory === 'all'
                ? 'bg-brand-emerald text-black shadow-glow-emerald'
                : 'bg-dark-card border border-dark-border text-slate-400 hover:text-slate-100'
            }`}
          >
            All Sports & Games
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('physical_sports')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedCategory === 'physical_sports'
                ? 'bg-brand-emerald text-black shadow-glow-emerald'
                : 'bg-dark-card border border-dark-border text-slate-400 hover:text-slate-100'
            }`}
          >
            🏏 Physical Sports
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('esports')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedCategory === 'esports'
                ? 'bg-brand-emerald text-black shadow-glow-emerald'
                : 'bg-dark-card border border-dark-border text-slate-400 hover:text-slate-100'
            }`}
          >
            🎮 Esports
          </button>
        </div>
      </div>

      {/* Sport Selector Tabs */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2">
        {sportKeys.map((sportKey) => (
          <button
            key={sportKey}
            type="button"
            onClick={() => setSelectedSport(sportKey)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
              selectedSport === sportKey
                ? 'bg-brand-emerald text-black shadow-glow-emerald'
                : 'bg-dark-card border border-dark-border text-slate-400 hover:text-slate-100'
            }`}
          >
            {sportKey.toUpperCase()}
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
            Server enforces these constraints dynamically during live bidding. Bids violating roster caps or purse sizes are automatically rejected.
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
            <span>Live Gavel Clock & Anti-Snipe Policy</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {currentRule.hammerClock}
          </p>
        </div>

        {/* General Auction Ethics */}
        <div className="border-t border-dark-border pt-6 flex items-start gap-3 text-xs text-slate-400">
          <ShieldCheck className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
          <p>
            All bids submitted in the Live Room are binding contracts. Bids exceeding your verified franchise purse are blocked by the atomic server validator.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuctionRules;
