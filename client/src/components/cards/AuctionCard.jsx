import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../context/LanguageContext';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import Badge from '../common/Badge';
import CountdownTimer from '../common/CountdownTimer';
import { Flame, Shield, Users, ArrowUpRight } from 'lucide-react';

const AuctionCard = ({ auction }) => {
  const { t } = useTranslation();

  const isLive = auction.status === 'live';
  const isUpcoming = auction.status === 'upcoming';
  const isCompleted = auction.status === 'completed';

  const defaultBanner =
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop';

  const roomLink = isLive ? `/auctions/live/${auction._id}` : `/auctions/${auction._id}`;

  return (
    <div className="group relative bg-dark-card border border-dark-border rounded-2xl overflow-hidden hover:border-slate-600 transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Banner with Status & Game Overlay */}
        <div className="relative h-44 w-full overflow-hidden bg-dark-surface">
          <img
            src={auction.bannerImage || defaultBanner}
            alt={auction.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-card via-transparent to-black/60" />

          {/* Top badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-dark-bg/90 backdrop-blur-sm text-slate-200 border border-dark-border">
              {auction.game?.title || auction.gameName || 'Esports'}
            </span>

            {isLive && (
              <Badge variant="live" pulse>
                {t('auction.live_now')}
              </Badge>
            )}
            {isUpcoming && (
              <Badge variant="upcoming">
                {t('auction.upcoming_badge')}
              </Badge>
            )}
            {isCompleted && (
              <Badge variant="sold">
                {t('auction.completed_badge')}
              </Badge>
            )}
          </div>

          {/* Current Lot Athlete Pill if Live */}
          {isLive && auction.currentLot?.participant && (
            <div className="absolute bottom-3 left-3 right-3 bg-dark-bg/90 backdrop-blur-md border border-brand-crimson/30 rounded-lg p-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-brand-crimson/20 border border-brand-crimson flex items-center justify-center text-xs font-bold text-brand-crimson">
                  LOT
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-100 leading-none">
                    {auction.currentLot.participant.inGameName || 'Active Athlete'}
                  </p>
                  <p className="text-[10px] text-slate-400 capitalize">
                    {auction.currentLot.participant.primaryRole || 'Player'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block leading-none">
                  {t('auction.current_bid')}
                </span>
                <span className="text-xs font-mono font-bold text-brand-emerald">
                  {formatCurrency(auction.currentLot.currentBid || auction.startingBid)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-gaming text-lg font-bold text-slate-100 group-hover:text-brand-emerald transition-colors line-clamp-1">
              {auction.title}
            </h3>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-400">
              <Shield className="w-3.5 h-3.5 text-brand-gold" />
              <span>Host: {auction.organizer?.username || auction.organizerName || 'Official'}</span>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-2 bg-dark-surface/60 rounded-xl p-2.5 border border-dark-border/40 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                {isLive ? t('auction.current_bid') : t('auction.starting_bid')}
              </span>
              <span className="font-mono font-bold text-slate-100 text-sm">
                {formatCurrency(isLive ? auction.currentLot?.currentBid || auction.startingBid : auction.startingBid)}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                {t('auction.min_increment')}
              </span>
              <span className="font-mono font-semibold text-brand-emerald text-sm">
                +{formatCurrency(auction.minimumIncrement || 50)}
              </span>
            </div>
          </div>

          {/* Time & Participants info */}
          <div className="flex items-center justify-between text-xs pt-1">
            <div className="flex items-center gap-1.5 text-slate-400">
              <Users className="w-3.5 h-3.5" />
              <span>{auction.registeredParticipantsCount || 0} Registered</span>
            </div>
            {isUpcoming && auction.startTime && (
              <CountdownTimer targetDate={auction.startTime} compact />
            )}
            {isCompleted && (
              <span className="text-slate-400 text-[11px]">
                {formatDate(auction.endTime || auction.updatedAt)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card Action Link */}
      <div className="p-4 pt-0">
        <Link
          to={roomLink}
          className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            isLive
              ? 'bg-brand-crimson hover:bg-[#e03a48] text-white shadow-glow-crimson'
              : 'bg-dark-surface hover:bg-dark-border text-slate-200 border border-dark-border hover:text-brand-emerald'
          }`}
        >
          {isLive ? (
            <>
              <Flame className="w-4 h-4 animate-bounce" />
              <span>{t('auction.enter_room')}</span>
            </>
          ) : (
            <>
              <span>View Auction Details</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </>
          )}
        </Link>
      </div>
    </div>
  );
};

export default AuctionCard;

