import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../context/LanguageContext';
import { MOCK_GAMES, MOCK_AUCTIONS } from '../../utils/mockData';
import { formatCurrency } from '../../utils/formatCurrency';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import {
  Trophy,
  Shield,
  ShieldCheck,
  CheckCircle,
  Plus,
  Trash2,
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  AlertCircle,
  Sparkles,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  Flame,
  Award,
  FileText,
  CreditCard,
  Users,
  Gamepad2,
  Check,
  Zap,
} from 'lucide-react';

const ADMIN_SLOT_TIERS = [
  {
    id: 'bronze',
    name: 'Bronze Hosting Slot',
    price: 999,
    maxTeams: 8,
    features: [
      'Host up to 8 Teams in Live Auction',
      'Real-time Digital Gavel & Socket Clock',
      'Standard Live Bidding Room & Chat',
      'Basic Team Purse & Roster Validation',
      'Official Admin License Verification Badge',
    ],
    recommended: false,
    badgeColor: 'border-amber-700/50 text-amber-500 bg-amber-500/10',
  },
  {
    id: 'silver',
    name: 'Silver Pro Hosting Slot',
    price: 1999,
    maxTeams: 16,
    features: [
      'Host up to 16 Teams in Live Auction',
      'Custom Tournament Logo & Banner Upload',
      'Live YouTube/Twitch Stream Embed in Room',
      'Deep Athlete Stats & K/D Performance HUD',
      'Automated Roster Sheet Export (PDF/Excel)',
      'Official Admin Verified Gold License',
    ],
    recommended: true,
    badgeColor: 'border-slate-300/50 text-slate-200 bg-slate-200/10',
  },
  {
    id: 'gold',
    name: 'Gold Championship Slot',
    price: 3499,
    maxTeams: 32,
    features: [
      'Host up to 32 Teams in Live Auction',
      'Dedicated Admin Priority WebSocket Cluster',
      'On-Screen Broadcast Overlays for Casters',
      'Live Umpire & Referee Decision Panel',
      'Custom External Rules Enforcement Engine',
      'Direct WhatsApp/SMS Broadcast to Athletes',
    ],
    recommended: false,
    badgeColor: 'border-brand-gold/50 text-brand-gold bg-brand-gold/10',
  },
  {
    id: 'platinum',
    name: 'Platinum Franchise License',
    price: 4999,
    maxTeams: 64,
    features: [
      'Unlimited / Up to 64 Franchise Teams',
      'Multi-Table Simultaneous Live Bidding',
      'Full Sponsor Placement & Brand Banners',
      'Instant UPI Prize Payout Automation Support',
      'Dedicated 24/7 Platform Ops Concierge',
    ],
    recommended: false,
    badgeColor: 'border-brand-cyan/50 text-brand-cyan bg-brand-cyan/10',
  },
];

const DEFAULT_EXTERNAL_RULES_BY_GAME = {
  cricket: [
    {
      category: 'Reporting & Toss Policy',
      title: 'Toss Grace Period & Late Penalty',
      description: 'Captains must report at the turf 30 minutes before toss. More than 15 minutes delay results in 1 over deduction per 5 minutes or toss forfeit.',
      penalty: '1 Over deduction / Toss Walkover to opponent',
      mandatory: true,
    },
    {
      category: 'Uniform & Footwear',
      title: 'Mandatory Team Jersey & Rubber-Stud Turf Shoes',
      description: 'All players must be in matching jersey colors with clearly printed squad numbers. Metal spikes strictly prohibited on astroturf.',
      penalty: 'Ineligible to take the field / Yellow card',
      mandatory: true,
    },
    {
      category: 'Match Overs & Ball',
      title: '10 Overs Limit & Heavy Tennis Ball Rule',
      description: 'Matches will be 10 overs a side. Max 2 overs per bowler. Official Red Cosco heavy tennis balls provided by the organizer.',
      penalty: 'Over forfeiture if bowler quota violated',
      mandatory: true,
    },
    {
      category: 'Substitutes',
      title: 'Strict 1 Impact Substitute Rule',
      description: 'Impact player must be named on the team sheet before toss. Outside unlisted players cannot be substituted.',
      penalty: 'Team Disqualification & entry fee forfeit',
      mandatory: true,
    },
    {
      category: 'Discipline & Umpiring',
      title: 'Zero Tolerance for Umpire Dissent',
      description: 'The on-field umpire decision is final. Abusive language, arguing with officials, or ball tampering is strictly banned.',
      penalty: '10 Runs penalty + Match suspension for player',
      mandatory: true,
    },
  ],
  carrom: [
    {
      category: 'Board & Striker Regulation',
      title: 'Championship Board & Striker Weight Limit',
      description: 'Synco/Sisca English Birchwood 8mm boards. Striker weight must not exceed 15.0 grams and must be smooth and circular.',
      penalty: 'Striker confiscation & 2 white coin penalty',
      mandatory: true,
    },
    {
      category: 'Powder Regulation',
      title: 'Only French Chalk Provided by Organizer',
      description: 'Players are not allowed to apply external boric powder or aerosol sprays. Only organizer-approved French chalk is permitted on the surface.',
      penalty: 'Loss of turn + opponent given choice of break',
      mandatory: true,
    },
    {
      category: 'Finger Grips & Fouls',
      title: 'Hand Position & Thumb Rest Restrictions',
      description: 'While striking, the player hand or wrist must touch the edge of the board. Pushing the striker with palm is a foul.',
      penalty: '1 Penalty coin placed in center circle',
      mandatory: true,
    },
    {
      category: 'Reporting & Decorum',
      title: 'Cell Phone Silence & 10-Minute Reporting Rule',
      description: 'Matches will begin strictly on board assignment. Mobile phones must be switched off. Ringing phone during play forfeits the board.',
      penalty: 'Opponent awarded 3 penalty points',
      mandatory: true,
    },
  ],
  bgmi: [
    {
      category: 'Device & Peripheral Restrictions',
      title: 'Mobile Phones Only (Strictly No iPads / Triggers / Emulators)',
      description: 'Only Android & iOS smartphones are permitted. Tablets, iPads, physical triggers, root modifications, and third-party overlays are strictly banned.',
      penalty: 'Instant Team Disqualification & Permanent Ban',
      mandatory: true,
    },
    {
      category: 'Anti-Cheat & Screen Recording',
      title: 'Mandatory Device Screen Recording for Top 3 Fraggers',
      description: 'Players must record their device screen with in-game sound and handcam if requested by organizers for anti-cheat verification.',
      penalty: 'Zero points for the match in case of failure to submit POV',
      mandatory: true,
    },
    {
      category: 'Disconnects & Re-host Policy',
      title: 'Server Re-host Only on 30% Lobby Drop within 60s',
      description: 'If a single player disconnects due to personal ISP failure, the match continues. Lobby re-host only if >30% drop within 60 seconds.',
      penalty: 'Match proceeds as scheduled',
      mandatory: false,
    },
    {
      category: 'Toxicity & Lobby Chat',
      title: 'Zero Toxicity in All-Mic or In-Game Chat',
      description: 'Abusive language in all-chat, lobby, or tournament Discord will lead to instant point deductions.',
      penalty: '5 Point deduction per incident',
      mandatory: true,
    },
  ],
  football: [
    {
      category: 'Turf Gear & Safety',
      title: 'Shinguards Mandatory & Flat Turf Studs Only',
      description: 'Every player must wear protective shinguards under socks. Molded rubber turf shoes only; metal studs strictly banned.',
      penalty: 'Player not allowed on the pitch',
      mandatory: true,
    },
    {
      category: 'Match Duration & Substitutions',
      title: '20 Mins x 2 Halves with Rolling Substitutions',
      description: 'Rolling substitutions are permitted at referee stoppage from the halfway line without time delay.',
      penalty: 'Yellow card for unauthorized pitch entry',
      mandatory: true,
    },
    {
      category: 'Tackling & Fair Play',
      title: 'No Slide Tackles on Turf',
      description: 'To prevent turf burn and serious injury, ground slide tackles are strictly prohibited. Standing tackles only.',
      penalty: 'Direct Free Kick + Yellow Card',
      mandatory: true,
    },
  ],
  valorant: [
    {
      category: 'Anti-Cheat',
      title: 'Vanguard Active & Discord Screen Sharing on Request',
      description: 'Riot Vanguard must be active. Tournament referee can request live Discord screen share at any time during the match.',
      penalty: 'Immediate match forfeiture',
      mandatory: true,
    },
    {
      category: 'Tactical Pauses & Overtime',
      title: 'Max Two 60-Second Tactical Pauses per Half',
      description: 'Captains can call tactical pause using chat. Overtime will be played on Win-by-2 rules.',
      penalty: 'Overtime round continuation',
      mandatory: true,
    },
  ],
  chess: [
    {
      category: 'Fair Play & Electronics',
      title: 'No Electronic Devices or Smart Watches in Playing Hall',
      description: 'All electronic watches, phones, and wireless earplugs must be deposited with the chief arbiter before round 1.',
      penalty: 'Instant match loss and FIDE ethics report',
      mandatory: true,
    },
    {
      category: 'Touch Move & Clock Press',
      title: 'Strict Touch-Move Rule & Same-Hand Clock Press',
      description: 'The piece touched must be moved. The clock must be pressed with the same hand that made the chess move.',
      penalty: 'Arbiter Warning + 2 mins added to opponent',
      mandatory: true,
    },
  ],
  kabaddi: [
    {
      category: 'Mat & Gear',
      title: 'Mat Shoes Mandatory & Nail Check',
      description: 'Players must wear official non-marking mat shoes. Fingernails will be inspected before every raid session.',
      penalty: 'Player barred until gear compliant',
      mandatory: true,
    },
    {
      category: 'Raid Cant & Time Limit',
      title: 'Unbroken Continuous Cant & 30-Second Raid Cap',
      description: 'The raider must maintain continuous audible cant. Breaking the cant inside opponent half results in immediate out.',
      penalty: 'Raider declared OUT + 1 point to defending team',
      mandatory: true,
    },
  ],
};

