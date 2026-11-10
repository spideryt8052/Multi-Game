import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../context/LanguageContext';
import { MOCK_GAMES, MOCK_AUCTIONS } from '../utils/mockData';
import GameCard from '../components/cards/GameCard';
import AuctionCard from '../components/cards/AuctionCard';
import Button from '../components/common/Button';
import {
  Flame,
  Gamepad2,
  Calendar,
  Trophy,
  ShieldCheck,
  TrendingUp,
  Award,
  Zap,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

const Home = () => {
  const { t } = useTranslation();
  const [selectedGameFilter, setSelectedGameFilter] = useState('all');

  const liveAuctions = MOCK_AUCTIONS.filter((a) => a.status === 'live');
  const upcomingAuctions = MOCK_AUCTIONS.filter((a) => a.status === 'upcoming');
  const completedAuctions = MOCK_AUCTIONS.filter((a) => a.status === 'completed');

  const filteredUpcoming =
    selectedGameFilter === 'all'
      ? upcomingAuctions
      : upcomingAuctions.filter((a) => a.gameSlug === selectedGameFilter);

  return (
    <div className="min-h-screen space-y-16 pb-12">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 overflow-hidden">
        {/* Subtle background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-brand-emerald/10 blur-[130px] rounded-full pointer-events-none -z-10" />
        <div className="absolute top-10 right-10 w-[300px] h-[300px] bg-brand-crimson/10 blur-[100px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Official badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-dark-card border border-brand-emerald/40 text-brand-emerald text-xs font-bold uppercase tracking-wider mb-6 shadow-glow-emerald">
            <Sparkles className="w-3.5 h-3.5 text-brand-emerald" />
            <span>{t('hero.badge')}</span>
          </div>

          {/* Main Title */}
          <h1 className="font-gaming text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-100 max-w-4xl mx-auto leading-none uppercase">
            {t('hero.title_part1')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-emerald via-emerald-400 to-brand-cyan">
              {t('hero.title_part2')}
            </span>{' '}
            {t('hero.title_part3')}
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {t('hero.subtitle')}
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/auctions/live">
              <Button size="lg" variant="danger" className="w-full sm:w-auto px-8 gap-2.5">
                <Flame className="w-5 h-5 animate-pulse" />
                <span>{t('hero.cta_live')}</span>
              </Button>
            </Link>
            <Link to="/register">
              <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 gap-2">
                <span>{t('hero.cta_register')}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {/* Real-time Lot Ticker */}
          <div className="mt-12 bg-dark-card/80 border border-dark-border/80 backdrop-blur-md rounded-2xl p-3 max-w-3xl mx-auto flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center gap-2 shrink-0">
              <span className="w-2 h-2 rounded-full bg-brand-crimson animate-ping" />
              <span className="font-bold text-brand-crimson uppercase tracking-wider text-[11px]">
                LIVE LOT UPDATE:
              </span>
            </div>
            <div className="truncate px-3 font-mono text-slate-200">
              <span className="text-brand-emerald font-bold">Soul_Akshat</span> currently at{' '}
              <span className="text-brand-gold font-bold">₹14,500</span> by GodLike Esports (BGMI Cup)
            </div>
            <Link
              to="/auctions/live/auc_bgmi_pro_01"
              className="shrink-0 text-brand-emerald hover:underline font-semibold flex items-center gap-1"
            >
              <span>Watch</span> &rarr;
            </Link>
          </div>

          {/* Metric Stats Strip */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-dark-card border border-dark-border p-4 rounded-xl text-center">
              <p className="font-gaming text-2xl font-bold text-brand-emerald">₹15,000,000+</p>
              <p className="text-xs text-slate-400 mt-0.5">Total Bidding Volume</p>
            </div>
            <div className="bg-dark-card border border-dark-border p-4 rounded-xl text-center">
              <p className="font-gaming text-2xl font-bold text-slate-100">4,500+</p>
              <p className="text-xs text-slate-400 mt-0.5">Verified Esports Athletes</p>
            </div>
            <div className="bg-dark-card border border-dark-border p-4 rounded-xl text-center">
              <p className="font-gaming text-2xl font-bold text-brand-gold">350+</p>
              <p className="text-xs text-slate-400 mt-0.5">Registered Esports Clans</p>
            </div>
            <div className="bg-dark-card border border-dark-border p-4 rounded-xl text-center">
              <p className="font-gaming text-2xl font-bold text-brand-cyan">99.98%</p>
              <p className="text-xs text-slate-400 mt-0.5">Socket Sync Precision</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. LIVE AUCTIONS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 pb-3 border-b border-dark-border gap-4">
          <div>
            <div className="flex items-center gap-2 text-brand-crimson text-xs font-bold uppercase tracking-wider">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-crimson animate-pulse" />
              <span>Real-Time Bidding Active</span>
            </div>
            <h2 className="font-gaming text-3xl font-extrabold text-slate-100 uppercase tracking-wide mt-1">
              Live Auction Rooms
            </h2>
          </div>
          <Link
            to="/auctions/live"
            className="text-xs font-bold text-brand-emerald hover:underline flex items-center gap-1"
          >
            <span>View All Live Rooms ({liveAuctions.length})</span> &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {liveAuctions.map((auction) => (
            <AuctionCard key={auction._id} auction={auction} />
          ))}
        </div>
      </section>

      {/* 3. POPULAR GAMES HUB */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 pb-3 border-b border-dark-border gap-4">
          <div>
            <span className="text-brand-emerald text-xs font-bold uppercase tracking-wider">
              Esports Titles
            </span>
            <h2 className="font-gaming text-3xl font-extrabold text-slate-100 uppercase tracking-wide mt-1">
              {t('games.title')}
            </h2>
            <p className="text-xs text-slate-400 mt-1">{t('games.subtitle')}</p>
          </div>
          <Link
            to="/games"
            className="text-xs font-bold text-brand-emerald hover:underline flex items-center gap-1"
          >
            <span>Browse All Games ({MOCK_GAMES.length})</span> &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_GAMES.map((game) => (
            <GameCard key={game._id} game={game} />
          ))}
        </div>
      </section>

      {/* 4. UPCOMING TOURNAMENT AUCTIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 pb-3 border-b border-dark-border gap-4">
          <div>
            <span className="text-brand-purple text-xs font-bold uppercase tracking-wider">
              Registration Open
            </span>
            <h2 className="font-gaming text-3xl font-extrabold text-slate-100 uppercase tracking-wide mt-1">
              Upcoming Esports Auctions
            </h2>
          </div>

          {/* Game filter pills */}
          <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1">
            <button
              type="button"
              onClick={() => setSelectedGameFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedGameFilter === 'all'
                  ? 'bg-brand-emerald text-black font-bold'
                  : 'bg-dark-card border border-dark-border text-slate-400 hover:text-slate-100'
              }`}
            >
              All Titles
            </button>
            {MOCK_GAMES.map((g) => (
              <button
                key={g.slug}
                type="button"
                onClick={() => setSelectedGameFilter(g.slug)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedGameFilter === g.slug
                    ? 'bg-brand-emerald text-black font-bold'
                    : 'bg-dark-card border border-dark-border text-slate-400 hover:text-slate-100'
                }`}
              >
                {g.title}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUpcoming.map((auction) => (
            <AuctionCard key={auction._id} auction={auction} />
          ))}
        </div>
      </section>

      {/* 5. HOW IT WORKS (IPL & ESPORTS AUCTION WORKFLOW) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-dark-card border border-dark-border rounded-3xl p-8 lg:p-12 relative overflow-hidden">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-brand-emerald text-xs font-bold uppercase tracking-wider">
              Step-by-Step System
            </span>
            <h2 className="font-gaming text-3xl sm:text-4xl font-extrabold text-slate-100 uppercase tracking-wide mt-1">
              How Live Esports Auctions Work
            </h2>
            <p className="text-xs text-slate-400 mt-2">
              A transparent, high-stakes auction environment powered by verified gaming stats and real-time Socket.IO bidding.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            <div className="bg-dark-surface/70 border border-dark-border/80 rounded-2xl p-5 space-y-3 relative group hover:border-brand-emerald transition-colors">
              <div className="w-10 h-10 rounded-xl bg-brand-emerald/15 text-brand-emerald font-gaming text-xl font-bold flex items-center justify-center border border-brand-emerald/30">
                01
              </div>
              <h4 className="font-gaming text-lg font-bold text-slate-100">1. Athlete Profile & KYC</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Gamers register their in-game UID, K/D ratio, tier ranks, and tournament achievements to enter the auction lot pool.
              </p>
            </div>

            <div className="bg-dark-surface/70 border border-dark-border/80 rounded-2xl p-5 space-y-3 relative group hover:border-brand-emerald transition-colors">
              <div className="w-10 h-10 rounded-xl bg-brand-cyan/15 text-brand-cyan font-gaming text-xl font-bold flex items-center justify-center border border-brand-cyan/30">
                02
              </div>
              <h4 className="font-gaming text-lg font-bold text-slate-100">2. Clan Purse Allocation</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Team owners register with authorized clan budgets. Server enforces strict budget caps before every bid.
              </p>
            </div>

            <div className="bg-dark-surface/70 border border-dark-border/80 rounded-2xl p-5 space-y-3 relative group hover:border-brand-emerald transition-colors">
              <div className="w-10 h-10 rounded-xl bg-brand-crimson/15 text-brand-crimson font-gaming text-xl font-bold flex items-center justify-center border border-brand-crimson/30">
                03
              </div>
              <h4 className="font-gaming text-lg font-bold text-slate-100">3. Live Hammer Room</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Lots are presented one by one. Team owners compete with increment buttons under a 30-second ticking clock.
              </p>
            </div>

            <div className="bg-dark-surface/70 border border-dark-border/80 rounded-2xl p-5 space-y-3 relative group hover:border-brand-emerald transition-colors">
              <div className="w-10 h-10 rounded-xl bg-brand-gold/15 text-brand-gold font-gaming text-xl font-bold flex items-center justify-center border border-brand-gold/30">
                04
              </div>
              <h4 className="font-gaming text-lg font-bold text-slate-100">4. Instant Roster Lock</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Sold athletes are instantly added to the winning team's official tournament roster with budget deducted automatically.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. RECENTLY COMPLETED AUCTIONS (HALL OF FAME) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8 pb-3 border-b border-dark-border">
          <div>
            <span className="text-brand-gold text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-brand-gold" />
              <span>Hall of Fame</span>
            </span>
            <h2 className="font-gaming text-3xl font-extrabold text-slate-100 uppercase tracking-wide mt-1">
              Recently Completed Auctions
            </h2>
          </div>
          <Link
            to="/auctions/completed"
            className="text-xs font-bold text-brand-emerald hover:underline"
          >
            Archive & Roster Records &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {completedAuctions.map((auction) => (
            <AuctionCard key={auction._id} auction={auction} />
          ))}
        </div>
      </section>

      {/* 7. ORGANIZER & TEAM CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-950/60 via-dark-card to-dark-surface border border-brand-emerald/40 rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-glow-emerald">
          <div className="space-y-3 max-w-xl">
            <span className="px-3 py-1 rounded-full bg-brand-emerald/20 text-brand-emerald text-xs font-bold uppercase tracking-wider border border-brand-emerald/30">
              Tournament Organizers
            </span>
            <h3 className="font-gaming text-3xl sm:text-4xl font-extrabold text-slate-100 uppercase">
              Host Your Esports Auction on Arena
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Custom game rules, role rosters, automatic budget deduction, and live audio-visual hammer rooms. Launch your competitive tournament draft in minutes.
            </p>
          </div>
          <div className="shrink-0 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Link to="/register">
              <Button size="lg" variant="primary" className="w-full sm:w-auto">
                Host An Auction
              </Button>
            </Link>
            <Link to="/rules">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Review Rule Engine
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

