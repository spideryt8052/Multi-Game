import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../context/LanguageContext';
import { MOCK_GAMES } from '../../utils/mockData';
import { SQUAD_RULES_CONFIG } from '../../utils/squadRulesConfig';
import { formatCurrency } from '../../utils/formatCurrency';
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
  Award,
  Zap,
  Target,
  Activity,
  Flame,
  Check,
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

    // SPORT / GAME SELECTION
    selectedSportSlug: 'cricket',
    primarySport: 'Cricket (IPL & Box Cricket)',
    sportCategory: 'physical_sports',

    // CRICKET ATTRIBUTES (IPL / BOX CRICKET)
    primaryRole: 'All-Rounder',
    subRole: 'Batting All-Rounder',
    battingStyle: 'rhb',
    bowlingStyle: 'rafm',
    cricketCategory: 'uncapped',
    jerseyNumber: '45',
    runsScored: 890,
    battingAverage: 37.1,
    strikeRate: 154.2,
    wickets: 26,
    bowlingEconomy: 6.9,

    // ESPORTS ATTRIBUTES (BGMI / VALORANT / FREE FIRE)
    inGameId: '',
    inGameName: '',
    device: 'mobile_ios',
    controlSetup: '4finger',
    rankTier: 'Conqueror',
    kdRatio: 4.85,
    avgDamage: 840,
    signatureAgents: 'Jett, Reyna',
    gamingExperience: 'Semi-Pro',

    // FOOTBALL ATTRIBUTES
    preferredFoot: 'right',
    footballCategory: 'senior',
    goalsScored: 12,
    assists: 8,

    // CARROM ATTRIBUTES
    carromRole: 'White Slam Specialist',
    strikingHand: 'right',
    gripStyle: 'scissor',
    carromTier: 'state_champion',
    strikerWeight: '15.0g',
    whiteSlams: 18,
    pocketAccuracy: 94.2,
    aicfRank: 'Top 10 State',

    // KABADDI / CHESS
    raidPoints: 48,
    fideRating: 2150,

    // BASE PRICE & REMARKS
    expectedBasePrice: 10000,
    accolades: 'Best All-Rounder 2025 • Strike Rate 154.2',

    // TEAM OWNER ATTRIBUTES
    teamName: '',
    teamTag: '',
    teamBudget: 100000,
    teamDescription: '',

    // ADMIN PASSKEY
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

  // Active game config for dynamic form
  const activeGameConfig = SQUAD_RULES_CONFIG[formData.selectedSportSlug] || SQUAD_RULES_CONFIG.cricket;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handler for selecting sport/game in athlete mode
  const handleSportChange = (slug) => {
    const cfg = SQUAD_RULES_CONFIG[slug] || SQUAD_RULES_CONFIG.cricket;
    const defaultRole = cfg.roles[0]?.label || 'Player';
    const defaultSubRole = cfg.roles[0]?.subRoles ? cfg.roles[0].subRoles[0] : '';
    const defaultBasePrice = cfg.basePriceSlabs ? cfg.basePriceSlabs[0].value : 5000;

    setFormData((prev) => ({
      ...prev,
      selectedSportSlug: slug,
      primarySport: cfg.gameTitle,
      sportCategory: cfg.categoryType,
      primaryRole: defaultRole,
      subRole: defaultSubRole,
      expectedBasePrice: defaultBasePrice,
      // Adjust inGameId placeholder context
      inGameId:
        prev.inGameId ||
        (slug === 'cricket'
          ? 'Jersey #45'
          : slug === 'carrom'
          ? 'AICF-2026-904'
          : slug === 'valorant'
          ? 'Player#IND'
          : 'UID 51928410'),
    }));
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
      // Build comprehensive playerProfile object for athletes
      const playerProfile =
        selectedRole === 'gamer'
          ? {
              sportSlug: formData.selectedSportSlug,
              sportCategory: formData.sportCategory,
              primarySport: formData.primarySport,
              primaryRole: formData.primaryRole,
              subRole: formData.subRole,
              battingStyle: formData.battingStyle,
              bowlingStyle: formData.bowlingStyle,
              preferredFoot: formData.preferredFoot,
              strikingHand: formData.strikingHand,
              gripStyle: formData.gripStyle,
              strikerWeight: formData.strikerWeight,
              aicfRank: formData.aicfRank,
              device: formData.device,
              controlSetup: formData.controlSetup,
              rankTier: formData.rankTier,
              signatureAgents: formData.signatureAgents
                ? formData.signatureAgents.split(',').map((s) => s.trim())
                : [],
              playerCategory:
                formData.cricketCategory || formData.footballCategory || formData.carromTier || 'uncapped',
              jerseyNumber: parseInt(formData.jerseyNumber, 10) || 45,
              expectedBasePrice: parseInt(formData.expectedBasePrice, 10) || 10000,
              accolades: formData.accolades,
              stats: {
                matchesPlayed: parseInt(formData.matchesPlayed, 10) || 0,
                runsScored: parseInt(formData.runsScored, 10) || 0,
                battingAverage: parseFloat(formData.battingAverage) || 0,
                strikeRate: parseFloat(formData.strikeRate) || 0,
                wickets: parseInt(formData.wickets, 10) || 0,
                bowlingEconomy: parseFloat(formData.bowlingEconomy) || 0,
                kdRatio: parseFloat(formData.kdRatio) || 1.0,
                avgDamage: parseInt(formData.avgDamage, 10) || 0,
                goalsScored: parseInt(formData.goalsScored, 10) || 0,
                assists: parseInt(formData.assists, 10) || 0,
                raidPoints: parseInt(formData.raidPoints, 10) || 0,
                fideRating: parseInt(formData.fideRating, 10) || 0,
                whiteSlams: parseInt(formData.whiteSlams, 10) || 0,
                pocketAccuracy: parseFloat(formData.pocketAccuracy) || 0,
              },
            }
          : undefined;

      const payload = {
        fullName: formData.fullName,
        username: formData.username,
        email: formData.email,
        mobileNumber: formData.mobileNumber,
        password: formData.password,
        role: selectedRole,
        country: formData.country,
        favoriteGames: [formData.primarySport, ...formData.favoriteGames.filter((g) => g !== formData.primarySport)],
        inGameId:
          formData.inGameId ||
          (selectedRole === 'gamer'
            ? formData.selectedSportSlug === 'cricket'
              ? `Jersey #${formData.jerseyNumber || 45}`
              : `${formData.username}#IGN`
            : selectedRole === 'user'
            ? 'Spectator'
            : 'Manager#01'),
        gamingExperience: formData.gamingExperience,
        playerProfile,
      };

      // Store in localStorage for instant access across tabs
      if (playerProfile) {
        localStorage.setItem('arena_player_profile', JSON.stringify(playerProfile));
      }

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
      setErrorMessage(
        err.response?.data?.message || t('auth.network_error', 'Server error. Please verify your details.')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-emerald/10 border border-brand-emerald/30 text-brand-emerald text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('auth.roles_system_badge', 'Official Multi-Game & Sports Registration')}</span>
          </div>
          <h1 className="font-gaming text-3xl sm:text-4xl font-extrabold text-slate-100 uppercase tracking-wide">
            {t('auth.register_title', 'Create Your Arena Account')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            {t(
              'auth.register_subtitle',
              'Choose your role. Players receive custom game-specific draft verification forms; Team Owners manage auction purses.'
            )}
          </p>
        </div>

        {/* STEP 1: Select Role (4 Core Roles) */}
        <div className="bg-dark-card border border-dark-border rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl">
          <div className="flex items-center justify-between border-b border-dark-border pb-3">
            <div>
              <span className="text-[11px] text-brand-emerald font-bold uppercase tracking-wider block">
                {t('auth.step1_title', 'Step 1: Select Your Platform Role')}
              </span>
              <p className="text-xs text-slate-400 mt-0.5">
                {t('auth.step1_hint', 'Your role determines your auction room permissions & dynamic profile.')}
              </p>
            </div>
            <span className="text-xs font-mono text-slate-500">4 ROLES AVAILABLE</span>
          </div>

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
                  className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                    isSelected
                      ? 'bg-dark-surface border-brand-emerald shadow-glow-emerald ring-1 ring-brand-emerald'
                      : 'bg-dark-surface/40 border-dark-border hover:border-slate-600 hover:bg-dark-surface'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'bg-brand-emerald text-black shadow-glow-emerald'
                            : 'bg-dark-card text-slate-300 border border-dark-border'
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

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Common Details (For all 4 roles) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {t('auth.full_name', 'Full Legal Name')} *
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
                  {t('auth.username', 'Username / Platform Alias')} *
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
                  {t('auth.email', 'Email Address')} *
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
                  {t('auth.mobile', 'Mobile Number')} *
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

            {/* DYNAMIC SECTION 1: IF PLAYER / KHILADI (DYNAMIC SPORT-SPECIFIC FORM) */}
            {selectedRole === 'gamer' && (
              <div className="bg-dark-surface/60 border border-brand-cyan/40 rounded-3xl p-5 sm:p-6 space-y-6 shadow-glow-cyan/5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-dark-border pb-4">
                  <div className="flex items-center gap-2 text-brand-cyan text-xs font-bold uppercase tracking-wider">
                    <Trophy className="w-4 h-4 text-brand-cyan" />
                    <span>Dynamic Athlete / Tournament Lot Verification Form</span>
                  </div>
                  <span className="text-[11px] text-brand-emerald font-semibold bg-brand-emerald/10 px-2.5 py-0.5 rounded-full border border-brand-emerald/30">
                    Live Form adapts to selected title
                  </span>
                </div>

                {/* GAME SELECTION PILLS */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider">
                    Choose Your Sport / Game Title:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                    {[
                      { slug: 'cricket', name: 'Cricket (IPL)', icon: '🏏' },
                      { slug: 'carrom', name: 'Carrom Masters', icon: '🎯' },
                      { slug: 'bgmi', name: 'BGMI Mobile', icon: '🎮' },
                      { slug: 'valorant', name: 'Valorant FPS', icon: '⚡' },
                      { slug: 'football', name: 'Football / Turf', icon: '⚽' },
                      { slug: 'kabaddi', name: 'Kabaddi League', icon: '🤼' },
                      { slug: 'chess', name: 'Chess League', icon: '♟️' },
                    ].map((sport) => {
                      const isActive = formData.selectedSportSlug === sport.slug;
                      return (
                        <button
                          key={sport.slug}
                          type="button"
                          onClick={() => handleSportChange(sport.slug)}
                          className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                            isActive
                              ? 'bg-brand-cyan text-black border-brand-cyan font-bold shadow-glow-cyan/30'
                              : 'bg-dark-card border-dark-border text-slate-300 hover:border-slate-500'
                          }`}
                        >
                          <span className="text-xl">{sport.icon}</span>
                          <span className="text-xs font-semibold truncate w-full">{sport.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* --- GAME 1: CRICKET (IPL & BOX CRICKET LEAGUE) --- */}
                {formData.selectedSportSlug === 'cricket' && (
                  <div className="space-y-4 pt-2 border-t border-dark-border/60">
                    <div className="flex items-center gap-2 text-xs font-bold text-brand-gold uppercase">
                      <span>🏏 Cricket Specific Roles & Bowling/Batting Form</span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        (Ballebaaz, Gendbaaz, All-Rounder & Wicketkeeper)
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Primary Role */}
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                          Primary Role in Team *
                        </label>
                        <select
                          name="primaryRole"
                          value={formData.primaryRole}
                          onChange={handleChange}
                          className="w-full px-3 py-2 bg-dark-card border border-dark-border rounded-xl text-xs text-slate-100 focus:outline-none focus:border-brand-emerald"
                        >
                          <option value="Batsman">🏏 Ballebaaz (Batsman)</option>
                          <option value="Bowler">🎯 Gendbaaz (Bowler)</option>
                          <option value="All-Rounder">⚡ Harfanmaula (All-Rounder)</option>
                          <option value="Wicketkeeper Batsman">🧤 Wicketkeeper Batsman (WK)</option>
                        </select>
                      </div>

                      {/* Batting Hand Style */}
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                          Batting Hand Style (Righty / Lefty) *
                        </label>
                        <select
                          name="battingStyle"
                          value={formData.battingStyle}
                          onChange={handleChange}
                          className="w-full px-3 py-2 bg-dark-card border border-dark-border rounded-xl text-xs text-slate-100 focus:outline-none focus:border-brand-emerald"
                        >
                          <option value="rhb">Right-Hand Batsman (RHB - Righty)</option>
                          <option value="lhb">Left-Hand Batsman (LHB - Lefty)</option>
                        </select>
                      </div>

                      {/* Bowling Style & Arm */}
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                          Bowling Arm & Style *
                        </label>
                        <select
                          name="bowlingStyle"
                          value={formData.bowlingStyle}
                          onChange={handleChange}
                          className="w-full px-3 py-2 bg-dark-card border border-dark-border rounded-xl text-xs text-slate-100 focus:outline-none focus:border-brand-emerald"
                        >
                          <option value="raf">Right-Arm Fast (Tez Gendbaaz)</option>
                          <option value="rafm">Right-Arm Fast-Medium (Swing)</option>
                          <option value="ram">Right-Arm Medium</option>
                          <option value="raos">Right-Arm Off-Spin (Spin Wizard)</option>
                          <option value="rals">Right-Arm Leg-Spin / Googly</option>
                          <option value="laf">Left-Arm Fast / Seam</option>
                          <option value="laos">Left-Arm Orthodox Spin</option>
                          <option value="lac">Left-Arm Chinaman (Unorthodox)</option>
                          <option value="none">Does Not Bowl (Specialist Batsman/WK)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Player Category (Capped / Uncapped / Overseas) */}
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                          Tournament Category Tier *
                        </label>
                        <select
                          name="cricketCategory"
                          value={formData.cricketCategory}
                          onChange={handleChange}
                          className="w-full px-3 py-2 bg-dark-card border border-dark-border rounded-xl text-xs text-slate-100 focus:outline-none focus:border-brand-emerald"
                        >
                          <option value="uncapped">Uncapped (Local Club / Box Cricket Star)</option>
                          <option value="capped">Capped (Ranji Trophy / State Pro)</option>
                          <option value="overseas">Overseas International Lot</option>
                        </select>
                      </div>

                      {/* Jersey Number */}
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                          Jersey Number
                        </label>
                        <input
                          type="number"
                          name="jerseyNumber"
                          value={formData.jerseyNumber}
                          onChange={handleChange}
                          placeholder="e.g. 45 or 18 or 7"
                          className="w-full px-3 py-2 bg-dark-card border border-dark-border rounded-xl text-xs text-slate-100 focus:outline-none focus:border-brand-emerald"
                        />
                      </div>

                      {/* Expected Base Price */}
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                          Auction Floor Base Price *
                        </label>
                        <select
                          name="expectedBasePrice"
                          value={formData.expectedBasePrice}
                          onChange={handleChange}
                          className="w-full px-3 py-2 bg-dark-card border border-dark-border rounded-xl text-xs text-brand-emerald font-mono font-bold focus:outline-none focus:border-brand-emerald"
                        >
                          <option value="5000">₹5,000 (Base Floor S1)</option>
                          <option value="10000">₹10,000 (Established Domestic / Ranji)</option>
                          <option value="20000">₹20,000 (Senior State / Box Icon)</option>
                          <option value="50000">₹50,000 (Marquee Star)</option>
                        </select>
                      </div>
                    </div>

                    {/* Cricket Career Statistics */}
                    <div className="bg-dark-card/60 p-4 rounded-2xl border border-dark-border space-y-3">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block">
                        Verified Cricket Career Statistics (For Franchise Scouting)
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
                        <div>
                          <label className="block text-[10px] text-slate-400">Matches Played</label>
                          <input
                            type="number"
                            name="matchesPlayed"
                            value={formData.matchesPlayed}
                            onChange={handleChange}
                            className="w-full px-2.5 py-1.5 bg-dark-surface border border-dark-border rounded-lg text-xs text-slate-100 font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-400">Total Runs</label>
                          <input
                            type="number"
                            name="runsScored"
                            value={formData.runsScored}
                            onChange={handleChange}
                            className="w-full px-2.5 py-1.5 bg-dark-surface border border-dark-border rounded-lg text-xs text-slate-100 font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-400">Batting Avg</label>
                          <input
                            type="number"
                            step="0.1"
                            name="battingAverage"
                            value={formData.battingAverage}
                            onChange={handleChange}
                            className="w-full px-2.5 py-1.5 bg-dark-surface border border-dark-border rounded-lg text-xs text-slate-100 font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-400">Strike Rate</label>
                          <input
                            type="number"
                            step="0.1"
                            name="strikeRate"
                            value={formData.strikeRate}
                            onChange={handleChange}
                            className="w-full px-2.5 py-1.5 bg-dark-surface border border-dark-border rounded-lg text-xs text-slate-100 font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-400">Wickets Taken</label>
                          <input
                            type="number"
                            name="wickets"
                            value={formData.wickets}
                            onChange={handleChange}
                            className="w-full px-2.5 py-1.5 bg-dark-surface border border-dark-border rounded-lg text-xs text-slate-100 font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-400">Bowling Economy</label>
                          <input
                            type="number"
                            step="0.1"
                            name="bowlingEconomy"
                            value={formData.bowlingEconomy}
                            onChange={handleChange}
                            className="w-full px-2.5 py-1.5 bg-dark-surface border border-dark-border rounded-lg text-xs text-slate-100 font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* --- GAME 2: BGMI (BATTLEGROUNDS MOBILE INDIA) --- */}
                {formData.selectedSportSlug === 'bgmi' && (
                  <div className="space-y-4 pt-2 border-t border-dark-border/60">
                    <div className="flex items-center gap-2 text-xs font-bold text-brand-cyan uppercase">
                      <span>🎮 BGMI Esports Competitive Form</span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        (IGL, Assaulter, Sniper, Device & Finger Claw)
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* BGMI Role */}
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                          In-Game Esports Role *
                        </label>
                        <select
                          name="primaryRole"
                          value={formData.primaryRole}
                          onChange={handleChange}
                          className="w-full px-3 py-2 bg-dark-card border border-dark-border rounded-xl text-xs text-slate-100 focus:outline-none focus:border-brand-emerald"
                        >
                          <option value="IGL (In-Game Leader)">🧠 In-Game Leader (IGL / Caller)</option>
                          <option value="Assaulter / Entry Fragger">⚔️ Assaulter / Entry Fragger (Frontline)</option>
                          <option value="Sniper / DMR">🎯 Sniper / Long-Range DMR Specialist</option>
                          <option value="Support / Utility Master">🛡️ Support / Medic & Smokes Master</option>
                        </select>
                      </div>

                      {/* Device Specification */}
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                          Device Specification *
                        </label>
                        <select
                          name="device"
                          value={formData.device}
                          onChange={handleChange}
                          className="w-full px-3 py-2 bg-dark-card border border-dark-border rounded-xl text-xs text-slate-100 focus:outline-none focus:border-brand-emerald"
                        >
                          <option value="mobile_ios">iPhone (Competitive Esports Tier)</option>
                          <option value="mobile_android">Android Flagship (ROG / iQOO / OnePlus)</option>
                          <option value="tablet">iPad / Tablet (Community Spec)</option>
                        </select>
                      </div>

                      {/* Control Setup & Gyroscope */}
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                          Control Setup & Gyroscope *
                        </label>
                        <select
                          name="controlSetup"
                          value={formData.controlSetup}
                          onChange={handleChange}
                          className="w-full px-3 py-2 bg-dark-card border border-dark-border rounded-xl text-xs text-slate-100 focus:outline-none focus:border-brand-emerald"
                        >
                          <option value="4finger">4-Finger Claw + Full Gyro (Always On)</option>
                          <option value="3finger">3-Finger Claw + Gyroscope</option>
                          <option value="2finger">2-Finger Thumb Player</option>
                          <option value="scope_gyro">Scope-Only Gyroscope</option>
                          <option value="non_gyro">Non-Gyro (Pure Touch)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      {/* Character UID */}
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                          BGMI Character UID *
                        </label>
                        <input
                          type="text"
                          required
                          name="inGameId"
                          value={formData.inGameId}
                          onChange={handleChange}
                          placeholder="e.g. 5129481023"
                          className="w-full px-3 py-2 bg-dark-card border border-dark-border rounded-xl text-xs text-slate-100 font-mono focus:outline-none focus:border-brand-emerald"
                        />
                      </div>

                      {/* Rank Tier */}
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                          Peak Competitive Tier *
                        </label>
                        <select
                          name="rankTier"
                          value={formData.rankTier}
                          onChange={handleChange}
                          className="w-full px-3 py-2 bg-dark-card border border-dark-border rounded-xl text-xs text-slate-100 focus:outline-none focus:border-brand-emerald"
                        >
                          <option value="Conqueror">Conqueror (Top 500 Regional)</option>
                          <option value="Ace Dominator">Ace Dominator (10+ Stars)</option>
                          <option value="Ace Master">Ace Master</option>
                          <option value="Ace">Ace Regular</option>
                        </select>
                      </div>

                      {/* F/D Ratio (KD) */}
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                          F/D (K/D) Ratio *
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          name="kdRatio"
                          value={formData.kdRatio}
                          onChange={handleChange}
                          className="w-full px-3 py-2 bg-dark-card border border-dark-border rounded-xl text-xs text-slate-100 font-mono focus:outline-none focus:border-brand-emerald"
                        />
                      </div>

                      {/* Base Price */}
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                          Base Starting Bid *
                        </label>
                        <select
                          name="expectedBasePrice"
                          value={formData.expectedBasePrice}
                          onChange={handleChange}
                          className="w-full px-3 py-2 bg-dark-card border border-dark-border rounded-xl text-xs text-brand-emerald font-mono font-bold focus:outline-none focus:border-brand-emerald"
                        >
                          <option value="2500">₹2,500 (Emerging Talent)</option>
                          <option value="5000">₹5,000 (Semi-Pro Verified)</option>
                          <option value="10000">₹10,000 (Tier 1 Pro Official)</option>
                          <option value="25000">₹25,000 (Superstar Champion)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* --- GAME 3: VALORANT --- */}
                {formData.selectedSportSlug === 'valorant' && (
                  <div className="space-y-4 pt-2 border-t border-dark-border/60">
                    <div className="flex items-center gap-2 text-xs font-bold text-brand-purple uppercase">
                      <span>⚡ Valorant Tactical FPS Form</span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        (Duelist, Controller, Initiator, Sentinel & Signature Agents)
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                          Agent Class / Role *
                        </label>
                        <select
                          name="primaryRole"
                          value={formData.primaryRole}
                          onChange={handleChange}
                          className="w-full px-3 py-2 bg-dark-card border border-dark-border rounded-xl text-xs text-slate-100 focus:outline-none focus:border-brand-emerald"
                        >
                          <option value="Duelist">🔥 Duelist (Jett, Reyna, Raze)</option>
                          <option value="Controller">💨 Controller (Omen, Viper, Brimstone)</option>
                          <option value="Initiator">⚡ Initiator (Sova, Fade, Breach)</option>
                          <option value="Sentinel">🛡️ Sentinel (Killjoy, Cypher, Chamber)</option>
                          <option value="Flex">✨ Flex (Multi-Role Master)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                          Riot ID & Tagline *
                        </label>
                        <input
                          type="text"
                          required
                          name="inGameId"
                          value={formData.inGameId}
                          onChange={handleChange}
                          placeholder="e.g. TenZ#NA1 or Mortal#IND"
                          className="w-full px-3 py-2 bg-dark-card border border-dark-border rounded-xl text-xs text-slate-100 font-mono focus:outline-none focus:border-brand-emerald"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                          Peak Competitive Rank *
                        </label>
                        <select
                          name="rankTier"
                          value={formData.rankTier}
                          onChange={handleChange}
                          className="w-full px-3 py-2 bg-dark-card border border-dark-border rounded-xl text-xs text-slate-100 focus:outline-none focus:border-brand-emerald"
                        >
                          <option value="Radiant">Radiant (Top 500)</option>
                          <option value="Immortal 3">Immortal 3 (300+ RR)</option>
                          <option value="Immortal 1-2">Immortal 1 - 2</option>
                          <option value="Ascendant">Ascendant 1 - 3</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                          Signature Agents (Comma separated)
                        </label>
                        <input
                          type="text"
                          name="signatureAgents"
                          value={formData.signatureAgents}
                          onChange={handleChange}
                          placeholder="e.g. Jett, Reyna, Omen"
                          className="w-full px-3 py-2 bg-dark-card border border-dark-border rounded-xl text-xs text-slate-100 focus:outline-none focus:border-brand-emerald"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                          Auction Base Price
                        </label>
                        <select
                          name="expectedBasePrice"
                          value={formData.expectedBasePrice}
                          onChange={handleChange}
                          className="w-full px-3 py-2 bg-dark-card border border-dark-border rounded-xl text-xs text-brand-emerald font-mono font-bold focus:outline-none focus:border-brand-emerald"
                        >
                          <option value="3000">₹3,000 (Premier Contender)</option>
                          <option value="6000">₹6,000 (Challengers Pro)</option>
                          <option value="12000">₹12,000 (Ascension Finalist)</option>
                          <option value="30000">₹30,000 (VCT Marquee)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* --- GAME 4: FOOTBALL / TURF SOCCER --- */}
                {formData.selectedSportSlug === 'football' && (
                  <div className="space-y-4 pt-2 border-t border-dark-border/60">
                    <div className="flex items-center gap-2 text-xs font-bold text-brand-emerald uppercase">
                      <span>⚽ Football Turf & Championship Form</span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        (Goalkeeper, Defender, Midfielder, Striker & Preferred Foot)
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                          Playing Position *
                        </label>
                        <select
                          name="primaryRole"
                          value={formData.primaryRole}
                          onChange={handleChange}
                          className="w-full px-3 py-2 bg-dark-card border border-dark-border rounded-xl text-xs text-slate-100 focus:outline-none focus:border-brand-emerald"
                        >
                          <option value="Goalkeeper (GK)">🧤 Goalkeeper (GK)</option>
                          <option value="Defender (CB/LB/RB)">🛡️ Defender (Center Back / Fullback)</option>
                          <option value="Midfielder (CM/CAM)">⚡ Midfielder (Playmaker / Engine)</option>
                          <option value="Forward / Striker (ST)">🎯 Forward / Striker (Goal Finisher)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                          Preferred Foot *
                        </label>
                        <select
                          name="preferredFoot"
                          value={formData.preferredFoot}
                          onChange={handleChange}
                          className="w-full px-3 py-2 bg-dark-card border border-dark-border rounded-xl text-xs text-slate-100 focus:outline-none focus:border-brand-emerald"
                        >
                          <option value="right">Right Foot Only</option>
                          <option value="left">Left Foot (Lefty Finisher)</option>
                          <option value="both">Both Feet (Ambidextrous)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                          Jersey Number
                        </label>
                        <input
                          type="number"
                          name="jerseyNumber"
                          value={formData.jerseyNumber}
                          onChange={handleChange}
                          placeholder="e.g. 10 or 7 or 1"
                          className="w-full px-3 py-2 bg-dark-card border border-dark-border rounded-xl text-xs text-slate-100 focus:outline-none focus:border-brand-emerald"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* --- GAME 5: CARROM (NATIONAL & CORPORATE CHAMPIONSHIP) --- */}
                {formData.selectedSportSlug === 'carrom' && (
                  <div className="space-y-4 pt-2 border-t border-dark-border/60">
                    <div className="flex items-center gap-2 text-xs font-bold text-brand-gold uppercase">
                      <span>🎯 Carrom Masters & White Slam Championship Form</span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        (White Slam Specialist, Direct Striker, Cut & Pocket Master, Grip & Striker Weight)
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Carrom Role */}
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                          Carrom Board Specialization *
                        </label>
                        <select
                          name="primaryRole"
                          value={formData.primaryRole}
                          onChange={handleChange}
                          className="w-full px-3 py-2 bg-dark-card border border-dark-border rounded-xl text-xs text-slate-100 focus:outline-none focus:border-brand-emerald"
                        >
                          <option value="White Slam Specialist">⚡ White Slam Specialist (1st Break Clearer)</option>
                          <option value="Direct Striker">🎯 Direct Striker (Seedha Nishanebaaz)</option>
                          <option value="Cut & Pocket Master">📐 Cut & Pocket Master (Rebound / Double Cut)</option>
                          <option value="Doubles Partner / Anchor">🛡️ Doubles Partner (Jodi Saathi & Defensive Anchor)</option>
                        </select>
                      </div>

                      {/* Striking Arm / Hand Style */}
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                          Striking Hand Style (Righty / Lefty) *
                        </label>
                        <select
                          name="strikingHand"
                          value={formData.strikingHand}
                          onChange={handleChange}
                          className="w-full px-3 py-2 bg-dark-card border border-dark-border rounded-xl text-xs text-slate-100 focus:outline-none focus:border-brand-emerald"
                        >
                          <option value="right">Right-Hand Striker (Righty)</option>
                          <option value="left">Left-Hand Striker (Lefty)</option>
                          <option value="both">Ambidextrous (Both Hands Capable)</option>
                        </select>
                      </div>

                      {/* Grip & Release Technique */}
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                          Grip & Release Technique *
                        </label>
                        <select
                          name="gripStyle"
                          value={formData.gripStyle}
                          onChange={handleChange}
                          className="w-full px-3 py-2 bg-dark-card border border-dark-border rounded-xl text-xs text-slate-100 focus:outline-none focus:border-brand-emerald"
                        >
                          <option value="scissor">Scissor Grip (Middle-Index Finger Release)</option>
                          <option value="straight_finger">Straight Finger Drive (Index Push)</option>
                          <option value="thumb_flick">Thumb Flick (Angootha Drive)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      {/* Federation Registration ID */}
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                          AICF / Board Reg ID *
                        </label>
                        <input
                          type="text"
                          required
                          name="inGameId"
                          value={formData.inGameId}
                          onChange={handleChange}
                          placeholder="e.g. AICF-2026-904"
                          className="w-full px-3 py-2 bg-dark-card border border-dark-border rounded-xl text-xs text-slate-100 font-mono focus:outline-none focus:border-brand-emerald"
                        />
                      </div>

                      {/* Federation Ranking / Tier */}
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                          Federation Ranking Tier *
                        </label>
                        <select
                          name="carromTier"
                          value={formData.carromTier}
                          onChange={handleChange}
                          className="w-full px-3 py-2 bg-dark-card border border-dark-border rounded-xl text-xs text-slate-100 focus:outline-none focus:border-brand-emerald"
                        >
                          <option value="state_champion">State Championship Medalist</option>
                          <option value="aicf_national">AICF National Ranked Master</option>
                          <option value="district_club">District / Corporate Club Ace</option>
                        </select>
                      </div>

                      {/* Striker Weight */}
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                          Match Striker Weight *
                        </label>
                        <select
                          name="strikerWeight"
                          value={formData.strikerWeight}
                          onChange={handleChange}
                          className="w-full px-3 py-2 bg-dark-card border border-dark-border rounded-xl text-xs text-slate-100 font-mono focus:outline-none focus:border-brand-emerald"
                        >
                          <option value="15.0g">15.0g (Standard Match Legal)</option>
                          <option value="14.8g">14.8g (Precision Speed)</option>
                          <option value="15.2g">15.2g (Heavy Impact)</option>
                        </select>
                      </div>

                      {/* Base Price Slabs */}
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                          Auction Base Price Floor *
                        </label>
                        <select
                          name="expectedBasePrice"
                          value={formData.expectedBasePrice}
                          onChange={handleChange}
                          className="w-full px-3 py-2 bg-dark-card border border-dark-border rounded-xl text-xs text-brand-emerald font-mono font-bold focus:outline-none focus:border-brand-emerald"
                        >
                          <option value="3000">₹3,000 (Club / District Prodigy)</option>
                          <option value="6000">₹6,000 (State Ranked Regular)</option>
                          <option value="12000">₹12,000 (National Champion Contender)</option>
                          <option value="25000">₹25,000 (White Slam Legend / Marquee Icon)</option>
                        </select>
                      </div>
                    </div>

                    {/* Verified Carrom Career Statistics */}
                    <div className="bg-dark-card/60 p-4 rounded-2xl border border-dark-border space-y-3">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block">
                        Verified Carrom Championship Statistics (Scouted by Franchises)
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div>
                          <label className="block text-[10px] text-slate-400">Total Career Matches</label>
                          <input
                            type="number"
                            name="matchesPlayed"
                            value={formData.matchesPlayed}
                            onChange={handleChange}
                            className="w-full px-2.5 py-1.5 bg-dark-surface border border-dark-border rounded-lg text-xs text-slate-100 font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-400">White Slams (1st Turn Clearances)</label>
                          <input
                            type="number"
                            name="whiteSlams"
                            value={formData.whiteSlams}
                            onChange={handleChange}
                            className="w-full px-2.5 py-1.5 bg-dark-surface border border-dark-border rounded-lg text-xs text-brand-emerald font-mono font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-400">Pocket Accuracy %</label>
                          <input
                            type="number"
                            step="0.1"
                            name="pocketAccuracy"
                            value={formData.pocketAccuracy}
                            onChange={handleChange}
                            className="w-full px-2.5 py-1.5 bg-dark-surface border border-dark-border rounded-lg text-xs text-brand-gold font-mono font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-400">AICF / State Rank</label>
                          <input
                            type="text"
                            name="aicfRank"
                            value={formData.aicfRank}
                            onChange={handleChange}
                            className="w-full px-2.5 py-1.5 bg-dark-surface border border-dark-border rounded-lg text-xs text-slate-100 font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Accolades & Trophies */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Career Highlights, Trophies & Awards (Displayed to Team Owners)
                  </label>
                  <input
                    type="text"
                    name="accolades"
                    value={formData.accolades}
                    onChange={handleChange}
                    placeholder="e.g. Best Bowler 2025, Orange Cap Winner, BGIS MVP 2024"
                    className="w-full px-3 py-2 bg-dark-card border border-dark-border rounded-xl text-xs text-slate-100 focus:outline-none focus:border-brand-emerald"
                  />
                </div>

                {/* --- LIVE INTERACTIVE LOT CARD PREVIEW --- */}
                <div className="bg-dark-card p-4 rounded-2xl border border-brand-cyan/40 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-brand-cyan uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Live Draft Lot Card Preview (Franchises will see this in auction room):</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-emerald/20 text-brand-emerald">
                      ✓ Tournament Qualified Lot
                    </span>
                  </div>

                  <div className="bg-dark-surface p-4 rounded-xl border border-dark-border/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-xl bg-dark-card border border-brand-cyan/40 text-brand-cyan flex items-center justify-center font-bold text-2xl">
                        {formData.selectedSportSlug === 'cricket'
                          ? '🏏'
                          : formData.selectedSportSlug === 'carrom'
                          ? '🎯'
                          : formData.selectedSportSlug === 'football'
                          ? '⚽'
                          : formData.selectedSportSlug === 'kabaddi'
                          ? '🤼'
                          : formData.selectedSportSlug === 'chess'
                          ? '♟️'
                          : formData.selectedSportSlug === 'valorant'
                          ? '⚡'
                          : '🎮'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-gaming text-lg font-bold text-slate-100">
                            {formData.fullName || 'Athlete Name'}
                          </h4>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-brand-cyan/15 text-brand-cyan font-bold uppercase">
                            {formData.selectedSportSlug === 'cricket'
                              ? `Jersey #${formData.jerseyNumber || 45}`
                              : formData.inGameId || 'ID#Verified'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-0.5">
                          <span className="text-brand-emerald font-semibold">{formData.primaryRole}</span>
                          {formData.selectedSportSlug === 'cricket' && (
                            <span className="text-slate-400">
                              {' '}
                              • {formData.battingStyle === 'rhb' ? 'Right-Hand Bat (RHB)' : 'Left-Hand Bat (LHB)'} •{' '}
                              {formData.bowlingStyle.toUpperCase()}
                            </span>
                          )}
                          {formData.selectedSportSlug === 'carrom' && (
                            <span className="text-slate-400">
                              {' '}
                              • {formData.strikingHand === 'left' ? 'Lefty' : 'Righty'} Striker •{' '}
                              {formData.gripStyle} grip • White Slams: {formData.whiteSlams} • Accuracy:{' '}
                              {formData.pocketAccuracy}%
                            </span>
                          )}
                          {formData.selectedSportSlug === 'bgmi' && (
                            <span className="text-slate-400">
                              {' '}
                              • {formData.controlSetup} • {formData.rankTier}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Base Floor Price</span>
                      <span className="font-mono text-xl font-extrabold text-brand-emerald">
                        {formatCurrency(formData.expectedBasePrice)}
                      </span>
                    </div>
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
                      {t('auth.team_name', 'Franchise / Team Name')} *
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
                      {t('auth.team_tag', 'Team Tag (3-4 Chars)')} *
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
                    {t('auth.team_budget', 'Initial Clan Purse Budget (₹)')} *
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
                  {t('auth.admin_section_title', 'SuperAdmin Authorization Passkey')} *
                </label>
                <input
                  type="password"
                  required
                  name="adminPasskey"
                  value={formData.adminPasskey}
                  onChange={handleChange}
                  placeholder={t('auth.admin_passkey_placeholder', 'Enter SuperAdmin secret passkey')}
                  className="w-full px-3 py-2 bg-dark-card border border-brand-gold/40 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-brand-gold"
                />
                <span className="text-[10px] text-slate-400 block">
                  {t('auth.admin_passkey_help', 'For testing: passkey is ARENA2026')}
                </span>
              </div>
            )}

            {/* Passwords */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {t('auth.password', 'Password')} *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-3 py-2 bg-dark-surface border border-dark-border rounded-xl text-xs text-slate-100 focus:outline-none focus:border-brand-emerald"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {t('auth.confirm_password', 'Confirm Password')} *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-3 py-2 bg-dark-surface border border-dark-border rounded-xl text-xs text-slate-100 focus:outline-none focus:border-brand-emerald"
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full font-gaming uppercase tracking-wider text-sm shadow-glow-emerald"
            >
              {loading ? t('auth.creating_account', 'Registering Profile...') : `${t('auth.register_cta', 'Register as')} ${currentRoleTitle}`}
            </Button>
          </form>

          <div className="text-center pt-4 border-t border-dark-border">
            <span className="text-xs text-slate-400">
              {t('auth.already_have_account', 'Already registered?')}{' '}
              <Link to="/login" className="text-brand-emerald hover:underline font-semibold">
                {t('auth.login_here', 'Sign In here')}
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
