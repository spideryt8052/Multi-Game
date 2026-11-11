import React, { useState } from 'react';
import { useTranslation } from '../context/LanguageContext';
import { SQUAD_RULES_CONFIG, evaluateSquadCompliance } from '../utils/squadRulesConfig';
import { formatCurrency } from '../utils/formatCurrency';
import Button from '../components/common/Button';
import {
  BookOpen,
  ShieldCheck,
  AlertCircle,
  CheckCircle,
  Zap,
  Shield,
  Trophy,
  Users,
  Sparkles,
  Plus,
  Trash2,
  Check,
} from 'lucide-react';

const AuctionRules = () => {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSport, setSelectedSport] = useState('cricket');

  // Interactive Squad Builder Simulator State
  const [simGame, setSimGame] = useState('cricket');
  const [simRoster, setSimRoster] = useState([
    { name: 'Virat_Sharma', role: 'Batsman', acquiredPrice: 12000 },
    { name: 'Hardik_Patel', role: 'All-Rounder', acquiredPrice: 15000 },
    { name: 'Mohammed_Siraj', role: 'Bowler', acquiredPrice: 10000 },
    { name: 'Yuzvendra_Chahal', role: 'Bowler', acquiredPrice: 9000 },
  ]);
  const [simPurse, setSimPurse] = useState(100000);

  const rulesData = {
    // Physical Sports
    cricket: {
      category: 'physical_sports',
      title: 'Cricket (IPL & Box Cricket League) Regulations',
      squadFormat: '11 Active Players + 4 Reserve Players (Squad of 15)',
      budgetLimit: '₹1,00,000 Total Team Purse Cap',
      basePrice: '₹5,000 - ₹50,000 Base Player Price',
      increments: 'Minimum ₹500 increment up to ₹25,000; Minimum ₹1,000 increment above ₹25,000',
      roleConstraints: [
        'Mandatory Wicketkeeper: Every franchise must draft at least 1 verified Wicketkeeper (WK) before tournament qualification.',
        'Bowling Quota: Minimum 4 specialist Bowlers (with at least 1 Spinner and 2 Fast/Medium Pacers) must be signed.',
        'All-Rounder Balance: At least 2 All-Rounders required for squad balance and bat/ball depth.',
        'Batting Core: Minimum 4 specialist Batsmen to anchor top and middle orders.',
        'IPL Purse Reserve Rule: Franchises cannot place bids that leave their remaining purse insufficient to fill remaining mandatory squad slots at base price.',
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
        'Mandatory Goalkeeper slot: Teams cannot participate without at least 1 acquired Goalkeeper.',
        'Defensive Cap: Minimum 2 Defenders must be acquired.',
        'Midfield Engine: Minimum 2 Midfielders for ball progression.',
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
        'At least 1 All-Rounder active in both tackling chains and raids.',
      ],
      hammerClock: '30 seconds contact sport bidding clock.',
    },
    chess: {
      category: 'physical_sports',
      title: 'Global Chess League & Grandmaster Draft Regulations',
      squadFormat: '6 Boards: Board 1 Icon, 2 Men Superstars, 2 Women Masters, 1 U-21 Prodigy',
      budgetLimit: '₹80,000 Total Franchise Purse',
      basePrice: '₹5,000 - ₹40,000 Base Player Price',
      increments: 'Minimum ₹500 increment',
      roleConstraints: [
        'Board 1 Icon: Mandatory Super Grandmaster (FIDE Classical Rating > 2650).',
        'Women Master Quota: At least 2 verified WGM/IM players per franchise.',
        'Junior Prodigy: 1 mandatory slot reserved for Under-21 ranked master.',
        'Tie-break Armageddon capability required for team roster registration.',
      ],
      hammerClock: '30 seconds per lot with FIDE rating verification.',
    },
    carrom: {
      category: 'physical_sports',
      title: 'All-India Carrom Championship Draft Regulations',
      squadFormat: '4 Active Board Players + 1 Substitute (Squad of 5)',
      budgetLimit: '₹50,000 Club Purse Cap',
      basePrice: '₹3,000 Base Player Price',
      increments: 'Minimum ₹250 increment',
      roleConstraints: [
        'White Slam Specialist: Each team must have at least 1 verified White Slam master.',
        'Direct Striker & Cut-and-Pocket specialist quota.',
        'Doubles partner chemistry verified before state license registration.',
      ],
      hammerClock: '25 seconds rapid tabletop draft timer.',
    },

    // Esports
    bgmi: {
      category: 'esports',
      title: 'BGMI (Battlegrounds Mobile India) Regulations',
      squadFormat: '4 Active Starters + 1 Substitute Player',
      budgetLimit: '₹50,000 Total Team Purse',
      basePrice: '₹2,500 - ₹25,000 depending on Tier',
      increments: 'Minimum ₹250 increment up to ₹10,000; Minimum ₹500 increment above ₹10,000',
      roleConstraints: [
        'Mandatory IGL: Each roster must have exactly 1 designated In-Game Leader (IGL) for zone calling.',
        'At least 2 verified Assaulters / Entry Fraggers to breach compounds and secure early knocks.',
        'Maximum 2 dedicated Snipers / DMR specialists per team.',
        'Players must compete on official verified mobile devices per Krafton handbook.',
      ],
      hammerClock: '30 seconds per lot with automatic +15s anti-snipe extension on bids placed in the final 10 seconds.',
    },
    valorant: {
      category: 'esports',
      title: 'Valorant Riot Esports Regulations',
      squadFormat: '5 Active Agents + 1 Substitute',
      budgetLimit: '₹60,000 VCT Points Budget',
      basePrice: '₹3,000 Base Lot',
      increments: 'Minimum ₹500 increment',
      roleConstraints: [
        'Strict Role Capping: Maximum 2 Duelists per roster.',
        'Mandatory Sentinel Slot: Team must have at least 1 signed Sentinel to hold bombsites.',
        'Mandatory Controller Slot: Team must have at least 1 signed Controller for smokes.',
        'At least 1 Initiator for site information and flashes.',
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

  // Simulator helper functions
  const simCompliance = evaluateSquadCompliance(simRoster, simGame);
  const simConfig = SQUAD_RULES_CONFIG[simGame] || SQUAD_RULES_CONFIG.cricket;
  const spentSoFar = simRoster.reduce((sum, p) => sum + (p.acquiredPrice || 5000), 0);
  const simRemainingPurse = Math.max(0, simPurse - spentSoFar);

  const handleAddPlayer = (role) => {
    if (simRoster.length >= simConfig.squadMax) return;
    const price = simConfig.minBasePrice || 5000;
    if (simRemainingPurse < price) return;

    setSimRoster((prev) => [
      ...prev,
      {
        name: `Player_${prev.length + 1}`,
        role,
        acquiredPrice: price,
      },
    ]);
  };

  const handleRemovePlayer = (idx) => {
    setSimRoster((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleResetSimulator = (game) => {
    setSimGame(game);
    const cfg = SQUAD_RULES_CONFIG[game] || SQUAD_RULES_CONFIG.cricket;
    setSimPurse(cfg.purseLimit);
    if (game === 'cricket') {
      setSimRoster([
        { name: 'Virat_Sharma', role: 'Batsman', acquiredPrice: 12000 },
        { name: 'Hardik_Patel', role: 'All-Rounder', acquiredPrice: 15000 },
        { name: 'Mohammed_Siraj', role: 'Bowler', acquiredPrice: 10000 },
        { name: 'Yuzvendra_Chahal', role: 'Bowler', acquiredPrice: 9000 },
      ]);
    } else {
      setSimRoster([
        { name: 'ClutchGod', role: 'IGL', acquiredPrice: 12500 },
        { name: 'Jonathan', role: 'Assaulter', acquiredPrice: 15000 },
      ]);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-emerald/15 border border-brand-emerald/30 text-brand-emerald text-xs font-bold uppercase tracking-wider">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Official League Rulebook</span>
        </div>
        <h1 className="font-gaming text-4xl sm:text-5xl font-extrabold text-slate-100 uppercase tracking-wide">
          {t('nav.rules')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Arena Auctions enforces sport-specific tournament squad constraints modeled after the official IPL and Esports circuits.
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
            🏏 Physical Sports (IPL Cricket, Football)
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
            🎮 Esports (BGMI, Valorant)
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
      <div className="bg-dark-card border border-dark-border rounded-3xl p-6 sm:p-10 space-y-8 shadow-2xl">
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
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 bg-dark-surface/40 p-3 rounded-xl border border-dark-border/60">
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

      {/* --- INTERACTIVE SQUAD BUILDER & IPL SIMULATOR --- */}
      <div className="bg-dark-card border border-brand-emerald/40 rounded-3xl p-6 sm:p-10 space-y-6 shadow-glow-emerald/10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-dark-border pb-5">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-emerald" />
              <h3 className="font-gaming text-2xl font-bold text-slate-100 uppercase">
                Interactive IPL & Esports Squad Builder Simulator
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Test how the IPL / Esports squad composition rules work. Add players, balance your role quotas, and test the Purse Reserve Rule!
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleResetSimulator('cricket')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition-all ${
                simGame === 'cricket'
                  ? 'bg-brand-emerald text-black font-extrabold shadow-glow-emerald'
                  : 'bg-dark-surface border border-dark-border text-slate-400'
              }`}
            >
              🏏 Test Cricket (IPL)
            </button>
            <button
              type="button"
              onClick={() => handleResetSimulator('bgmi')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition-all ${
                simGame === 'bgmi'
                  ? 'bg-brand-cyan text-black font-extrabold shadow-glow-cyan/40'
                  : 'bg-dark-surface border border-dark-border text-slate-400'
              }`}
            >
              🎮 Test BGMI
            </button>
          </div>
        </div>

        {/* Simulator Dashboard Gauges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-dark-surface p-4 rounded-2xl border border-dark-border space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Simulated Squad Size:</span>
              <span className="font-mono font-bold text-slate-100">
                {simCompliance.currentCount} / {simCompliance.squadMin} Min ({simCompliance.squadMax} Max)
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-dark-card overflow-hidden">
              <div
                className="h-full bg-brand-emerald rounded-full transition-all duration-300"
                style={{ width: `${simCompliance.progressPercentage}%` }}
              />
            </div>
            <span className="text-[11px] text-slate-400 block">
              {simCompliance.slotsNeededForMin > 0
                ? `Need ${simCompliance.slotsNeededForMin} more players to qualify for official matches.`
                : '✓ Minimum team size requirement met!'}
            </span>
          </div>

          <div className="bg-dark-surface p-4 rounded-2xl border border-dark-border space-y-1">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Remaining Purse</span>
            <span className="font-gaming text-2xl font-black text-brand-emerald block">
              {formatCurrency(simRemainingPurse)}
            </span>
            <span className="text-[11px] text-slate-400 block">
              Total Budget: {formatCurrency(simPurse)}
            </span>
          </div>

          <div className="bg-dark-surface p-4 rounded-2xl border border-dark-border space-y-1">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Qualification Status</span>
            <span
              className={`font-gaming text-xl font-bold uppercase mt-1 block ${
                simCompliance.isQualified ? 'text-brand-emerald' : 'text-brand-gold'
              }`}
            >
              {simCompliance.isQualified ? '✓ OFFICIAL SQUAD READY' : '⏳ SQUAD INCOMPLETE'}
            </span>
            <span className="text-[11px] text-slate-400 block">
              {simCompliance.isQualified
                ? 'All mandatory roles and purse rules verified!'
                : 'Missing mandatory roles (see below).'}
            </span>
          </div>
        </div>

        {/* Role Breakdown in Simulator */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-300 uppercase tracking-wider">
              Role Requirements Breakdown:
            </span>
            <span className="text-slate-400">Click (+ Add Player) to simulate buying that role</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {simCompliance.roleBreakdown.map((r) => (
              <div
                key={r.roleId}
                className={`p-4 rounded-2xl border flex flex-col justify-between ${
                  r.isMinMet
                    ? 'bg-brand-emerald/10 border-brand-emerald/40'
                    : 'bg-dark-surface border-dark-border/80'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-gaming text-sm font-bold text-slate-100">{r.label}</span>
                    <span
                      className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                        r.isMinMet
                          ? 'bg-brand-emerald/20 text-brand-emerald'
                          : 'bg-brand-crimson/20 text-brand-crimson'
                      }`}
                    >
                      {r.count} / {r.min}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    {r.needed > 0 ? `Need ${r.needed} more to meet quota` : '✓ Role quota satisfied'}
                  </span>
                </div>

                <div className="pt-3 mt-3 border-t border-dark-border/40 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-400">Max: {r.max}</span>
                  <button
                    type="button"
                    onClick={() => handleAddPlayer(r.label)}
                    disabled={r.count >= r.max || simRemainingPurse < simConfig.minBasePrice}
                    className="px-2.5 py-1 rounded-lg bg-dark-card border border-brand-emerald/40 text-brand-emerald hover:bg-brand-emerald hover:text-black text-xs font-bold flex items-center gap-1 transition-all disabled:opacity-40"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Buy {formatCurrency(simConfig.minBasePrice)}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Current Simulated Roster List */}
        <div className="space-y-3 pt-2 border-t border-dark-border">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-300 uppercase tracking-wider">
              Simulated Team Roster ({simRoster.length} Players):
            </span>
            <span className="text-slate-400">Click trash icon to release a player</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {simRoster.map((player, idx) => (
              <div
                key={idx}
                className="p-3 bg-dark-surface rounded-xl border border-dark-border flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-slate-100 block">{player.name}</span>
                  <span className="text-[11px] text-brand-emerald">{player.role}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-brand-gold">
                    {formatCurrency(player.acquiredPrice)}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemovePlayer(idx)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-brand-crimson hover:bg-dark-card transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionRules;
