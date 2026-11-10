import React, { useState } from 'react';
import Button from '../../components/common/Button';
import { Mail, MessageSquare, MapPin, Send } from 'lucide-react';

const ContactUs = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      <div className="text-center space-y-2">
        <h1 className="font-gaming text-4xl sm:text-5xl font-extrabold text-slate-100 uppercase">
          Contact Support & Partnerships
        </h1>
        <p className="text-sm text-slate-400">
          Reach our esports tournament operations desk for custom clan auctions or technical support.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-dark-card border border-dark-border p-6 rounded-3xl space-y-6">
          <h3 className="font-gaming text-xl font-bold text-slate-100">Direct Contacts</h3>
          <div className="space-y-4 text-xs text-slate-300">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-brand-emerald" />
              <div>
                <p className="font-semibold text-slate-100">Tournament Inquiries</p>
                <p className="text-slate-400">tournaments@arenaauctions.gg</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MessageSquare className="w-5 h-5 text-brand-cyan" />
              <div>
                <p className="font-semibold text-slate-100">Discord Official Ops</p>
                <p className="text-slate-400">discord.gg/arenaauctions</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-brand-gold" />
              <div>
                <p className="font-semibold text-slate-100">Headquarters</p>
                <p className="text-slate-400">Bengaluru & New Delhi, India</p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-dark-card border border-dark-border p-6 rounded-3xl space-y-4">
          {submitted ? (
            <div className="text-center py-12 space-y-2">
              <span className="text-2xl">🎉</span>
              <h4 className="font-gaming text-lg font-bold text-brand-emerald">Message Received!</h4>
              <p className="text-xs text-slate-400">Our tournament operations team will reply within 4 hours.</p>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Your Name / Clan Handle</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Captain_Viper"
                  className="w-full px-3 py-2 bg-dark-surface border border-dark-border rounded-xl text-xs text-slate-100 focus:outline-none focus:border-brand-emerald"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="clan@esports.com"
                  className="w-full px-3 py-2 bg-dark-surface border border-dark-border rounded-xl text-xs text-slate-100 focus:outline-none focus:border-brand-emerald"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Message / Inquiry</label>
                <textarea
                  rows="4"
                  required
                  placeholder="Describe your tournament or custom game auction requirements..."
                  className="w-full px-3 py-2 bg-dark-surface border border-dark-border rounded-xl text-xs text-slate-100 focus:outline-none focus:border-brand-emerald"
                />
              </div>
              <Button type="submit" variant="primary" size="md" className="w-full gap-2">
                <Send className="w-4 h-4" />
                <span>Submit Inquiry</span>
              </Button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default ContactUs;

