import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../context/LanguageContext';
import Button from '../../components/common/Button';
import { Mail, Lock, AlertCircle, Eye, Trophy, Shield, Briefcase } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState('admin@arenaauctions.gg');
  const [password, setPassword] = useState('Admin@123');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeRoleTab, setActiveRoleTab] = useState('admin');

  // Quick Demo Credentials for all 4 roles
  const demoAccounts = {
    darshak: {
      key: 'darshak',
      email: 'viewer@arena.gg',
      pass: 'Viewer@123',
      redirect: '/dashboard',
    },
    player: {
      key: 'player',
      email: 'rohit@cricket.in',
      pass: 'Gamer@123',
      redirect: '/dashboard',
    },
    team_owner: {
      key: 'team_owner',
      email: 'owner@mumbaititans.com',
      pass: 'Owner@123',
      redirect: '/teams',
    },
    admin: {
      key: 'admin',
      email: 'admin@arenaauctions.gg',
      pass: 'Admin@123',
      redirect: '/admin',
    },
  };

  const handleRoleSelect = (roleKey) => {
    setActiveRoleTab(roleKey);
    const acc = demoAccounts[roleKey];
    setIdentifier(acc.email);
    setPassword(acc.pass);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const result = await login(identifier, password);
      if (result.success) {
        const userRole = result.user.role;
        if (userRole === 'admin') {
          navigate('/admin');
        } else if (userRole === 'team_owner') {
          navigate('/teams');
        } else {
          navigate('/dashboard');
        }
      } else {
        setErrorMessage(result.message || t('auth.invalid_credentials'));
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || t('auth.network_error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg bg-dark-card border border-dark-border rounded-3xl p-6 sm:p-10 space-y-6 shadow-2xl relative">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-emerald/15 border border-brand-emerald/30 text-brand-emerald flex items-center justify-center text-xl font-bold mx-auto mb-2">
            ⚡
          </div>
          <h2 className="font-gaming text-3xl font-extrabold text-slate-100 uppercase">
            {t('auth.login_title', 'Sign In to Arena')}
          </h2>
          <p className="text-xs text-slate-400">
            {t('auth.login_subtitle', 'Login based on your role: Darshak, Player, Team Owner, or SuperAdmin.')}
          </p>
        </div>

        {/* 4 Role Selector Tabs */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider text-center">
            {t('auth.quick_demo_label', 'Quick 1-Click Role Login Demo:')}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-dark-surface rounded-xl border border-dark-border">
            <button
              type="button"
              onClick={() => handleRoleSelect('darshak')}
              className={`py-2 px-1 text-[11px] font-bold rounded-lg transition-all flex flex-col items-center gap-1 ${
                activeRoleTab === 'darshak'
                  ? 'bg-brand-emerald text-black shadow-sm font-extrabold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{t('auth.roles.darshak.tab_name', 'Viewer')}</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect('player')}
              className={`py-2 px-1 text-[11px] font-bold rounded-lg transition-all flex flex-col items-center gap-1 ${
                activeRoleTab === 'player'
                  ? 'bg-brand-emerald text-black shadow-sm font-extrabold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>{t('auth.roles.player.tab_name', 'Player')}</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect('team_owner')}
              className={`py-2 px-1 text-[11px] font-bold rounded-lg transition-all flex flex-col items-center gap-1 ${
                activeRoleTab === 'team_owner'
                  ? 'bg-brand-emerald text-black shadow-sm font-extrabold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>{t('auth.roles.team_owner.tab_name', 'Team Owner')}</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect('admin')}
              className={`py-2 px-1 text-[11px] font-bold rounded-lg transition-all flex flex-col items-center gap-1 ${
                activeRoleTab === 'admin'
                  ? 'bg-brand-emerald text-black shadow-sm font-extrabold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>{t('auth.roles.admin.tab_name', 'Admin')}</span>
            </button>
          </div>
          <p className="text-[11px] text-slate-400 text-center italic pt-1">
            {t(`auth.roles.${activeRoleTab}.desc`)}
          </p>
        </div>

        {errorMessage && (
          <div className="p-3 bg-brand-crimson/15 border border-brand-crimson/40 rounded-xl text-xs text-brand-crimson flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {t('auth.email_or_username', 'Email or Username')}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={t('auth.email_or_username_placeholder', 'athlete@esports.com or Mortal')}
                className="w-full pl-9 pr-3 py-2 bg-dark-surface border border-dark-border rounded-xl text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-brand-emerald"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-300">
                {t('auth.password', 'Password')}
              </label>
              <Link to="/forgot-password" className="text-[11px] text-brand-emerald hover:underline">
                {t('auth.forgot_password', 'Forgot password?')}
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('auth.password_placeholder', '••••••••••••')}
                className="w-full pl-9 pr-3 py-2 bg-dark-surface border border-dark-border rounded-xl text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-brand-emerald"
              />
            </div>
          </div>

          <Button type="submit" variant="primary" size="md" loading={loading} className="w-full mt-2">
            {loading ? t('auth.signing_in', 'Signing In...') : `${t('auth.sign_in_as', 'Sign In as')} ${t(`auth.roles.${activeRoleTab}.title`)}`}
          </Button>
        </form>

        <div className="text-center pt-2 text-xs text-slate-400">
          <span>{t('auth.new_user_prompt', 'New to Arena?')} </span>
          <Link to="/register" className="text-brand-emerald font-semibold hover:underline">
            {t('auth.register_here', 'Register Here (Darshak, Player, Owner, Admin)')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
