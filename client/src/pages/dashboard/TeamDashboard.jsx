import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/formatCurrency';
import { SQUAD_RULES_CONFIG, evaluateSquadCompliance } from '../../utils/squadRulesConfig';
import Button from '../../components/common/Button';
import {
  Shield,
  PlusCircle,
  Users,
  Wallet,
  Trophy,
  Flame,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  Sparkles,
} from 'lucide-react';

const TeamDashboard = () => {
  const { user } = useAuth();

  const teamsData = [
    {
      id: 'team_cric_01',
      name: 'Mumbai Titans',
      tag: 'MT',
      game: 'Cricket (IPL & Box Cricket)',
      gameSlug: 'cricket',
      owner: user?.fullName || 'Rohit Verma',
      allocatedBudget: 100000,
      remainingBudget: 67500,
      roster: [
        {
          id: 'r_c1',
          name: 'Virat_Sharma',
          role: 'Batsman',
          price: 12000,
          auction: 'Mumbai Premier Box Cricket 2026',
          date: 'Yesterday',
        },
        {
          id: 'r_c2',
          name: 'Shikhar_Rao',
          role: 'Batsman',
          price: 8500,
          auction: 'Mumbai Premier Box Cricket 2026',
          date: 'Yesterday',
        },
        {
          id: 'r_c3',
          name: 'Hardik_Patel',
          role: 'All-Rounder',
          price: 15000,
          auction: 'Mumbai Premier Box Cricket 2026',
          date: 'Yesterday',
        },
        {
          id: 'r_c4',
          name: 'Mohammed_Siraj',
          role: 'Bowler',
          price: 9000,
          auction: 'Mumbai Premier Box Cricket 2026',
          date: 'Yesterday',
        },
        {
          id: 'r_c5',
          name: 'Yuzvendra_Chahal',
          role: 'Bowler',
          price: 10500,
          auction: 'Mumbai Premier Box Cricket 2026',
          date: 'Yesterday',
        },
      ],
      auctionHistory: [
        {
          id: 'ah_c1',
          auctionTitle: 'Mumbai Premier Box Cricket League Season 4',
          status: 'Active In Bidding',
          bidsPlaced: 18,
          spent: 32500,
        },
      ],
    },
    {
      id: 'team_bgmi_02',
      name: 'GodLike Esports',
      tag: 'GODL',
      game: 'BGMI Mobile Esports',
      gameSlug: 'bgmi',
      owner: user?.fullName || 'Chetan Chandgude',
      allocatedBudget: 50000,
      remainingBudget: 35500,
      roster: [
        {
          id: 'r_1',
          name: 'GodL_ClutchGod',
          role: 'IGL',
          price: 12500,
          auction: 'BGMI Champions Cup Season 5',
          date: 'Nov 09',
        },
        {
          id: 'r_2',
          name: 'Soul_Akshat',
          role: 'Assaulter / Finisher',
          price: 14500,
          auction: 'BGMI Champions Cup Season 5',
          date: 'Today',
        },
      ],
      auctionHistory: [
        {
          id: 'ah_1',
          auctionTitle: 'BGMI Champions Cup Season 5',
          status: 'Active',
          bidsPlaced: 12,
          spent: 14500,
        },
      ],
    },
  ];

  const [activeTeamId, setActiveTeamId] = useState(teamsData[0].id);
  const activeTeam = teamsData.find((t) => t.id === activeTeamId) || teamsData[0];

  const spentAmount = activeTeam.allocatedBudget - activeTeam.remainingBudget;
  const pursePercentage = Math.round((activeTeam.remainingBudget / activeTeam.allocatedBudget) * 100);

  // Evaluate live squad compliance against official rules
  const compliance = evaluateSquadCompliance(activeTeam.roster, activeTeam.gameSlug);
  const activeConfig = SQUAD_RULES_CONFIG[activeTeam.gameSlug] || SQUAD_RULES_CONFIG.cricket;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Franchise Switcher Bar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          {teamsData.map((team) => (
            <button
              key={team.id}
              type="button"
              onClick={() => setActiveTeamId(team.id)}
              className={`px-4 py-2 rounded-2xl border text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                activeTeam.id === team.id
                  ? 'bg-brand-emerald text-black border-brand-emerald shadow-glow-emerald'
                  : 'bg-dark-card border-dark-border text-slate-400 hover:text-slate-100'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>{team.name}</span>
            </button>
          ))}
        </div>

        <Link to="/teams/create">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs">
            <PlusCircle className="w-4 h-4" />
            <span>Create New Franchise</span>
          </Button>
        </Link>
      </div>

      {/* Team Header Bar */}
      <div className="bg-dark-card border border-dark-border rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-brand-crimson/20 border border-brand-crimson/40 text-brand-crimson flex items-center justify-center font-black text-2xl uppercase">
            {activeTeam.tag}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-gaming text-3xl font-extrabold text-slate-100 uppercase">
                {activeTeam.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-dark-surface border border-dark-border text-slate-300">
                {activeTeam.game}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Franchise Owner: <span className="text-slate-200 font-semibold">{activeTeam.owner}</span> | Status:{' '}
              <span className="text-brand-emerald font-semibold">Active In Tournaments</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/auctions/live">
            <Button variant="danger" size="md" className="gap-2">
              <Flame className="w-4 h-4" />
              <span>Bid in Live Room</span>
            </Button>
          </Link>
          <Link to="/rules">
            <Button variant="outline" size="md" className="gap-2">
              <BookOpen className="w-4 h-4" />
              <span>Squad Rules</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Purse & Budget Allocation Widget */}
      <div className="bg-dark-card border border-dark-border rounded-3xl p-6 sm:p-8 space-y-4 shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <span className="text-brand-emerald text-xs font-bold uppercase tracking-wider">
              Franchise Financial Purse
            </span>
            <h3 className="font-gaming text-2xl font-bold text-slate-100 uppercase mt-0.5">
              Budget & Expenditure Breakdown
            </h3>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 block">Remaining Purse</span>
            <span className="font-gaming text-3xl font-black text-brand-emerald">
              {formatCurrency(activeTeam.remainingBudget)}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5 pt-2">
          <div className="w-full bg-dark-surface h-3 rounded-full overflow-hidden border border-dark-border flex">
            <div
              className="bg-brand-crimson h-full transition-all duration-500"
              style={{ width: `${100 - pursePercentage}%` }}
              title={`Spent: ${formatCurrency(spentAmount)}`}
            />
            <div
              className="bg-brand-emerald h-full transition-all duration-500"
              style={{ width: `${pursePercentage}%` }}
              title={`Remaining: ${formatCurrency(activeTeam.remainingBudget)}`}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Spent: {formatCurrency(spentAmount)}</span>
            <span>Allocated Cap: {formatCurrency(activeTeam.allocatedBudget)}</span>
          </div>
        </div>
      </div>

      {/* --- TOURNAMENT SQUAD COMPOSITION & IPL QUOTA BALANCE --- */}
      <div className="bg-dark-card border border-dark-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-dark-border pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-brand-emerald" />
              <h3 className="font-gaming text-xl sm:text-2xl font-bold text-slate-100 uppercase">
                {activeTeam.gameSlug === 'cricket' ? 'IPL Squad Quota & Role Distribution' : 'Esports Roster Balance Tracker'}
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Official Tournament Rules: Squad must fulfill all role quotas to be eligible for match scheduling.
            </p>
          </div>

          <span
            className={`text-xs font-bold uppercase px-3 py-1 rounded-full border ${
              compliance.isQualified
                ? 'bg-brand-emerald/15 text-brand-emerald border-brand-emerald/30'
                : 'bg-brand-gold/15 text-brand-gold border-brand-gold/30'
            }`}
          >
            {compliance.isQualified ? '✓ Official Squad Qualified' : '⏳ Incomplete Lineup (Need More Players)'}
          </span>
        </div>

        {/* Squad Capacity Bar */}
        <div className="bg-dark-surface p-4 rounded-2xl border border-dark-border space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-semibold">Total Squad Capacity:</span>
            <span className="font-mono font-bold text-slate-100">
              {compliance.currentCount} of {compliance.squadMin} Minimum ({compliance.squadMax} Max)
            </span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-dark-card overflow-hidden">
            <div
              className="h-full bg-brand-emerald rounded-full transition-all duration-500"
              style={{ width: `${compliance.progressPercentage}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>
              {compliance.slotsNeededForMin > 0
                ? `Need ${compliance.slotsNeededForMin} more players in auction to reach tournament minimum.`
                : '✓ Minimum roster requirements satisfied.'}
            </span>
            <span className="font-mono text-brand-gold">
              Purse Reserve Needed: {formatCurrency(compliance.slotsNeededForMin * activeConfig.minBasePrice)}
            </span>
          </div>
        </div>

        {/* Role Breakdown Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {compliance.roleBreakdown.map((r) => (
            <div
              key={r.roleId}
              className={`p-4 rounded-2xl border transition-all ${
                r.isMinMet
                  ? 'bg-brand-emerald/10 border-brand-emerald/30 shadow-glow-emerald/10'
                  : 'bg-dark-surface border-dark-border'
              }`}
            >
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
              <p className="text-[10px] text-slate-400 mt-1 leading-snug">{r.labelHinglish}</p>
              <div className="mt-2.5 pt-2 border-t border-dark-border/40 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Status:</span>
                <span className={`font-semibold ${r.isMinMet ? 'text-brand-emerald' : 'text-brand-gold'}`}>
                  {r.needed > 0 ? `Need ${r.needed} more` : '✓ Quota Met'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Roster & History Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Acquired Roster */}
        <div className="bg-dark-card border border-dark-border rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="font-gaming text-xl font-bold text-slate-100 uppercase flex items-center gap-2">
              <Users className="w-5 h-5 text-brand-emerald" />
              <span>Acquired Players ({activeTeam.roster.length})</span>
            </h3>
            <span className="text-xs text-brand-emerald font-semibold font-mono">
              Total Spent: {formatCurrency(spentAmount)}
            </span>
          </div>

          <div className="space-y-3">
            {activeTeam.roster.map((player) => (
              <div
                key={player.id}
                className="bg-dark-surface p-4 rounded-2xl border border-brand-emerald/30 flex items-center justify-between text-xs"
              >
                <div>
                  <h4 className="font-gaming text-lg font-bold text-slate-100">{player.name}</h4>
                  <p className="text-brand-emerald font-medium">{player.role}</p>
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    Won in: {player.auction}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block uppercase">Price</span>
                  <span className="font-mono text-base font-bold text-brand-gold">
                    {formatCurrency(player.price)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tournament Participation History */}
        <div className="bg-dark-card border border-dark-border rounded-3xl p-6 space-y-4 shadow-xl">
          <h3 className="font-gaming text-xl font-bold text-slate-100 uppercase flex items-center gap-2">
            <Trophy className="w-5 h-5 text-brand-gold" />
            <span>Auction Participation History</span>
          </h3>

          <div className="space-y-3">
            {activeTeam.auctionHistory.map((item) => (
              <div
                key={item.id}
                className="bg-dark-surface p-4 rounded-2xl border border-dark-border/60 flex items-center justify-between text-xs"
              >
                <div>
                  <h4 className="font-bold text-slate-100 text-sm">{item.auctionTitle}</h4>
                  <p className="text-slate-400 text-xs">Total Bids Placed: {item.bidsPlaced}</p>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-brand-emerald/15 text-brand-emerald border border-brand-emerald/30">
                    {item.status}
                  </span>
                  <span className="font-mono text-xs text-slate-300 block mt-1">
                    Purse Spent: {formatCurrency(item.spent)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamDashboard;
