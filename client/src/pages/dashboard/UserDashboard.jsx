import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../context/LanguageContext';
import { formatCurrency } from '../../utils/formatCurrency';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import {
  User,
  Layers,
  Flame,
  History,
  Trophy,
  Bell,
  Settings,
  PlusCircle,
  Shield,
  ArrowUpRight,
} from 'lucide-react';

const UserDashboard = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');

  // Sample real-looking data for dashboard
  const userStats = {
    teamsCount: 2,
    activeAuctionsCount: 3,
    totalBidsPlaced: 18,
    wonLotsCount: 4,
    allocatedBudget: 50000,
    remainingBudget: 32500,
  };

  const sampleRegistrations = [
    {
      id: 'reg_1',
      auctionTitle: 'BGMI Champions Cup Season 5 Player Auction',
      game: 'BGMI',
      registeredAs: 'Athlete (Assaulter)',
      status: 'Approved',
      date: 'Nov 10, 2026',
    },
    {
      id: 'reg_2',
      auctionTitle: 'Valorant India Invitational 2026',
      game: 'Valorant',
      registeredAs: 'Duelist / Initiator',
      status: 'In Pool (Lot #14)',
      date: 'Nov 08, 2026',
    },
  ];

  const sampleBids = [
    {
      id: 'bid_1',
      auctionName: 'BGMI Champions Cup Season 5',
      lotName: 'Soul_Akshat',
      amount: 14500,
      time: '14:33:28 Today',
      status: 'Leading Bid',
    },
    {
      id: 'bid_2',
      auctionName: 'Valorant India Invitational 2026',
      lotName: 'Global_SkRossi',
      amount: 18000,
      time: '15:11:05 Today',
      status: 'Outbid',
    },
  ];

  const sampleWonLots = [
    {
      id: 'won_1',
      athleteName: 'Mortal_Viper',
      game: 'BGMI',
      role: 'Support / IGL',
      winningPrice: 22000,
      teamName: 'Team GodL',
      date: 'Nov 02, 2026',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Profile Summary Card */}
      <div className="bg-dark-card border border-dark-border rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-emerald to-brand-cyan flex items-center justify-center font-black text-2xl text-black uppercase shadow-glow-emerald">
            {user?.username ? user.username.substring(0, 2) : 'ME'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-gaming text-2xl sm:text-3xl font-extrabold text-slate-100 uppercase">
                {user?.fullName || 'Pro Athlete'}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-emerald/15 text-brand-emerald border border-brand-emerald/30">
                {user?.role?.replace('_', ' ') || 'Gamer'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Alias: <span className="text-slate-200 font-semibold">@{user?.username || 'player'}</span> | UID:{' '}
              <span className="text-brand-emerald font-mono">{user?.inGameId || '5129481920'}</span> | Country:{' '}
              <span className="text-slate-200">{user?.country || 'India'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Link to="/teams/create" className="w-full md:w-auto">
            <Button variant="primary" size="md" className="gap-2 w-full">
              <PlusCircle className="w-4 h-4" />
              <span>Create Esports Team</span>
            </Button>
          </Link>
          <Link to="/teams" className="w-full md:w-auto">
            <Button variant="outline" size="md" className="gap-2 w-full">
              <Layers className="w-4 h-4" />
              <span>Team Hub</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="flex items-center gap-2 border-b border-dark-border pb-3 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'overview'
              ? 'bg-brand-emerald text-black shadow-glow-emerald'
              : 'text-slate-400 hover:text-slate-100'
          }`}
        >
          <User className="w-4 h-4" />
          <span>{t('dashboard.overview')}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('registrations')}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'registrations'
              ? 'bg-brand-emerald text-black shadow-glow-emerald'
              : 'text-slate-400 hover:text-slate-100'
          }`}
        >
          <Flame className="w-4 h-4" />
          <span>{t('dashboard.my_registrations')}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('bids')}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'bids'
              ? 'bg-brand-emerald text-black shadow-glow-emerald'
              : 'text-slate-400 hover:text-slate-100'
          }`}
        >
          <History className="w-4 h-4" />
          <span>{t('dashboard.bidding_history')}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('won')}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'won'
              ? 'bg-brand-emerald text-black shadow-glow-emerald'
              : 'text-slate-400 hover:text-slate-100'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>{t('dashboard.won_lots')}</span>
        </button>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Metrics summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-dark-card border border-dark-border p-5 rounded-2xl">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Remaining Purse</span>
              <span className="font-gaming text-2xl font-bold text-brand-emerald mt-1 block">
                {formatCurrency(userStats.remainingBudget)}
              </span>
              <span className="text-[10px] text-slate-400 mt-1 block">
                Total Cap: {formatCurrency(userStats.allocatedBudget)}
              </span>
            </div>

            <div className="bg-dark-card border border-dark-border p-5 rounded-2xl">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Active Tournaments</span>
              <span className="font-gaming text-2xl font-bold text-slate-100 mt-1 block">
                {userStats.activeAuctionsCount}
              </span>
              <span className="text-[10px] text-slate-400 mt-1 block">Live Rooms Open</span>
            </div>

            <div className="bg-dark-card border border-dark-border p-5 rounded-2xl">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Total Bids Placed</span>
              <span className="font-gaming text-2xl font-bold text-brand-gold mt-1 block">
                {userStats.totalBidsPlaced}
              </span>
              <span className="text-[10px] text-slate-400 mt-1 block">Across all rooms</span>
            </div>

            <div className="bg-dark-card border border-dark-border p-5 rounded-2xl">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Won Athletes</span>
              <span className="font-gaming text-2xl font-bold text-brand-cyan mt-1 block">
                {userStats.wonLotsCount}
              </span>
              <span className="text-[10px] text-slate-400 mt-1 block">Signed on Roster</span>
            </div>
          </div>

          {/* Quick links to active live rooms */}
          <div className="bg-dark-card border border-dark-border rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-gaming text-lg font-bold text-slate-100 uppercase">
                Active Bidding Stream
              </h3>
              <Link to="/auctions/live" className="text-xs text-brand-emerald hover:underline">
                Enter Rooms &rarr;
              </Link>
            </div>

            <div className="space-y-3">
              {sampleBids.map((b) => (
                <div
                  key={b.id}
                  className="bg-dark-surface p-3.5 rounded-xl border border-dark-border/60 flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="font-semibold text-slate-100">{b.lotName}</p>
                    <p className="text-[11px] text-slate-400">{b.auctionName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono font-bold text-brand-emerald">{formatCurrency(b.amount)}</p>
                    <span
                      className={`text-[10px] font-bold uppercase ${
                        b.status === 'Leading Bid' ? 'text-brand-emerald' : 'text-brand-crimson'
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Registrations */}
      {activeTab === 'registrations' && (
        <div className="bg-dark-card border border-dark-border rounded-2xl p-6 space-y-4">
          <h3 className="font-gaming text-lg font-bold text-slate-100 uppercase">
            My Registered Lots & Tournaments
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-dark-border text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-2">Tournament</th>
                  <th className="py-3 px-2">Game</th>
                  <th className="py-3 px-2">Registered Role</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-2">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-border/60">
                {sampleRegistrations.map((r) => (
                  <tr key={r.id}>
                    <td className="py-3.5 px-2 font-semibold text-slate-200">{r.auctionTitle}</td>
                    <td className="py-3.5 px-2">
                      <span className="px-2 py-0.5 rounded bg-dark-surface border border-dark-border text-[11px]">
                        {r.game}
                      </span>
                    </td>
                    <td className="py-3.5 px-2 text-slate-300">{r.registeredAs}</td>
                    <td className="py-3.5 px-2">
                      <span className="text-brand-emerald font-semibold">{r.status}</span>
                    </td>
                    <td className="py-3.5 px-2 text-slate-400">{r.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Bidding History */}
      {activeTab === 'bids' && (
        <div className="bg-dark-card border border-dark-border rounded-2xl p-6 space-y-4">
          <h3 className="font-gaming text-lg font-bold text-slate-100 uppercase">
            Complete Audit Log of My Bids
          </h3>
          <div className="space-y-3">
            {sampleBids.map((b) => (
              <div
                key={b.id}
                className="bg-dark-surface p-4 rounded-xl border border-dark-border/60 flex items-center justify-between text-xs"
              >
                <div>
                  <p className="font-bold text-slate-100 text-sm">{b.lotName}</p>
                  <p className="text-slate-400 text-xs">{b.auctionName}</p>
                  <span className="text-[10px] text-slate-500 mt-1 block">{b.time}</span>
                </div>
                <div className="text-right">
                  <span className="font-mono text-base font-bold text-brand-emerald block">
                    {formatCurrency(b.amount)}
                  </span>
                  <span
                    className={`text-[11px] font-bold ${
                      b.status === 'Leading Bid' ? 'text-brand-emerald' : 'text-brand-crimson'
                    }`}
                  >
                    {b.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Won Lots */}
      {activeTab === 'won' && (
        <div className="bg-dark-card border border-dark-border rounded-2xl p-6 space-y-4">
          <h3 className="font-gaming text-lg font-bold text-slate-100 uppercase">
            Athletes & Squads Won in Auction
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sampleWonLots.map((w) => (
              <div
                key={w.id}
                className="bg-dark-surface border border-brand-emerald/40 p-4 rounded-2xl space-y-2 shadow-glow-emerald"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-brand-emerald/20 text-brand-emerald">
                    {w.game}
                  </span>
                  <span className="font-mono text-xs font-bold text-brand-gold">
                    Hammer: {formatCurrency(w.winningPrice)}
                  </span>
                </div>
                <h4 className="font-gaming text-xl font-bold text-slate-100">{w.athleteName}</h4>
                <p className="text-xs text-slate-400">Position: {w.role}</p>
                <div className="pt-2 border-t border-dark-border/60 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Signed to: {w.teamName}</span>
                  <span>Acquired: {w.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;

