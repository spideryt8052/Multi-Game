import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/formatCurrency';
import Button from '../../components/common/Button';
import { Shield, PlusCircle, Users, Wallet, Trophy, Flame } from 'lucide-react';

const TeamDashboard = () => {
  const { user } = useAuth();

  const mockTeam = {
    name: 'GodLike Esports',
    tag: 'GODL',
    game: 'BGMI',
    owner: user?.fullName || 'Chetan Chandgude',
    allocatedBudget: 50000,
    remainingBudget: 35500,
    roster: [
      {
        id: 'r_1',
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
  };

  const spentAmount = mockTeam.allocatedBudget - mockTeam.remainingBudget;
  const pursePercentage = Math.round((mockTeam.remainingBudget / mockTeam.allocatedBudget) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Team Header Bar */}
      <div className="bg-dark-card border border-dark-border rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-brand-crimson/20 border border-brand-crimson/40 text-brand-crimson flex items-center justify-center font-black text-2xl uppercase">
            {mockTeam.tag}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-gaming text-3xl font-extrabold text-slate-100 uppercase">
                {mockTeam.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-dark-surface border border-dark-border text-slate-300">
                {mockTeam.game}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Owner: <span className="text-slate-200 font-semibold">{mockTeam.owner}</span> | Status:{' '}
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
          <Link to="/teams/create">
            <Button variant="outline" size="md" className="gap-2">
              <PlusCircle className="w-4 h-4" />
              <span>New Team</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Purse & Budget Allocation Widget */}
      <div className="bg-dark-card border border-dark-border rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <span className="text-brand-emerald text-xs font-bold uppercase tracking-wider">
              Clan Financial Purse
            </span>
            <h3 className="font-gaming text-2xl font-bold text-slate-100 uppercase mt-0.5">
              Budget & Expenditure Breakdown
            </h3>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 block">Remaining Purse</span>
            <span className="font-gaming text-3xl font-black text-brand-emerald">
              {formatCurrency(mockTeam.remainingBudget)}
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
              title={`Remaining: ${formatCurrency(mockTeam.remainingBudget)}`}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Spent: {formatCurrency(spentAmount)}</span>
            <span>Allocated Cap: {formatCurrency(mockTeam.allocatedBudget)}</span>
          </div>
        </div>
      </div>

      {/* Roster & History Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Acquired Roster */}
        <div className="bg-dark-card border border-dark-border rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-gaming text-xl font-bold text-slate-100 uppercase flex items-center gap-2">
              <Users className="w-5 h-5 text-brand-emerald" />
              <span>Current Signed Roster</span>
            </h3>
            <span className="text-xs text-slate-400 font-semibold">1 / 5 Slots</span>
          </div>

          <div className="space-y-3">
            {mockTeam.roster.map((player) => (
              <div
                key={player.id}
                className="bg-dark-surface p-4 rounded-2xl border border-brand-emerald/30 flex items-center justify-between text-xs"
              >
                <div>
                  <h4 className="font-gaming text-lg font-bold text-slate-100">{player.name}</h4>
                  <p className="text-slate-400">{player.role}</p>
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Won in: {player.auction}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block uppercase">Price</span>
                  <span className="font-mono text-base font-bold text-brand-emerald">
                    {formatCurrency(player.price)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tournament Participation History */}
        <div className="bg-dark-card border border-dark-border rounded-3xl p-6 space-y-4">
          <h3 className="font-gaming text-xl font-bold text-slate-100 uppercase flex items-center gap-2">
            <Trophy className="w-5 h-5 text-brand-gold" />
            <span>Auction Participation History</span>
          </h3>

          <div className="space-y-3">
            {mockTeam.auctionHistory.map((item) => (
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

