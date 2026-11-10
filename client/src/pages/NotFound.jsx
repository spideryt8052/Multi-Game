import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import { Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <span className="font-gaming text-8xl font-black text-brand-emerald">404</span>
      <h2 className="font-gaming text-3xl font-bold text-slate-100 uppercase mt-2">
        Lot or Arena Not Found
      </h2>
      <p className="text-sm text-slate-400 mt-2 max-w-md">
        The match, tournament room, or page you are looking for does not exist or has already been concluded.
      </p>
      <div className="mt-6">
        <Link to="/">
          <Button variant="primary" size="md" className="gap-2">
            <Home className="w-4 h-4" />
            <span>Return to Lobby</span>
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

