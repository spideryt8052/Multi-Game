import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../context/LanguageContext';
import { formatCurrency } from '../../utils/formatCurrency';
import { MOCK_AUCTIONS, MOCK_GAMES } from '../../utils/mockData';
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
  Eye,
  CheckCircle2,
  Calendar,
  Sparkles,
} from 'lucide-react';

const UserDashboard = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');

  const role = user?.role || 'user'; // 'user' (Darshak), 'gamer' (Player), 'team_owner', 'admin'

  const sampleRegistrations = [
    {
      id: 'reg_1',
      auctionTitle: 'Mumbai Premier Box Cricket League 2026',
      game: 'Cricket',
      registeredAs: 'All-Rounder (Jersey #45)',
      status: 'Active In Pool (Lot #01)',
      date: 'Nov 10, 2026',
    },
    {
      id: 'reg_2',
      auctionTitle: 'BGMI Champions Cup Season 5 Player Auction',
      game: 'BGMI',
      registeredAs: 'Assaulter / Finisher',
      status: 'Sold to GodLike Esports',
      date: 'Nov 08, 2026',
    },
  ];

  const sampleBids = [
    {
      id: 'bid_1',
      auctionName: 'Mumbai Premier Box Cricket League',
      lotName: 'Rohit_Verma',
      amount: 32500,
      time: '16:03:40 Today',
      status: 'Leading Bid',
    },
    {
      id: 'bid_2',
      auctionName: 'Global Chess Premier League 2026',
      lotName: 'GM_Vidit_Gujrathi',
      amount: 28500,
      time: '17:11:32 Today',
      status: 'Outbid',
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
                {user?.fullName || 'Arena User'}
              </h1>
              <span
                className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${
                  role === 'team_owner'
                    ? 'bg-brand-emerald/15 text-brand-emerald border-brand-emerald/30'
                    : role === 'gamer'
                    ? 'bg-brand-cyan/15 text-brand-cyan border-brand-cyan/30'
                    : role === 'admin'
                    ? 'bg-brand-gold/15 text-brand-gold border-brand-gold/30'
                    : 'bg-dark-surface text-slate-300 border-dark-border'
                }`}
              >
                {role === 'user'
                  ? `👁️ ${t('auth.roles.darshak.title', 'Viewer (Spectator)')}`
                  : role === 'gamer'
                  ? `🏃 ${t('auth.roles.player.title', 'Player (Athlete)')}`
                  : role === 'team_owner'
                  ? `🛡️ ${t('auth.roles.team_owner.title', 'Team Owner')}`
                  : `👑 ${t('auth.roles.admin.title', 'SuperAdmin')}`}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Username: <span className="text-slate-200 font-semibold">@{user?.email?.split('@')[0] || user?.username || 'user'}</span> | Email:{' '}
              <span className="text-slate-200">{user?.email || 'viewer@arena.gg'}</span>
            </p>
          </div>
        </div>

        {/* Role Quick Action Buttons */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          {role === 'team_owner' ? (
            <Link to="/teams" className="w-full md:w-auto">
              <Button variant="primary" size="md" className="gap-2 w-full">
                <Shield className="w-4 h-4" />
                <span>Open Franchise Purse Hub</span>
              </Button>
            </Link>
          ) : role === 'gamer' ? (
            <Link to="/auctions/live" className="w-full md:w-auto">
              <Button variant="primary" size="md" className="gap-2 w-full">
                <Trophy className="w-4 h-4" />
                <span>View My Active Lot Queue</span>
              </Button>
            </Link>
          ) : (
            <Link to="/auctions/live" className="w-full md:w-auto">
              <Button variant="danger" size="md" className="gap-2 w-full">
                <Flame className="w-4 h-4 animate-pulse" />
                <span>Watch Live Auctions</span>
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* VIEW 1: DARSHAK (SPECTATOR) DASHBOARD */}
      {role === 'user' && (
        <div className="space-y-6">
          <div className="bg-dark-card border border-dark-border rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-brand-emerald font-bold text-xs uppercase tracking-wider">
              <Eye className="w-4 h-4" />
              <span>Darshak Hub (Spectator Lounge)</span>
            </div>
            <h3 className="font-gaming text-2xl font-bold text-slate-100 uppercase">
              Follow Live Matches, Tournaments & Bidding
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
              Aap Darshak profile se logged in hain. Aap bina kisi dabav ke live tournaments, player stats, leaderboard aur gavels strikes follow kar sakte hain.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="bg-dark-surface p-4 rounded-2xl border border-dark-border space-y-1">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Live Rooms Open</span>
                <span className="font-gaming text-2xl font-bold text-brand-crimson">3 Live Tournaments</span>
                <span className="text-[11px] text-slate-400 block">Cricket, Chess & BGMI</span>
              </div>
              <div className="bg-dark-surface p-4 rounded-2xl border border-dark-border space-y-1">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Upcoming Drafts</span>
                <span className="font-gaming text-2xl font-bold text-brand-purple">4 Scheduled</span>
                <span className="text-[11px] text-slate-400 block">Football, Kabaddi & Carrom</span>
              </div>
              <div className="bg-dark-surface p-4 rounded-2xl border border-dark-border space-y-1">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Total Bidding Volume</span>
                <span className="font-gaming text-2xl font-bold text-brand-gold">₹25,420,000+</span>
                <span className="text-[11px] text-brand-emerald block">Verified fair bidding</span>
              </div>
            </div>
          </div>

          {/* Quick Access to Live Rooms */}
          <div className="bg-dark-card border border-dark-border rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-gaming text-xl font-bold text-slate-100 uppercase">
                Trending Live Auction Rooms Right Now
              </h4>
              <Link to="/auctions/live" className="text-xs text-brand-emerald hover:underline">
                View All &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {MOCK_AUCTIONS.slice(0, 2).map((auc) => (
                <div key={auc._id} className="bg-dark-surface p-4 rounded-2xl border border-dark-border flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-brand-emerald font-bold uppercase">{auc.gameName}</span>
                    <h5 className="font-gaming text-base font-bold text-slate-100">{auc.title}</h5>
                    <p className="text-xs text-slate-400">Current Bid: {formatCurrency(auc.currentLot?.currentBid || auc.startingBid)}</p>
                  </div>
                  <Link to={`/auctions/live/${auc._id}`}>
                    <Button variant="danger" size="sm" className="whitespace-nowrap">
                      Enter Stream
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: PLAYER / KHILADI DASHBOARD */}
      {role === 'gamer' && (
        <div className="space-y-6">
          <div className="bg-dark-card border border-brand-cyan/40 rounded-3xl p-6 sm:p-8 space-y-4 shadow-glow-cyan/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-brand-cyan font-bold text-xs uppercase tracking-wider">
                <Trophy className="w-4 h-4" />
                <span>Player & Athlete Dashboard</span>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-brand-emerald/15 text-brand-emerald border border-brand-emerald/30">
                KYC VERIFIED ATHLETE
              </span>
            </div>

            <h3 className="font-gaming text-2xl sm:text-3xl font-bold text-slate-100 uppercase">
              My Auction Lots & Franchise Contracts
            </h3>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Yahan aap apne draft status, base price, live hammer updates aur contract details dekh sakte hain.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
              <div className="bg-dark-surface p-4 rounded-2xl border border-dark-border">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Draft Pool Status</span>
                <span className="font-gaming text-xl font-bold text-brand-emerald mt-1 block">Active Lot Queue</span>
              </div>
              <div className="bg-dark-surface p-4 rounded-2xl border border-dark-border">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Base Lot Floor</span>
                <span className="font-gaming text-xl font-bold text-slate-100 mt-1 block">₹10,000</span>
              </div>
              <div className="bg-dark-surface p-4 rounded-2xl border border-dark-border">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Current Highest Offer</span>
                <span className="font-gaming text-xl font-bold text-brand-gold mt-1 block">₹32,500</span>
              </div>
              <div className="bg-dark-surface p-4 rounded-2xl border border-dark-border">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Leading Franchise</span>
                <span className="font-gaming text-base font-bold text-brand-cyan mt-1 block truncate">Mumbai Titans</span>
              </div>
            </div>
          </div>

          {/* Registered Lots Table */}
          <div className="bg-dark-card border border-dark-border rounded-3xl p-6 space-y-4">
            <h4 className="font-gaming text-xl font-bold text-slate-100 uppercase">
              My Registered Tournaments & Lot Results
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-dark-border text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-2">Tournament</th>
                    <th className="py-3 px-2">Sport</th>
                    <th className="py-3 px-2">Role / Position</th>
                    <th className="py-3 px-2">Lot Status</th>
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
        </div>
      )}

      {/* VIEW 3: TEAM OWNER DASHBOARD */}
      {role === 'team_owner' && (
        <div className="space-y-6">
          <div className="bg-dark-card border border-brand-emerald/40 rounded-3xl p-6 sm:p-8 space-y-4 shadow-glow-emerald">
            <div className="flex items-center justify-between">
              <span className="text-xs text-brand-emerald font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Shield className="w-4 h-4" />
                <span>Franchise Ownership Center</span>
              </span>
              <Link to="/teams">
                <Button variant="primary" size="sm">
                  View Full Roster & Purse
                </Button>
              </Link>
            </div>
            <h3 className="font-gaming text-3xl font-extrabold text-slate-100 uppercase">
              Mumbai Titans Franchise Purse: ₹67,500
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Aapke paas live auction rooms mein boli lagane ke pure adhikar hain. Bids aapke purse se automatically deduct hoti hain.
            </p>
          </div>

          {/* Recent Bids */}
          <div className="bg-dark-card border border-dark-border rounded-3xl p-6 space-y-4">
            <h4 className="font-gaming text-xl font-bold text-slate-100 uppercase">
              Live Bidding Stream & Log
            </h4>
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
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
