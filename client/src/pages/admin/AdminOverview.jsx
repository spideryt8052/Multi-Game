import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../context/LanguageContext';
import { MOCK_GAMES, MOCK_AUCTIONS } from '../../utils/mockData';
import { formatCurrency } from '../../utils/formatCurrency';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import {
  Shield,
  Gamepad2,
  Flame,
  Users,
  AlertTriangle,
  Play,
  Pause,
  PlusCircle,
  CheckCircle,
  XCircle,
  TrendingUp,
  BarChart3,
} from 'lucide-react';

const AdminOverview = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'games', 'auctions', 'users', 'approvals'

  // Admin stats
  const stats = {
    totalUsers: 4820,
    totalTeams: 364,
    activeAuctions: 3,
    totalVolume: 15420000,
    pendingApprovals: 8,
  };

  const [pendingParticipants, setPendingParticipants] = useState([
    {
      id: 'p_1',
      name: 'Viper_Snipes',
      uid: '5192847192',
      game: 'BGMI',
      role: 'Sniper / DMR',
      tier: 'Conqueror',
      kd: '5.12',
    },
    {
      id: 'p_2',
      name: 'Phoenix_Duelist',
      uid: 'Phoenix#IND',
      game: 'Valorant',
      role: 'Duelist',
      tier: 'Immortal 3',
      kd: '1.42',
    },
  ]);

  const handleApprove = (id) => {
    setPendingParticipants((prev) => prev.filter((p) => p.id !== id));
  };

  const handleReject = (id) => {
    setPendingParticipants((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Admin Header */}
      <div className="bg-dark-card border border-brand-gold/40 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-glow-gold/10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-brand-gold/15 border border-brand-gold/40 text-brand-gold flex items-center justify-center font-bold text-2xl">
            <Shield className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-gaming text-3xl font-extrabold text-slate-100 uppercase">
                Arena Admin Command Center
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-gold/15 text-brand-gold border border-brand-gold/30">
                Root SuperAdmin
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Live tournament orchestrator, participant approvals, anti-cheat audit and game catalog manager.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="gold" size="md" className="gap-2">
            <PlusCircle className="w-4 h-4" />
            <span>Create New Auction</span>
          </Button>
        </div>
      </div>

      {/* Admin Tabs */}
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
          <BarChart3 className="w-4 h-4" />
          <span>Platform Metrics</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('auctions')}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'auctions'
              ? 'bg-brand-emerald text-black shadow-glow-emerald'
              : 'text-slate-400 hover:text-slate-100'
          }`}
        >
          <Flame className="w-4 h-4" />
          <span>Manage Auctions & Hammer</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('games')}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'games'
              ? 'bg-brand-emerald text-black shadow-glow-emerald'
              : 'text-slate-400 hover:text-slate-100'
          }`}
        >
          <Gamepad2 className="w-4 h-4" />
          <span>Manage Games & Rules</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('approvals')}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'approvals'
              ? 'bg-brand-emerald text-black shadow-glow-emerald'
              : 'text-slate-400 hover:text-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Approvals ({pendingParticipants.length})</span>
        </button>
      </div>

      {/* Tab 1: Platform Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-dark-card border border-dark-border p-5 rounded-2xl">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Total Bidding Volume</span>
              <span className="font-gaming text-2xl font-bold text-brand-emerald mt-1 block">
                {formatCurrency(stats.totalVolume)}
              </span>
              <span className="text-[10px] text-slate-400 mt-1 block">+18.4% this month</span>
            </div>

            <div className="bg-dark-card border border-dark-border p-5 rounded-2xl">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Verified Athletes</span>
              <span className="font-gaming text-2xl font-bold text-slate-100 mt-1 block">
                {stats.totalUsers}
              </span>
              <span className="text-[10px] text-brand-emerald mt-1 block">98.2% KYC Verified</span>
            </div>

            <div className="bg-dark-card border border-dark-border p-5 rounded-2xl">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Clans & Teams</span>
              <span className="font-gaming text-2xl font-bold text-brand-gold mt-1 block">
                {stats.totalTeams}
              </span>
              <span className="text-[10px] text-slate-400 mt-1 block">Active across 6 games</span>
            </div>

            <div className="bg-dark-card border border-dark-border p-5 rounded-2xl">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Live Auction Rooms</span>
              <span className="font-gaming text-2xl font-bold text-brand-crimson mt-1 block">
                {stats.activeAuctions}
              </span>
              <span className="text-[10px] text-brand-crimson mt-1 block">Broadcasting right now</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Manage Auctions */}
      {activeTab === 'auctions' && (
        <div className="bg-dark-card border border-dark-border rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-gaming text-xl font-bold text-slate-100 uppercase">
              Live Auction Control Console
            </h3>
            <span className="text-xs text-slate-400">Hammer Controls & State Transitions</span>
          </div>

          <div className="space-y-3">
            {MOCK_AUCTIONS.map((auc) => (
              <div
                key={auc._id}
                className="bg-dark-surface p-4 rounded-2xl border border-dark-border/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-100 text-sm">{auc.title}</span>
                    <span className="px-2 py-0.5 rounded bg-dark-bg border border-dark-border text-[10px] font-bold text-slate-300">
                      {auc.gameName}
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs mt-1">
                    Status: <span className="font-semibold text-brand-emerald capitalize">{auc.status}</span> | Registered:{' '}
                    {auc.registeredParticipantsCount}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {auc.status === 'live' ? (
                    <>
                      <Button variant="danger" size="sm" className="gap-1">
                        <Pause className="w-3.5 h-3.5" />
                        <span>Pause Room</span>
                      </Button>
                      <Button variant="gold" size="sm" className="gap-1">
                        <Play className="w-3.5 h-3.5" />
                        <span>Strike Hammer</span>
                      </Button>
                    </>
                  ) : (
                    <Button variant="primary" size="sm" className="gap-1">
                      <Play className="w-3.5 h-3.5" />
                      <span>Start Auction Live</span>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Games Catalog */}
      {activeTab === 'games' && (
        <div className="bg-dark-card border border-dark-border rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-gaming text-xl font-bold text-slate-100 uppercase">
              Supported Game Titles & Rule Engines
            </h3>
            <Button variant="primary" size="sm" className="gap-1">
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add New Game</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MOCK_GAMES.map((game) => (
              <div key={game._id} className="bg-dark-surface p-4 rounded-xl border border-dark-border/60 flex items-center justify-between">
                <div>
                  <h4 className="font-gaming text-lg font-bold text-slate-100">{game.title}</h4>
                  <p className="text-xs text-slate-400">{game.genre} | {game.developer}</p>
                </div>
                <Button variant="outline" size="sm">
                  Edit Rules
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Approvals */}
      {activeTab === 'approvals' && (
        <div className="bg-dark-card border border-dark-border rounded-2xl p-6 space-y-4">
          <h3 className="font-gaming text-xl font-bold text-slate-100 uppercase">
            Pending Athlete Auction Registrations
          </h3>

          <div className="space-y-3">
            {pendingParticipants.map((p) => (
              <div
                key={p.id}
                className="bg-dark-surface p-4 rounded-2xl border border-dark-border/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-100 text-sm">{p.name}</span>
                    <span className="px-2 py-0.5 rounded bg-dark-bg border border-dark-border text-[10px] text-brand-emerald">
                      {p.game}
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs mt-1">
                    UID: <span className="font-mono text-slate-200">{p.uid}</span> | Role: {p.role} | Tier: {p.tier} | K/D: {p.kd}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleApprove(p.id)}
                    className="gap-1 bg-brand-emerald text-black"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Approve Lot</span>
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleReject(p.id)}
                    className="gap-1 bg-brand-crimson"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </Button>
                </div>
              </div>
            ))}

            {pendingParticipants.length === 0 && (
              <p className="text-xs text-slate-400 py-6 text-center">No pending participant registrations.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOverview;

