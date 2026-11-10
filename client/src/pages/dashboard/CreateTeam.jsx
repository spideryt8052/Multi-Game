import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../context/LanguageContext';
import { MOCK_GAMES } from '../../utils/mockData';
import Button from '../../components/common/Button';
import { Shield, Image as ImageIcon, Users, Wallet, CheckCircle2 } from 'lucide-react';

const CreateTeam = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    tag: '',
    gameSlug: 'bgmi',
    logo: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=200&auto=format&fit=crop',
    description: '',
    allocatedBudget: 50000,
    members: '',
  });

  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => {
      navigate('/teams');
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="bg-dark-card border border-dark-border rounded-3xl p-8 sm:p-10 space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-cyan/15 border border-brand-cyan/30 text-brand-cyan flex items-center justify-center text-xl font-bold mx-auto mb-2">
            🛡️
          </div>
          <h2 className="font-gaming text-3xl font-extrabold text-slate-100 uppercase">
            Create Esports Team / Clan
          </h2>
          <p className="text-xs text-slate-400">
            Form your competitive franchise to register for auctions and bid on premier athletes.
          </p>
        </div>

        {success ? (
          <div className="p-6 bg-brand-emerald/15 border border-brand-emerald/40 rounded-2xl text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-brand-emerald mx-auto" />
            <h3 className="font-gaming text-xl font-bold text-slate-100 uppercase">Team Created Successfully!</h3>
            <p className="text-xs text-slate-300">Redirecting to Team Hub...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">Official Team Name</label>
                <input
                  type="text"
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. GodLike Esports"
                  className="w-full px-3 py-2 bg-dark-surface border border-dark-border rounded-xl text-xs text-slate-100 focus:outline-none focus:border-brand-emerald"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Team Tag (3-5 Chars)</label>
                <input
                  type="text"
                  required
                  name="tag"
                  value={formData.tag}
                  onChange={handleChange}
                  placeholder="GODL"
                  className="w-full px-3 py-2 bg-dark-surface border border-dark-border rounded-xl text-xs text-slate-100 uppercase font-mono focus:outline-none focus:border-brand-emerald"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Game Title</label>
                <select
                  name="gameSlug"
                  value={formData.gameSlug}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-dark-surface border border-dark-border rounded-xl text-xs text-slate-100 focus:outline-none focus:border-brand-emerald"
                >
                  {MOCK_GAMES.map((game) => (
                    <option key={game.slug} value={game.slug}>
                      {game.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Initial Purse Allocation (₹)</label>
                <div className="relative">
                  <Wallet className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    required
                    name="allocatedBudget"
                    value={formData.allocatedBudget}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2 bg-dark-surface border border-dark-border rounded-xl text-xs text-slate-100 focus:outline-none focus:border-brand-emerald"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Team Logo URL</label>
              <div className="relative">
                <ImageIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  name="logo"
                  value={formData.logo}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full pl-9 pr-3 py-2 bg-dark-surface border border-dark-border rounded-xl text-xs text-slate-100 focus:outline-none focus:border-brand-emerald"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Team Description & Bio</label>
              <textarea
                rows="3"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your clan's achievements and competitive goals..."
                className="w-full px-3 py-2 bg-dark-surface border border-dark-border rounded-xl text-xs text-slate-100 focus:outline-none focus:border-brand-emerald"
              />
            </div>

            <Button type="submit" variant="primary" size="lg" className="w-full mt-2">
              Register Team & Initialize Wallet
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default CreateTeam;

