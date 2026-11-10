import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';
import {
  Flame,
  Gamepad2,
  Trophy,
  Calendar,
  BookOpen,
  Menu,
  X,
  User as UserIcon,
  LogOut,
  Shield,
  Layers,
} from 'lucide-react';

const Navbar = () => {
  const { t } = useTranslation();
  const { user, isAuthenticated, logout, hasRole } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const navLinks = [
    { name: t('nav.home'), path: '/', icon: null },
    { name: t('nav.all_games'), path: '/games', icon: Gamepad2 },
    {
      name: t('nav.live_auctions'),
      path: '/auctions/live',
      icon: Flame,
      highlight: true,
    },
    { name: t('nav.upcoming'), path: '/auctions/upcoming', icon: Calendar },
    { name: t('nav.rules'), path: '/rules', icon: BookOpen },
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 bg-dark-bg/95 backdrop-blur-md border-b border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-emerald to-emerald-600 flex items-center justify-center font-black text-black text-lg shadow-glow-emerald group-hover:scale-105 transition-transform">
                ⚡
              </div>
              <div className="flex flex-col">
                <span className="font-gaming text-xl font-bold tracking-wider text-slate-100 group-hover:text-brand-emerald transition-colors">
                  ARENA<span className="text-brand-emerald">AUCTIONS</span>
                </span>
                <span className="text-[9px] uppercase tracking-widest text-slate-400 font-semibold -mt-1">
                  Esports Bidding
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? 'text-brand-emerald bg-dark-card font-semibold'
                      : 'text-slate-300 hover:text-slate-100 hover:bg-dark-surface/50'
                  }`}
                >
                  {Icon && (
                    <Icon
                      className={`w-4 h-4 ${
                        link.highlight ? 'text-brand-crimson animate-pulse' : ''
                      }`}
                    />
                  )}
                  <span>{link.name}</span>
                  {link.highlight && (
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-crimson opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-crimson" />
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Auth Actions */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 bg-dark-card hover:bg-dark-surface border border-dark-border px-3 py-1.5 rounded-lg text-sm transition-all focus:outline-none"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-brand-emerald/40 to-brand-cyan/40 border border-brand-emerald/50 flex items-center justify-center text-xs font-bold text-slate-100 uppercase">
                    {user?.username ? user.username.substring(0, 2) : 'ME'}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-semibold text-slate-100 line-clamp-1 max-w-[100px]">
                      {user?.username || 'User'}
                    </span>
                    <span className="text-[10px] text-brand-emerald uppercase font-bold tracking-wider">
                      {user?.role === 'user'
                        ? '👁️ Darshak'
                        : user?.role === 'gamer'
                        ? '🏃 Player'
                        : user?.role === 'team_owner'
                        ? '🛡️ Team Owner'
                        : '👑 Admin'}
                    </span>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-dark-card border border-dark-border rounded-xl shadow-2xl py-2 z-50">
                    <div className="px-4 py-2 border-b border-dark-border text-xs">
                      <p className="text-slate-400">Signed in as</p>
                      <p className="font-semibold text-slate-200 truncate">{user?.email}</p>
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-300 hover:bg-dark-surface hover:text-brand-emerald transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-slate-400" />
                      <span>{t('nav.dashboard')}</span>
                    </Link>

                    <Link
                      to="/teams"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-300 hover:bg-dark-surface hover:text-brand-emerald transition-colors"
                    >
                      <Layers className="w-4 h-4 text-slate-400" />
                      <span>{t('nav.team_hub')}</span>
                    </Link>

                    {hasRole('admin') && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-brand-gold hover:bg-dark-surface transition-colors"
                      >
                        <Shield className="w-4 h-4" />
                        <span>{t('nav.admin_panel')}</span>
                      </Link>
                    )}

                    <div className="border-t border-dark-border mt-1 pt-1">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex items-center gap-2.5 w-full text-left px-4 py-2 text-sm text-brand-crimson hover:bg-brand-crimson/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>{t('nav.logout')}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 rounded-lg text-sm font-semibold text-slate-200 hover:text-brand-emerald transition-colors"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-1.5 rounded-lg text-sm font-bold bg-brand-emerald text-black hover:bg-[#00c985] shadow-glow-emerald transition-all"
                >
                  {t('nav.register')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <LanguageSwitcher />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-dark-card border border-dark-border text-slate-300 hover:text-slate-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-dark-card/95 border-b border-dark-border px-4 pt-2 pb-6 space-y-3">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium text-slate-300 hover:bg-dark-surface hover:text-brand-emerald"
                >
                  {Icon && <Icon className="w-5 h-5" />}
                  <span>{link.name}</span>
                  {link.highlight && (
                    <span className="ml-auto px-2 py-0.5 text-[10px] font-bold rounded-full bg-brand-crimson/20 text-brand-crimson border border-brand-crimson/30">
                      LIVE
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          <div className="border-t border-dark-border pt-3">
            {isAuthenticated ? (
              <div className="space-y-2">
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-dark-surface"
                >
                  <UserIcon className="w-4 h-4 text-brand-emerald" />
                  <span>{t('nav.dashboard')}</span>
                </Link>
                {hasRole('admin') && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-brand-gold hover:bg-dark-surface"
                  >
                    <Shield className="w-4 h-4" />
                    <span>{t('nav.admin_panel')}</span>
                  </Link>
                )}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-brand-crimson hover:bg-dark-surface"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t('nav.logout')}</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-lg text-sm font-semibold bg-dark-surface text-slate-200 border border-dark-border"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-lg text-sm font-bold bg-brand-emerald text-black"
                >
                  {t('nav.register')}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

