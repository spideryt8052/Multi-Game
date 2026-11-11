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
  ShieldCheck,
  Calendar,
  Users,
  Trophy,
  BookOpen,
  ArrowRight,
  UserCheck,
  Zap,
  CheckCircle,
  MapPin,
  Clock,
  DollarSign,
  AlertTriangle,
  AlertCircle,
  FileText,
  CreditCard,
  Sparkles,
  Award,
  Check,
} from 'lucide-react';

const AuctionDetail = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();

  // Look up in localStorage first (for custom created tournaments), then in MOCK_AUCTIONS
  const [auction, setAuction] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('user_hosted_tournaments') || '[]');
      const foundInStorage = stored.find((a) => a._id === id || a.gameSlug === id);
      if (foundInStorage) return foundInStorage;
    } catch (e) {
      console.error(e);
    }
    return MOCK_AUCTIONS.find((a) => a._id === id || a.gameSlug === id) || MOCK_AUCTIONS[0];
  });

  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'rules', 'pool', 'teams'
  const [registered, setRegistered] = useState(false);
  const [showTeamRegisterModal, setShowTeamRegisterModal] = useState(false);
  const [teamRegistrationSuccess, setTeamRegistrationSuccess] = useState(false);

  const [teamForm, setTeamForm] = useState({
    teamName: 'Bandra Super Strikers',
    tag: 'BSS',
    captainName: user?.fullName || 'Sameer Sheikh',
    contactNumber: '9820192831',
    playerCount: 6,
  });

  const [registeredClans, setRegisteredClans] = useState([
    { id: 'c1', name: 'GodLike Esports', tag: 'GODL', purse: 50000, owner: 'Kronten', feePaid: true },
    { id: 'c2', name: 'Team Soul', tag: 'SOUL', purse: 50000, owner: 'Mortal', feePaid: true },
    { id: 'c3', name: 'Blind Esports', tag: 'BLIND', purse: 50000, owner: 'BigBrother', feePaid: true },
  ]);

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

  const entryFee = auction.entryFee || 2500;
  const prizePool = auction.prizePool || {
    total: 100000,
    first: 50000,
    second: 25000,
    third: 15000,
    mvpAwards: 10000,
    distributionNote: 'Instant UPI payout within 24 hours of Grand Final conclusion',
  };

  const adminSlot = auction.adminSlot || {
    tier: 'Gold Championship Slot',
    feePaid: 3499,
    licenseNumber: 'LIC-ADMIN-8492',
    slotCapacity: 16,
    isApproved: true,
  };

  const externalRules = auction.externalRules || [
    {
      category: 'Reporting & Toss Policy',
      title: 'Strict Toss Grace Period & Walkover Penalty',
      description: 'Teams must report at the turf 30 minutes before scheduled slot. More than 15 minutes delay results in toss walkover.',
      penalty: 'Walkover / 1 over deduction per 5 mins delay',
      mandatory: true,
    },
    {
      category: 'Uniform & Equipment',
      title: 'Mandatory Team Jersey & Rubber-Stud Turf Shoes',
      description: 'Every player must wear identical team colored jerseys. Metal spikes strictly prohibited.',
      penalty: 'Ineligible to take the field / Yellow card',
      mandatory: true,
    },
    {
      category: 'Conduct & Fair Play',
      title: 'Zero Tolerance for Umpire Dissent',
      description: 'The on-field umpire has final say on all calls. Dissent results in 10-run penalty.',
      penalty: '10-Run Penalty + Tournament Ban for repeat offenses',
      mandatory: true,
    },
  ];

  const matchFormat = auction.matchFormat || {
    overs: '10 Overs a Side',
    ballType: 'Heavy Tennis Cosco Red',
    bowlersLimit: 'Max 2 overs per bowler, powerplay 3 overs',
  };

  const venueOrServer = auction.venueOrServer || {
    type: 'physical_turf',
    venueName: 'Urban Turf Arena, Bandra West',
    address: 'Plot 18, Opp. Reclamation Sea View, Bandra West, Mumbai 400050',
    reportingTime: '08:30 AM IST (Toss strictly at 08:45 AM)',
    amenities: ['Floodlights', 'Dressing Rooms', 'Live YouTube Broadcast', 'First Aid Station'],
  };

  const handleRegisterTeamSubmit = (e) => {
    e.preventDefault();
    const newClan = {
      id: `c_${Date.now()}`,
      name: teamForm.teamName,
      tag: teamForm.tag,
      purse: auction.teamBudgetLimit || 50000,
      owner: teamForm.captainName,
      feePaid: true,
    };
    setRegisteredClans((prev) => [newClan, ...prev]);
    setTeamRegistrationSuccess(true);
    setTimeout(() => {
      setShowTeamRegisterModal(false);
      setTeamRegistrationSuccess(false);
    }, 2000);
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Banner */}
      <div className="relative h-80 sm:h-[420px] w-full overflow-hidden bg-dark-card border-b border-dark-border">
        <img
          src={auction.bannerImage}
          alt={auction.title}
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/60 to-transparent" />

        <div className="absolute bottom-6 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-dark-surface border border-dark-border text-slate-200">
                  {auction.gameName}
                </span>

                {/* Admin Slot License Badge */}
                <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-mono font-bold bg-brand-emerald/15 text-brand-emerald border border-brand-emerald/40 shadow-glow-emerald/30">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-emerald" />
                  <span>Verified License: {adminSlot.licenseNumber}</span>
                </div>

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

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
                <p>
                  Organized by: <span className="text-slate-100 font-semibold">{auction.organizerName}</span>
                </p>
                <span>•</span>
                <p>
                  Scheduled: <span className="text-brand-emerald font-semibold">{formatDate(auction.startTime)}</span>
                </p>
                <span>•</span>
                <p>
                  Admin Slot: <span className="text-brand-gold font-semibold">{adminSlot.tier}</span>
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Button
                variant="primary"
                size="lg"
                onClick={() => setShowTeamRegisterModal(true)}
                className="gap-2 shadow-glow-emerald w-full sm:w-auto"
              >
                <CreditCard className="w-5 h-5" />
                <span>Register Team ({formatCurrency(entryFee)})</span>
              </Button>

              <Link to={`/auctions/live/${auction._id}`} className="w-full sm:w-auto">
                <Button variant="danger" size="lg" className="gap-2 shadow-glow-crimson w-full">
                  <Flame className="w-5 h-5 animate-pulse" />
                  <span>Live Auction Room</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Quick Highlights Strip */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-dark-card border border-brand-emerald/40 p-4 rounded-2xl shadow-glow-emerald/10">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Team Registration Fee</span>
            <span className="font-gaming text-2xl font-black text-brand-emerald mt-0.5 block">
              {formatCurrency(entryFee)}
            </span>
            <span className="text-[10px] text-slate-400">set by Organizer</span>
          </div>

          <div className="bg-dark-card border border-brand-gold/40 p-4 rounded-2xl shadow-glow-gold/10">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Total Prize Pool</span>
            <span className="font-gaming text-2xl font-black text-brand-gold mt-0.5 block">
              {formatCurrency(prizePool.total)}
            </span>
            <span className="text-[10px] text-slate-400">1st: {formatCurrency(prizePool.first)}</span>
          </div>

          <div className="bg-dark-card border border-dark-border p-4 rounded-2xl">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Team Purse Cap</span>
            <span className="font-gaming text-xl font-bold text-brand-cyan mt-0.5 block">
              {formatCurrency(auction.teamBudgetLimit || 50000)}
            </span>
            <span className="text-[10px] text-slate-400">for live player bidding</span>
          </div>

          <div className="bg-dark-card border border-dark-border p-4 rounded-2xl">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Admin Slot Tier</span>
            <span className="font-gaming text-base font-bold text-slate-100 mt-0.5 block truncate">
              {adminSlot.tier}
            </span>
            <span className="text-[10px] text-brand-emerald font-semibold">✓ Verified Platform License</span>
          </div>

          <div className="bg-dark-card border border-dark-border p-4 rounded-2xl">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">External Rules</span>
            <span className="font-gaming text-xl font-bold text-slate-100 mt-0.5 block">
              {externalRules.length} Verified Rules
            </span>
            <span className="text-[10px] text-slate-400">Turf, Toss, Conduct</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center gap-2 border-b border-dark-border pb-3">
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
            onClick={() => setActiveTab('rules')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
              activeTab === 'rules'
                ? 'bg-brand-emerald text-black shadow-glow-emerald'
                : 'text-slate-400 hover:text-slate-100'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Organizer External Rules ({externalRules.length})</span>
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
            Registered Teams ({registeredClans.length})
          </button>
        </div>

        {/* TAB 1: OVERVIEW & PRIZE POOL */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Tournament General Overview */}
              <div className="bg-dark-card border border-dark-border rounded-3xl p-6 sm:p-8 space-y-4">
                <h3 className="font-gaming text-xl font-bold text-slate-100 uppercase">
                  Tournament Overview & Draft Structure
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  The {auction.title} represents the premier competitive drafting ground for {auction.gameName}. Participating team managers must maintain strict adherence to roster limitations, squad roles, and team purse limits.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
                  <div className="p-3.5 rounded-2xl bg-dark-surface border border-dark-border space-y-1">
                    <span className="text-slate-400 block font-semibold">Match / Innings Format</span>
                    <span className="font-bold text-slate-100 block">
                      {matchFormat.overs || matchFormat.maps || matchFormat.boardsCount || 'Standard Format'}
                    </span>
                    <span className="text-[11px] text-brand-emerald">
                      {matchFormat.ballType || matchFormat.pointSystem || 'Official Regulations'}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-dark-surface border border-dark-border space-y-1">
                    <span className="text-slate-400 block font-semibold">Admin Slot License</span>
                    <span className="font-bold text-brand-gold block font-mono">
                      {adminSlot.licenseNumber}
                    </span>
                    <span className="text-[11px] text-slate-300">
                      Capacity: {adminSlot.slotCapacity || 16} Franchises
                    </span>
                  </div>
                </div>
              </div>

              {/* Venue / Ground Info */}
              <div className="bg-dark-card border border-dark-border rounded-3xl p-6 sm:p-8 space-y-4">
                <h3 className="font-gaming text-lg font-bold text-slate-100 uppercase flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-brand-crimson" />
                  <span>Venue, Ground & Reporting Information</span>
                </h3>

                <div className="p-4 rounded-2xl bg-dark-surface border border-dark-border space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-100 text-sm">{venueOrServer.venueName}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-brand-emerald/15 text-brand-emerald">
                      {venueOrServer.type === 'physical_turf' ? 'Physical Turf' : 'Esports Server'}
                    </span>
                  </div>
                  <p className="text-slate-400">{venueOrServer.address}</p>

                  <div className="pt-2 border-t border-dark-border flex items-center gap-2 text-slate-300">
                    <Clock className="w-4 h-4 text-brand-emerald" />
                    <span><strong className="text-slate-100">Reporting Time:</strong> {venueOrServer.reportingTime}</span>
                  </div>

                  {venueOrServer.amenities && (
                    <div className="pt-2 flex flex-wrap gap-1.5">
                      {(Array.isArray(venueOrServer.amenities)
                        ? venueOrServer.amenities
                        : [venueOrServer.amenities]
                      ).map((amenity, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md text-[10px] bg-dark-card border border-dark-border text-slate-300">
                          ✓ {amenity}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Prize Pool Breakdown & Registration Callout */}
            <div className="space-y-6">
              {/* Prize Pool Breakdown Card */}
              <div className="bg-dark-card border border-brand-gold/40 rounded-3xl p-6 space-y-5 shadow-glow-gold/10">
                <div className="flex items-center justify-between">
                  <h3 className="font-gaming text-lg font-bold text-slate-100 uppercase flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-brand-gold" />
                    <span>Prize Pool Breakdown</span>
                  </h3>
                  <span className="font-gaming font-black text-brand-gold text-lg">
                    {formatCurrency(prizePool.total)}
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-brand-gold/10 border border-brand-gold/30">
                    <div className="flex items-center gap-2">
                      <span className="text-base">🥇</span>
                      <span className="font-bold text-slate-100">1st Place (Champion)</span>
                    </div>
                    <span className="font-gaming font-extrabold text-brand-gold text-base">
                      {formatCurrency(prizePool.first)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-400/10 border border-slate-400/30">
                    <div className="flex items-center gap-2">
                      <span className="text-base">🥈</span>
                      <span className="font-bold text-slate-100">2nd Place (Runner-up)</span>
                    </div>
                    <span className="font-gaming font-bold text-slate-200">
                      {formatCurrency(prizePool.second)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-amber-700/10 border border-amber-700/30">
                    <div className="flex items-center gap-2">
                      <span className="text-base">🥉</span>
                      <span className="font-bold text-slate-100">3rd Place</span>
                    </div>
                    <span className="font-gaming font-bold text-amber-500">
                      {formatCurrency(prizePool.third)}
                    </span>
                  </div>

                  {prizePool.mvpAwards > 0 && (
                    <div className="flex items-center justify-between p-3 rounded-xl bg-brand-cyan/10 border border-brand-cyan/30">
                      <div className="flex items-center gap-2">
                        <span className="text-base">🎖️</span>
                        <span className="font-bold text-slate-100">MVP / Best Striker Awards</span>
                      </div>
                      <span className="font-gaming font-bold text-brand-cyan">
                        {formatCurrency(prizePool.mvpAwards)}
                      </span>
                    </div>
                  )}
                </div>

                <p className="text-[11px] text-slate-400 italic">
                  Note: {prizePool.distributionNote || 'Official UPI disbursement within 24 hours of trophy presentation.'}
                </p>
              </div>

              {/* Team Entry Fee Card */}
              <div className="bg-dark-card border border-brand-emerald/40 rounded-3xl p-6 space-y-4 shadow-glow-emerald">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                    Franchise Registration
                  </span>
                  <div className="flex items-baseline justify-between">
                    <h4 className="font-gaming text-2xl font-black text-brand-emerald">
                      {formatCurrency(entryFee)}
                    </h4>
                    <span className="text-xs text-slate-400">per team slot</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Participating teams receive an official live auction purse of {formatCurrency(auction.teamBudgetLimit || 50000)} to bid and acquire athletes.
                </p>

                <Button
                  variant="primary"
                  size="md"
                  onClick={() => setShowTeamRegisterModal(true)}
                  className="w-full gap-2 font-gaming"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Register & Secure Team Slot</span>
                </Button>

                {/* Athlete Registration */}
                <div className="border-t border-dark-border pt-4">
                  {registered ? (
                    <div className="p-3 bg-brand-emerald/15 border border-brand-emerald/40 rounded-xl text-center text-xs text-brand-emerald font-bold">
                      ✓ Registered in Athlete Auction Pool
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setRegistered(true)}
                      className="w-full gap-2 text-xs"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>Register as Individual Player</span>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ORGANIZER EXTERNAL RULES */}
        {activeTab === 'rules' && (
          <div className="space-y-6">
            <div className="bg-dark-card border border-dark-border rounded-3xl p-6 sm:p-8 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-6 h-6 text-brand-emerald" />
                    <h3 className="font-gaming text-2xl font-bold text-slate-100 uppercase">
                      Organizer External Tournament Rules & Conduct
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Yeh rules tournament host (<span className="text-slate-200 font-semibold">{auction.organizerName}</span>) dwara turf, toss, dress code, substitutes, aur penalties ke liye enforce kiye gaye hain.
                  </p>
                </div>

                <div className="px-3.5 py-1.5 rounded-xl bg-dark-surface border border-brand-emerald/40 text-brand-emerald font-mono text-xs font-bold text-center">
                  Admin Verified Contract
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {externalRules.map((rule, idx) => (
                <div
                  key={idx}
                  className="bg-dark-card border border-dark-border rounded-3xl p-6 space-y-3 hover:border-slate-600 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-brand-emerald/15 text-brand-emerald border border-brand-emerald/30">
                        {rule.category}
                      </span>
                      {rule.mandatory && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-brand-crimson/15 text-brand-crimson border border-brand-crimson/30">
                          Strictly Enforced
                        </span>
                      )}
                    </div>

                    <h4 className="font-gaming text-lg font-bold text-slate-100">
                      {rule.title}
                    </h4>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {rule.description}
                    </p>
                  </div>

                  {rule.penalty && (
                    <div className="p-3 rounded-2xl bg-dark-surface border border-dark-border flex items-start gap-2.5 text-xs mt-3">
                      <AlertTriangle className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Penalty for Violation:</span>
                        <span className="text-brand-gold font-semibold">{rule.penalty}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="p-5 rounded-2xl bg-dark-surface border border-dark-border flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-brand-emerald" />
                <span>Any rule dispute will be arbitrated directly by the Chief Tournament Referee and Platform Admin.</span>
              </div>
              <span className="text-brand-emerald font-semibold">Organized by {auction.organizerName}</span>
            </div>
          </div>
        )}

        {/* TAB 3: ATHLETE POOL */}
        {activeTab === 'pool' && (
          <div className="bg-dark-card border border-dark-border rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-gaming text-xl font-bold text-slate-100 uppercase">
                Approved Athletes in Draft Queue ({registeredPool.length})
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRegistered(true)}
                className="gap-1.5 text-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Join Athlete Pool</span>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {registeredPool.map((p) => (
                <div key={p.id} className="bg-dark-surface p-5 rounded-2xl border border-dark-border space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-brand-emerald font-bold uppercase tracking-wider">{p.role}</span>
                    <span className="text-xs font-mono text-brand-gold font-bold">{formatCurrency(p.basePrice)}</span>
                  </div>
                  <h4 className="font-gaming text-lg font-bold text-slate-100">{p.name}</h4>
                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-dark-border">
                    <span>Performance: {p.kd}</span>
                    <span>Tier: {p.tier}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: REGISTERED CLANS */}
        {activeTab === 'teams' && (
          <div className="bg-dark-card border border-dark-border rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-gaming text-xl font-bold text-slate-100 uppercase">
                  Registered Franchises & Teams ({registeredClans.length})
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Teams that have paid the {formatCurrency(entryFee)} registration fee to the organizer.
                </p>
              </div>

              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowTeamRegisterModal(true)}
                className="gap-1.5 text-xs shadow-glow-emerald"
              >
                <Plus className="w-4 h-4" />
                <span>Register Team</span>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {registeredClans.map((c) => (
                <div key={c.id} className="bg-dark-surface p-5 rounded-2xl border border-dark-border space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-brand-crimson">{c.tag}</span>
                    <div className="flex items-center gap-1 text-[10px] text-brand-emerald font-bold">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Entry Fee Paid</span>
                    </div>
                  </div>
                  <h4 className="font-gaming text-lg font-bold text-slate-100">{c.name}</h4>
                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-dark-border">
                    <span>Owner: {c.owner}</span>
                    <span className="font-mono font-bold text-brand-emerald">{formatCurrency(c.purse)} Purse</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* TEAM REGISTRATION & ENTRY FEE PAYMENT MODAL */}
      {showTeamRegisterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-dark-card border border-brand-emerald/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-glow-emerald">
            <div className="flex items-center justify-between border-b border-dark-border pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-emerald/15 border border-brand-emerald/30 text-brand-emerald flex items-center justify-center font-bold">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-gaming text-lg font-bold text-slate-100">
                    Register Franchise Team
                  </h3>
                  <p className="text-xs text-slate-400">{auction.title}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowTeamRegisterModal(false)}
                className="text-slate-400 hover:text-slate-100 text-sm p-1"
              >
                ✕
              </button>
            </div>

            {teamRegistrationSuccess ? (
              <div className="p-6 rounded-2xl bg-brand-emerald/20 border border-brand-emerald/40 text-center space-y-3 animate-fadeIn">
                <div className="w-12 h-12 rounded-full bg-brand-emerald text-black flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <h4 className="font-gaming text-xl font-bold text-slate-100">Team Registered Successfully!</h4>
                <p className="text-xs text-slate-300">
                  Entry fee of {formatCurrency(entryFee)} received by {auction.organizerName}. Your purse budget of {formatCurrency(auction.teamBudgetLimit || 50000)} is unlocked in the Live Auction Room.
                </p>
              </div>
            ) : (
              <form onSubmit={handleRegisterTeamSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Franchise / Team Name</label>
                  <input
                    type="text"
                    value={teamForm.teamName}
                    onChange={(e) => setTeamForm({ ...teamForm, teamName: e.target.value })}
                    className="w-full bg-dark-surface border border-dark-border rounded-xl px-3 py-2 text-slate-100 font-gaming"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Team Tag (3-4 Letters)</label>
                    <input
                      type="text"
                      maxLength={4}
                      value={teamForm.tag}
                      onChange={(e) => setTeamForm({ ...teamForm, tag: e.target.value.toUpperCase() })}
                      className="w-full bg-dark-surface border border-dark-border rounded-xl px-3 py-2 text-slate-100 uppercase font-mono"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Squad Size / Players</label>
                    <input
                      type="number"
                      value={teamForm.playerCount}
                      onChange={(e) => setTeamForm({ ...teamForm, playerCount: e.target.value })}
                      className="w-full bg-dark-surface border border-dark-border rounded-xl px-3 py-2 text-slate-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Team Owner / Captain</label>
                    <input
                      type="text"
                      value={teamForm.captainName}
                      onChange={(e) => setTeamForm({ ...teamForm, captainName: e.target.value })}
                      className="w-full bg-dark-surface border border-dark-border rounded-xl px-3 py-2 text-slate-100"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Contact / WhatsApp</label>
                    <input
                      type="text"
                      value={teamForm.contactNumber}
                      onChange={(e) => setTeamForm({ ...teamForm, contactNumber: e.target.value })}
                      className="w-full bg-dark-surface border border-dark-border rounded-xl px-3 py-2 text-slate-100"
                      required
                    />
                  </div>
                </div>

                {/* Entry fee invoice box */}
                <div className="p-4 rounded-2xl bg-dark-surface border border-dark-border space-y-2">
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Organizer Entry Fee:</span>
                    <span className="font-gaming font-bold text-brand-emerald text-base">
                      {formatCurrency(entryFee)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400 text-[11px]">
                    <span>Allocated Auction Purse:</span>
                    <span className="font-mono text-brand-cyan">
                      {formatCurrency(auction.teamBudgetLimit || 50000)} pts
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="md"
                    className="w-1/2"
                    onClick={() => setShowTeamRegisterModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    className="w-1/2 gap-2 shadow-glow-emerald"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Pay {formatCurrency(entryFee)} & Confirm</span>
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AuctionDetail;
