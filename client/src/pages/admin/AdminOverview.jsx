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
  X,
  Trophy,
} from 'lucide-react';

const AdminOverview = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');

  // Modals state
  const [showCreateAuctionModal, setShowCreateAuctionModal] = useState(false);
  const [showCreateGameModal, setShowCreateGameModal] = useState(false);

  // Dynamic game & auction states
  const [gamesList, setGamesList] = useState(MOCK_GAMES);
  const [auctionsList, setAuctionsList] = useState(MOCK_AUCTIONS);

  // Forms
  const [newAuctionForm, setNewAuctionForm] = useState({
    title: '',
    gameSlug: 'cricket',
    startingBid: 5000,
    minimumIncrement: 500,
    teamBudgetLimit: 100000,
    maxTeams: 8,
    bannerImage: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=800&auto=format&fit=crop',
  });

  const [newGameForm, setNewGameForm] = useState({
    title: '',
    slug: '',
    categoryType: 'physical_sports',
    developer: '',
    genre: '',
    defaultRoles: '',
    bannerImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
  });

  const stats = {
    totalUsers: 4820,
    totalTeams: 364,
    activeAuctions: auctionsList.filter((a) => a.status === 'live').length,
    totalVolume: 25420000,
  };

  const [pendingParticipants, setPendingParticipants] = useState([
    {
      id: 'p_1',
      name: 'Viper_Snipes',
      uid: '5192847192',
      game: 'BGMI',
      role: 'Sniper / DMR',
      tier: 'Conqueror',
      stat: 'K/D: 5.12',
    },
    {
      id: 'p_2',
      name: 'IM_Praggnanandhaa',
      uid: 'FIDE: 2506001',
      game: 'Chess',
      role: 'Grandmaster (Board 1)',
      tier: 'Super GM',
      stat: 'Elo: 2750',
    },
  ]);

  const handleApprove = (id) => {
    setPendingParticipants((prev) => prev.filter((p) => p.id !== id));
  };

  const handleReject = (id) => {
    setPendingParticipants((prev) => prev.filter((p) => p.id !== id));
  };

  const handleCreateAuction = (e) => {
    e.preventDefault();
    const selectedGame = gamesList.find((g) => g.slug === newAuctionForm.gameSlug) || gamesList[0];

    const created = {
      _id: `auc_custom_${Date.now()}`,
      title: newAuctionForm.title,
      gameSlug: selectedGame.slug,
      gameName: selectedGame.title,
      categoryType: selectedGame.categoryType,
      organizerName: user?.fullName || 'SuperAdmin',
      bannerImage: newAuctionForm.bannerImage,
      status: 'upcoming',
      auctionType: 'player',
      startTime: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
      startingBid: Number(newAuctionForm.startingBid),
      minimumIncrement: Number(newAuctionForm.minimumIncrement),
      registeredParticipantsCount: 0,
      teamBudgetLimit: Number(newAuctionForm.teamBudgetLimit),
    };

    setAuctionsList((prev) => [created, ...prev]);
    setShowCreateAuctionModal(false);
  };

  const handleCreateGame = (e) => {
    e.preventDefault();
    const createdGame = {
      _id: `game_custom_${Date.now()}`,
      title: newGameForm.title,
      slug: newGameForm.slug.toLowerCase().replace(/\s+/g, '-'),
      categoryType: newGameForm.categoryType,
      developer: newGameForm.developer,
      genre: newGameForm.genre,
      bannerImage: newGameForm.bannerImage,
      activeAuctionsCount: 0,
      athletesCount: 0,
      defaultRoles: newGameForm.defaultRoles.split(',').map((r) => r.trim()),
    };

    setGamesList((prev) => [...prev, createdGame]);
    setShowCreateGameModal(false);
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
              Live tournament orchestrator, participant approvals, anti-cheat audit, and multi-game catalog manager.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="gold"
            size="md"
            onClick={() => setShowCreateAuctionModal(true)}
            className="gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Auction</span>
          </Button>
          <Button
            variant="outline"
            size="md"
            onClick={() => setShowCreateGameModal(true)}
            className="gap-2"
          >
            <Trophy className="w-4 h-4" />
            <span>Add Sport / Game</span>
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
          <span>Manage Auctions ({auctionsList.length})</span>
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
          <span>Catalog & Sports ({gamesList.length})</span>
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
              <span className="text-[10px] text-slate-400 mt-1 block">+24.2% this month</span>
            </div>

            <div className="bg-dark-card border border-dark-border p-5 rounded-2xl">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Verified Athletes</span>
              <span className="font-gaming text-2xl font-bold text-slate-100 mt-1 block">
                {stats.totalUsers}
              </span>
              <span className="text-[10px] text-brand-emerald mt-1 block">Esports & Physical Sports</span>
            </div>

            <div className="bg-dark-card border border-dark-border p-5 rounded-2xl">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Clans & Franchises</span>
              <span className="font-gaming text-2xl font-bold text-brand-gold mt-1 block">
                {stats.totalTeams}
              </span>
              <span className="text-[10px] text-slate-400 mt-1 block">Active across 8 titles</span>
            </div>

            <div className="bg-dark-card border border-dark-border p-5 rounded-2xl">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Live Gavel Rooms</span>
              <span className="font-gaming text-2xl font-bold text-brand-crimson mt-1 block">
                {stats.activeAuctions}
              </span>
              <span className="text-[10px] text-brand-crimson mt-1 block">Real-time socket active</span>
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
            <span className="text-xs text-slate-400">Gavel Controls & State Transitions</span>
          </div>

          <div className="space-y-3">
            {auctionsList.map((auc) => (
              <div
                key={auc._id}
                className="bg-dark-surface p-4 rounded-2xl border border-dark-border/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-100 text-sm">{auc.title}</span>
                    <span className="px-2 py-0.5 rounded bg-dark-bg border border-dark-border text-[10px] font-bold text-brand-emerald">
                      {auc.gameName}
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs mt-1">
                    Status: <span className="font-semibold text-brand-emerald capitalize">{auc.status}</span> | Registered:{' '}
                    {auc.registeredParticipantsCount || 0}
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
                        <span>Strike Gavel</span>
                      </Button>
                    </>
                  ) : (
                    <Button variant="primary" size="sm" className="gap-1">
                      <Play className="w-3.5 h-3.5" />
                      <span>Start Live Now</span>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Games & Sports Catalog */}
      {activeTab === 'games' && (
        <div className="bg-dark-card border border-dark-border rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-gaming text-xl font-bold text-slate-100 uppercase">
              Supported Game Titles & Physical Sports
            </h3>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowCreateGameModal(true)}
              className="gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add New Sport / Game</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {gamesList.map((game) => (
              <div key={game._id} className="bg-dark-surface p-4 rounded-xl border border-dark-border/60 flex items-center justify-between">
                <div>
                  <h4 className="font-gaming text-lg font-bold text-slate-100">{game.title}</h4>
                  <p className="text-xs text-slate-400">
                    {game.categoryType === 'physical_sports' ? '🏏 Physical Sport' : '🎮 Esports'} • {game.developer}
                  </p>
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
                    UID: <span className="font-mono text-slate-200">{p.uid}</span> | Role: {p.role} | {p.stat}
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
              <p className="text-xs text-slate-400 py-6 text-center">No pending athlete registrations.</p>
            )}
          </div>
        </div>
      )}

      {/* MODAL 1: Create New Auction */}
      {showCreateAuctionModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-dark-card border border-brand-gold/60 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-glow-gold/20">
            <div className="flex items-center justify-between border-b border-dark-border pb-3">
              <h3 className="font-gaming text-xl font-bold text-slate-100 uppercase">
                Create Live Auction
              </h3>
              <button
                type="button"
                onClick={() => setShowCreateAuctionModal(false)}
                className="text-slate-400 hover:text-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAuction} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Tournament Title</label>
                <input
                  type="text"
                  required
                  value={newAuctionForm.title}
                  onChange={(e) => setNewAuctionForm({ ...newAuctionForm, title: e.target.value })}
                  placeholder="e.g. Delhi Premier Box Cricket Season 1"
                  className="w-full px-3 py-2 bg-dark-surface border border-dark-border rounded-xl text-slate-100 focus:outline-none focus:border-brand-emerald"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Sport / Game</label>
                  <select
                    value={newAuctionForm.gameSlug}
                    onChange={(e) => setNewAuctionForm({ ...newAuctionForm, gameSlug: e.target.value })}
                    className="w-full px-3 py-2 bg-dark-surface border border-dark-border rounded-xl text-slate-100 focus:outline-none focus:border-brand-emerald"
                  >
                    {gamesList.map((g) => (
                      <option key={g.slug} value={g.slug}>
                        {g.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Franchise Purse Limit (₹)</label>
                  <input
                    type="number"
                    required
                    value={newAuctionForm.teamBudgetLimit}
                    onChange={(e) => setNewAuctionForm({ ...newAuctionForm, teamBudgetLimit: e.target.value })}
                    className="w-full px-3 py-2 bg-dark-surface border border-dark-border rounded-xl text-slate-100 focus:outline-none focus:border-brand-emerald"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Starting Bid (₹)</label>
                  <input
                    type="number"
                    required
                    value={newAuctionForm.startingBid}
                    onChange={(e) => setNewAuctionForm({ ...newAuctionForm, startingBid: e.target.value })}
                    className="w-full px-3 py-2 bg-dark-surface border border-dark-border rounded-xl text-slate-100 focus:outline-none focus:border-brand-emerald"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Min Increment (₹)</label>
                  <input
                    type="number"
                    required
                    value={newAuctionForm.minimumIncrement}
                    onChange={(e) => setNewAuctionForm({ ...newAuctionForm, minimumIncrement: e.target.value })}
                    className="w-full px-3 py-2 bg-dark-surface border border-dark-border rounded-xl text-slate-100 focus:outline-none focus:border-brand-emerald"
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button type="submit" variant="gold" size="md" className="w-full">
                  Create Tournament Auction
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Add New Game / Sport */}
      {showCreateGameModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-dark-card border border-brand-emerald/60 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-glow-emerald">
            <div className="flex items-center justify-between border-b border-dark-border pb-3">
              <h3 className="font-gaming text-xl font-bold text-slate-100 uppercase">
                Add Sport or Esports Title
              </h3>
              <button
                type="button"
                onClick={() => setShowCreateGameModal(false)}
                className="text-slate-400 hover:text-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGame} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={newGameForm.title}
                    onChange={(e) => setNewGameForm({ ...newGameForm, title: e.target.value })}
                    placeholder="e.g. Table Tennis"
                    className="w-full px-3 py-2 bg-dark-surface border border-dark-border rounded-xl text-slate-100 focus:outline-none focus:border-brand-emerald"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={newGameForm.categoryType}
                    onChange={(e) => setNewGameForm({ ...newGameForm, categoryType: e.target.value })}
                    className="w-full px-3 py-2 bg-dark-surface border border-dark-border rounded-xl text-slate-100 focus:outline-none focus:border-brand-emerald"
                  >
                    <option value="physical_sports">Physical Sport</option>
                    <option value="esports">Esports & Gaming</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Association / Developer</label>
                <input
                  type="text"
                  required
                  value={newGameForm.developer}
                  onChange={(e) => setNewGameForm({ ...newGameForm, developer: e.target.value })}
                  placeholder="e.g. Table Tennis Federation"
                  className="w-full px-3 py-2 bg-dark-surface border border-dark-border rounded-xl text-slate-100 focus:outline-none focus:border-brand-emerald"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Default Roles (comma separated)</label>
                <input
                  type="text"
                  required
                  value={newGameForm.defaultRoles}
                  onChange={(e) => setNewGameForm({ ...newGameForm, defaultRoles: e.target.value })}
                  placeholder="Singles Attacker, Defensive Chopper, Doubles Partner"
                  className="w-full px-3 py-2 bg-dark-surface border border-dark-border rounded-xl text-slate-100 focus:outline-none focus:border-brand-emerald"
                />
              </div>

              <div className="pt-2">
                <Button type="submit" variant="primary" size="md" className="w-full">
                  Save to Catalog
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOverview;
