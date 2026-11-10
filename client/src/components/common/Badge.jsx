import React from 'react';

const Badge = ({ variant = 'default', children, className = '', pulse = false }) => {
  const variants = {
    live: 'bg-brand-crimson/15 text-brand-crimson border-brand-crimson/30',
    upcoming: 'bg-brand-purple/15 text-brand-purple border-brand-purple/30',
    sold: 'bg-brand-emerald/15 text-brand-emerald border-brand-emerald/30',
    unsold: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
    gold: 'bg-brand-gold/15 text-brand-gold border-brand-gold/30',
    info: 'bg-brand-cyan/15 text-brand-cyan border-brand-cyan/30',
    default: 'bg-dark-surface text-slate-300 border-dark-border',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
        variants[variant] || variants.default
      } ${className}`}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-current" />
        </span>
      )}
      {children}
    </span>
  );
};

export default Badge;

