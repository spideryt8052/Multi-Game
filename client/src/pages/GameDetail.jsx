import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MOCK_GAMES, MOCK_AUCTIONS } from '../utils/mockData';
import AuctionCard from '../components/cards/AuctionCard';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import { useTranslation } from '../context/LanguageContext';
import {
  Gamepad2,
  Users,
  Trophy,
  Shield,
  BookOpen,
  Flame,
  Calendar,
  Layers,
  Sparkles,
  CheckCircle,
  Clock,
} from 'lucide-react';

const GameDetail = () => {
  const { slug } = useParams();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('auctions'); // 'auctions', 'teams', 'rules'

  const game =
    MOCK_GAMES.find((g) => g.slug.toLowerCase() === (slug || '').toLowerCase()) || MOCK_GAMES[0];
  const gameAuctions = MOCK_AUCTIONS.filter((a) => a.gameSlug === game.slug);
  const liveAuctionForGame = gameAuctions.find((a) => a.status === 'live');

  const gameRules = {
    cricket: {
      squadSize: '11 Active Players + 4 Reserves (Squad of 15)',
      teamBudget: '₹1,00,000 Team Purse Cap',
      basePrice: '₹5,000 - ₹10,000 Base Player Price',
      roles: ['Opening Batsman', 'Top Order Batsman', 'Hard-Hitting All-Rounder', 'Pace Bowler', 'Spin Bowler', 'Wicketkeeper Batsman'],
      specialRule: 'Mandatory 1 Wicketkeeper, at least 4 specialist Bowlers, and 2 All-Rounders required.',
    },
    football: {
      squadSize: '7 Active Players + 3 Substitutes (Turf Format)',
      teamBudget: '₹80,000 Total Club Purse',
      basePrice: '₹4,000 Base Player Price',
      roles: ['Center Forward / Striker', 'Winger', 'Attacking Midfielder', 'Center Back', 'Fullback', 'Goalkeeper'],
      specialRule: 'Mandatory Goalkeeper acquisition. Minimum 2 Defenders required before squad qualifies.',
    },
    kabaddi: {
      squadSize: '7 Mat Starters + 3 Substitutes (Squad of 10)',
      teamBudget: '₹60,000 Club Purse',
      basePrice: '₹3,000 Base Lot Price',
      roles: ['Main Raider', 'Right Corner Defender', 'Left Corner Defender', 'Center Cover', 'All-Rounder'],
      specialRule: 'Minimum 3 dedicated Raiders and 3 specialist Defenders required.',
    },
    chess: {
      squadSize: '6 Boards (Icon GM, 2 Men Superstars, 2 Women Masters, 1 U-21 Prodigy)',
      teamBudget: '₹80,000 Total Franchise Purse',
      basePrice: '₹8,000 - ₹15,000 Base Player Price',
      roles: ['Grandmaster (Board 1)', 'International Master (Board 2)', 'Rapid / Blitz Specialist', 'Junior Prodigy', 'Women Grandmaster'],
      specialRule: 'Board 1 Icon must have FIDE Rating > 2650. Women and Junior quotas strictly enforced.',
    },
    carrom: {
      squadSize: '4 Active Board Players + 1 Substitute',
      teamBudget: '₹50,000 Club Purse Cap',
      basePrice: '₹3,000 Base Player Price',
      roles: ['White Slam Specialist', 'Direct Striker', 'Cut & Pocket Master', 'Doubles Partner', 'Defensive Finisher'],
      specialRule: 'Each team must have at least 1 verified White Slam specialist.',
    },
    badminton: {
      squadSize: '4 Active Racquet Players',
      teamBudget: '₹45,000 Club Purse',
      basePrice: '₹3,000 Base Price',
      roles: ['Singles Ace', 'Doubles Front Specialist', 'Doubles Back Smasher', 'Mixed Doubles Player'],
      specialRule: 'At least 1 Singles Ace and 1 verified Doubles specialist pair.',
    },
    bgmi: {
      squadSize: '4 Active Players + 1 Substitute',
      teamBudget: '₹50,000 Total Purse Limit',
      basePrice: '₹2,500 Base Player Price',
      roles: ['In-Game Leader (IGL)', 'Assaulter / Entry', 'Support / Healer', 'Sniper / DMR'],
      specialRule: 'Teams cannot bid on more than 2 Snipers. At least 1 IGL required per squad.',
    },
    valorant: {
      squadSize: '5 Active Players + 1 Coach/Sub',
      teamBudget: '60,000 Points Allocation',
      basePrice: '3,000 Points Base',
      roles: ['Duelist', 'Initiator', 'Controller', 'Sentinel'],
      specialRule: 'Max 2 Duelists allowed per roster. Every team must bid for at least 1 Controller and 1 Sentinel.',
    },
    freefire: {
      squadSize: '4 Active Players',
      teamBudget: '₹40,000 Total Purse',
      basePrice: '₹1,500 Base',
      roles: ['Rusher', 'Sniper', 'Granadier', 'Captain'],
      specialRule: 'Fast hammer timer: 20 seconds lot timeout. Mandatory Rusher slot.',
    },
    cs2: {
      squadSize: '5 Active Players + 1 Coach',
      teamBudget: '₹55,000 Team Purse',
      basePrice: '₹2,500 Base Price',
      roles: ['AWPer', 'Entry Fragger', 'IGL', 'Lurker', 'Support'],
      specialRule: 'Max 1 AWPer per roster. Strict 30s auction hammer timer.',
    },
    fifa: {
      squadSize: '1 Main Competitor + 1 Reserve',
      teamBudget: '₹25,000 Purse Limit',
      basePrice: '₹2,000 Base',
      roles: ['Forward Specialist', 'Midfield Controller', 'Defensive Master', 'Goalkeeper'],
      specialRule: 'Direct 1v1 draft. Winner signs exclusive season contract with clan.',
    },
    gta: {
      squadSize: '4 Crew Members',
      teamBudget: '₹40,000 Syndicate Purse',
      basePrice: '₹2,000 Base Price',
      roles: ['Crew Leader', 'Driver / Getaway', 'Shooter', 'Strategist'],
      specialRule: 'Roleplay server syndicate draft with custom clan territory bidding.',
    },
  };

  const currentRules = gameRules[game.slug] || gameRules.cricket || gameRules.bgmi;

  return (
    <div className="space-y-12 pb-16">
      {/* Game Header Banner */}
      <div className="relative h-72 sm:h-80 w-full overflow-hidden bg-dark-card border-b border-dark-border">
        <img
          src={game.bannerImage}
          alt={game.title}
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/60 to-transparent" />

        <div className="absolute bottom-6 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-emerald/20 text-brand-emerald border border-brand-emerald/30">
                  {game.categoryType === 'physical_sports' ? '🏏 Physical Sport' : '🎮 Esports'}
                </span>
                <span className="text-xs text-slate-400 font-semibold">{game.genre}</span>
              </div>
              <h1 className="font-gaming text-4xl sm:text-5xl font-extrabold text-slate-100 uppercase tracking-wide">
                {game.title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                {game.description}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {liveAuctionForGame ? (
                <Link to={`/auctions/live/${liveAuctionForGame._id}`}>
                  <Button variant="danger" size="md" className="gap-2 shadow-glow-crimson">
                    <Flame className="w-4 h-4 animate-pulse" />
                    <span>Join {game.title} Live Room</span>
                  </Button>
                </Link>
              ) : (
                <Link to="/auctions/upcoming">
                  <Button variant="primary" size="md" className="gap-2 shadow-glow-emerald">
                    <Calendar className="w-4 h-4" />
                    <span>View Upcoming Tournaments</span>
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 border-b border-dark-border pb-3">
          <button
            type="button"
            onClick={() => setActiveTab('auctions')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 ${
              activeTab === 'auctions'
                ? 'bg-brand-emerald text-black shadow-glow-emerald'
                : 'text-slate-400 hover:text-slate-100 hover:bg-dark-card'
            }`}
          >
            <Flame className="w-4 h-4" />
            <span>Dedicated Auctions ({gameAuctions.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('rules')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 ${
              activeTab === 'rules'
                ? 'bg-brand-emerald text-black shadow-glow-emerald'
                : 'text-slate-400 hover:text-slate-100 hover:bg-dark-card'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>{game.title} Tournament Rules</span>
          </button>
        </div>

        {/* Tab 1: Auctions */}
        {activeTab === 'auctions' && (
          <div className="mt-8">
            {gameAuctions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gameAuctions.map((auction) => (
                  <AuctionCard key={auction._id} auction={auction} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-dark-card border border-dark-border rounded-2xl space-y-4">
                <Gamepad2 className="w-12 h-12 text-slate-500 mx-auto" />
                <div>
                  <h3 className="text-lg font-bold text-slate-100">No active auctions for {game.title} at this moment</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                    New seasonal tournaments are being scheduled by organizers. You can register your athlete profile or review rules below.
                  </p>
                </div>
                <div className="pt-2 flex items-center justify-center gap-3">
                  <Link to="/register">
                    <Button variant="primary" size="sm">Register Athlete Profile</Button>
                  </Link>
                  <Link to="/auctions/upcoming">
                    <Button variant="outline" size="sm">Explore All Upcoming</Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Specific Game Rules */}
        {activeTab === 'rules' && (
          <div className="mt-8 bg-dark-card border border-dark-border rounded-2xl p-6 sm:p-8 space-y-6">
            <div>
              <span className="text-brand-emerald text-xs font-bold uppercase tracking-wider">
                Official Rule Engine
              </span>
              <h2 className="font-gaming text-2xl font-bold text-slate-100 uppercase mt-1">
                {game.title} Auction Specifications & Constraints
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                These rules are enforced by the live server validation engine. Invalid bids violating team caps or purse sizes are automatically rejected.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-dark-surface p-4 rounded-xl border border-dark-border/60">
                <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Roster Limit</span>
                <span className="font-gaming text-lg font-bold text-slate-100 mt-0.5 block">{currentRules.squadSize}</span>
              </div>
              <div className="bg-dark-surface p-4 rounded-xl border border-dark-border/60">
                <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Purse Cap</span>
                <span className="font-gaming text-lg font-bold text-brand-emerald mt-0.5 block">{currentRules.teamBudget}</span>
              </div>
              <div className="bg-dark-surface p-4 rounded-xl border border-dark-border/60">
                <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Base Player Price</span>
                <span className="font-gaming text-lg font-bold text-brand-gold mt-0.5 block">{currentRules.basePrice}</span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-gaming">
                Recognized Roles for {game.title}
              </h4>
              <div className="flex flex-wrap gap-2">
                {currentRules.roles.map((role) => (
                  <span
                    key={role}
                    className="px-3 py-1.5 rounded-lg bg-dark-surface border border-dark-border text-xs text-slate-200 font-semibold"
                  >
                    🎯 {role}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 bg-brand-emerald/10 border border-brand-emerald/30 rounded-xl">
              <h5 className="text-xs font-bold text-brand-emerald uppercase tracking-wider">
                Special Automated Constraint
              </h5>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {currentRules.specialRule}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameDetail;
