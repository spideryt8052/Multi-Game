import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import { Mail, CheckCircle2 } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-dark-card border border-dark-border rounded-3xl p-8 space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <h2 className="font-gaming text-3xl font-extrabold text-slate-100 uppercase">
            Reset Password
          </h2>
          <p className="text-xs text-slate-400">
            Enter your registered email address to receive secure reset credentials.
          </p>
        </div>

        {sent ? (
          <div className="p-4 bg-brand-emerald/15 border border-brand-emerald/30 rounded-2xl text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-brand-emerald mx-auto" />
            <h4 className="font-gaming text-base font-bold text-slate-100">Reset Email Dispatched</h4>
            <p className="text-xs text-slate-300">
              Check your inbox for a secure password reset link sent to <span className="font-semibold text-brand-emerald">{email}</span>.
            </p>
            <div className="pt-2">
              <Link to="/login" className="text-xs text-brand-emerald font-semibold hover:underline">
                Return to Login &rarr;
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Registered Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="athlete@esports.com"
                  className="w-full pl-9 pr-3 py-2 bg-dark-surface border border-dark-border rounded-xl text-xs text-slate-100 focus:outline-none focus:border-brand-emerald"
                />
              </div>
            </div>

            <Button type="submit" variant="primary" size="md" className="w-full">
              Send Reset Link
            </Button>

            <div className="text-center text-xs text-slate-400 pt-1">
              <Link to="/login" className="hover:underline">
                Back to Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;

