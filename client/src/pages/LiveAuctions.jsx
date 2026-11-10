import React from 'react';
import { MOCK_AUCTIONS } from '../utils/mockData';
import AuctionCard from '../components/cards/AuctionCard';
import { Flame } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';

const LiveAuctions = () => {
  const { t } = useTranslation();
  const liveAuctions = MOCK_AUCTIONS.filter((a) => a.status === 'live');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-2 pb-4 border-b border-dark-border">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-crimson/15 border border-brand-crimson/30 text-brand-crimson text-xs font-bold uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full bg-brand-crimson animate-ping" />
          <span>Real-Time Bidding Active</span>
        </div>
        <h1 className="font-gaming text-4xl sm:text-5xl font-extrabold text-slate-100 uppercase tracking-wide">
          {t('nav.live_auctions')}
        </h1>
        <p className="text-sm text-slate-400">
          Enter any active live auction room to spectate real-time bids, follow player lots, or place atomic bids as a verified team manager.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {liveAuctions.map((auction) => (
          <AuctionCard key={auction._id} auction={auction} />
        ))}
      </div>

      {liveAuctions.length === 0 && (
        <div className="text-center py-16 bg-dark-card border border-dark-border rounded-2xl">
          <Flame className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-100">No Live Auctions Right Now</h3>
          <p className="text-xs text-slate-400 mt-1">Please explore our Upcoming Auctions section to register early.</p>
        </div>
      )}
    </div>
  );
};

export default LiveAuctions;

