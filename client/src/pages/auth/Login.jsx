import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../context/LanguageContext';
import Button from '../../components/common/Button';
import { Mail, Lock, AlertCircle, Sparkles } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const result = await login(identifier, password);
      if (result.success) {
        if (result.user.role === 'admin') {
          navigate('/admin');
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
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-dark-card border border-dark-border rounded-3xl p-8 space-y-6 shadow-2xl relative">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-emerald/15 border border-brand-emerald/30 text-brand-emerald flex items-center justify-center text-xl font-bold mx-auto mb-2">
            ⚡
          </div>
          <h2 className="font-gaming text-3xl font-extrabold text-slate-100 uppercase">
            {t('nav.login')}
          </h2>
          <p className="text-xs text-slate-400">
            Sign in to access your clan purse, place live bids, or register for upcoming auctions.
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
            Sign In to Arena
          </Button>
        </form>

        <div className="text-center pt-2 text-xs text-slate-400">
          <span>Don't have an esports account? </span>
          <Link to="/register" className="text-brand-emerald font-semibold hover:underline">
            {t('nav.register')}
          </Link>
        </div>

        {/* Demo credentials hint for convenience */}
        <div className="mt-4 p-3 bg-dark-surface border border-dark-border/60 rounded-xl text-[11px] text-slate-400 space-y-1">
          <p className="font-semibold text-slate-300 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-brand-gold" /> Demo Credentials:
          </p>
          <p>Admin: <span className="text-slate-200">admin@arenaauctions.gg</span> / <span className="text-slate-200">Admin@123</span></p>
          <p>Team Owner: <span className="text-slate-200">owner@godl.gg</span> / <span className="text-slate-200">Owner@123</span></p>
        </div>
      </div>
    </div>
  );
};

export default Login;

