import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../context/LanguageContext';
import { MOCK_GAMES } from '../../utils/mockData';
import Button from '../../components/common/Button';
import { User, Mail, Phone, Lock, Globe, Gamepad2, Shield, AlertCircle } from 'lucide-react';

const Register = () => {
  const { register } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    mobileNumber: '',
    password: '',
    confirmPassword: '',
    country: 'India',
    gamingExperience: 'Intermediate',
    role: 'gamer',
    inGameId: '',
    favoriteGames: ['BGMI'],
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGameToggle = (gameTitle) => {
    setFormData((prev) => {
      const exists = prev.favoriteGames.includes(gameTitle);
      return {
        ...prev,
        favoriteGames: exists
          ? prev.favoriteGames.filter((g) => g !== gameTitle)
          : [...prev.favoriteGames, gameTitle],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const result = await register(formData);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setErrorMessage(result.message || 'Registration failed');
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Server error during registration. Please verify details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl bg-dark-card border border-dark-border rounded-3xl p-8 sm:p-10 space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-emerald/15 border border-brand-emerald/30 text-brand-emerald flex items-center justify-center text-xl font-bold mx-auto mb-2">
            ⚡
          </div>
          <h2 className="font-gaming text-3xl font-extrabold text-slate-100 uppercase">
            {t('nav.register')}
          </h2>
          <p className="text-xs text-slate-400">
            Create your athlete or clan manager profile to participate in live tournament drafts.
          </p>
        </div>

        {errorMessage && (
          <div className="p-3 bg-brand-crimson/15 border border-brand-crimson/40 rounded-xl text-xs text-brand-crimson flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Row 1: Name and Username */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Legal Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Naman Mathur"
                  className="w-full pl-9 pr-3 py-2 bg-dark-surface border border-dark-border rounded-xl text-xs text-slate-100 focus:outline-none focus:border-brand-emerald"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Username / Gaming Alias</label>
              <div className="relative">
                <Gamepad2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="e.g. Mortal_Esports"
                  className="w-full pl-9 pr-3 py-2 bg-dark-surface border border-dark-border rounded-xl text-xs text-slate-100 focus:outline-none focus:border-brand-emerald"
                />
              </div>
            </div>
          </div>

          {/* Row 2: Email and Mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="athlete@domain.com"
                  className="w-full pl-9 pr-3 py-2 bg-dark-surface border border-dark-border rounded-xl text-xs text-slate-100 focus:outline-none focus:border-brand-emerald"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Mobile Number (with country code)</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  placeholder="+91 9876543210"
                  className="w-full pl-9 pr-3 py-2 bg-dark-surface border border-dark-border rounded-xl text-xs text-slate-100 focus:outline-none focus:border-brand-emerald"
                />
              </div>
            </div>
          </div>

          {/* Row 3: Role and Country */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Platform Role</label>
              <div className="relative">
                <Shield className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2 bg-dark-surface border border-dark-border rounded-xl text-xs text-slate-100 focus:outline-none focus:border-brand-emerald"
                >
                  <option value="gamer">Gamer / Athlete (Auction Participant)</option>
                  <option value="team_owner">Team Owner / Clan Manager</option>
                  <option value="organizer">Auction Organizer / Host</option>
                  <option value="user">Spectator / Normal User</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Country</label>
              <div className="relative">
                <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2 bg-dark-surface border border-dark-border rounded-xl text-xs text-slate-100 focus:outline-none focus:border-brand-emerald"
                />
              </div>
            </div>
          </div>

          {/* Row 4: In-Game UID and Gaming Experience */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">In-Game Username / UID</label>
              <input
                type="text"
                required
                name="inGameId"
                value={formData.inGameId}
                onChange={handleChange}
                placeholder="BGMI UID: 5129481920 or Riot ID"
                className="w-full px-3 py-2 bg-dark-surface border border-dark-border rounded-xl text-xs text-slate-100 focus:outline-none focus:border-brand-emerald"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Gaming Experience Level</label>
              <select
                name="gamingExperience"
                value={formData.gamingExperience}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-dark-surface border border-dark-border rounded-xl text-xs text-slate-100 focus:outline-none focus:border-brand-emerald"
              >
                <option value="Beginner">Beginner Tier</option>
                <option value="Intermediate">Intermediate / Clan Player</option>
                <option value="Semi-Pro">Semi-Pro (Tier 2/3 Tournaments)</option>
                <option value="Professional Esports">Professional Esports Athlete</option>
              </select>
            </div>
          </div>

          {/* Row 5: Favorite Games Multi-Select */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Favorite Games (Select all that apply)
            </label>
            <div className="flex flex-wrap gap-2">
              {MOCK_GAMES.map((game) => {
                const selected = formData.favoriteGames.includes(game.title);
                return (
                  <button
                    key={game.slug}
                    type="button"
                    onClick={() => handleGameToggle(game.title)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      selected
                        ? 'bg-brand-emerald text-black font-bold'
                        : 'bg-dark-surface border border-dark-border text-slate-400 hover:text-slate-100'
                    }`}
                  >
                    {selected ? '✓ ' : '+ '}
                    {game.title}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row 6: Passwords */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min 6 characters"
                  className="w-full pl-9 pr-3 py-2 bg-dark-surface border border-dark-border rounded-xl text-xs text-slate-100 focus:outline-none focus:border-brand-emerald"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Confirm Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat password"
                  className="w-full pl-9 pr-3 py-2 bg-dark-surface border border-dark-border rounded-xl text-xs text-slate-100 focus:outline-none focus:border-brand-emerald"
                />
              </div>
            </div>
          </div>

          <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full mt-4">
            Complete Registration & Join Arena
          </Button>
        </form>

        <div className="text-center pt-2 text-xs text-slate-400">
          <span>Already registered? </span>
          <Link to="/login" className="text-brand-emerald font-semibold hover:underline">
            {t('nav.login')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;

