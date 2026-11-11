import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import Home from './pages/Home';
import GamesList from './pages/GamesList';
import GameDetail from './pages/GameDetail';
import LiveAuctions from './pages/LiveAuctions';
import UpcomingAuctions from './pages/UpcomingAuctions';
import CompletedAuctions from './pages/CompletedAuctions';
import AuctionDetail from './pages/AuctionDetail';
import LiveAuctionRoom from './pages/LiveAuctionRoom';
import AuctionRules from './pages/AuctionRules';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import VerifyEmail from './pages/auth/VerifyEmail';

// Dashboard & Team Pages
import UserDashboard from './pages/dashboard/UserDashboard';
import TeamDashboard from './pages/dashboard/TeamDashboard';
import CreateTeam from './pages/dashboard/CreateTeam';
import HostTournament from './pages/dashboard/HostTournament';

// Admin Pages
import AdminOverview from './pages/admin/AdminOverview';

// Static Pages
import AboutUs from './pages/static/AboutUs';
import ContactUs from './pages/static/ContactUs';
import PrivacyPolicy from './pages/static/PrivacyPolicy';
import TermsConditions from './pages/static/TermsConditions';
import NotFound from './pages/NotFound';

// Scroll to top helper on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-dark-bg text-slate-100 font-sans selection:bg-brand-emerald selection:text-black">
      <ScrollToTop />
      <Navbar />
      <main className="flex-grow">
        <Routes>
          {/* Public Core Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/games" element={<GamesList />} />
          <Route path="/games/:slug" element={<GameDetail />} />
          <Route path="/auctions" element={<LiveAuctions />} />
          <Route path="/auctions/live" element={<LiveAuctions />} />
          <Route path="/auctions/upcoming" element={<UpcomingAuctions />} />
          <Route path="/auctions/completed" element={<CompletedAuctions />} />
          <Route path="/auctions/:id" element={<AuctionDetail />} />
          <Route path="/auctions/live/:id" element={<LiveAuctionRoom />} />
          <Route path="/rules" element={<AuctionRules />} />
          <Route path="/rules/:sport" element={<AuctionRules />} />

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />

          {/* Protected User & Clan Dashboards */}
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/profile" element={<UserDashboard />} />
          <Route path="/notifications" element={<UserDashboard />} />
          <Route path="/team" element={<TeamDashboard />} />
          <Route path="/teams" element={<TeamDashboard />} />
          <Route path="/teams/create" element={<CreateTeam />} />
          <Route path="/create-team" element={<CreateTeam />} />
          <Route path="/host-tournament" element={<HostTournament />} />
          <Route path="/tournaments/create" element={<HostTournament />} />
          <Route path="/organize" element={<HostTournament />} />

          {/* Protected Admin Console */}
          <Route path="/admin" element={<AdminOverview />} />

          {/* Static Legal & Support */}
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsConditions />} />

          {/* 404 Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;

