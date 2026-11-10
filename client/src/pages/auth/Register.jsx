import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../context/LanguageContext';
import { MOCK_GAMES } from '../../utils/mockData';
import Button from '../../components/common/Button';
import {
  User,
  Mail,
  Phone,
  Lock,
  Globe,
  Gamepad2,
  Shield,
  Eye,
  Trophy,
  AlertCircle,
  CheckCircle,
  Briefcase,
  Sparkles,
} from 'lucide-react';

const Register = () => {
  const { register } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  // 4 Core Platform Roles: 'user' (Darshak), 'gamer' (Player), 'team_owner' (Team Malik), 'admin'
  const [selectedRole, setSelectedRole] = useState('user');

  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    mobileNumber: '',
    password: '',
    confirmPassword: '',
    country: 'India',
    favoriteGames: ['Cricket (IPL & Box Cricket)', 'BGMI'],
    // Player / Athlete Specific Fields
    sportCategory: 'physical_sports',
    primarySport: 'Cricket (IPL & Box Cricket)',
    primaryRole: 'All-Rounder',
    inGameId: '',
    gamingExperience: 'Intermediate',
    expectedBasePrice: 5000,
    accolades: '',
    // Team Owner Specific Fields
    teamName: '',
    teamTag: '',
    teamBudget: 100000,
    teamDescription: '',
    // Admin Passkey
    adminPasskey: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const rolesConfig = [
    {
      id: 'user',
      roleKey: 'darshak',
      icon: Eye,
    },
    {
      id: 'gamer',
      roleKey: 'player',
      icon: Trophy,
    },
    {
      id: 'team_owner',
      roleKey: 'team_owner',
      icon: Shield,
    },
    {
      id: 'admin',
      roleKey: 'admin',
      icon: Briefcase,
    },
  ];

  const currentRoleConfig = rolesConfig.find((r) => r.id === selectedRole) || rolesConfig[0];
  const currentRoleTitle = t(`auth.roles.${currentRoleConfig.roleKey}.title`);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage(t('auth.passwords_mismatch', 'Passwords do not match'));
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage(t('auth.password_too_short', 'Password must be at least 6 characters'));
      return;
    }

    if (selectedRole === 'admin' && formData.adminPasskey !== 'ARENA2026') {
      setErrorMessage(
        t('auth.invalid_admin_passkey', 'Invalid Admin Passkey! SuperAdmin registration requires the secret key.')
      );
      return;
    }

    setLoading(true);

    try {
      const payload = {
        fullName: formData.fullName,
        username: formData.username,
        email: formData.email,
        mobileNumber: formData.mobileNumber,
        password: formData.password,
        role: selectedRole,
        country: formData.country,
        favoriteGames: formData.favoriteGames,
        inGameId: formData.inGameId || (selectedRole === 'user' ? 'Spectator' : 'Athlete#01'),
        gamingExperience: formData.gamingExperience,
      };

      const result = await register(payload);
      if (result.success) {
        if (selectedRole === 'team_owner') {
          navigate('/teams');
        } else if (selectedRole === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        setErrorMessage(result.message || 'Registration failed');
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || t('auth.network_error', 'Server error. Please verify your details.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-brand-emerald/15 border border-brand-emerald/30 text-brand-emerald flex items-center justify-center text-xl font-bold mx-auto">
            ⚡
          </div>
          <h1 className="font-gaming text-3xl sm:text-5xl font-extrabold text-slate-100 uppercase">
            {t('auth.register_title', 'Create Your Arena Account')}
          </h1>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            {t(
              'auth.register_subtitle',
              'Select your role: Darshak (Viewer), Player (Khiladi), Team Malik (Owner), or Admin. The entire platform customizes to your identity.'
            )}
          </p>
        </div>

        {/* STEP 1: Select Role (4 Cards) */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider text-center">
            {t('auth.step1_title', 'Step 1: Choose Your Platform Role (Identity)')}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {rolesConfig.map((role) => {
              const Icon = role.icon;
              const isSelected = selectedRole === role.id;
              const roleTitle = t(`auth.roles.${role.roleKey}.title`);
              const roleBadge = t(`auth.roles.${role.roleKey}.badge`);
              const roleDesc = t(`auth.roles.${role.roleKey}.desc`);
              const roleCanDo = t(`auth.roles.${role.roleKey}.can_do`);
              const roleCannotDo = t(`auth.roles.${role.roleKey}.cannot_do`);

              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setSelectedRole(role.id)}
                  className={`text-left p-5 rounded-2xl border transition-all flex flex-col justify-between relative group ${
                    isSelected
                      ? 'bg-dark-card border-brand-emerald shadow-glow-emerald -translate-y-1'
                      : 'bg-dark-card/60 border-dark-border hover:border-slate-600 hover:bg-dark-card'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          isSelected
                            ? 'bg-brand-emerald text-black font-bold'
                            : 'bg-dark-surface text-slate-300'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                          isSelected
                            ? 'bg-brand-emerald/15 text-brand-emerald border-brand-emerald/30'
                            : 'bg-dark-surface text-slate-400 border-dark-border'
                        }`}
                      >
                        {roleBadge}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-gaming text-lg font-bold text-slate-100">{roleTitle}</h3>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{roleDesc}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-dark-border/60 mt-3 text-[11px] space-y-1">
                    <p className="text-brand-emerald font-semibold flex items-center gap-1">
                      <span>✓ {roleCanDo}</span>
                    </p>
                    <p className="text-slate-500 flex items-center gap-1">
                      <span>✕ {roleCannotDo}</span>
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* STEP 2: Registration Form */}
        <div className="bg-dark-card border border-dark-border rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6">
          <div className="border-b border-dark-border pb-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-brand-emerald font-bold uppercase tracking-wider block">
                {t('auth.step2_title', 'Step 2: Profile Details')}
              </span>
              <h2 className="font-gaming text-2xl font-bold text-slate-100 uppercase">
                {currentRoleTitle}
              </h2>
            </div>
            <span className="text-xs text-slate-400">
              {t('auth.current_role', 'Active Role')}:{' '}
              <span className="font-bold text-brand-emerald uppercase">{currentRoleTitle}</span>
            </span>
          </div>

          {errorMessage && (
            <div className="p-3 bg-brand-crimson/15 border border-brand-crimson/40 rounded-xl text-xs text-brand-crimson flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Common Details (For all 4 roles) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {t('auth.full_name', 'Full Legal Name')}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder={t('auth.full_name_placeholder', 'e.g. Rohit Verma')}
                    className="w-full pl-9 pr-3 py-2 bg-dark-surface border border-dark-border rounded-xl text-xs text-slate-100 focus:outline-none focus:border-brand-emerald"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {t('auth.username', 'Username / Platform Alias')}
                </label>
                <input
                  type="text"
                  required
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder={t('auth.username_placeholder', 'e.g. rohit_titans')}
                  className="w-full px-3 py-2 bg-dark-surface border border-dark-border rounded-xl text-xs text-slate-100 focus:outline-none focus:border-brand-emerald"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {t('auth.email', 'Email Address')}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={t('auth.email_placeholder', 'name@domain.com')}
                    className="w-full pl-9 pr-3 py-2 bg-dark-surface border border-dark-border rounded-xl text-xs text-slate-100 focus:outline-none focus:border-brand-emerald"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {t('auth.mobile', 'Mobile Number')}
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    placeholder={t('auth.mobile_placeholder', '+91 9876543210')}
                    className="w-full pl-9 pr-3 py-2 bg-dark-surface border border-dark-border rounded-xl text-xs text-slate-100 focus:outline-none focus:border-brand-emerald"
                  />
                </div>
              </div>
            </div>

            {/* DYNAMIC SECTION 1: IF PLAYER / KHILADI */}
            {selectedRole === 'gamer' && (
              <div className="bg-dark-surface/50 border border-brand-cyan/30 rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-2 text-brand-cyan text-xs font-bold uppercase tracking-wider">
                  <Trophy className="w-4 h-4" />
                  <span>{t('auth.athlete_section_title', 'Athlete / Sports Lot Verification Details')}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-300 mb-1">
                      {t('auth.sport_category', 'Sport / Game Category')}
                    </label>
                    <select
                      name="sportCategory"
                      value={formData.sportCategory}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-dark-card border border-dark-border rounded-xl text-xs text-slate-100 focus:outline-none focus:border-brand-emerald"
                    >
                      <option value="physical_sports">
                        {t('auth.sport_cat_physical', '🏏 Physical Sport (Cricket, Football, etc.)')}
                      </option>
                      <option value="esports">
                        {t('auth.sport_cat_esports', '🎮 Esports (BGMI, Valorant, etc.)')}
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-300 mb-1">
                      {t('auth.primary_sport', 'Primary Title')}
                    </label>
                    <select
                      name="primarySport"
                      value={formData.primarySport}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-dark-card border border-dark-border rounded-xl text-xs text-slate-100 focus:outline-none focus:border-brand-emerald"
                    >
                      {MOCK_GAMES.map((g) => (
                        <option key={g.slug} value={g.title}>
                          {g.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-300 mb-1">
                      {t('auth.playing_role', 'Playing Role / Position')}
                    </label>
                    <input
                      type="text"
                      name="primaryRole"
                      value={formData.primaryRole}
                      onChange={handleChange}
                      placeholder={t('auth.playing_role_placeholder', 'e.g. All-Rounder / Striker / IGL')}
                      className="w-full px-3 py-2 bg-dark-card border border-dark-border rounded-xl text-xs text-slate-100 focus:outline-none focus:border-brand-emerald"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-300 mb-1">
                      {t('auth.in_game_id', 'In-Game UID / Jersey Number')}
                    </label>
                    <input
                      type="text"
                      required
                      name="inGameId"
                      value={formData.inGameId}
                      onChange={handleChange}
                      placeholder={t('auth.in_game_id_placeholder', 'e.g. Jersey #45 or BGMI UID 5129481')}
                      className="w-full px-3 py-2 bg-dark-card border border-dark-border rounded-xl text-xs text-slate-100 focus:outline-none focus:border-brand-emerald"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-300 mb-1">
                      {t('auth.accolades', 'Career Accolades / Stats')}
                    </label>
                    <input
                      type="text"
                      name="accolades"
                      value={formData.accolades}
                      onChange={handleChange}
                      placeholder={t('auth.accolades_placeholder', 'e.g. Best Bowler 2024, Strike Rate: 168.4')}
                      className="w-full px-3 py-2 bg-dark-card border border-dark-border rounded-xl text-xs text-slate-100 focus:outline-none focus:border-brand-emerald"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* DYNAMIC SECTION 2: IF TEAM OWNER */}
            {selectedRole === 'team_owner' && (
              <div className="bg-dark-surface/50 border border-brand-emerald/30 rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-2 text-brand-emerald text-xs font-bold uppercase tracking-wider">
                  <Shield className="w-4 h-4" />
                  <span>{t('auth.team_section_title', 'Franchise / Clan Ownership Details')}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] text-slate-300 mb-1">
                      {t('auth.team_name', 'Franchise / Team Name')}
                    </label>
                    <input
                      type="text"
                      required
                      name="teamName"
                      value={formData.teamName}
                      onChange={handleChange}
                      placeholder={t('auth.team_name_placeholder', 'e.g. Mumbai Titans or GodLike')}
                      className="w-full px-3 py-2 bg-dark-card border border-dark-border rounded-xl text-xs text-slate-100 focus:outline-none focus:border-brand-emerald"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-300 mb-1">
                      {t('auth.team_tag', 'Team Tag (3-4 Chars)')}
                    </label>
                    <input
                      type="text"
                      required
                      name="teamTag"
                      value={formData.teamTag}
                      onChange={handleChange}
                      placeholder={t('auth.team_tag_placeholder', 'MT')}
                      className="w-full px-3 py-2 bg-dark-card border border-dark-border rounded-xl text-xs text-slate-100 font-mono uppercase focus:outline-none focus:border-brand-emerald"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-300 mb-1">
                    {t('auth.team_budget', 'Initial Clan Purse Budget (₹)')}
                  </label>
                  <input
                    type="number"
                    required
                    name="teamBudget"
                    value={formData.teamBudget}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-dark-card border border-dark-border rounded-xl text-xs text-slate-100 font-mono focus:outline-none focus:border-brand-emerald"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    {t(
                      'auth.team_budget_help',
                      'This purse will be allocated to your franchise for live bidding in tournament rooms.'
                    )}
                  </span>
                </div>
              </div>
            )}

            {/* DYNAMIC SECTION 3: IF ADMIN PASSKEY */}
            {selectedRole === 'admin' && (
              <div className="bg-brand-gold/10 border border-brand-gold/30 rounded-2xl p-5 space-y-2">
                <label className="block text-xs font-bold text-brand-gold uppercase tracking-wider">
                  {t('auth.admin_section_title', 'SuperAdmin Authorization Passkey')}
                </label>
                <input
                  type="password"
                  required
                  name="adminPasskey"
                  value={formData.adminPasskey}
                  onChange={handleChange}
                  placeholder={t('auth.admin_passkey_placeholder', 'Enter Secret Key (Demo: ARENA2026)')}
                  className="w-full px-3 py-2 bg-dark-card border border-dark-border rounded-xl text-xs text-slate-100 focus:outline-none focus:border-brand-gold"
                />
                <p className="text-[11px] text-slate-400">
                  {t('auth.admin_passkey_help', 'Demo Passkey for evaluator:')}{' '}
                  <span className="font-mono text-brand-gold font-bold">ARENA2026</span>
                </p>
              </div>
            )}

            {/* Passwords */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {t('auth.password_label', 'Password')}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder={t('auth.password_min_help', 'Min 6 characters')}
                    className="w-full pl-9 pr-3 py-2 bg-dark-surface border border-dark-border rounded-xl text-xs text-slate-100 focus:outline-none focus:border-brand-emerald"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {t('auth.confirm_password_label', 'Confirm Password')}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder={t('auth.confirm_password_placeholder', 'Repeat password')}
                    className="w-full pl-9 pr-3 py-2 bg-dark-surface border border-dark-border rounded-xl text-xs text-slate-100 focus:outline-none focus:border-brand-emerald"
                  />
                </div>
              </div>
            </div>

            <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full mt-4">
              {t('auth.complete_registration', 'Complete Registration')} ({currentRoleTitle})
            </Button>
          </form>

          <div className="text-center pt-2 text-xs text-slate-400">
            <span>{t('auth.already_have_account', 'Already have an account?')} </span>
            <Link to="/login" className="text-brand-emerald font-semibold hover:underline">
              {t('auth.sign_in_here', 'Sign In Here')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
