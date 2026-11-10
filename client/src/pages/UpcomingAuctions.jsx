import React from 'react';
import { MOCK_AUCTIONS } from '../utils/mockData';
import AuctionCard from '../components/cards/AuctionCard';
import { Calendar } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';

const UpcomingAuctions = () => {
  const { t } = useTranslation();
  const upcomingAuctions = MOCK_AUCTIONS.filter((a) => a.status === 'upcoming');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-2 pb-4 border-b border-dark-border">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-purple/15 border border-brand-purple/30 text-brand-purple text-xs font-bold uppercase tracking-wider">
          <Calendar className="w-3.5 h-3.5" />
          <span>Scheduled Tournaments</span>
        </div>
        <h1 className="font-gaming text-4xl sm:text-5xl font-extrabold text-slate-100 uppercase tracking-wide">
          {t('nav.upcoming')}
        </h1>
        <p className="text-sm text-slate-400">
          Review upcoming lot drafts and squad auctions. Ensure your team wallet is funded and athlete profiles are approved before the live deadline.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {upcomingAuctions.map((auction) => (
          <AuctionCard key={auction._id} auction={auction} />
        ))}
      </div>
    </div>
  );
};

export default UpcomingAuctions;

