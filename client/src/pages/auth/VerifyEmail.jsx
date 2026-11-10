import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import { CheckCircle2 } from 'lucide-react';

const VerifyEmail = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-dark-card border border-dark-border rounded-3xl p-8 space-y-6 shadow-2xl text-center">
        <div className="w-14 h-14 rounded-full bg-brand-emerald/15 border border-brand-emerald/30 text-brand-emerald flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="font-gaming text-3xl font-extrabold text-slate-100 uppercase">
          Email Verified Successfully
        </h2>
        <p className="text-xs text-slate-400">
          Your athlete profile is now confirmed. You are eligible to participate in live tournament bidding and register teams.
        </p>
        <Link to="/dashboard">
          <Button variant="primary" size="md" className="w-full">
            Proceed to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default VerifyEmail;

