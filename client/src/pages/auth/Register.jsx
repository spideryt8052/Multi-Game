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

  // 4 Core Platform Roles
  const [selectedRole, setSelectedRole] = useState('user'); // 'user' (Darshak), 'gamer' (Player), 'team_owner' (Team Malik), 'admin'

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
      title: 'Darshak (Spectator / Fan)',
      badge: 'Viewer Access',
      icon: Eye,
      description: 'Live auction dekhna, bids follow karna aur matches spectate karna.',
      canDo: ['Live bidding rooms watch karna', 'Player stats & leaderboards dekhna', 'Tournaments follow karna'],
      cannotDo: ['Boli (Bid) nahi laga sakte', 'Admin controls nahi milenge'],
    },
    {
      id: 'gamer',
      title: 'Player / Khiladi (Athlete)',
      badge: 'Draft Eligible',
      icon: Trophy,
      description: 'Auction pool mein enter hona aur teams dwara kharida jana.',
      canDo: ['Apna player profile & stats submit karna', 'Auction lot queue mein ana', 'Franchise contract sign karna'],
      cannotDo: ['Dusre players par boli nahi laga sakte', 'Admin controls nahi milenge'],
    },
    {
      id: 'team_owner',
      title: 'Team Owner (Team Malik)',
      badge: 'Full Bidding Access',
      icon: Shield,
      description: 'Apni team banana, purse budget manage karna aur players par live boli lagana.',
      canDo: ['Live auction room mein bid lagana', 'Apni franchise ka budget purse manage karna', 'Winning squad create karna'],
      cannotDo: ['Khiladi ke roop mein pool mein nahi ja sakte', 'Admin controls nahi milenge'],
    },
    {
      id: 'admin',
      title: 'Admin (Prabandhak)',
      badge: 'Root SuperAdmin',
      icon: Briefcase,
      description: 'Poore platform aur tournaments ka full management aur control.',
      canDo: ['Auctions start/pause/sold gavel strike karna', 'Players approve/reject karna', 'Sports & rules add karna'],
      cannotDo: ['Spectator jaisa normal view nahi'],
    },
  ];

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
      setErrorMessage('Passwords match nahi ho rahe hain');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage('Password kam se kam 6 characters ka hona chahiye');
      return;
    }

    if (selectedRole === 'admin' && formData.adminPasskey !== 'ARENA2026') {
      setErrorMessage('Galat Admin Passkey! SuperAdmin registration ke liye secret key required hai.');
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
      setErrorMessage(err.response?.data?.message || 'Server error. Please verify your details.');
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
            Create Your Arena Account
          </h1>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Apna role select karein: <span className="text-slate-200 font-semibold">Darshak (Viewer)</span>, <span className="text-brand-cyan font-semibold">Player (Khiladi)</span>, <span className="text-brand-emerald font-semibold">Team Malik (Owner)</span> ya <span className="text-brand-gold font-semibold">Admin</span>. Har role ke hisab se platform customize hoga.
          </p>
        </div>

        {/* STEP 1: Select Role (4 Cards) */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider text-center">
            Step 1: Apna Role Chunein (Select Platform Identity)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {rolesConfig.map((role) => {
              const Icon = role.icon;
              const isSelected = selectedRole === role.id;

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
                        {role.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-gaming text-lg font-bold text-slate-100">{role.title}</h3>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{role.description}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-dark-border/60 mt-3 text-[11px] space-y-1">
                    <p className="text-brand-emerald font-semibold flex items-center gap-1">
                      <span>✓ {role.canDo[0]}</span>
                    </p>
                    <p className="text-slate-500 flex items-center gap-1">
                      <span>✕ {role.cannotDo[0]}</span>
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
                Step 2: Profile Details
              </span>
              <h2 className="font-gaming text-2xl font-bold text-slate-100 uppercase">
                {rolesConfig.find((r) => r.id === selectedRole)?.title} Registration
              </h2>
            </div>
            <span className="text-xs text-slate-400">
              Role: <span className="font-bold text-brand-emerald uppercase">{selectedRole}</span>
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
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Legal Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. Rohit Verma"
                    className="w-full pl-9 pr-3 py-2 bg-dark-surface border border-dark-border rounded-xl text-xs text-slate-100 focus:outline-none focus:border-brand-emerald"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Username / Platform Alias</label>
                <input
                  type="text"
                  required
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="e.g. rohit_titans"
                  className="w-full px-3 py-2 bg-dark-surface border border-dark-border rounded-xl text-xs text-slate-100 focus:outline-none focus:border-brand-emerald"
                />
              </div>
            </div>

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
                    placeholder="name@domain.com"
                    className="w-full pl-9 pr-3 py-2 bg-dark-surface border border-dark-border rounded-xl text-xs text-slate-100 focus:outline-none focus:border-brand-emerald"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Mobile Number</label>
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

            {/* DYNAMIC SECTION 1: IF PLAYER / KHILADI */}
            {selectedRole === 'gamer' && (
              <div className="bg-dark-surface/50 border border-brand-cyan/30 rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-2 text-brand-cyan text-xs font-bold uppercase tracking-wider">
                  <Trophy className="w-4 h-4" />
                  <span>Athlete / Sports Lot Verification Details</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-300 mb-1">Sport / Game Category</label>
                    <select
                      name="sportCategory"
                      value={formData.sportCategory}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-dark-card border border-dark-border rounded-xl text-xs text-slate-100 focus:outline-none focus:border-brand-emerald"
                    >
                      <option value="physical_sports">🏏 Physical Sport (Cricket, Football, etc.)</option>
                      <option value="esports">🎮 Esports (BGMI, Valorant, etc.)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-300 mb-1">Primary Title</label>
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
                    <label className="block text-[11px] text-slate-300 mb-1">Playing Role / Position</label>
                    <input
                      type="text"
                      name="primaryRole"
                      value={formData.primaryRole}
                      onChange={handleChange}
                      placeholder="e.g. All-Rounder / Striker / IGL"
                      className="w-full px-3 py-2 bg-dark-card border border-dark-border rounded-xl text-xs text-slate-100 focus:outline-none focus:border-brand-emerald"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-300 mb-1">In-Game UID / Jersey Number</label>
                    <input
                      type="text"
                      required
                      name="inGameId"
                      value={formData.inGameId}
                      onChange={handleChange}
                      placeholder="e.g. Jersey #45 or BGMI UID 5129481"
                      className="w-full px-3 py-2 bg-dark-card border border-dark-border rounded-xl text-xs text-slate-100 focus:outline-none focus:border-brand-emerald"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-300 mb-1">Career Accolades / Stats</label>
                    <input
                      type="text"
                      name="accolades"
                      value={formData.accolades}
                      onChange={handleChange}
                      placeholder="e.g. Best Bowler 2024, Strike Rate: 168.4"
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
                  <span>Franchise / Clan Ownership Details</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] text-slate-300 mb-1">Franchise / Team Name</label>
                    <input
                      type="text"
                      required
                      name="teamName"
                      value={formData.teamName}
                      onChange={handleChange}
                      placeholder="e.g. Mumbai Titans or GodLike"
                      className="w-full px-3 py-2 bg-dark-card border border-dark-border rounded-xl text-xs text-slate-100 focus:outline-none focus:border-brand-emerald"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-300 mb-1">Team Tag (3-4 Chars)</label>
                    <input
                      type="text"
                      required
                      name="teamTag"
                      value={formData.teamTag}
                      onChange={handleChange}
                      placeholder="MT"
                      className="w-full px-3 py-2 bg-dark-card border border-dark-border rounded-xl text-xs text-slate-100 font-mono uppercase focus:outline-none focus:border-brand-emerald"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-300 mb-1">Initial Clan Purse Budget (₹)</label>
                  <input
                    type="number"
                    required
                    name="teamBudget"
                    value={formData.teamBudget}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-dark-card border border-dark-border rounded-xl text-xs text-slate-100 font-mono focus:outline-none focus:border-brand-emerald"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    This purse will be allocated to your franchise for live bidding in tournament rooms.
                  </span>
                </div>
              </div>
            )}

            {/* DYNAMIC SECTION 3: IF ADMIN PASSKEY */}
            {selectedRole === 'admin' && (
              <div className="bg-brand-gold/10 border border-brand-gold/30 rounded-2xl p-5 space-y-2">
                <label className="block text-xs font-bold text-brand-gold uppercase tracking-wider">
                  SuperAdmin Authorization Passkey
                </label>
                <input
                  type="password"
                  required
                  name="adminPasskey"
                  value={formData.adminPasskey}
                  onChange={handleChange}
                  placeholder="Enter Secret Key (Demo: ARENA2026)"
                  className="w-full px-3 py-2 bg-dark-card border border-dark-border rounded-xl text-xs text-slate-100 focus:outline-none focus:border-brand-gold"
                />
                <p className="text-[11px] text-slate-400">
                  Demo Passkey for evaluator: <span className="font-mono text-brand-gold font-bold">ARENA2026</span>
                </p>
              </div>
            )}

            {/* Passwords */}
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
              Complete {rolesConfig.find((r) => r.id === selectedRole)?.title} Registration
            </Button>
          </form>

          <div className="text-center pt-2 text-xs text-slate-400">
            <span>Already have an account? </span>
            <Link to="/login" className="text-brand-emerald font-semibold hover:underline">
              Sign In Here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
