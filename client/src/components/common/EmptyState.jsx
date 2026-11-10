import React from 'react';

export const LoadingSkeleton = ({ count = 3, height = 'h-32', className = '' }) => {
  return (
    <div className={`grid gap-4 w-full ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`${height} bg-dark-card border border-dark-border/50 rounded-xl animate-pulse flex flex-col justify-end p-4`}
        >
          <div className="h-4 bg-dark-surface rounded w-3/4 mb-2" />
          <div className="h-3 bg-dark-surface/60 rounded w-1/2" />
        </div>
      ))}
    </div>
  );
};

export const EmptyState = ({
  icon: Icon,
  title = 'No items found',
  description = 'There are no active auctions or records available at this moment.',
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-dark-card border border-dark-border rounded-2xl my-6">
      {Icon && (
        <div className="w-14 h-14 rounded-full bg-dark-surface flex items-center justify-center text-slate-400 mb-4 border border-dark-border">
          <Icon className="w-7 h-7" />
        </div>
      )}
      <h3 className="text-lg font-bold text-slate-100 mb-1">{title}</h3>
      <p className="text-sm text-slate-400 max-w-md mb-6">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 bg-brand-emerald text-black text-sm font-semibold rounded-lg hover:bg-[#00c985] transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default { LoadingSkeleton, EmptyState };

