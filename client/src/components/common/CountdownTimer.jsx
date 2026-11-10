import React, { useState, useEffect } from 'react';
import { getTimeLeft } from '../../utils/formatDate';

const CountdownTimer = ({ targetDate, onExpire, compact = false }) => {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = getTimeLeft(targetDate);
      setTimeLeft(remaining);

      if (remaining.expired) {
        clearInterval(timer);
        if (onExpire) onExpire();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onExpire]);

  if (timeLeft.expired) {
    return <span className="text-brand-crimson font-bold text-xs uppercase tracking-wider">Expired / Closed</span>;
  }

  if (compact) {
    return (
      <span className="font-mono text-xs font-semibold text-brand-emerald">
        {timeLeft.days > 0 ? `${timeLeft.days}d ` : ''}
        {String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.minutes).padStart(2, '0')}m : {String(timeLeft.seconds).padStart(2, '0')}s
      </span>
    );
  }

  return (
    <div className="flex items-center gap-1.5 font-mono">
      {timeLeft.days > 0 && (
        <div className="flex flex-col items-center bg-dark-bg/80 border border-dark-border px-2 py-1 rounded">
          <span className="text-xs font-bold text-slate-100">{timeLeft.days}</span>
          <span className="text-[9px] text-slate-400 uppercase">Days</span>
        </div>
      )}
      <div className="flex flex-col items-center bg-dark-bg/80 border border-dark-border px-2 py-1 rounded">
        <span className="text-xs font-bold text-slate-100">{String(timeLeft.hours).padStart(2, '0')}</span>
        <span className="text-[9px] text-slate-400 uppercase">Hrs</span>
      </div>
      <span className="text-slate-500 font-bold">:</span>
      <div className="flex flex-col items-center bg-dark-bg/80 border border-dark-border px-2 py-1 rounded">
        <span className="text-xs font-bold text-slate-100">{String(timeLeft.minutes).padStart(2, '0')}</span>
        <span className="text-[9px] text-slate-400 uppercase">Min</span>
      </div>
      <span className="text-slate-500 font-bold">:</span>
      <div className="flex flex-col items-center bg-dark-bg/80 border border-dark-border px-2 py-1 rounded text-brand-emerald">
        <span className="text-xs font-bold">{String(timeLeft.seconds).padStart(2, '0')}</span>
        <span className="text-[9px] text-brand-emerald/70 uppercase">Sec</span>
      </div>
    </div>
  );
};

export default CountdownTimer;

