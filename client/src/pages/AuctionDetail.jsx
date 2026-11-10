import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MOCK_AUCTIONS, MOCK_GAMES } from '../utils/mockData';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDate } from '../utils/formatDate';
import { useTranslation } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import CountdownTimer from '../components/common/CountdownTimer';
import {
  Flame,
  Shield,
  Calendar,
  Users,
  Trophy,
  BookOpen,
  ArrowRight,
  UserCheck,
  Zap,
  CheckCircle,
} from 'lucide-react';

const AuctionDetail = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();

  const auction =
    MOCK_AUCTIONS.find((a) => a._id === id || a.gameSlug === id) || MOCK_AUCTIONS[0];

  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'pool', 'teams', 'rules'
  const [registered, setRegistered] = useState(false);

  const registeredPool = [
    {
      id: 'p1',
      name: 'Soul_Akshat',
      role: 'Assaulter / Finisher',
      kd: '4.82',
      tier: 'Conqueror Top 100',
      basePrice: 5000,
      status: 'Active In Pool',
    },
    {
      id: 'p2',
      name: 'GodL_Jonathan',
      role: 'Assaulter / Fragger',
      kd: '5.64',
      tier: 'Conqueror Top 10',
      basePrice: 6000,
      status: 'Active In Pool',
    },
    {
      id: 'p3',
      name: 'Blind_Spower',
      role: 'Support / DMR',
      kd: '4.15',
      tier: 'Conqueror',
      basePrice: 4000,
      status: 'Active In Pool',
    },
  ];

  const registeredClans = [
    { id: 'c1', name: 'GodLike Esports', tag: 'GODL', purse: 50000, owner: 'Kronten' },
    { id: 'c2', name: 'Team Soul', tag: 'SOUL', purse: 50000, owner: 'Mortal' },
    { id: 'c3', name: 'Blind Esports', tag: 'BLIND', purse: 50000, owner: 'BigBrother' },
  ];

  return (
    <div className="space-y-12 pb-16">
      {/* Banner */}
      <div className="relative h-72 sm:h-96 w-full overflow-hidden bg-dark-card border-b border-dark-border">
        <img
          src={auction.bannerImage}
          alt={auction.title}
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/60 to-transparent" />

        <div className="absolute bottom-6 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-dark-surface border border-dark-border text-slate-200">
                  {auction.gameName}
                </span>
                {auction.status === 'live' ? (
                  <Badge variant="live" pulse>
                    {t('auction.live_now')}
                  </Badge>
                ) : (
                  <Badge variant="upcoming">
                    {t('auction.upcoming_badge')}
                  </Badge>
                )}
              </div>
              <h1 className="font-gaming text-3xl sm:text-5xl font-extrabold text-slate-100 uppercase tracking-wide">
                {auction.title}
              </h1>
              <p className="text-xs text-slate-400">
                Organized by: <span className="text-slate-200 font-semibold">{auction.organizerName}</span> | Date:{' '}
                <span className="text-brand-emerald">{formatDate(auction.startTime)}</span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link to={`/auctions/live/${auction._id}`}>
                <Button variant="danger" size="lg" className="gap-2 shadow-glow-crimson">
                  <Flame className="w-5 h-5 animate-pulse" />
                  <span>Enter Live Auction Room</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Quick Highlights Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-dark-card border border-dark-border p-4 rounded-2xl">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Base Starting Bid</span>
            <span className="font-gaming text-xl font-bold text-slate-100 mt-0.5 block">
              {formatCurrency(auction.startingBid)}
            </span>
          </div>

          <div className="bg-dark-card border border-dark-border p-4 rounded-2xl">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Minimum Increment</span>
            <span className="font-gaming text-xl font-bold text-brand-emerald mt-0.5 block">
              +{formatCurrency(auction.minimumIncrement)}
            </span>
          </div>

          <div className="bg-dark-card border border-dark-border p-4 rounded-2xl">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Team Purse Cap</span>
            <span className="font-gaming text-xl font-bold text-brand-gold mt-0.5 block">
              ₹50,000 Points
            </span>
          </div>

          <div className="bg-dark-card border border-dark-border p-4 rounded-2xl">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Registered Athletes</span>
            <span className="font-gaming text-xl font-bold text-brand-cyan mt-0.5 block">
              {auction.registeredParticipantsCount || 48} Athletes
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-dark-border pb-3">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
              activeTab === 'overview'
                ? 'bg-brand-emerald text-black shadow-glow-emerald'
                : 'text-slate-400 hover:text-slate-100'
            }`}
          >
            Tournament Overview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('pool')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
              activeTab === 'pool'
                ? 'bg-brand-emerald text-black shadow-glow-emerald'
                : 'text-slate-400 hover:text-slate-100'
            }`}
          >
            Athlete Pool ({registeredPool.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('teams')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
              activeTab === 'teams'
                ? 'bg-brand-emerald text-black shadow-glow-emerald'
                : 'text-slate-400 hover:text-slate-100'
            }`}
          >
            Registered Clans ({registeredClans.length})
          </button>
        </div>

        {/* Tab 1: Overview & Registration */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-dark-card border border-dark-border rounded-3xl p-6 space-y-4">
                <h3 className="font-gaming text-xl font-bold text-slate-100 uppercase">
                  Tournament Overview & Draft Structure
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  The {auction.title} represents the premier competitive drafting ground for Tier 1 {auction.gameName} athletes. Participating clan managers must maintain strict adherence to roster limitations, squad roles (IGL, Assaulters, Support), and team purse limits.
                </p>
                <div className="space-y-2 pt-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-200">
                    <CheckCircle className="w-4 h-4 text-brand-emerald" />
                    <span>Real-time Socket.IO synchronization with 30s digital gavel clock.</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-200">
                    <CheckCircle className="w-4 h-4 text-brand-emerald" />
                    <span>Server-side atomic budget verification and instant roster locks.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Registration Box */}
            <div className="bg-dark-card border border-brand-emerald/40 rounded-3xl p-6 space-y-4 shadow-glow-emerald">
              <h3 className="font-gaming text-xl font-bold text-slate-100 uppercase">
                Athlete Registration
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Eligible gamers can submit their verified in-game UID and accolades to join the auction pool.
              </p>

              {registered ? (
                <div className="p-4 bg-brand-emerald/15 border border-brand-emerald/40 rounded-2xl text-center space-y-1">
                  <UserCheck className="w-8 h-8 text-brand-emerald mx-auto" />
                  <p className="font-gaming text-base font-bold text-slate-100">Registered Successfully!</p>
                  <p className="text-[11px] text-slate-300">Your profile is placed in the active lot queue.</p>
                </div>
              ) : (
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => setRegistered(true)}
                  className="w-full gap-2"
                >
                  <Zap className="w-4 h-4" />
                  <span>Register as Athlete</span>
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Athlete Pool */}
        {activeTab === 'pool' && (
          <div className="bg-dark-card border border-dark-border rounded-3xl p-6 space-y-4">
            <h3 className="font-gaming text-xl font-bold text-slate-100 uppercase">
              Approved Athletes in Draft Queue
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {registeredPool.map((p) => (
                <div key={p.id} className="bg-dark-surface p-4 rounded-2xl border border-dark-border space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-brand-emerald font-bold uppercase">{p.role}</span>
                    <span className="text-[11px] font-mono text-brand-gold font-bold">{formatCurrency(p.basePrice)}</span>
                  </div>
                  <h4 className="font-gaming text-lg font-bold text-slate-100">{p.name}</h4>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>K/D: {p.kd}</span>
                    <span>Tier: {p.tier}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Registered Clans */}
        {activeTab === 'teams' && (
          <div className="bg-dark-card border border-dark-border rounded-3xl p-6 space-y-4">
            <h3 className="font-gaming text-xl font-bold text-slate-100 uppercase">
              Registered Esports Clans
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {registeredClans.map((c) => (
                <div key={c.id} className="bg-dark-surface p-4 rounded-2xl border border-dark-border space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-brand-crimson">{c.tag}</span>
                    <span className="font-mono text-xs font-bold text-brand-emerald">{formatCurrency(c.purse)}</span>
                  </div>
                  <h4 className="font-gaming text-lg font-bold text-slate-100">{c.name}</h4>
                  <p className="text-xs text-slate-400">Owner: {c.owner}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuctionDetail;

