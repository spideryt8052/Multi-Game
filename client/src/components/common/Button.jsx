import React from 'react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  icon: Icon,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-bg disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-95';

  const variants = {
    primary: 'bg-brand-emerald text-black hover:bg-[#00c985] shadow-glow-emerald focus:ring-brand-emerald',
    danger: 'bg-brand-crimson text-white hover:bg-[#e03a48] shadow-glow-crimson focus:ring-brand-crimson',
    gold: 'bg-brand-gold text-black hover:bg-[#df9317] shadow-glow-gold focus:ring-brand-gold',
    outline: 'border border-dark-border bg-dark-surface/60 text-slate-200 hover:border-brand-emerald hover:text-brand-emerald focus:ring-brand-emerald',
    secondary: 'bg-dark-surface text-slate-200 hover:bg-dark-hover border border-dark-border focus:ring-slate-400',
    ghost: 'text-slate-400 hover:text-slate-100 hover:bg-dark-surface/50 focus:ring-slate-500',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3 gap-2.5 font-bold',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : Icon ? (
        <Icon className="w-4 h-4 shrink-0" />
      ) : null}
      {children}
    </button>
  );
};

export default Button;

