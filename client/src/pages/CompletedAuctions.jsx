import React from 'react';
import { MOCK_AUCTIONS } from '../utils/mockData';
import AuctionCard from '../components/cards/AuctionCard';
import { Trophy } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';

const CompletedAuctions = () => {
  const { t } = useTranslation();
  const completedAuctions = MOCK_AUCTIONS.filter((a) => a.status === 'completed');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-2 pb-4 border-b border-dark-border">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/15 border border-brand-gold/30 text-brand-gold text-xs font-bold uppercase tracking-wider">
          <Trophy className="w-3.5 h-3.5" />
          <span>Esports Hall of Fame</span>
        </div>
        <h1 className="font-gaming text-4xl sm:text-5xl font-extrabold text-slate-100 uppercase tracking-wide">
          {t('nav.completed')}
        </h1>
        <p className="text-sm text-slate-400">
          Official records and contract values from concluded auction sessions. See which clans secured top athletes.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {completedAuctions.map((auction) => (
          <AuctionCard key={auction._id} auction={auction} />
        ))}
      </div>
    </div>
  );
};

export default CompletedAuctions;

