import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  Wallet,
  Clock,
  Award,
} from 'lucide-react';

const UserDashboard = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const location = useLocation();

  // Detect tab from URL route (/dashboard, /profile, /notifications)
  const initialTab =
    location.pathname === '/profile'
      ? 'profile'
      : location.pathname === '/notifications'
      ? 'notifications'
      : 'overview';

  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    if (location.pathname === '/profile') setActiveTab('profile');
    else if (location.pathname === '/notifications') setActiveTab('notifications');
  }, [location.pathname]);

  const role = user?.role || 'user'; // 'user' (Viewer), 'gamer' (Player), 'team_owner', 'admin'

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
    {
      id: 'reg_3',
      auctionTitle: 'Global Chess Premier League 2026',
      game: 'Chess',
      registeredAs: 'Grandmaster (Board 1)',
      status: 'Active In Pool',
      date: 'Nov 09, 2026',
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
    {
      id: 'bid_3',
      auctionName: 'BGMI Champions Cup Season 5',
      lotName: 'Soul_Akshat',
      amount: 14500,
      time: '14:33:28 Today',
      status: 'Won',
    },
  ];

  const sampleWonLots = [
    {
      id: 'won_1',
      name: 'Soul_Akshat',
      game: 'BGMI',
      role: 'Assaulter / Finisher',
      price: 14500,
      auction: 'BGMI Champions Cup Season 5',
      contractTerm: 'Season 2026 Exclusive',
      status: 'Contract Signed',
    },
    {
      id: 'won_2',
      name: 'Virat_Sharma',
      game: 'Cricket',
      role: 'All-Rounder (Fast Medium)',
      price: 54000,
      auction: 'Delhi Corporate T20 Box Cricket',
      contractTerm: 'Championship Trophy Roster',
      status: 'Contract Signed',
    },
  ];

  const sampleNotifications = [
    {
      id: 'notif_1',
      title: 'Outbid Alert in Live Room',
      message: 'Alpine SG Pipers outbid your franchise for GM_Vidit_Gujrathi at ₹26,000.',
      time: '10 mins ago',
      unread: true,
    },
    {
      id: 'notif_2',
      title: 'Athlete KYC Verified',
      message: 'Your athlete profile for Mumbai Box Cricket League is approved by SuperAdmin.',
      time: '1 hour ago',
      unread: true,
    },
    {
      id: 'notif_3',
      title: 'Upcoming Draft Reminder',
      message: 'All-India Carrom Masters League draft begins in 36 hours. Fund your clan wallet.',
      time: '5 hours ago',
      unread: false,
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
              Username: <span className="text-slate-200 font-semibold">@{user?.username || 'user'}</span> | Email:{' '}
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
                <span>Open Team Hub</span>
              </Button>
            </Link>
          ) : role === 'gamer' ? (
            <Link to="/auctions/live" className="w-full md:w-auto">
              <Button variant="primary" size="md" className="gap-2 w-full">
                <Trophy className="w-4 h-4" />
                <span>View Live Pool</span>
              </Button>
            </Link>
          ) : role === 'admin' ? (
            <Link to="/admin" className="w-full md:w-auto">
              <Button variant="primary" size="md" className="gap-2 w-full">
                <Shield className="w-4 h-4" />
                <span>Admin Console</span>
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

      {/* DASHBOARD TABS NAVIGATION */}
      <div className="flex items-center gap-2 border-b border-dark-border pb-3 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'overview'
              ? 'bg-brand-emerald text-black shadow-glow-emerald'
              : 'text-slate-400 hover:text-slate-100 hover:bg-dark-card'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Dashboard Overview</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'profile'
              ? 'bg-brand-emerald text-black shadow-glow-emerald'
              : 'text-slate-400 hover:text-slate-100 hover:bg-dark-card'
          }`}
        >
          <User className="w-4 h-4" />
          <span>My Profile</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('registrations')}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'registrations'
              ? 'bg-brand-emerald text-black shadow-glow-emerald'
              : 'text-slate-400 hover:text-slate-100 hover:bg-dark-card'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>My Registrations ({sampleRegistrations.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('bids')}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'bids'
              ? 'bg-brand-emerald text-black shadow-glow-emerald'
              : 'text-slate-400 hover:text-slate-100 hover:bg-dark-card'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Bidding History</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('won')}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'won'
              ? 'bg-brand-emerald text-black shadow-glow-emerald'
              : 'text-slate-400 hover:text-slate-100 hover:bg-dark-card'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>Won Lots & Squads</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('teams')}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'teams'
              ? 'bg-brand-emerald text-black shadow-glow-emerald'
              : 'text-slate-400 hover:text-slate-100 hover:bg-dark-card'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Teams & Budget</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('notifications')}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'notifications'
              ? 'bg-brand-emerald text-black shadow-glow-emerald'
              : 'text-slate-400 hover:text-slate-100 hover:bg-dark-card'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Notifications ({sampleNotifications.filter((n) => n.unread).length})</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* VIEW 1: DARSHAK (SPECTATOR) DASHBOARD */}
          {role === 'user' && (
            <div className="space-y-6">
              <div className="bg-dark-card border border-dark-border rounded-3xl p-6 space-y-4">
                <div className="flex items-center gap-2 text-brand-emerald font-bold text-xs uppercase tracking-wider">
                  <Eye className="w-4 h-4" />
                  <span>Viewer Lounge & Spectator Hub</span>
                </div>
                <h3 className="font-gaming text-2xl font-bold text-slate-100 uppercase">
                  Follow Live Matches, Tournaments & Bidding
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
                  You are logged in as a Viewer. You can follow live tournaments, athlete statistics, leaderboards, and auctioneer gavels with zero delay.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="bg-dark-surface p-4 rounded-2xl border border-dark-border space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Live Rooms Open</span>
                    <span className="font-gaming text-2xl font-bold text-brand-crimson">3 Tournaments</span>
                    <span className="text-[11px] text-slate-400 block">Cricket, Chess & BGMI</span>
                  </div>
                  <div className="bg-dark-surface p-4 rounded-2xl border border-dark-border space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Upcoming Drafts</span>
                    <span className="font-gaming text-2xl font-bold text-brand-purple">8 Scheduled</span>
                    <span className="text-[11px] text-slate-400 block">Football, Kabaddi, Carrom & Esports</span>
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
                  Track your tournament draft eligibility, base price evaluation, live auction hammer results, and verified team contracts.
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
                  You have full live bidding authorization in official auction rooms. Bids are verified and deducted in real-time from your clan purse.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MY PROFILE */}
      {activeTab === 'profile' && (
        <div className="bg-dark-card border border-dark-border rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-dark-border pb-4 flex items-center justify-between">
            <div>
              <h3 className="font-gaming text-2xl font-bold text-slate-100 uppercase">User Identity & Gamer Profile</h3>
              <p className="text-xs text-slate-400 mt-1">Manage personal credentials, gaming IDs, and competitive statistics.</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-brand-emerald/15 text-brand-emerald border border-brand-emerald/30">
              Active Verified
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div className="space-y-1">
              <span className="text-slate-400 block font-semibold">Full Legal Name</span>
              <p className="font-bold text-slate-100 text-sm">{user?.fullName || 'Rohit Verma'}</p>
            </div>
            <div className="space-y-1">
              <span className="text-slate-400 block font-semibold">Username / Handle</span>
              <p className="font-bold text-slate-100 text-sm">@{user?.username || 'rohit_titans'}</p>
            </div>
            <div className="space-y-1">
              <span className="text-slate-400 block font-semibold">Email Address</span>
              <p className="font-bold text-slate-100 text-sm">{user?.email || 'rohit@cricket.in'}</p>
            </div>
            <div className="space-y-1">
              <span className="text-slate-400 block font-semibold">Mobile Contact</span>
              <p className="font-bold text-slate-100 text-sm">{user?.mobileNumber || '+91 9876543210'}</p>
            </div>
            <div className="space-y-1">
              <span className="text-slate-400 block font-semibold">Platform Role</span>
              <p className="font-bold text-brand-emerald text-sm uppercase">{role}</p>
            </div>
            <div className="space-y-1">
              <span className="text-slate-400 block font-semibold">In-Game UID / Jersey Number</span>
              <p className="font-bold text-brand-cyan text-sm">{user?.inGameId || 'Jersey #45 (Cricket) / 5129481 (BGMI)'}</p>
            </div>
            <div className="space-y-1 sm:col-span-2">
              <span className="text-slate-400 block font-semibold">Favorite Sports & Titles</span>
              <div className="flex flex-wrap gap-2 pt-1">
                {(user?.favoriteGames || ['Cricket (IPL & Box Cricket)', 'BGMI', 'Chess']).map((g) => (
                  <span key={g} className="px-2.5 py-1 rounded-lg bg-dark-surface border border-dark-border text-slate-200">
                    {g}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: REGISTRATIONS */}
      {activeTab === 'registrations' && (
        <div className="bg-dark-card border border-dark-border rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-dark-border pb-4">
            <div>
              <h4 className="font-gaming text-xl font-bold text-slate-100 uppercase">My Tournament Registrations</h4>
              <p className="text-xs text-slate-400 mt-0.5">Tournaments where you have submitted an athlete lot or team entry.</p>
            </div>
            <Link to="/auctions/upcoming">
              <Button variant="primary" size="sm">Register New Draft</Button>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-dark-border text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-2">Tournament</th>
                  <th className="py-3 px-2">Sport</th>
                  <th className="py-3 px-2">Role / Slot</th>
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

      {/* TAB 4: BIDDING HISTORY */}
      {activeTab === 'bids' && (
        <div className="bg-dark-card border border-dark-border rounded-3xl p-6 space-y-4">
          <h4 className="font-gaming text-xl font-bold text-slate-100 uppercase">Live Bidding Log & Audit Stream</h4>
          <p className="text-xs text-slate-400">Complete immutable record of all bids submitted from your profile.</p>

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
                      b.status === 'Leading Bid' || b.status === 'Won' ? 'text-brand-emerald' : 'text-brand-crimson'
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

      {/* TAB 5: WON AUCTIONS */}
      {activeTab === 'won' && (
        <div className="bg-dark-card border border-dark-border rounded-3xl p-6 space-y-4">
          <h4 className="font-gaming text-xl font-bold text-slate-100 uppercase">Won Lots & Signed Contracts</h4>
          <p className="text-xs text-slate-400">Athletes and championship roster spots secured under winning hammer bids.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sampleWonLots.map((w) => (
              <div key={w.id} className="bg-dark-surface p-5 rounded-2xl border border-brand-emerald/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-brand-emerald/20 text-brand-emerald">
                    {w.game}
                  </span>
                  <span className="font-mono text-base font-bold text-brand-gold">{formatCurrency(w.price)}</span>
                </div>
                <div>
                  <h5 className="font-gaming text-lg font-bold text-slate-100">{w.name}</h5>
                  <p className="text-xs text-slate-400">{w.role}</p>
                </div>
                <div className="pt-2 border-t border-dark-border text-xs flex items-center justify-between text-slate-300">
                  <span>{w.auction}</span>
                  <span className="text-brand-emerald font-semibold">✓ {w.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: TEAMS & BUDGET */}
      {activeTab === 'teams' && (
        <div className="bg-dark-card border border-dark-border rounded-3xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-dark-border pb-4">
            <div>
              <h4 className="font-gaming text-xl font-bold text-slate-100 uppercase">Registered Franchises & Clans</h4>
              <p className="text-xs text-slate-400">Your managed teams and tournament purse allocations.</p>
            </div>
            <Link to="/teams/create">
              <Button variant="primary" size="sm">Create New Team</Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-dark-surface p-5 rounded-2xl border border-dark-border space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-brand-emerald/20 text-brand-emerald flex items-center justify-center font-bold text-sm">
                    MT
                  </span>
                  <h5 className="font-gaming text-lg font-bold text-slate-100">Mumbai Titans</h5>
                </div>
                <span className="text-xs text-slate-400 uppercase font-semibold">Cricket</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div>
                  <span className="text-slate-400 block">Total Purse</span>
                  <span className="font-mono font-bold text-slate-200">₹1,00,000</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Remaining Purse</span>
                  <span className="font-mono font-bold text-brand-emerald">₹67,500</span>
                </div>
              </div>
            </div>

            <div className="bg-dark-surface p-5 rounded-2xl border border-dark-border space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-brand-crimson/20 text-brand-crimson flex items-center justify-center font-bold text-sm">
                    GODL
                  </span>
                  <h5 className="font-gaming text-lg font-bold text-slate-100">GodLike Esports</h5>
                </div>
                <span className="text-xs text-slate-400 uppercase font-semibold">BGMI</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div>
                  <span className="text-slate-400 block">Total Purse</span>
                  <span className="font-mono font-bold text-slate-200">₹50,000</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Remaining Purse</span>
                  <span className="font-mono font-bold text-brand-emerald">₹38,500</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: NOTIFICATIONS */}
      {activeTab === 'notifications' && (
        <div className="bg-dark-card border border-dark-border rounded-3xl p-6 space-y-4">
          <h4 className="font-gaming text-xl font-bold text-slate-100 uppercase">Live Activity & Notifications</h4>
          <p className="text-xs text-slate-400">Real-time alerts regarding bids, tournament starts, and lot gavel strikes.</p>

          <div className="space-y-3">
            {sampleNotifications.map((n) => (
              <div
                key={n.id}
                className={`p-4 rounded-xl border flex items-start gap-3 transition-colors ${
                  n.unread ? 'bg-dark-surface border-brand-emerald/40' : 'bg-dark-surface/50 border-dark-border'
                }`}
              >
                <div className="w-2 h-2 rounded-full bg-brand-emerald mt-2 shrink-0" />
                <div className="space-y-0.5 flex-1">
                  <div className="flex items-center justify-between">
                    <h5 className="font-bold text-slate-100 text-xs">{n.title}</h5>
                    <span className="text-[10px] text-slate-500">{n.time}</span>
                  </div>
                  <p className="text-xs text-slate-300">{n.message}</p>
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
