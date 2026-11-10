import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../context/LanguageContext';
import { ShieldCheck, Zap, Disc as Discord, Twitter, Youtube, Twitch } from 'lucide-react';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-dark-card border-t border-dark-border mt-20 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-brand-emerald flex items-center justify-center font-black text-black">
                ⚡
              </div>
              <span className="font-gaming text-2xl font-bold tracking-wider text-slate-100">
                ARENA<span className="text-brand-emerald">AUCTIONS</span>
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-slate-400 max-w-sm">
              {t('footer.tagline')}
            </p>
            <div className="flex items-center gap-3 pt-2 text-slate-400">
              <a href="#discord" className="p-2 rounded-lg bg-dark-surface hover:text-brand-emerald transition-colors" title="Discord Community">
                <Discord className="w-4 h-4" />
              </a>
              <a href="#twitter" className="p-2 rounded-lg bg-dark-surface hover:text-brand-emerald transition-colors" title="X / Twitter">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#youtube" className="p-2 rounded-lg bg-dark-surface hover:text-brand-emerald transition-colors" title="YouTube Esports">
                <Youtube className="w-4 h-4" />
              </a>
              <a href="#twitch" className="p-2 rounded-lg bg-dark-surface hover:text-brand-emerald transition-colors" title="Twitch Live">
                <Twitch className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-200 text-sm uppercase tracking-wider font-gaming">
              {t('footer.quick_links')}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/games" className="hover:text-brand-emerald transition-colors">
                  {t('nav.all_games')}
                </Link>
              </li>
              <li>
                <Link to="/auctions/live" className="hover:text-brand-crimson transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-crimson" />
                  {t('nav.live_auctions')}
                </Link>
              </li>
              <li>
                <Link to="/auctions/upcoming" className="hover:text-brand-emerald transition-colors">
                  {t('nav.upcoming')}
                </Link>
              </li>
              <li>
                <Link to="/rules" className="hover:text-brand-emerald transition-colors">
                  {t('nav.rules')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Gaming Hubs */}
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-200 text-sm uppercase tracking-wider font-gaming">
              Esports Hubs
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/games/bgmi" className="hover:text-brand-emerald transition-colors">
                  BGMI Pro Auctions
                </Link>
              </li>
              <li>
                <Link to="/games/valorant" className="hover:text-brand-emerald transition-colors">
                  Valorant Champions Pool
                </Link>
              </li>
              <li>
                <Link to="/games/freefire" className="hover:text-brand-emerald transition-colors">
                  Free Fire MAX League
                </Link>
              </li>
              <li>
                <Link to="/games/cs2" className="hover:text-brand-emerald transition-colors">
                  Counter-Strike 2 Draft
                </Link>
              </li>
              <li>
                <Link to="/games/fifa" className="hover:text-brand-emerald transition-colors">
                  FIFA / EA FC Clubs
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Security */}
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-200 text-sm uppercase tracking-wider font-gaming">
              {t('footer.legal')}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/privacy" className="hover:text-brand-emerald transition-colors">
                  {t('footer.privacy')}
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-brand-emerald transition-colors">
                  {t('footer.terms')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-brand-emerald transition-colors">
                  {t('footer.contact')}
                </Link>
              </li>
              <li className="pt-2 flex items-center gap-1.5 text-[11px] text-brand-emerald">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                <span>Verified Anti-Cheat & Secure Bidding</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-dark-border mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>{t('footer.copyright')}</p>
          <div className="flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-brand-emerald" />
            <span>Built for Competitive Gaming & Clans</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

