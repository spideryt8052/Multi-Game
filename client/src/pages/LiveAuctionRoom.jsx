import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../context/LanguageContext';
import { MOCK_AUCTIONS } from '../utils/mockData';
import { formatCurrency } from '../utils/formatCurrency';
import { playBidSound, playSoldHammerSound, playTickSound, playWarningSound } from '../utils/soundEffects';
import {
  SQUAD_RULES_CONFIG,
  evaluateSquadCompliance,
  validatePurseAndSquadLimits,
} from '../utils/squadRulesConfig';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import confetti from 'canvas-confetti';
import {
  Flame,
  Shield,
  Clock,
  TrendingUp,
  User,
  Users,
  Trophy,
  Award,
  Zap,
  Volume2,
  VolumeX,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  ArrowLeft,
  Gavel,
  Sparkles,
  Bot,
  Activity,
  BookOpen,
  Check,
  X,
  Target,
  ChevronRight,
  Eye,
} from 'lucide-react';

const LiveAuctionRoom = () => {
  const { id } = useParams();
  const { socket, connected } = useSocket();
  const { user, isAuthenticated, hasRole } = useAuth();
  const { t } = useTranslation();

  // Find auction or fallback to mock
  const initialAuction =
    MOCK_AUCTIONS.find((a) => a._id === id || a.gameSlug === id) || MOCK_AUCTIONS[0];

  const [auction, setAuction] = useState(initialAuction);
  const [currentLot, setCurrentLot] = useState(initialAuction.currentLot);
  const [biddingHistory, setBiddingHistory] = useState(initialAuction.biddingHistory || []);
  const [secondsLeft, setSecondsLeft] = useState(25);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [bidError, setBidError] = useState('');
  const [bidWarning, setBidWarning] = useState('');
  const [customBidInput, setCustomBidInput] = useState('');
  const [lotResult, setLotResult] = useState(null);
  const [simulatedRivalsActive, setSimulatedRivalsActive] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);

  // Is this a physical sport or esports lot?
  const isPhysicalSport =
    auction.categoryType === 'physical_sports' ||
    auction.gameSlug === 'cricket' ||
    auction.gameSlug === 'football' ||
    auction.gameSlug === 'kabaddi';

  // Team wallet and active squad
  const [myTeam, setMyTeam] = useState(() => {
    if (auction.gameSlug === 'cricket') {
      return {
        _id: 'team_mumbai_titans',
        name: 'Mumbai Titans',
        tag: 'MT',
        remainingBudget: 67500,
        roster: [
          { name: 'Virat_Sharma', role: 'Batsman', acquiredPrice: 12000 },
          { name: 'Shikhar_Rao', role: 'Batsman', acquiredPrice: 8500 },
          { name: 'Hardik_Patel', role: 'All-Rounder', acquiredPrice: 15000 },
          { name: 'Mohammed_Siraj', role: 'Bowler', acquiredPrice: 9000 },
          { name: 'Yuzvendra_Chahal', role: 'Bowler', acquiredPrice: 10500 },
        ],
      };
    }
    return {
      _id: 'team_godl',
      name: 'GodLike Esports',
      tag: 'GODL',
      remainingBudget: 38500,
      roster: [
        { name: 'GodL_ClutchGod', role: 'IGL', acquiredPrice: 12500 },
        { name: 'GodL_Jonathan', role: 'Assaulter', acquiredPrice: 18000 },
      ],
    };
  });

  // Calculate live squad compliance against tournament rules
  const compliance = evaluateSquadCompliance(myTeam.roster, auction.gameSlug);
  const activeGameConfig = SQUAD_RULES_CONFIG[auction.gameSlug] || SQUAD_RULES_CONFIG.cricket;
  const currentLotRole = currentLot?.participant?.primaryRole || '';

  // Check if current lot matches any role currently needed by the squad
  const matchingNeededRole = compliance.roleBreakdown.find((r) => {
    const pRole = currentLotRole.toLowerCase();
    if (r.roleId === 'batsman' && pRole.includes('bat') && !pRole.includes('wicket') && !pRole.includes('all-round')) return r.needed > 0;
    if (r.roleId === 'bowler' && (pRole.includes('bowl') || pRole.includes('pace') || pRole.includes('spin'))) return r.needed > 0;
    if (r.roleId === 'all_rounder' && (pRole.includes('all-round') || pRole.includes('allrounder'))) return r.needed > 0;
    if (r.roleId === 'wicketkeeper' && (pRole.includes('wicket') || pRole.includes('wk'))) return r.needed > 0;
    if (r.roleId === 'igl' && pRole.includes('igl')) return r.needed > 0;
    if (r.roleId === 'assaulter' && (pRole.includes('assault') || pRole.includes('entry'))) return r.needed > 0;
    if (r.roleId === 'sniper' && (pRole.includes('sniper') || pRole.includes('dmr'))) return r.needed > 0;
    if (r.roleId === 'duelist' && pRole.includes('duelist')) return r.needed > 0;
    return false;
  });

  const participatingTeams =
    auction.gameSlug === 'cricket'
      ? [
          { id: 't1', name: 'Mumbai Titans', tag: 'MT', budget: 67500, isMe: true },
          { id: 't2', name: 'Bandra Blasters', tag: 'BB', budget: 74000, isMe: false },
          { id: 't3', name: 'Andheri Warriors', tag: 'AW', budget: 80000, isMe: false },
          { id: 't4', name: 'Pune Smashers', tag: 'PS', budget: 52000, isMe: false },
        ]
      : [
          { id: 't1', name: 'GodLike Esports', tag: 'GODL', budget: 38500, isMe: true },
          { id: 't2', name: 'Team Soul', tag: 'SOUL', budget: 42000, isMe: false },
          { id: 't3', name: 'Blind Esports', tag: 'BLIND', budget: 29500, isMe: false },
          { id: 't4', name: 'Global Esports', tag: 'GE', budget: 35000, isMe: false },
        ];

  // Socket setup & event listeners
  useEffect(() => {
    if (!socket) return;

    socket.emit('auction:join_room', {
      auctionId: auction._id,
      userId: user?._id || 'guest',
      teamId: myTeam._id,
    });

    socket.on('auction:new_bid', (bidData) => {
      setCurrentLot((prev) => ({
        ...prev,
        currentBid: bidData.amount,
        currentBidderTeam: { name: bidData.teamName, tag: bidData.teamTag },
        lotEndsAt: bidData.newLotEndsAt,
      }));

      setBiddingHistory((prev) => [
        {
          id: `bid_${Date.now()}`,
          amount: bidData.amount,
          teamName: bidData.teamName,
          time: new Date().toLocaleTimeString(),
        },
        ...prev,
      ]);

      setSecondsLeft(25);
      if (soundEnabled) playBidSound();
    });

    socket.on('auction:timer_tick', ({ seconds }) => {
      setSecondsLeft(seconds);
    });

    socket.on('auction:lot_sold', (soldData) => {
      handleLotSoldEffect(soldData);
    });

    socket.on('auction:lot_unsold', () => {
      setLotResult({ type: 'unsold' });
    });

    socket.on('auction:bid_rejected', ({ reason }) => {
      setBidError(reason);
      setTimeout(() => setBidError(''), 4000);
    });

    return () => {
      socket.emit('auction:leave_room', { auctionId: auction._id });
      socket.off('auction:new_bid');
      socket.off('auction:timer_tick');
      socket.off('auction:lot_sold');
      socket.off('auction:lot_unsold');
      socket.off('auction:bid_rejected');
    };
  }, [socket, auction._id, user, myTeam._id, soundEnabled]);

  // Local ticker countdown with audio ticks
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) return 0;
        if (prev <= 5 && soundEnabled) playTickSound();
        if (prev === 10 && soundEnabled) playWarningSound();
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [soundEnabled]);

  // Simulated Rival Bids (for solo live testing)
  useEffect(() => {
    if (!simulatedRivalsActive || secondsLeft <= 3 || lotResult) return;

    const rivalClans =
      auction.gameSlug === 'cricket'
        ? [
            { name: 'Bandra Blasters', tag: 'BB' },
            { name: 'Andheri Warriors', tag: 'AW' },
            { name: 'Pune Smashers', tag: 'PS' },
          ]
        : [
            { name: 'Team Soul', tag: 'SOUL' },
            { name: 'Blind Esports', tag: 'BLIND' },
            { name: 'Global Esports', tag: 'GE' },
          ];

    const interval = setInterval(() => {
      const currentHighest = currentLot?.currentBid || auction.startingBid;
      const increment = auction.minimumIncrement || 250;
      const rival = rivalClans[Math.floor(Math.random() * rivalClans.length)];
      const newAmount = currentHighest + increment;

      if (currentLot?.currentBidderTeam?.name !== rival.name && newAmount < 150000) {
        if (soundEnabled) playBidSound();

        setCurrentLot((prev) => ({
          ...prev,
          currentBid: newAmount,
          currentBidderTeam: rival,
        }));

        setBiddingHistory((prev) => [
          {
            id: `bid_${Date.now()}`,
            amount: newAmount,
            teamName: rival.name,
            time: new Date().toLocaleTimeString(),
          },
          ...prev,
        ]);

        setSecondsLeft(25);
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [simulatedRivalsActive, secondsLeft, currentLot, auction, lotResult, soundEnabled]);

  const handleLotSoldEffect = (soldData) => {
    const finalPrice = soldData?.finalPrice || currentLot?.currentBid;
    const winnerTeam = soldData?.teamName || currentLot?.currentBidderTeam?.name || 'Winning Franchise';

    setLotResult({
      type: 'sold',
      teamName: winnerTeam,
      amount: finalPrice,
      athleteName: currentLot?.participant?.inGameName,
    });

    // If my franchise won this player, add to roster & deduct purse
    if (winnerTeam === myTeam.name || currentLot?.currentBidderTeam?.name === myTeam.name) {
      setMyTeam((prev) => ({
        ...prev,
        remainingBudget: Math.max(0, prev.remainingBudget - finalPrice),
        roster: [
          ...prev.roster,
          {
            name: currentLot?.participant?.inGameName || 'Acquired Athlete',
            role: currentLot?.participant?.primaryRole || 'Player',
            acquiredPrice: finalPrice,
          },
        ],
      }));
    }

    if (soundEnabled) playSoldHammerSound();

    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.55 },
    });
  };

  // Quick Bid Calculator
  const currentBid = currentLot?.currentBid || auction.startingBid;
  const increment = auction.minimumIncrement || 250;

  const quickBidOptions = [
    currentBid + increment,
    currentBid + increment * 2,
    currentBid + increment * 4,
  ];

  const handlePlaceBid = (amount) => {
    setBidError('');
    setBidWarning('');

    if (!isAuthenticated) {
      setBidError('Please sign in to place live auction bids.');
      return;
    }

    if (amount <= currentBid) {
      setBidError(`Bid must be greater than current bid of ${formatCurrency(currentBid)}`);
      return;
    }

    // Validate using official tournament & purse reserve rules
    const validation = validatePurseAndSquadLimits(
      myTeam,
      currentLot?.participant,
      amount,
      auction.gameSlug
    );

    if (!validation.isValid) {
      setBidError(validation.errors[0]);
      setTimeout(() => setBidError(''), 5000);
      return;
    }

    if (validation.warnings.length > 0) {
      setBidWarning(validation.warnings[0]);
      setTimeout(() => setBidWarning(''), 6000);
    }

    if (soundEnabled) playBidSound();

    // Emit live event to backend
    if (socket && connected) {
      socket.emit('auction:place_bid', {
        auctionId: auction._id,
        lotId: currentLot?.participant?._id,
        amount,
        teamId: myTeam._id,
        teamName: myTeam.name,
        teamTag: myTeam.tag,
      });
    }

    // Client update
    setCurrentLot((prev) => ({
      ...prev,
      currentBid: amount,
      currentBidderTeam: { name: myTeam.name, tag: myTeam.tag },
    }));

    setBiddingHistory((prev) => [
      {
        id: `bid_${Date.now()}`,
        amount,
        teamName: myTeam.name,
        time: new Date().toLocaleTimeString(),
      },
      ...prev,
    ]);

    setSecondsLeft(25);
  };

  const handleCustomBidSubmit = (e) => {
    e.preventDefault();
    const val = parseInt(customBidInput, 10);
    if (isNaN(val)) return;
    handlePlaceBid(val);
    setCustomBidInput('');
  };

  // Admin Hammer Actions
  const handleAdminHammerSold = () => {
    handleLotSoldEffect({
      finalPrice: currentBid,
      teamName: currentLot?.currentBidderTeam?.name || myTeam.name,
    });

    if (socket && connected) {
      socket.emit('auction:admin_hammer_sold', {
        auctionId: auction._id,
        lotId: currentLot?.participant?._id,
        teamId: myTeam._id,
        finalPrice: currentBid,
      });
    }
  };

  const handleResetNextLot = () => {
    setLotResult(null);
    setSecondsLeft(30);

    if (auction.gameSlug === 'cricket') {
      setCurrentLot({
        participant: {
          _id: 'part_cric_02',
          inGameName: 'Jasprit_Bumrah',
          inGameId: 'Jersey #93',
          primaryRole: 'Fast Bowler (Right-Arm Fast / Yorker Specialist)',
          basePrice: 15000,
          wickets: 68,
          bowlingEconomy: 5.4,
          strikeRate: 14.2,
          runsScored: 180,
          matchesPlayed: 48,
          tierRank: 'National Tier 1',
          esportsTrophies: ['Purple Cap Winner', 'Death Overs Specialist'],
          photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop',
        },
        currentBid: 15000,
        currentBidderTeam: null,
        lotStatus: 'bidding',
      });
    } else {
      setCurrentLot({
        participant: {
          _id: 'part_bgmi_02',
          inGameName: 'GodL_Jonathan',
          inGameId: '511223344',
          primaryRole: 'Assaulter / Finisher',
          basePrice: 6000,
          kdRatio: 5.64,
          winRate: 42.1,
          tierRank: 'Conqueror Top 10',
          esportsTrophies: ['PMIS MVP', 'BGIS Champion'],
          photo: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=400&auto=format&fit=crop',
        },
        currentBid: 6000,
        currentBidderTeam: null,
        lotStatus: 'bidding',
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-dark-card border border-dark-border p-4 rounded-2xl shadow-lg">
        <div className="flex items-center gap-3">
          <Link
            to="/auctions/live"
            className="p-2 rounded-xl bg-dark-surface hover:text-brand-emerald border border-dark-border transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-gaming text-xl sm:text-2xl font-bold text-slate-100 uppercase">
                {auction.title}
              </h1>
              <Badge variant="live" pulse>
                {t('auction.live_now')}
              </Badge>
            </div>
            <p className="text-xs text-slate-400">
              Host: <span className="text-slate-200">{auction.organizerName}</span> | Sync:{' '}
              <span className={connected ? 'text-brand-emerald font-semibold' : 'text-brand-gold font-semibold'}>
                {connected ? '● Sub-Second WebSockets Live' : '○ Standby Mode'}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end flex-wrap">
          {/* Rules & Squad Balance Toggle Button */}
          <button
            type="button"
            onClick={() => setShowRulesModal(true)}
            className="px-3 py-1.5 rounded-xl border border-brand-gold/40 bg-brand-gold/10 hover:bg-brand-gold/20 text-brand-gold text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>IPL / Squad Rules</span>
          </button>

          {/* Toggle Rivals Simulation */}
          <button
            type="button"
            onClick={() => setSimulatedRivalsActive(!simulatedRivalsActive)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              simulatedRivalsActive
                ? 'bg-brand-purple/20 text-brand-purple border-brand-purple/50'
                : 'bg-dark-surface border-dark-border text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle automated rival franchise bidding for demonstration"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Rival Bots: {simulatedRivalsActive ? 'ON' : 'OFF'}</span>
          </button>

          {/* Toggle Sound */}
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2.5 rounded-xl bg-dark-surface border border-dark-border text-slate-300 hover:text-brand-emerald text-xs flex items-center gap-1.5"
            title="Toggle Audio SFX"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-brand-emerald" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            <span className="hidden sm:inline">SFX</span>
          </button>

          <div className="px-3.5 py-1.5 rounded-xl bg-dark-surface border border-brand-emerald/30 text-right">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">My Franchise Purse</span>
            <span className="font-mono text-sm font-bold text-brand-emerald">
              {formatCurrency(myTeam.remainingBudget)}
            </span>
          </div>
        </div>
      </div>

      {/* Main 3-Column Auction Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Lot Athlete Profile (5 Cols) */}
        <div className="lg:col-span-5 bg-dark-card border border-dark-border rounded-3xl p-6 space-y-6 flex flex-col justify-between shadow-2xl">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-crimson/15 text-brand-crimson border border-brand-crimson/30">
                ACTIVE LOT
              </span>
              <span className="text-xs text-brand-emerald font-bold uppercase">
                {auction.gameName}
              </span>
            </div>

            {/* Athlete Photo Card */}
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-dark-surface border border-dark-border">
              <img
                src={
                  currentLot?.participant?.photo ||
                  'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=600&auto=format&fit=crop'
                }
                alt="Athlete"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-card via-transparent to-transparent" />

              <div className="absolute bottom-3 left-3 right-3">
                <h2 className="font-gaming text-2xl font-extrabold text-slate-100 uppercase">
                  {currentLot?.participant?.inGameName}
                </h2>
                <div className="flex items-center gap-2 mt-0.5 text-xs text-brand-emerald font-semibold">
                  <span>⚡ {currentLot?.participant?.primaryRole}</span>
                  <span>•</span>
                  <span>{currentLot?.participant?.inGameId}</span>
                </div>
              </div>
            </div>

            {/* Dynamic Verified Stats: Cricket vs Chess vs Carrom vs Esports */}
            {auction.gameSlug === 'chess' ? (
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-dark-surface p-3 rounded-xl border border-dark-border/50">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">FIDE Rating</span>
                  <span className="font-gaming text-lg font-bold text-brand-emerald mt-0.5 block">
                    {currentLot?.participant?.fideRating || '2724'}
                  </span>
                </div>
                <div className="bg-dark-surface p-3 rounded-xl border border-dark-border/50">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Blitz Elo</span>
                  <span className="font-gaming text-lg font-bold text-brand-gold mt-0.5 block">
                    {currentLot?.participant?.blitzRating || '2758'}
                  </span>
                </div>
                <div className="bg-dark-surface p-3 rounded-xl border border-dark-border/50">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Win Rate</span>
                  <span className="font-gaming text-lg font-bold text-slate-100 mt-0.5 block">
                    {currentLot?.participant?.winRate || '68.5'}%
                  </span>
                </div>
              </div>
            ) : auction.gameSlug === 'carrom' ? (
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-dark-surface p-3 rounded-xl border border-dark-border/50">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">White Slams</span>
                  <span className="font-gaming text-lg font-bold text-brand-emerald mt-0.5 block">
                    {currentLot?.participant?.whiteSlams || '18'}
                  </span>
                </div>
                <div className="bg-dark-surface p-3 rounded-xl border border-dark-border/50">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Pocket Accuracy</span>
                  <span className="font-gaming text-lg font-bold text-brand-gold mt-0.5 block">
                    94.2%
                  </span>
                </div>
                <div className="bg-dark-surface p-3 rounded-xl border border-dark-border/50">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">National Rank</span>
                  <span className="font-gaming text-xs font-bold text-slate-100 mt-1 block truncate">
                    Top 5 AICF
                  </span>
                </div>
              </div>
            ) : isPhysicalSport ? (
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-dark-surface p-3 rounded-xl border border-dark-border/50">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Strike Rate</span>
                  <span className="font-gaming text-lg font-bold text-brand-emerald mt-0.5 block">
                    {currentLot?.participant?.strikeRate || '168.4'}
                  </span>
                </div>
                <div className="bg-dark-surface p-3 rounded-xl border border-dark-border/50">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Wickets / Economy</span>
                  <span className="font-gaming text-lg font-bold text-brand-gold mt-0.5 block">
                    {currentLot?.participant?.wickets || '42'} / {currentLot?.participant?.bowlingEconomy || '6.8'}
                  </span>
                </div>
                <div className="bg-dark-surface p-3 rounded-xl border border-dark-border/50">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Total Runs</span>
                  <span className="font-gaming text-lg font-bold text-slate-100 mt-0.5 block">
                    {currentLot?.participant?.runsScored || '1,240'}
                  </span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-dark-surface p-3 rounded-xl border border-dark-border/50">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">K/D Ratio</span>
                  <span className="font-gaming text-lg font-bold text-brand-emerald mt-0.5 block">
                    {currentLot?.participant?.kdRatio || '4.82'}
                  </span>
                </div>
                <div className="bg-dark-surface p-3 rounded-xl border border-dark-border/50">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Win Rate</span>
                  <span className="font-gaming text-lg font-bold text-slate-100 mt-0.5 block">
                    {currentLot?.participant?.winRate || '38.5'}%
                  </span>
                </div>
                <div className="bg-dark-surface p-3 rounded-xl border border-dark-border/50">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Rank Tier</span>
                  <span className="font-gaming text-xs font-bold text-brand-gold mt-1 block truncate">
                    {currentLot?.participant?.tierRank || 'Conqueror Top 100'}
                  </span>
                </div>
              </div>
            )}

            {/* Accolades */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Championship Accolades
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(currentLot?.participant?.esportsTrophies || ['Best All-Rounder 2024', 'Man of the Series']).map((trophy) => (
                  <span
                    key={trophy}
                    className="px-2.5 py-1 rounded-lg bg-dark-surface border border-brand-gold/30 text-[11px] text-brand-gold font-medium flex items-center gap-1"
                  >
                    <Trophy className="w-3 h-3" />
                    <span>{trophy}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Base Lot Floor */}
          <div className="pt-4 border-t border-dark-border/60 flex items-center justify-between text-xs text-slate-400">
            <span>Base Starting Bid:</span>
            <span className="font-mono font-bold text-slate-200">
              {formatCurrency(currentLot?.participant?.basePrice || auction.startingBid)}
            </span>
          </div>
        </div>

        {/* Center Column: Live Bidding Gavel & Controls (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Live Gavel Clock Card */}
          <div className="bg-dark-card border border-dark-border rounded-3xl p-6 text-center space-y-4 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-center gap-2">
              <Clock className="w-4 h-4 text-brand-crimson animate-pulse" />
              <span className="text-xs font-bold text-brand-crimson uppercase tracking-wider">
                Gavel Timer
              </span>
            </div>

            {/* Digital Countdown */}
            <div className="py-2">
              <span
                className={`font-mono text-6xl sm:text-7xl font-black transition-colors ${
                  secondsLeft <= 5
                    ? 'text-brand-crimson animate-pulse'
                    : secondsLeft <= 10
                    ? 'text-brand-gold'
                    : 'text-brand-emerald'
                }`}
              >
                00:{String(secondsLeft).padStart(2, '0')}
              </span>

              {/* Hammer Status Alert */}
              <div className="mt-2">
                {lotResult ? (
                  <span className="px-4 py-1.5 rounded-full text-xs font-black uppercase bg-brand-emerald text-black shadow-glow-emerald inline-block">
                    LOT CONCLUDED ({lotResult.type.toUpperCase()})
                  </span>
                ) : secondsLeft <= 5 ? (
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-brand-crimson text-white animate-bounce inline-block">
                    GOING TWICE!! FAIR WARNING!
                  </span>
                ) : secondsLeft <= 10 ? (
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-brand-gold text-black inline-block">
                    GOING ONCE!
                  </span>
                ) : (
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                    Bidding Open & Active
                  </span>
                )}
              </div>
            </div>

            {/* Current Highest Bid Display */}
            <div className="bg-dark-surface p-4 rounded-2xl border border-dark-border space-y-1">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">
                {t('auction.current_bid')}
              </span>
              <span className="font-gaming text-4xl sm:text-5xl font-black text-brand-emerald block">
                {formatCurrency(currentBid)}
              </span>
              <p className="text-xs text-slate-300">
                Leading Franchise:{' '}
                <span className="font-bold text-brand-gold">
                  {currentLot?.currentBidderTeam?.name || 'No bids placed yet'}
                </span>
              </p>
            </div>

            {/* Error banner */}
            {bidError && (
              <div className="p-3 bg-brand-crimson/20 border border-brand-crimson rounded-xl text-xs text-brand-crimson font-semibold flex items-center gap-2 text-left">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{bidError}</span>
              </div>
            )}

            {/* Warning banner (Purse Reserve or Role Cap notice) */}
            {bidWarning && (
              <div className="p-3 bg-brand-gold/20 border border-brand-gold/60 rounded-xl text-xs text-brand-gold font-semibold flex items-center gap-2 text-left">
                <AlertCircle className="w-4 h-4 shrink-0 text-brand-gold" />
                <span>{bidWarning}</span>
              </div>
            )}

            {/* Match Recommendation Pill */}
            {matchingNeededRole && (
              <div className="p-2.5 bg-brand-emerald/10 border border-brand-emerald/40 rounded-xl text-xs text-brand-emerald flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>IPL Target: Open {matchingNeededRole.label} slot!</span>
                </div>
                <span className="text-[10px] bg-brand-emerald/20 px-2 py-0.5 rounded font-mono">
                  Need {matchingNeededRole.needed} more
                </span>
              </div>
            )}

            {/* ROLE-BASED BIDDING CONTROLS OR SPECTATOR / PLAYER VIEW */}
            {!lotResult && (
              <>
                {/* 1. TEAM OWNER: FULL BIDDING BUTTONS */}
                {user?.role === 'team_owner' ? (
                  <>
                    <div className="space-y-2 pt-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-300 font-bold flex items-center gap-1.5">
                          <Shield className="w-3.5 h-3.5 text-brand-emerald" />
                          <span>Team Owner Bidding Controls:</span>
                        </span>
                        <span className="text-brand-emerald font-mono font-bold">
                          Purse: {formatCurrency(myTeam.remainingBudget)}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {quickBidOptions.map((amount) => (
                          <button
                            key={amount}
                            type="button"
                            onClick={() => handlePlaceBid(amount)}
                            className="py-3 px-2 rounded-xl bg-brand-emerald text-black font-gaming font-extrabold text-base hover:bg-[#00c985] shadow-glow-emerald active:scale-95 transition-all flex flex-col items-center justify-center leading-tight"
                          >
                            <span>+{formatCurrency(amount - currentBid)}</span>
                            <span className="text-[11px] font-mono opacity-80">{formatCurrency(amount)}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Custom Bid Form */}
                    <form onSubmit={handleCustomBidSubmit} className="pt-2 flex items-center gap-2">
                      <input
                        type="number"
                        value={customBidInput}
                        onChange={(e) => setCustomBidInput(e.target.value)}
                        placeholder={`Min ${formatCurrency(currentBid + increment)}`}
                        className="w-full px-3 py-2 bg-dark-surface border border-dark-border rounded-xl text-xs text-slate-100 font-mono focus:outline-none focus:border-brand-emerald"
                      />
                      <Button type="submit" variant="primary" size="sm" className="whitespace-nowrap">
                        Bid Custom
                      </Button>
                    </form>
                  </>
                ) : user?.role === 'gamer' ? (
                  /* 2. PLAYER / KHILADI VIEW */
                  <div className="p-4 bg-brand-cyan/10 border border-brand-cyan/30 rounded-2xl text-left space-y-2">
                    <div className="flex items-center gap-2 text-brand-cyan font-bold text-xs uppercase tracking-wider">
                      <Trophy className="w-4 h-4" />
                      <span>{t('auction.athlete_mode', 'Athlete Mode (Player View)')}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Aap Player profile se logged in hain. Franchises live room mein aapki boli laga rahi hain. Boli lagane ka adhikar keval verified Team Owners ke paas hota hai.
                    </p>
                    <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400">
                      <span>Status: In Draft Pool</span>
                      <Link to="/dashboard" className="text-brand-cyan hover:underline font-semibold">
                        My Player Hub &rarr;
                      </Link>
                    </div>
                  </div>
                ) : (
                  /* 3. DARSHAK (SPECTATOR) OR GUEST VIEW */
                  <div className="p-4 bg-dark-surface border border-dark-border rounded-2xl text-left space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-slate-200 font-bold text-xs uppercase tracking-wider">
                        <Eye className="w-4 h-4 text-brand-emerald" />
                        <span>{t('auction.spectator_mode', 'Spectator Mode (Viewer Stream)')}</span>
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-emerald/15 text-brand-emerald font-bold">
                        LIVE SPECTATING
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Aap live neelami dekh rahe hain! Boli lagana chahte hain? Apni franchise register karein aur team wallet se players ko apni team mein shamil karein.
                    </p>
                    <div className="pt-2 flex items-center gap-2">
                      <Link to="/register" className="w-full">
                        <Button variant="outline" size="sm" className="w-full text-xs">
                          Register as Team Owner to Bid
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Host Gavel Controls */}
            <div className="pt-3 border-t border-dark-border/60 space-y-2">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold block">
                Auctioneer Gavel Controls
              </span>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleAdminHammerSold}
                  disabled={!!lotResult}
                  className="gap-1.5"
                >
                  <Gavel className="w-3.5 h-3.5" />
                  <span>Strike SOLD</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetNextLot}
                  className="gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Next Player Lot</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Participating Franchises & Live Bid Stream (3 Cols) */}
        <div className="lg:col-span-3 space-y-6">
          {/* Participating Franchises & Purses */}
          <div className="bg-dark-card border border-dark-border rounded-3xl p-5 space-y-3">
            <h3 className="font-gaming text-base font-bold text-slate-100 uppercase flex items-center gap-1.5">
              <Users className="w-4 h-4 text-brand-emerald" />
              <span>Participating Franchises</span>
            </h3>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {participatingTeams.map((t) => (
                <div
                  key={t.id}
                  className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                    t.isMe
                      ? 'bg-brand-emerald/10 border-brand-emerald/40'
                      : 'bg-dark-surface border-dark-border/50'
                  }`}
                >
                  <div>
                    <p className="font-semibold text-slate-100 flex items-center gap-1">
                      <span>{t.name}</span>
                      {t.isMe && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-brand-emerald text-black font-bold">
                          YOU
                        </span>
                      )}
                    </p>
                    <span className="text-[10px] text-slate-400 font-mono">{t.tag}</span>
                  </div>
                  <span className="font-mono text-xs font-bold text-brand-emerald">
                    {formatCurrency(t.budget)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Live Bid Stream Feed */}
          <div className="bg-dark-card border border-dark-border rounded-3xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-gaming text-base font-bold text-slate-100 uppercase flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-brand-crimson" />
                <span>Live Bid Stream</span>
              </h3>
              <span className="w-2 h-2 rounded-full bg-brand-crimson animate-ping" />
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {biddingHistory.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-all ${
                    idx === 0
                      ? 'bg-dark-surface border-brand-emerald/40 shadow-glow-emerald/20'
                      : 'bg-dark-surface/40 border-dark-border/30 opacity-70'
                  }`}
                >
                  <div>
                    <span className="font-bold text-slate-200 block">{item.teamName}</span>
                    <span className="text-[10px] text-slate-500">{item.time}</span>
                  </div>
                  <span className="font-mono text-xs font-bold text-brand-emerald">
                    {formatCurrency(item.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* --- IPL & ESPORTS TOURNAMENT SQUAD COMPLIANCE & LINEUP TRACKER --- */}
      <div className="bg-dark-card border border-dark-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-dark-border pb-5">
          <div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-brand-emerald" />
              <h3 className="font-gaming text-xl sm:text-2xl font-bold text-slate-100 uppercase">
                {auction.gameSlug === 'cricket' ? 'IPL Franchise Squad Tracker & Quota Balance' : 'Esports Roster Balance & Lineup Tracker'}
              </h3>
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-brand-emerald/15 text-brand-emerald border border-brand-emerald/30">
                {myTeam.name} ({myTeam.tag})
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Official Tournament Composition Rules: Minimum {compliance.squadMin} to Maximum {compliance.squadMax} players. Balanced role distribution verified in real-time.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowRulesModal(true)}
              className="px-4 py-2 rounded-xl bg-dark-surface border border-brand-gold/40 text-brand-gold hover:bg-brand-gold/10 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              <span>View Full IPL Rulebook</span>
            </button>
            <div className="px-4 py-2 rounded-xl bg-dark-surface border border-brand-emerald/30 text-right">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Qualification Status</span>
              <span className={`text-xs font-bold uppercase ${compliance.isQualified ? 'text-brand-emerald' : 'text-brand-gold'}`}>
                {compliance.isQualified ? '✓ Qualified For Matches' : '⏳ Incomplete Squad'}
              </span>
            </div>
          </div>
        </div>

        {/* Overall Squad Count & Purse Reserve Gauges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Squad Count Progress */}
          <div className="bg-dark-surface p-4 rounded-2xl border border-dark-border space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Squad Capacity:</span>
              <span className="font-mono font-bold text-slate-100">
                {compliance.currentCount} / {compliance.squadMin} Players
              </span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-dark-card overflow-hidden">
              <div
                className="h-full bg-brand-emerald rounded-full transition-all duration-500"
                style={{ width: `${compliance.progressPercentage}%` }}
              />
            </div>
            <span className="text-[11px] text-slate-400 block">
              {compliance.slotsNeededForMin > 0
                ? `Need ${compliance.slotsNeededForMin} more players to meet tournament qualification minimum.`
                : '✓ Minimum squad size successfully achieved!'}
            </span>
          </div>

          {/* IPL Purse Reserve Calculator */}
          <div className="bg-dark-surface p-4 rounded-2xl border border-dark-border space-y-1">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
              IPL Purse Reserve Protection
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-xl font-bold text-brand-gold">
                {formatCurrency(compliance.slotsNeededForMin * activeGameConfig.minBasePrice)}
              </span>
              <span className="text-[11px] text-slate-400">
                reserved for {compliance.slotsNeededForMin} open slots
              </span>
            </div>
            <span className="text-[11px] text-slate-400 block">
              Safe max bid for current lot:{' '}
              <strong className="text-brand-emerald font-mono">
                {formatCurrency(
                  Math.max(
                    0,
                    myTeam.remainingBudget - compliance.slotsNeededForMin * activeGameConfig.minBasePrice
                  )
                )}
              </strong>
            </span>
          </div>

          {/* Franchise Purse Remaining */}
          <div className="bg-dark-surface p-4 rounded-2xl border border-dark-border space-y-1">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
              Active Franchise Purse
            </span>
            <span className="font-gaming text-2xl font-black text-brand-emerald block">
              {formatCurrency(myTeam.remainingBudget)}
            </span>
            <span className="text-[11px] text-slate-400 block">
              Initial Purse: {formatCurrency(activeGameConfig.purseLimit)}
            </span>
          </div>
        </div>

        {/* Dynamic Role Breakdown Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Role Quotas & Lineup Balance:
            </h4>
            <span className="text-[11px] text-slate-500">All positions must meet minimums</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {compliance.roleBreakdown.map((r) => (
              <div
                key={r.roleId}
                className={`p-4 rounded-2xl border transition-all ${
                  r.isMinMet
                    ? 'bg-brand-emerald/10 border-brand-emerald/30 shadow-glow-emerald/10'
                    : 'bg-dark-surface border-dark-border/80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-gaming text-sm font-bold text-slate-100">{r.label}</span>
                  <span
                    className={`font-mono text-xs font-extrabold px-2 py-0.5 rounded-md ${
                      r.isMinMet
                        ? 'bg-brand-emerald/20 text-brand-emerald'
                        : 'bg-brand-crimson/20 text-brand-crimson'
                    }`}
                  >
                    {r.count} / {r.min}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1 leading-snug">
                  {r.labelHinglish || r.label} (Max: {r.max})
                </p>
                <div className="mt-2.5 pt-2 border-t border-dark-border/40 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Status:</span>
                  <span
                    className={`font-semibold ${
                      r.isMinMet ? 'text-brand-emerald' : 'text-brand-gold'
                    }`}
                  >
                    {r.needed > 0 ? `Need ${r.needed} more` : '✓ Quota Met'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Acquired Players Roster Strip */}
        <div className="space-y-2 pt-2 border-t border-dark-border">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Acquired Players In Current Franchise Roster:
          </span>
          <div className="flex flex-wrap gap-2">
            {myTeam.roster.map((player, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-xl bg-dark-surface border border-dark-border text-xs text-slate-200 flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-brand-emerald" />
                <span className="font-semibold text-slate-100">{player.name}</span>
                <span className="text-[10px] text-slate-400">({player.role})</span>
                <span className="text-[10px] font-mono text-brand-gold font-bold">
                  {formatCurrency(player.acquiredPrice || 10000)}
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Lot Result Celebration Modal */}
      {lotResult && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-dark-card border border-brand-emerald/60 rounded-3xl p-8 max-w-md w-full text-center space-y-4 shadow-glow-emerald">
            <div className="w-16 h-16 rounded-full bg-brand-emerald/20 border border-brand-emerald text-brand-emerald flex items-center justify-center text-3xl mx-auto animate-bounce">
              🔨
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-brand-emerald">
                GAVEL STRUCK — OFFICIAL LOT SOLD
              </span>
              <h2 className="font-gaming text-3xl font-extrabold text-slate-100 uppercase mt-1">
                {lotResult.athleteName || currentLot?.participant?.inGameName}
              </h2>
            </div>
            <div className="bg-dark-surface p-4 rounded-2xl border border-dark-border space-y-1">
              <span className="text-xs text-slate-400">Sold To Franchise:</span>
              <p className="font-gaming text-xl font-bold text-brand-gold">{lotResult.teamName}</p>
              <p className="font-mono text-2xl font-black text-brand-emerald pt-1">
                {formatCurrency(lotResult.amount)}
              </p>
            </div>
            <Button
              variant="primary"
              size="lg"
              onClick={handleResetNextLot}
              className="w-full gap-2 shadow-glow-emerald"
            >
              <span>Load Next Player Lot</span> &rarr;
            </Button>
          </div>
        </div>
      )}

      {/* Official Tournament Squad Rules & Balance Modal */}
      {showRulesModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-dark-card border border-brand-emerald/60 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-dark-border pb-4">
              <div>
                <span className="text-[10px] text-brand-emerald font-bold uppercase tracking-wider block">
                  OFFICIAL TOURNAMENT HANDBOOK
                </span>
                <h3 className="font-gaming text-2xl font-bold text-slate-100 uppercase">
                  {activeGameConfig.gameTitle} Regulations
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowRulesModal(false)}
                className="p-2 rounded-xl bg-dark-surface border border-dark-border text-slate-400 hover:text-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-300">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-dark-surface p-3 rounded-xl border border-dark-border">
                  <span className="text-[10px] text-slate-400 block uppercase">Min Squad</span>
                  <span className="font-mono text-base font-bold text-slate-100">{activeGameConfig.squadMin} Players</span>
                </div>
                <div className="bg-dark-surface p-3 rounded-xl border border-dark-border">
                  <span className="text-[10px] text-slate-400 block uppercase">Max Squad</span>
                  <span className="font-mono text-base font-bold text-slate-100">{activeGameConfig.squadMax} Players</span>
                </div>
                <div className="bg-dark-surface p-3 rounded-xl border border-dark-border">
                  <span className="text-[10px] text-slate-400 block uppercase">Purse Limit</span>
                  <span className="font-mono text-base font-bold text-brand-emerald">{formatCurrency(activeGameConfig.purseLimit)}</span>
                </div>
                <div className="bg-dark-surface p-3 rounded-xl border border-dark-border">
                  <span className="text-[10px] text-slate-400 block uppercase">Min Base Price</span>
                  <span className="font-mono text-base font-bold text-brand-gold">{formatCurrency(activeGameConfig.minBasePrice)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-gaming text-sm font-bold text-slate-100 uppercase">Mandatory Squad Roles</h4>
                <div className="space-y-1.5">
                  {activeGameConfig.roles.map((r) => (
                    <div key={r.id} className="p-3 bg-dark-surface rounded-xl border border-dark-border/70 flex items-start justify-between">
                      <div>
                        <p className="font-bold text-slate-100">{r.label} ({r.labelHinglish})</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{r.description}</p>
                      </div>
                      <span className="font-mono text-xs font-bold text-brand-emerald bg-brand-emerald/10 px-2 py-1 rounded">
                        Min {r.min} - Max {r.max}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-gaming text-sm font-bold text-slate-100 uppercase">Official League Rules</h4>
                <ul className="space-y-1.5">
                  {activeGameConfig.keyRules.map((rule, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-dark-surface/50 p-2.5 rounded-lg border border-dark-border">
                      <Check className="w-4 h-4 text-brand-emerald shrink-0 mt-0.5" />
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-3 border-t border-dark-border flex justify-end">
              <Button variant="primary" size="md" onClick={() => setShowRulesModal(false)}>
                Got It, Return to Auction
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveAuctionRoom;