const HostTournament = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Wizard Steps: 1: Admin Slot, 2: Game & Format, 3: Fees & Prize Pool, 4: External Rules, 5: Review & Publish
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Admin Slot License State
  const [selectedSlotTier, setSelectedSlotTier] = useState('silver');
  const [slotPaid, setSlotPaid] = useState(false);
  const [slotPaymentModal, setSlotPaymentModal] = useState(false);
  const [licenseNumber, setLicenseNumber] = useState('');

  // Step 2: Tournament Meta & Game Selection
  const [tournamentForm, setTournamentForm] = useState({
    title: 'Super Smash Box Cricket Championship 2026',
    tagline: 'High-voltage 10-over turf battle with player auction drafts',
    gameSlug: 'cricket',
    categoryType: 'physical_sports',
    tournamentType: 'auction_league',
    startDate: '2026-04-15',
    startTime: '09:00',
    bannerImage: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=1200&auto=format&fit=crop',
    organizerName: user?.fullName || user?.username || 'Premier Sports Club',
    organizerContact: '9876543210',
    organizerEmail: user?.email || 'organizer@arenauctions.com',
  });

  // Game format details
  const [matchFormat, setMatchFormat] = useState({
    overs: '10 Overs a Side',
    ballType: 'Heavy Tennis Cosco Red',
    bowlersLimit: 'Max 2 overs per bowler, 3 overs powerplay',
    pitchType: 'Astroturf Box Turf (Bandra)',
    maps: 'Erangel, Miramar, Sanhok (4 Matches)',
    pointSystem: 'BGIS Official 10-Point System',
    deviceType: 'Android & iOS Mobile Phones Only',
    boardsCount: 'Best of 3 Boards (25 Points Cap)',
    venueType: 'physical_turf', // physical_turf, physical_hall, online_discord
    venueName: 'Urban Turf Arena, Bandra West',
    venueAddress: 'Plot 18, Opp. Reclamation Sea View, Bandra West, Mumbai, Maharashtra 400050',
    googleMapLink: 'https://maps.google.com',
    reportingTime: '08:30 AM IST (Toss sharp at 08:45 AM)',
    amenities: 'Floodlights, Dugout seating, Official Umpires, YouTube Live Streaming, First-Aid',
  });

  // Step 3: Custom Team Entry Fee, Team Purse, and Prize Pool Breakdown
  const [financeForm, setFinanceForm] = useState({
    entryFeePerTeam: 2500, // Organizer's registration fee per team
    teamPurseLimit: 50000, // Budget points each team gets in auction
    startingBid: 2000,
    minimumIncrement: 250,
    maxTeams: 16,
    totalPrizePool: 100000,
    firstPrize: 50000,
    secondPrize: 25000,
    thirdPrize: 15000,
    mvpPrize: 10000,
    payoutTerms: 'Winning prize money transferred via UPI/Bank transfer within 24 hours of trophy presentation.',
  });

  // Step 4: External Custom Rules
  const [externalRules, setExternalRules] = useState(
    DEFAULT_EXTERNAL_RULES_BY_GAME.cricket
  );

  const [newRule, setNewRule] = useState({
    category: 'General Conduct',
    title: '',
    description: '',
    penalty: '',
    mandatory: true,
  });

  // Handle Game change and update default external rules
  const handleGameSelect = (slug) => {
    const game = MOCK_GAMES.find((g) => g.slug === slug);
    const cat = game ? game.categoryType : 'physical_sports';
    const defaultRules = DEFAULT_EXTERNAL_RULES_BY_GAME[slug] || DEFAULT_EXTERNAL_RULES_BY_GAME.cricket;

    setTournamentForm((prev) => ({
      ...prev,
      gameSlug: slug,
      categoryType: cat,
      bannerImage: game?.bannerImage || prev.bannerImage,
      title: `${game?.title || slug.toUpperCase()} Premier League 2026`,
    }));

    setExternalRules(defaultRules);

    // Update matchFormat presets according to game
    if (slug === 'carrom') {
      setMatchFormat((prev) => ({
        ...prev,
        venueType: 'physical_hall',
        venueName: 'Dadar Club Carrom Hall',
        venueAddress: 'Lokmanya Tilak Road, Dadar East, Mumbai 400014',
        boardsCount: 'Best of 3 Boards (25 Points Cap)',
        reportingTime: '10:00 AM IST (Round 1 draw starts at 10:15 AM)',
        amenities: 'Synco 8mm Birchwood Boards, French Chalk, AC Playing Hall, Official Referees',
      }));
    } else if (slug === 'bgmi' || slug === 'valorant') {
      setMatchFormat((prev) => ({
        ...prev,
        venueType: 'online_discord',
        venueName: 'Official Arena Discord & In-Game Custom Lobby',
        venueAddress: 'discord.gg/arena-champions (Lobby Password 15m prior)',
        reportingTime: '15 Minutes prior to match scheduled room launch',
        amenities: 'Dedicated Discord Voice Channels, Casters Stream, Anti-Cheat Admin Audit',
      }));
    } else if (slug === 'cricket') {
      setMatchFormat((prev) => ({
        ...prev,
        venueType: 'physical_turf',
        venueName: 'Urban Turf Arena, Bandra West',
        venueAddress: 'Plot 18, Opp. Reclamation Sea View, Bandra West, Mumbai 400050',
        reportingTime: '08:30 AM IST (Toss sharp at 08:45 AM)',
        amenities: 'Floodlights, Dugout seating, Official Umpires, YouTube Live Streaming, First-Aid',
      }));
    }
  };

  // Admin Slot purchase confirmation
  const handleConfirmSlotPurchase = () => {
    const tier = ADMIN_SLOT_TIERS.find((t) => t.id === selectedSlotTier) || ADMIN_SLOT_TIERS[1];
    const generatedLic = `LIC-ADMIN-${Math.floor(1000 + Math.random() * 9000)}-${tournamentForm.gameSlug.toUpperCase()}`;
    setLicenseNumber(generatedLic);
    setSlotPaid(true);
    setSlotPaymentModal(false);
    setFinanceForm((prev) => ({
      ...prev,
      maxTeams: tier.maxTeams,
    }));
  };

  // Add custom external rule
  const handleAddRule = (e) => {
    e.preventDefault();
    if (!newRule.title || !newRule.description) return;
    setExternalRules((prev) => [...prev, { ...newRule }]);
    setNewRule({
      category: 'General Conduct',
      title: '',
      description: '',
      penalty: '',
      mandatory: true,
    });
  };

  // Remove external rule
  const handleRemoveRule = (index) => {
    setExternalRules((prev) => prev.filter((_, i) => i !== index));
  };

  // Financial calculations
  const selectedTierObj = ADMIN_SLOT_TIERS.find((t) => t.id === selectedSlotTier) || ADMIN_SLOT_TIERS[1];
  const maxTeamsAllowed = selectedTierObj.maxTeams;
  const expectedTotalRevenue = Number(financeForm.entryFeePerTeam) * Number(financeForm.maxTeams);
  const totalPrizeMoney = Number(financeForm.totalPrizePool);
  const adminSlotCost = selectedTierObj.price;
  const organizerEstimatedNet = expectedTotalRevenue - totalPrizeMoney - adminSlotCost;

  // Final Publish Handler
  const handlePublishTournament = () => {
    const selectedGame = MOCK_GAMES.find((g) => g.slug === tournamentForm.gameSlug) || MOCK_GAMES[0];

    const newAuctionObj = {
      _id: `auc_org_${Date.now()}`,
      title: tournamentForm.title,
      gameSlug: tournamentForm.gameSlug,
      gameName: selectedGame.title,
      categoryType: tournamentForm.categoryType,
      organizerName: tournamentForm.organizerName,
      bannerImage: tournamentForm.bannerImage,
      status: 'upcoming',
      auctionType: 'player',
      startTime: new Date(`${tournamentForm.startDate}T${tournamentForm.startTime}`).toISOString(),
      startingBid: Number(financeForm.startingBid),
      minimumIncrement: Number(financeForm.minimumIncrement),
      registeredParticipantsCount: 0,
      teamBudgetLimit: Number(financeForm.teamPurseLimit),
      entryFee: Number(financeForm.entryFeePerTeam),
      prizePool: {
        total: Number(financeForm.totalPrizePool),
        currency: 'INR',
        first: Number(financeForm.firstPrize),
        second: Number(financeForm.secondPrize),
        third: Number(financeForm.thirdPrize),
        mvpAwards: Number(financeForm.mvpPrize),
        distributionNote: financeForm.payoutTerms,
      },
      adminSlot: {
        tier: selectedTierObj.name,
        feePaid: selectedTierObj.price,
        licenseNumber: licenseNumber || `LIC-ADMIN-8492-${tournamentForm.gameSlug.toUpperCase()}`,
        slotCapacity: financeForm.maxTeams,
        isApproved: true,
        licensedAt: new Date().toISOString(),
      },
      matchFormat: {
        overs: matchFormat.overs,
        ballType: matchFormat.ballType,
        bowlersLimit: matchFormat.bowlersLimit,
        pitchType: matchFormat.pitchType,
        maps: matchFormat.maps,
        pointSystem: matchFormat.pointSystem,
        boardsCount: matchFormat.boardsCount,
      },
      venueOrServer: {
        type: matchFormat.venueType,
        venueName: matchFormat.venueName,
        address: matchFormat.venueAddress,
        reportingTime: matchFormat.reportingTime,
        googleMapLink: matchFormat.googleMapLink,
        amenities: matchFormat.amenities.split(',').map((s) => s.trim()),
      },
      externalRules: externalRules,
    };

    // Save to MOCK_AUCTIONS in-memory array and localStorage
    MOCK_AUCTIONS.unshift(newAuctionObj);
    try {
      const stored = JSON.parse(localStorage.getItem('user_hosted_tournaments') || '[]');
      stored.unshift(newAuctionObj);
      localStorage.setItem('user_hosted_tournaments', JSON.stringify(stored));
    } catch (e) {
      console.error(e);
    }

    // Navigate to the newly created auction detail page
    navigate(`/auctions/${newAuctionObj._id}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Header Banner */}
      <div className="bg-gradient-to-r from-dark-card via-dark-surface to-dark-card border border-brand-emerald/40 rounded-3xl p-6 sm:p-10 shadow-glow-emerald/10 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-brand-emerald/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-emerald/15 text-brand-emerald border border-brand-emerald/30">
                ⚡ Organizer Portal
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-dark-bg text-slate-300 border border-dark-border">
                Custom External Rules & Slots
              </span>
            </div>
            <h1 className="font-gaming text-3xl sm:text-4xl font-extrabold text-slate-100 uppercase tracking-wide">
              Host Your Tournament & Player Auction
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Admin se official hosting license purchase karein, apne man mutabiq registration fee aur prize pool set karein, aur turf/esports ke custom external rules enforce karein.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="bg-dark-bg/80 border border-dark-border rounded-2xl p-4 text-center min-w-[160px]">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Admin Slot Status</span>
              {slotPaid ? (
                <div className="flex items-center justify-center gap-1.5 text-brand-emerald font-bold text-sm mt-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Licensed Active</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-1.5 text-brand-gold font-bold text-sm mt-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>Slot Pending</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stepper Navigation */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { step: 1, title: '1. Admin Slot License', desc: 'Platform Fee & Teams' },
          { step: 2, title: '2. Game & Format', desc: 'Cricket, Carrom, BGMI' },
          { step: 3, title: '3. Fees & Prize Pool', desc: 'Entry Fee & Rewards' },
          { step: 4, title: '4. External Rules', desc: 'Turf, Toss, Conduct' },
          { step: 5, title: '5. Review & Launch', desc: 'Publish Live Draft' },
        ].map((s) => (
          <button
            key={s.step}
            type="button"
            onClick={() => setCurrentStep(s.step)}
            className={`p-3.5 rounded-2xl border text-left transition-all ${
              currentStep === s.step
                ? 'bg-brand-emerald/15 border-brand-emerald shadow-glow-emerald text-brand-emerald font-bold'
                : currentStep > s.step
                ? 'bg-dark-card border-brand-emerald/30 text-slate-200'
                : 'bg-dark-card/50 border-dark-border text-slate-500 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-gaming">
              <span>{s.title}</span>
              {currentStep > s.step && <Check className="w-3.5 h-3.5 text-brand-emerald" />}
            </div>
            <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{s.desc}</p>
          </button>
        ))}
      </div>

      {/* STEP 1: ADMIN SLOT PURCHASE */}
      {currentStep === 1 && (
        <div className="space-y-8 animate-fadeIn">
          <div className="space-y-2">
            <h2 className="font-gaming text-2xl font-bold text-slate-100 uppercase flex items-center gap-2">
              <Shield className="w-6 h-6 text-brand-gold" />
              <span>Step 1: Purchase Official Tournament Hosting Slot from Admin</span>
            </h2>
            <p className="text-xs text-slate-400">
              Admin platform infrastructure (Socket.IO cluster, high-concurrency real-time bidding, fraud detection, and verifiable digital license key) use karne ke liye slot purchase karein.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ADMIN_SLOT_TIERS.map((tier) => {
              const isSelected = selectedSlotTier === tier.id;
              return (
                <div
                  key={tier.id}
                  onClick={() => setSelectedSlotTier(tier.id)}
                  className={`relative cursor-pointer rounded-3xl p-6 border transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-dark-card border-brand-emerald shadow-glow-emerald ring-2 ring-brand-emerald/50'
                      : 'bg-dark-card/70 border-dark-border hover:border-slate-600'
                  }`}
                >
                  {tier.recommended && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-brand-emerald text-black shadow-glow-emerald">
                      Most Popular
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className={`px-2.5 py-1 rounded-xl text-xs font-bold ${tier.badgeColor}`}>
                        {tier.name}
                      </span>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        isSelected ? 'border-brand-emerald bg-brand-emerald text-black' : 'border-slate-600'
                      }`}>
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="font-gaming text-3xl font-extrabold text-slate-100">
                          {formatCurrency(tier.price)}
                        </span>
                        <span className="text-xs text-slate-400">/ one-time license</span>
                      </div>
                      <p className="text-xs text-brand-emerald font-semibold mt-1">
                        Up to {tier.maxTeams} Franchises / Teams
                      </p>
                    </div>

                    <div className="border-t border-dark-border pt-4 space-y-2.5 text-xs">
                      {tier.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-slate-300">
                          <CheckCircle className="w-4 h-4 text-brand-emerald shrink-0 mt-0.5" />
                          <span className="leading-tight">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6">
                    <Button
                      variant={isSelected ? 'primary' : 'outline'}
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        setSelectedSlotTier(tier.id);
                        setSlotPaymentModal(true);
                      }}
                    >
                      {slotPaid && isSelected ? '✓ License Purchased' : `Purchase ${tier.name}`}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Slot Purchase Status Strip */}
          {slotPaid ? (
            <div className="bg-brand-emerald/10 border border-brand-emerald/40 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-brand-emerald/20 text-brand-emerald flex items-center justify-center font-bold">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-gaming text-lg font-bold text-slate-100">
                      Official Admin Hosting License Generated!
                    </h4>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-dark-bg text-brand-emerald border border-brand-emerald/30 font-bold">
                      {licenseNumber}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Slot fee of {formatCurrency(selectedTierObj.price)} recorded in Admin Treasury. You are authorized to organize this tournament.
                  </p>
                </div>
              </div>
              <Button
                variant="primary"
                size="md"
                onClick={() => setCurrentStep(2)}
                className="gap-2 shrink-0 shadow-glow-emerald"
              >
                <span>Proceed to Game Details</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="flex justify-end pt-4">
              <Button
                variant="gold"
                size="lg"
                onClick={() => setSlotPaymentModal(true)}
                className="gap-2 shadow-glow-gold"
              >
                <CreditCard className="w-5 h-5" />
                <span>Pay Admin Slot Fee ({formatCurrency(selectedTierObj.price)})</span>
              </Button>
            </div>
          )}
        </div>
      )}

      {/* STEP 2: GAME SELECTION & MATCH FORMAT */}
      {currentStep === 2 && (
        <div className="space-y-8 animate-fadeIn">
          <div className="space-y-2">
            <h2 className="font-gaming text-2xl font-bold text-slate-100 uppercase flex items-center gap-2">
              <Gamepad2 className="w-6 h-6 text-brand-emerald" />
              <span>Step 2: Choose Sport/Game & Define Match Format</span>
            </h2>
            <p className="text-xs text-slate-400">
              Tournament ka game select karein (Cricket, Carrom, BGMI, Football, Chess) aur uske ground/server ki details bharo.
            </p>
          </div>

          {/* Game Selector Chips */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {[
              { slug: 'cricket', name: 'Cricket', icon: '🏏' },
              { slug: 'carrom', name: 'Carrom', icon: '🎯' },
              { slug: 'bgmi', name: 'BGMI', icon: '🔫' },
              { slug: 'football', name: 'Football', icon: '⚽' },
              { slug: 'valorant', name: 'Valorant', icon: '⚡' },
              { slug: 'chess', name: 'Chess', icon: '♟️' },
              { slug: 'kabaddi', name: 'Kabaddi', icon: '🤼' },
            ].map((g) => {
              const active = tournamentForm.gameSlug === g.slug;
              return (
                <button
                  key={g.slug}
                  type="button"
                  onClick={() => handleGameSelect(g.slug)}
                  className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all ${
                    active
                      ? 'bg-brand-emerald/20 border-brand-emerald shadow-glow-emerald text-brand-emerald font-bold scale-105'
                      : 'bg-dark-card border-dark-border text-slate-400 hover:text-slate-100 hover:border-slate-600'
                  }`}
                >
                  <span className="text-3xl">{g.icon}</span>
                  <span className="font-gaming text-xs tracking-wider">{g.name}</span>
                </button>
              );
            })}
          </div>

          {/* Tournament General Details Form */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-dark-card border border-dark-border rounded-3xl p-6 sm:p-8 space-y-6">
              <h3 className="font-gaming text-lg font-bold text-slate-100 uppercase">
                Tournament Title & Schedule
              </h3>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1.5">
                    Tournament Official Name
                  </label>
                  <input
                    type="text"
                    value={tournamentForm.title}
                    onChange={(e) => setTournamentForm({ ...tournamentForm, title: e.target.value })}
                    className="w-full bg-dark-surface border border-dark-border rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-brand-emerald font-gaming text-sm"
                    placeholder="e.g. Bandra Box Cricket Championship 2026"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1.5">
                      Tournament / Auction Date
                    </label>
                    <input
                      type="date"
                      value={tournamentForm.startDate}
                      onChange={(e) => setTournamentForm({ ...tournamentForm, startDate: e.target.value })}
                      className="w-full bg-dark-surface border border-dark-border rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-brand-emerald"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 font-semibold block mb-1.5">
                      Reporting / Live Auction Time
                    </label>
                    <input
                      type="time"
                      value={tournamentForm.startTime}
                      onChange={(e) => setTournamentForm({ ...tournamentForm, startTime: e.target.value })}
                      className="w-full bg-dark-surface border border-dark-border rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-brand-emerald"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1.5">
                      Organizer Name / Club
                    </label>
                    <input
                      type="text"
                      value={tournamentForm.organizerName}
                      onChange={(e) => setTournamentForm({ ...tournamentForm, organizerName: e.target.value })}
                      className="w-full bg-dark-surface border border-dark-border rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-brand-emerald"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 font-semibold block mb-1.5">
                      Organizer Helpline / WhatsApp
                    </label>
                    <input
                      type="text"
                      value={tournamentForm.organizerContact}
                      onChange={(e) => setTournamentForm({ ...tournamentForm, organizerContact: e.target.value })}
                      className="w-full bg-dark-surface border border-dark-border rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-brand-emerald"
                    />
                  </div>
                </div>
              </div>

              {/* Game Specific Format Fields */}
              <div className="border-t border-dark-border pt-6 space-y-4">
                <h4 className="font-gaming text-sm font-bold text-brand-emerald uppercase flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Custom Match Format ({tournamentForm.gameSlug.toUpperCase()})</span>
                </h4>

                {tournamentForm.gameSlug === 'cricket' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">Overs Per Innings</label>
                      <input
                        type="text"
                        value={matchFormat.overs}
                        onChange={(e) => setMatchFormat({ ...matchFormat, overs: e.target.value })}
                        className="w-full bg-dark-surface border border-dark-border rounded-xl px-3 py-2 text-slate-100"
                        placeholder="e.g. 10 Overs a Side"
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">Ball Specification</label>
                      <input
                        type="text"
                        value={matchFormat.ballType}
                        onChange={(e) => setMatchFormat({ ...matchFormat, ballType: e.target.value })}
                        className="w-full bg-dark-surface border border-dark-border rounded-xl px-3 py-2 text-slate-100"
                        placeholder="e.g. Cosco Heavy Tennis Red"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-slate-300 font-semibold block mb-1">Bowler Quota & Powerplay Rules</label>
                      <input
                        type="text"
                        value={matchFormat.bowlersLimit}
                        onChange={(e) => setMatchFormat({ ...matchFormat, bowlersLimit: e.target.value })}
                        className="w-full bg-dark-surface border border-dark-border rounded-xl px-3 py-2 text-slate-100"
                        placeholder="Max 2 overs per bowler, powerplay 3 overs"
                      />
                    </div>
                  </div>
                )}

                {tournamentForm.gameSlug === 'carrom' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">Boards / Match Cap</label>
                      <input
                        type="text"
                        value={matchFormat.boardsCount}
                        onChange={(e) => setMatchFormat({ ...matchFormat, boardsCount: e.target.value })}
                        className="w-full bg-dark-surface border border-dark-border rounded-xl px-3 py-2 text-slate-100"
                        placeholder="Best of 3 Boards (25 Points Cap)"
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">Striker Weight Limit</label>
                      <input
                        type="text"
                        defaultValue="Max 15.0 Grams Weight"
                        className="w-full bg-dark-surface border border-dark-border rounded-xl px-3 py-2 text-slate-100"
                      />
                    </div>
                  </div>
                )}

                {(tournamentForm.gameSlug === 'bgmi' || tournamentForm.gameSlug === 'valorant') && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">Maps / Rotation</label>
                      <input
                        type="text"
                        value={matchFormat.maps}
                        onChange={(e) => setMatchFormat({ ...matchFormat, maps: e.target.value })}
                        className="w-full bg-dark-surface border border-dark-border rounded-xl px-3 py-2 text-slate-100"
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">Scoring System</label>
                      <input
                        type="text"
                        value={matchFormat.pointSystem}
                        onChange={(e) => setMatchFormat({ ...matchFormat, pointSystem: e.target.value })}
                        className="w-full bg-dark-surface border border-dark-border rounded-xl px-3 py-2 text-slate-100"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Venue / Turf Location Card */}
            <div className="bg-dark-card border border-dark-border rounded-3xl p-6 sm:p-8 space-y-5">
              <h3 className="font-gaming text-lg font-bold text-slate-100 uppercase flex items-center gap-2">
                <MapPin className="w-5 h-5 text-brand-crimson" />
                <span>Venue or Server Info</span>
              </h3>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Venue / Ground / Discord Room</label>
                  <input
                    type="text"
                    value={matchFormat.venueName}
                    onChange={(e) => setMatchFormat({ ...matchFormat, venueName: e.target.value })}
                    className="w-full bg-dark-surface border border-dark-border rounded-xl px-3 py-2 text-slate-100"
                    placeholder="e.g. Urban Turf Arena"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Exact Address / Server Link</label>
                  <textarea
                    rows={3}
                    value={matchFormat.venueAddress}
                    onChange={(e) => setMatchFormat({ ...matchFormat, venueAddress: e.target.value })}
                    className="w-full bg-dark-surface border border-dark-border rounded-xl p-3 text-slate-100 resize-none"
                    placeholder="Plot number, Landmark, City..."
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Toss / Reporting Time</label>
                  <input
                    type="text"
                    value={matchFormat.reportingTime}
                    onChange={(e) => setMatchFormat({ ...matchFormat, reportingTime: e.target.value })}
                    className="w-full bg-dark-surface border border-dark-border rounded-xl px-3 py-2 text-slate-100"
                    placeholder="08:30 AM IST (Toss 08:45 AM)"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Available Turf Amenities</label>
                  <input
                    type="text"
                    value={matchFormat.amenities}
                    onChange={(e) => setMatchFormat({ ...matchFormat, amenities: e.target.value })}
                    className="w-full bg-dark-surface border border-dark-border rounded-xl px-3 py-2 text-slate-100"
                    placeholder="Floodlights, YouTube stream, Umpires"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <Button variant="outline" size="md" onClick={() => setCurrentStep(1)} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Back: Admin Slot</span>
            </Button>
            <Button variant="primary" size="md" onClick={() => setCurrentStep(3)} className="gap-2 shadow-glow-emerald">
              <span>Next: Entry Fee & Prize Pool</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: CUSTOM ENTRY FEE, PURSE & PRIZE POOL */}
      {currentStep === 3 && (
        <div className="space-y-8 animate-fadeIn">
          <div className="space-y-2">
            <h2 className="font-gaming text-2xl font-bold text-slate-100 uppercase flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-brand-gold" />
              <span>Step 3: Set Your Custom Team Registration Fee & Prize Pool</span>
            </h2>
            <p className="text-xs text-slate-400">
              Aap apne hisab se teams ka registration fee rakh sakte hain, aur tournament ka prize pool distribution announce kar sakte hain.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Input Config Form */}
            <div className="lg:col-span-2 bg-dark-card border border-dark-border rounded-3xl p-6 sm:p-8 space-y-6">
              <h3 className="font-gaming text-lg font-bold text-slate-100 uppercase">
                Team Entry Fee & Auction Purse Limits
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1.5">
                    Team Registration / Entry Fee (₹ per Team)
                  </label>
                  <input
                    type="number"
                    value={financeForm.entryFeePerTeam}
                    onChange={(e) => setFinanceForm({ ...financeForm, entryFeePerTeam: e.target.value })}
                    className="w-full bg-dark-surface border border-dark-border rounded-xl px-4 py-2.5 text-brand-emerald font-gaming text-lg font-bold"
                    placeholder="2500"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Each participating franchise pays this entry fee to confirm their slot.
                  </p>
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1.5">
                    Maximum Participating Teams
                  </label>
                  <input
                    type="number"
                    max={maxTeamsAllowed}
                    value={financeForm.maxTeams}
                    onChange={(e) => setFinanceForm({ ...financeForm, maxTeams: Math.min(Number(e.target.value), maxTeamsAllowed) })}
                    className="w-full bg-dark-surface border border-dark-border rounded-xl px-4 py-2.5 text-slate-100 font-gaming text-lg font-bold"
                  />
                  <p className="text-[10px] text-brand-gold mt-1">
                    Your {selectedTierObj.name} allows up to {maxTeamsAllowed} teams.
                  </p>
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1.5">
                    Team Auction Purse Budget (Points)
                  </label>
                  <input
                    type="number"
                    value={financeForm.teamPurseLimit}
                    onChange={(e) => setFinanceForm({ ...financeForm, teamPurseLimit: e.target.value })}
                    className="w-full bg-dark-surface border border-dark-border rounded-xl px-4 py-2.5 text-slate-100 font-gaming text-lg font-bold"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Virtual currency allocated to each team for buying players in the live auction.
                  </p>
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1.5">
                    Player Base Price / Starting Bid
                  </label>
                  <input
                    type="number"
                    value={financeForm.startingBid}
                    onChange={(e) => setFinanceForm({ ...financeForm, startingBid: e.target.value })}
                    className="w-full bg-dark-surface border border-dark-border rounded-xl px-4 py-2.5 text-slate-100 font-gaming text-lg font-bold"
                  />
                </div>
              </div>

              {/* Prize Pool Breakdown */}
              <div className="border-t border-dark-border pt-6 space-y-4">
                <h4 className="font-gaming text-sm font-bold text-brand-gold uppercase flex items-center gap-2">
                  <Trophy className="w-4 h-4" />
                  <span>Prize Pool Breakdown</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Total Prize Pool (₹)</label>
                    <input
                      type="number"
                      value={financeForm.totalPrizePool}
                      onChange={(e) => setFinanceForm({ ...financeForm, totalPrizePool: e.target.value })}
                      className="w-full bg-dark-surface border border-dark-border rounded-xl px-3 py-2 text-brand-gold font-bold font-gaming"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">1st Prize (Winner)</label>
                    <input
                      type="number"
                      value={financeForm.firstPrize}
                      onChange={(e) => setFinanceForm({ ...financeForm, firstPrize: e.target.value })}
                      className="w-full bg-dark-surface border border-dark-border rounded-xl px-3 py-2 text-brand-emerald font-bold font-gaming"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">2nd Prize (Runner-up)</label>
                    <input
                      type="number"
                      value={financeForm.secondPrize}
                      onChange={(e) => setFinanceForm({ ...financeForm, secondPrize: e.target.value })}
                      className="w-full bg-dark-surface border border-dark-border rounded-xl px-3 py-2 text-slate-100 font-bold font-gaming"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">MVP / Awards Pool</label>
                    <input
                      type="number"
                      value={financeForm.mvpPrize}
                      onChange={(e) => setFinanceForm({ ...financeForm, mvpPrize: e.target.value })}
                      className="w-full bg-dark-surface border border-dark-border rounded-xl px-3 py-2 text-brand-cyan font-bold font-gaming"
                    />
                  </div>
                </div>

                <div className="pt-2 text-xs">
                  <label className="text-slate-300 font-semibold block mb-1">Disbursement / Payout Terms</label>
                  <input
                    type="text"
                    value={financeForm.payoutTerms}
                    onChange={(e) => setFinanceForm({ ...financeForm, payoutTerms: e.target.value })}
                    className="w-full bg-dark-surface border border-dark-border rounded-xl px-3 py-2 text-slate-100"
                  />
                </div>
              </div>
            </div>

            {/* Organizer Revenue & Margin Calculator Card */}
            <div className="bg-dark-card border border-brand-emerald/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-glow-emerald/10">
              <h3 className="font-gaming text-lg font-bold text-slate-100 uppercase flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-brand-emerald" />
                <span>Organizer Financial Summary</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-dark-surface border border-dark-border">
                  <span className="text-slate-400">Total Teams × Entry Fee:</span>
                  <span className="font-gaming text-sm font-bold text-brand-emerald">
                    {formatCurrency(expectedTotalRevenue)}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-dark-surface border border-dark-border">
                  <span className="text-slate-400">Admin Platform Slot Fee:</span>
                  <span className="font-gaming text-sm font-bold text-brand-crimson">
                    -{formatCurrency(adminSlotCost)}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-dark-surface border border-dark-border">
                  <span className="text-slate-400">Declared Prize Pool:</span>
                  <span className="font-gaming text-sm font-bold text-brand-gold">
                    -{formatCurrency(totalPrizeMoney)}
                  </span>
                </div>

                <div className="border-t border-dark-border pt-3">
                  <div className="p-4 rounded-2xl bg-brand-emerald/15 border border-brand-emerald/40 space-y-1">
                    <span className="text-[11px] text-slate-300 font-semibold block uppercase">
                      Estimated Organizer Net Margin
                    </span>
                    <span className={`font-gaming text-2xl font-extrabold ${
                      organizerEstimatedNet >= 0 ? 'text-brand-emerald' : 'text-brand-crimson'
                    }`}>
                      {formatCurrency(organizerEstimatedNet)}
                    </span>
                    <p className="text-[10px] text-slate-400">
                      {organizerEstimatedNet >= 0
                        ? 'Profitable tournament setup! You can cover turf rental and trophies comfortably.'
                        : 'Prize pool exceeds entry fee revenue. Ensure sponsor tie-ups cover the difference.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <Button variant="outline" size="md" onClick={() => setCurrentStep(2)} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Back: Game Format</span>
            </Button>
            <Button variant="primary" size="md" onClick={() => setCurrentStep(4)} className="gap-2 shadow-glow-emerald">
              <span>Next: Custom External Rules</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 4: CUSTOM EXTERNAL RULES BUILDER */}
      {currentStep === 4 && (
        <div className="space-y-8 animate-fadeIn">
          <div className="space-y-2">
            <h2 className="font-gaming text-2xl font-bold text-slate-100 uppercase flex items-center gap-2">
              <FileText className="w-6 h-6 text-brand-cyan" />
              <span>Step 4: Define Organizer External Rules & Code of Conduct</span>
            </h2>
            <p className="text-xs text-slate-400">
              Game ke base rules ke alawa turf reporting, uniform dress code, toss penalty, substitute restrictions, aur umpire authority jaise custom external rules banayein.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Rules List View */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-gaming text-lg font-bold text-slate-100 uppercase">
                  Active Tournament External Rules ({externalRules.length})
                </h3>
                <span className="text-xs text-brand-emerald font-semibold">
                  Preset for {tournamentForm.gameSlug.toUpperCase()} loaded
                </span>
              </div>

              <div className="space-y-3">
                {externalRules.map((rule, idx) => (
                  <div
                    key={idx}
                    className="bg-dark-card border border-dark-border rounded-2xl p-5 space-y-2 relative group hover:border-slate-600 transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-brand-emerald/15 text-brand-emerald border border-brand-emerald/30">
                            {rule.category}
                          </span>
                          {rule.mandatory && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-brand-crimson/15 text-brand-crimson border border-brand-crimson/30">
                              Mandatory
                            </span>
                          )}
                        </div>
                        <h4 className="font-gaming text-base font-bold text-slate-100">
                          {rule.title}
                        </h4>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveRule(idx)}
                        className="text-slate-500 hover:text-brand-crimson p-1 rounded-lg opacity-60 group-hover:opacity-100 transition-opacity"
                        title="Delete Rule"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {rule.description}
                    </p>

                    {rule.penalty && (
                      <div className="p-2.5 rounded-xl bg-dark-surface border border-dark-border flex items-center gap-2 text-xs">
                        <AlertCircle className="w-4 h-4 text-brand-gold shrink-0" />
                        <span className="text-slate-400">Penalty for Breach:</span>
                        <span className="text-brand-gold font-semibold">{rule.penalty}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Add Custom Rule Form */}
            <div className="bg-dark-card border border-dark-border rounded-3xl p-6 sm:p-8 space-y-5 h-fit">
              <h3 className="font-gaming text-lg font-bold text-slate-100 uppercase flex items-center gap-2">
                <Plus className="w-5 h-5 text-brand-emerald" />
                <span>Add New Custom Rule</span>
              </h3>

              <form onSubmit={handleAddRule} className="space-y-4 text-xs">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Rule Category</label>
                  <select
                    value={newRule.category}
                    onChange={(e) => setNewRule({ ...newRule, category: e.target.value })}
                    className="w-full bg-dark-surface border border-dark-border rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-brand-emerald"
                  >
                    <option value="Reporting & Toss Policy">Reporting & Toss Policy</option>
                    <option value="Uniform & Equipment">Uniform & Equipment</option>
                    <option value="Substitutes & Roster Lock">Substitutes & Roster Lock</option>
                    <option value="Conduct & Fair Play">Conduct & Fair Play</option>
                    <option value="Anti-Cheat & Recording">Anti-Cheat & Recording</option>
                    <option value="Dispute Resolution">Dispute Resolution</option>
                    <option value="Prize Disbursement">Prize Disbursement</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Rule Title</label>
                  <input
                    type="text"
                    value={newRule.title}
                    onChange={(e) => setNewRule({ ...newRule, title: e.target.value })}
                    className="w-full bg-dark-surface border border-dark-border rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-brand-emerald"
                    placeholder="e.g. Strict No Spikes on Turf"
                    required
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Rule Description & Scope</label>
                  <textarea
                    rows={3}
                    value={newRule.description}
                    onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
                    className="w-full bg-dark-surface border border-dark-border rounded-xl p-3 text-slate-100 focus:outline-none focus:border-brand-emerald resize-none"
                    placeholder="Describe what players or teams must do..."
                    required
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Penalty for Violation</label>
                  <input
                    type="text"
                    value={newRule.penalty}
                    onChange={(e) => setNewRule({ ...newRule, penalty: e.target.value })}
                    className="w-full bg-dark-surface border border-dark-border rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-brand-emerald"
                    placeholder="e.g. 5 Run Penalty / 1 Over Deduction"
                  />
                </div>

                <Button type="submit" variant="primary" size="md" className="w-full gap-2 mt-2">
                  <Plus className="w-4 h-4" />
                  <span>Add External Rule</span>
                </Button>
              </form>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <Button variant="outline" size="md" onClick={() => setCurrentStep(3)} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Back: Fees & Prize Pool</span>
            </Button>
            <Button variant="primary" size="md" onClick={() => setCurrentStep(5)} className="gap-2 shadow-glow-emerald">
              <span>Next: Review & Launch</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 5: REVIEW & PUBLISH TOURNAMENT */}
      {currentStep === 5 && (
        <div className="space-y-8 animate-fadeIn">
          <div className="space-y-2">
            <h2 className="font-gaming text-2xl font-bold text-slate-100 uppercase flex items-center gap-2">
              <Award className="w-6 h-6 text-brand-emerald" />
              <span>Step 5: Review Tournament Contract & Publish Live</span>
            </h2>
            <p className="text-xs text-slate-400">
              Apne tournament draft ko check karein. Publish karte hi yeh platform par live ho jayega aur teams entry fee pay karke register kar sakengi.
            </p>
          </div>

          {/* Interactive Preview Card */}
          <div className="bg-dark-card border border-brand-emerald/40 rounded-3xl overflow-hidden shadow-2xl">
            {/* Banner Header */}
            <div className="relative h-60 sm:h-72 w-full bg-dark-surface">
              <img
                src={tournamentForm.bannerImage}
                alt={tournamentForm.title}
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-card via-dark-card/50 to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-brand-emerald text-black font-gaming">
                      {tournamentForm.gameSlug.toUpperCase()}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-dark-bg/90 text-brand-gold border border-brand-gold/30">
                      ✓ Admin License: {licenseNumber || 'LIC-ADMIN-8492'}
                    </span>
                  </div>
                  <h3 className="font-gaming text-2xl sm:text-3xl font-extrabold text-slate-100 uppercase">
                    {tournamentForm.title}
                  </h3>
                  <p className="text-xs text-slate-300">
                    Host: <span className="font-bold text-brand-emerald">{tournamentForm.organizerName}</span> | Date: {tournamentForm.startDate} at {tournamentForm.startTime}
                  </p>
                </div>

                <div className="bg-dark-bg/90 border border-brand-emerald/50 p-4 rounded-2xl text-right min-w-[180px]">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Team Registration Fee</span>
                  <span className="font-gaming text-2xl font-black text-brand-emerald block">
                    {formatCurrency(financeForm.entryFeePerTeam)}
                  </span>
                  <span className="text-[10px] text-slate-400">per participating franchise</span>
                </div>
              </div>
            </div>

            {/* Quick Stats Strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 border-b border-dark-border bg-dark-surface/40">
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">Total Prize Pool</span>
                <span className="font-gaming text-xl font-bold text-brand-gold">
                  {formatCurrency(financeForm.totalPrizePool)}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">Team Purse Budget</span>
                <span className="font-gaming text-xl font-bold text-brand-cyan">
                  {formatCurrency(financeForm.teamPurseLimit)} pts
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">Slot Capacity</span>
                <span className="font-gaming text-xl font-bold text-slate-100">
                  {financeForm.maxTeams} Teams Max
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">Organizer External Rules</span>
                <span className="font-gaming text-xl font-bold text-brand-emerald">
                  {externalRules.length} Verified Rules
                </span>
              </div>
            </div>

            {/* Content Body Grid */}
            <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column: Match Format & Venue */}
              <div className="space-y-4">
                <h4 className="font-gaming text-base font-bold text-slate-100 uppercase flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-brand-crimson" />
                  <span>Venue & Ground Information</span>
                </h4>

                <div className="p-4 rounded-2xl bg-dark-surface border border-dark-border space-y-2 text-xs">
                  <p className="font-bold text-slate-200">{matchFormat.venueName}</p>
                  <p className="text-slate-400">{matchFormat.venueAddress}</p>
                  <div className="pt-2 border-t border-dark-border text-slate-300">
                    <span className="text-brand-emerald font-semibold">Reporting Time: </span>
                    {matchFormat.reportingTime}
                  </div>
                </div>

                <h4 className="font-gaming text-base font-bold text-slate-100 uppercase flex items-center gap-2 pt-2">
                  <Trophy className="w-4 h-4 text-brand-gold" />
                  <span>Prize Distribution</span>
                </h4>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-3 rounded-xl bg-brand-gold/10 border border-brand-gold/30">
                    <span className="text-[10px] text-brand-gold font-bold block">1st Winner</span>
                    <span className="font-gaming font-bold text-slate-100">{formatCurrency(financeForm.firstPrize)}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-400/10 border border-slate-400/30">
                    <span className="text-[10px] text-slate-300 font-bold block">2nd Runner-up</span>
                    <span className="font-gaming font-bold text-slate-100">{formatCurrency(financeForm.secondPrize)}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-brand-cyan/10 border border-brand-cyan/30">
                    <span className="text-[10px] text-brand-cyan font-bold block">MVP & Awards</span>
                    <span className="font-gaming font-bold text-slate-100">{formatCurrency(financeForm.mvpPrize)}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Key External Rules Checklist */}
              <div className="space-y-4">
                <h4 className="font-gaming text-base font-bold text-slate-100 uppercase flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-brand-emerald" />
                  <span>Organizer External Rules Summary</span>
                </h4>

                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {externalRules.slice(0, 4).map((rule, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-dark-surface border border-dark-border text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-200">{rule.title}</span>
                        <span className="text-[10px] text-brand-gold font-semibold">{rule.penalty}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{rule.description}</p>
                    </div>
                  ))}
                  {externalRules.length > 4 && (
                    <p className="text-[11px] text-slate-500 text-center">
                      +{externalRules.length - 4} more rules attached to tournament contract
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Launch Action Footer */}
            <div className="p-6 sm:p-8 bg-dark-surface/80 border-t border-dark-border flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-300">
                <p className="font-semibold text-slate-100">Ready to publish?</p>
                <p className="text-slate-400">Tournament will be listed immediately and players/franchises can register.</p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Button variant="outline" size="md" onClick={() => setCurrentStep(4)} className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  <span>Edit Rules</span>
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handlePublishTournament}
                  className="gap-2 shadow-glow-emerald w-full sm:w-auto font-gaming"
                >
                  <Zap className="w-5 h-5" />
                  <span>Publish Tournament Live</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SIMULATED ADMIN SLOT PAYMENT MODAL */}
      {slotPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-dark-card border border-brand-gold/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-glow-gold/20">
            <div className="flex items-center justify-between border-b border-dark-border pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-gold/15 border border-brand-gold/30 text-brand-gold flex items-center justify-center font-bold">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-gaming text-lg font-bold text-slate-100">
                    Purchase Admin Hosting Slot
                  </h3>
                  <p className="text-xs text-slate-400">Arena Admin Official Platform License</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSlotPaymentModal(false)}
                className="text-slate-400 hover:text-slate-100 text-sm p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-dark-surface border border-dark-border space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Selected License Tier:</span>
                <span className="font-bold text-slate-100">{selectedTierObj.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Team Capacity:</span>
                <span className="font-bold text-brand-emerald">Up to {selectedTierObj.maxTeams} Teams</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Socket.IO High-Concurrency Bidding:</span>
                <span className="font-bold text-brand-cyan">Included ✓</span>
              </div>
              <div className="flex items-center justify-between border-t border-dark-border pt-2 text-sm">
                <span className="font-semibold text-slate-200">Admin Platform Charge:</span>
                <span className="font-gaming font-extrabold text-brand-gold text-lg">
                  {formatCurrency(selectedTierObj.price)}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle className="w-4 h-4 text-brand-emerald" />
                <span>Instant license key generation upon confirmation.</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle className="w-4 h-4 text-brand-emerald" />
                <span>You can collect team entry fees directly from franchises.</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button
                variant="outline"
                size="md"
                className="w-1/2"
                onClick={() => setSlotPaymentModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="gold"
                size="md"
                className="w-1/2 gap-2 shadow-glow-gold"
                onClick={handleConfirmSlotPurchase}
              >
                <Check className="w-4 h-4" />
                <span>Confirm & Pay {formatCurrency(selectedTierObj.price)}</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HostTournament;
