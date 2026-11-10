import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../context/LanguageContext';
import { Users, Flame, ChevronRight } from 'lucide-react';

const GameCard = ({ game }) => {
  const { t } = useTranslation();

  const defaultImages = {
    bgmi: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop',
    valorant: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=800&auto=format&fit=crop',
    freefire: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800&auto=format&fit=crop',
    cs2: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop',
    gta: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
    fifa: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=800&auto=format&fit=crop',
    minecraft: 'https://images.unsplash.com/photo-1627856013091-fed6e4e30025?q=80&w=800&auto=format&fit=crop',
    cod: 'https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=800&auto=format&fit=crop',
  };

  const imageSrc = game.bannerImage || defaultImages[game.slug] || defaultImages.bgmi;

  return (
    <Link
      to={`/games/${game.slug}`}
      className="group relative bg-dark-card border border-dark-border rounded-2xl overflow-hidden hover:border-brand-emerald transition-all duration-300 hover:-translate-y-1 hover:shadow-glow-emerald flex flex-col"
    >
      {/* Game Banner Image */}
      <div className="relative h-44 w-full overflow-hidden bg-dark-surface">
        <img
          src={imageSrc}
          alt={game.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-card via-dark-card/40 to-transparent" />
        
        {/* Genre Pill */}
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-dark-bg/85 backdrop-blur-sm text-brand-emerald border border-brand-emerald/30">
          {game.genre || 'Esports'}
        </span>

        {/* Live indicator if active auctions exist */}
        {game.activeAuctionsCount > 0 && (
          <span className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-crimson/90 text-white animate-pulse">
            <Flame className="w-3 h-3" />
            <span>{game.activeAuctionsCount} LIVE</span>
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-gaming text-xl font-bold text-slate-100 group-hover:text-brand-emerald transition-colors">
              {game.title}
            </h3>
            <span className="text-[10px] text-slate-400 font-semibold">{game.developer}</span>
          </div>
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {game.description || `Explore dedicated player drafts, squad auctions, and rules for ${game.title}.`}
          </p>
        </div>

        {/* Stats footer */}
        <div className="mt-4 pt-3 border-t border-dark-border/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span>{game.athletesCount || '120+'} Athletes</span>
          </div>
          <span className="text-brand-emerald font-semibold flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
            <span>{t('games.explore_game')}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
};

export default GameCard;

