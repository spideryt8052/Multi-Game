import React, { useState } from 'react';
import { MOCK_GAMES } from '../utils/mockData';
import GameCard from '../components/cards/GameCard';
import { Search, Gamepad2 } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';

const GamesList = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');

  const genres = ['All', 'Battle Royale', 'Tactical FPS', 'Sports Simulation', 'Open World / RP'];

  const filteredGames = MOCK_GAMES.filter((game) => {
    const matchesSearch =
      game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre === 'All' || game.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-dark-card border border-brand-emerald/40 text-brand-emerald text-xs font-bold uppercase tracking-wider">
          <Gamepad2 className="w-3.5 h-3.5" />
          <span>Esports Catalog</span>
        </div>
        <h1 className="font-gaming text-4xl sm:text-5xl font-extrabold text-slate-100 uppercase tracking-wide">
          {t('games.title')}
        </h1>
        <p className="text-sm text-slate-400">
          Every title on Arena Auctions features isolated tournament rosters, role caps, and budget rules. Select a game to view its active rooms and player pool.
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
            placeholder="Search games, genre..."
            className="w-full pl-10 pr-4 py-2 bg-dark-surface border border-dark-border rounded-xl text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-brand-emerald"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {genres.map((genre) => (
            <button
              key={genre}
              type="button"
              onClick={() => setSelectedGenre(genre)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedGenre === genre
                  ? 'bg-brand-emerald text-black font-bold'
                  : 'bg-dark-surface text-slate-400 hover:text-slate-100'
              }`}
            >
              {genre}
            </button>
          ))}
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
          <p className="text-slate-400 text-sm">No game found matching your search term.</p>
        </div>
      )}
    </div>
  );
};

export default GamesList;

