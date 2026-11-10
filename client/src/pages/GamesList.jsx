import React, { useState } from 'react';
import { MOCK_GAMES } from '../utils/mockData';
import GameCard from '../components/cards/GameCard';
import { Search, Trophy } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';

const GamesList = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all'); // 'all', 'physical_sports', 'esports'

  const filteredGames = MOCK_GAMES.filter((game) => {
    const matchesSearch =
      game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.genre.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' || game.categoryType === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-dark-card border border-brand-emerald/40 text-brand-emerald text-xs font-bold uppercase tracking-wider">
          <Trophy className="w-3.5 h-3.5" />
          <span>Multi-Game & Sports Catalog</span>
        </div>
        <h1 className="font-gaming text-4xl sm:text-5xl font-extrabold text-slate-100 uppercase tracking-wide">
          {t('games.title')}
        </h1>
        <p className="text-sm text-slate-400">
          Explore dedicated auction hubs for Real Physical Sports (Cricket, Football, Kabaddi, Badminton) and premier Esports titles. Every sport features isolated team budgets and player draft pools.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-dark-card border border-dark-border p-3 rounded-2xl">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Cricket, Football, BGMI..."
            className="w-full pl-10 pr-4 py-2 bg-dark-surface border border-dark-border rounded-xl text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-brand-emerald"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-brand-emerald text-black font-bold'
                : 'bg-dark-surface text-slate-400 hover:text-slate-100'
            }`}
          >
            All Titles ({MOCK_GAMES.length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('physical_sports')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1 ${
              selectedCategory === 'physical_sports'
                ? 'bg-brand-emerald text-black font-bold'
                : 'bg-dark-surface text-slate-400 hover:text-slate-100'
            }`}
          >
            🏏 Physical Sports
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('esports')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1 ${
              selectedCategory === 'esports'
                ? 'bg-brand-emerald text-black font-bold'
                : 'bg-dark-surface text-slate-400 hover:text-slate-100'
            }`}
          >
            🎮 Esports
          </button>
        </div>
      </div>

      {/* Game Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGames.map((game) => (
          <GameCard key={game._id} game={game} />
        ))}
      </div>

      {filteredGames.length === 0 && (
        <div className="text-center py-16 bg-dark-card border border-dark-border rounded-2xl">
          <p className="text-slate-400 text-sm">No game or sport found matching your search term.</p>
        </div>
      )}
    </div>
  );
};

export default GamesList;
