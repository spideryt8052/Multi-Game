import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../context/LanguageContext';
import { MOCK_AUCTIONS } from '../utils/mockData';
import { formatCurrency } from '../utils/formatCurrency';
import { playBidSound, playSoldHammerSound, playTickSound, playWarningSound } from '../utils/soundEffects';
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
  const [customBidInput, setCustomBidInput] = useState('');
  const [lotResult, setLotResult] = useState(null); // { type: 'sold' | 'unsold', details }
  const [simulatedRivalsActive, setSimulatedRivalsActive] = useState(false);

  // Team wallet for logged-in user
  const [myTeam, setMyTeam] = useState({
    _id: 'team_godl',
    name: 'GodLike Esports',
    tag: 'GODL',
    remainingBudget: 38500,
  });

  const [participatingTeams, setParticipatingTeams] = useState([
    { id: 't1', name: 'GodLike Esports', tag: 'GODL', budget: 38500, isMe: true },
    { id: 't2', name: 'Team Soul', tag: 'SOUL', budget: 42000, isMe: false },
    { id: 't3', name: 'Blind Esports', tag: 'BLIND', budget: 29500, isMe: false },
    { id: 't4', name: 'Global Esports', tag: 'GE', budget: 35000, isMe: false },
  ]);

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
        if (prev <= 1) {
          return 0;
        }
        if (prev <= 5 && soundEnabled) {
          playTickSound();
        }
        if (prev === 10 && soundEnabled) {
          playWarningSound();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [soundEnabled]);

  // Simulated Rival Bids (for solo live testing)
  useEffect(() => {
    if (!simulatedRivalsActive || secondsLeft <= 3 || lotResult) return;

    const rivalClans = [
      { name: 'Team Soul', tag: 'SOUL' },
      { name: 'Blind Esports', tag: 'BLIND' },
      { name: 'Global Esports', tag: 'GE' },
    ];

    const interval = setInterval(() => {
      const currentHighest = currentLot?.currentBid || auction.startingBid;
      const increment = auction.minimumIncrement || 250;
      const rival = rivalClans[Math.floor(Math.random() * rivalClans.length)];
      const newAmount = currentHighest + increment;

      if (currentLot?.currentBidderTeam?.name !== rival.name && newAmount < 50000) {
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
    setLotResult({
      type: 'sold',
      teamName: soldData?.teamName || currentLot?.currentBidderTeam?.name || 'Winning Clan',
      amount: soldData?.finalPrice || currentLot?.currentBid,
      athleteName: currentLot?.participant?.inGameName,
    });

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

    if (!isAuthenticated) {
      setBidError('Please sign in to place live auction bids.');
      return;
    }

    if (amount <= currentBid) {
      setBidError(`Bid must be greater than current bid of ${formatCurrency(currentBid)}`);
      return;
    }

    if (amount > myTeam.remainingBudget) {
      setBidError(`Bid amount exceeds your clan purse of ${formatCurrency(myTeam.remainingBudget)}`);
      return;
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

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {/* Toggle Rivals Simulation */}
          <button
            type="button"
            onClick={() => setSimulatedRivalsActive(!simulatedRivalsActive)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              simulatedRivalsActive
                ? 'bg-brand-purple/20 text-brand-purple border-brand-purple/50'
                : 'bg-dark-surface border-dark-border text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle automated rival clan bidding for demonstration"
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
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">My Clan Purse</span>
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
              <span className="text-xs text-slate-400 font-semibold">{auction.gameName}</span>
            </div>

            {/* Athlete Photo and Identity */}
            <div className="relative rounded-2xl overflow-hidden bg-dark-surface h-64 border border-dark-border">
              <img
                src={currentLot?.participant?.photo || 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=600&auto=format&fit=crop'}
                alt={currentLot?.participant?.inGameName}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-card via-transparent to-transparent" />

              <div className="absolute bottom-3 left-3 right-3">
                <h2 className="font-gaming text-2xl font-extrabold text-slate-100 uppercase">
                  {currentLot?.participant?.inGameName}
                </h2>
                <div className="flex items-center gap-2 mt-0.5 text-xs text-brand-emerald font-semibold">
                  <span>🎯 {currentLot?.participant?.primaryRole}</span>
                  <span>•</span>
                  <span>UID: {currentLot?.participant?.inGameId}</span>
                </div>
              </div>
            </div>

            {/* Verified Gaming Stats */}
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
                  {currentLot?.participant?.tierRank || 'Conqueror'}
                </span>
              </div>
            </div>

            {/* Trophies & Accolades */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Championship Accolades
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(currentLot?.participant?.esportsTrophies || ['BMPS 2023 Champion', 'BGIS Runner-up']).map((trophy) => (
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

        {/* Center Column: Live Bidding Hammer & Controls (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Live Hammer Clock Card */}
          <div className="bg-dark-card border border-dark-border rounded-3xl p-6 text-center space-y-4 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-center gap-2">
              <Clock className="w-4 h-4 text-brand-crimson animate-pulse" />
              <span className="text-xs font-bold text-brand-crimson uppercase tracking-wider">
                Hammer Timer
              </span>
            </div>

            {/* Massive Digital Countdown */}
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
                Leading Clan:{' '}
                <span className="font-bold text-brand-gold">
                  {currentLot?.currentBidderTeam?.name || 'No bids placed yet'}
                </span>
              </p>
            </div>

            {/* Error banner if validation fails */}
            {bidError && (
              <div className="p-3 bg-brand-crimson/20 border border-brand-crimson rounded-xl text-xs text-brand-crimson font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{bidError}</span>
              </div>
            )}

            {/* Quick Live Bid Buttons */}
            {!lotResult && (
              <>
                <div className="space-y-2 pt-2">
                  <span className="text-xs text-slate-400 font-semibold block text-left">
                    {t('auction.quick_bid')}:
                  </span>
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
            )}

            {/* Host & Admin Hammer Strike Controls */}
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
                  <span>Next Athlete Lot</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Participating Clans & Live Bid Stream (3 Cols) */}
        <div className="lg:col-span-3 space-y-6">
          {/* Participating Clans & Budgets */}
          <div className="bg-dark-card border border-dark-border rounded-3xl p-5 space-y-3">
            <h3 className="font-gaming text-base font-bold text-slate-100 uppercase flex items-center gap-1.5">
              <Users className="w-4 h-4 text-brand-emerald" />
              <span>Participating Clans</span>
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

      {/* Lot Result Celebration Modal */}
      {lotResult && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-dark-card border border-brand-emerald/60 rounded-3xl p-8 max-w-md w-full text-center space-y-4 shadow-glow-emerald">
            <div className="w-16 h-16 rounded-full bg-brand-emerald/20 border border-brand-emerald text-brand-emerald flex items-center justify-center text-3xl mx-auto animate-bounce">
              🔨
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-brand-emerald">
                HAMMER FALL — OFFICIAL LOT SOLD
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
              <span>Load Next Athlete Lot</span> &rarr;
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveAuctionRoom;
