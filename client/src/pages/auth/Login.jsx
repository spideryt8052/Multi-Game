import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../context/LanguageContext';
import Button from '../../components/common/Button';
import { Mail, Lock, AlertCircle, Sparkles, Eye, Trophy, Shield, Briefcase } from 'lucide-react';

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
      title: 'Darshak (Viewer)',
      email: 'viewer@arena.gg',
      pass: 'Viewer@123',
      desc: 'View live auctions, inspect player lot stats, spectator mode.',
      redirect: '/dashboard',
    },
    player: {
      title: 'Player / Khiladi',
      email: 'rohit@cricket.in',
      pass: 'Gamer@123',
      desc: 'Player lot status, auction pool verification & contract tracking.',
      redirect: '/dashboard',
    },
    team_owner: {
      title: 'Team Owner (Malik)',
      email: 'owner@mumbaititans.com',
      pass: 'Owner@123',
      desc: 'Full live bidding buttons active, purse management & squad drafting.',
      redirect: '/teams',
    },
    admin: {
      title: 'SuperAdmin',
      email: 'admin@arenaauctions.gg',
      pass: 'Admin@123',
      desc: 'Full gavel hammer controls, participant KYC approvals & sports catalog.',
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
        setErrorMessage(result.message || 'Invalid username/email or password');
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Unable to connect to login server. Please try again.');
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
            Sign In to Arena
          </h2>
          <p className="text-xs text-slate-400">
            Login based on your role: Darshak, Player, Team Owner, or SuperAdmin.
          </p>
        </div>

        {/* 4 Role Selector Tabs */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider text-center">
            Quick 1-Click Role Login Demo:
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
              <span>Darshak</span>
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
              <span>Player</span>
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
              <span>Team Owner</span>
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
              <span>Admin</span>
            </button>
          </div>
          <p className="text-[11px] text-slate-400 text-center italic pt-1">
            {demoAccounts[activeRoleTab].desc}
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
              Email or Username
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="athlete@esports.com or Mortal"
                className="w-full pl-9 pr-3 py-2 bg-dark-surface border border-dark-border rounded-xl text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-brand-emerald"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-300">Password</label>
              <Link to="/forgot-password" className="text-[11px] text-brand-emerald hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-3 py-2 bg-dark-surface border border-dark-border rounded-xl text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-brand-emerald"
              />
            </div>
          </div>

          <Button type="submit" variant="primary" size="md" loading={loading} className="w-full mt-2">
            Sign In as {demoAccounts[activeRoleTab].title}
          </Button>
        </form>

        <div className="text-center pt-2 text-xs text-slate-400">
          <span>Naye user hain? </span>
          <Link to="/register" className="text-brand-emerald font-semibold hover:underline">
            Register Here (Darshak, Player, Owner, Admin)
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
