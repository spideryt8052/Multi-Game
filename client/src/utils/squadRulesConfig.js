// Comprehensive Tournament Squad Composition & Player Form Rules Config
// Covers Cricket (IPL / Box Cricket), BGMI, Valorant, Football, Kabaddi, Chess & Carrom

export const SQUAD_RULES_CONFIG = {
  cricket: {
    gameSlug: 'cricket',
    gameTitle: 'Cricket (IPL & Box Cricket)',
    categoryType: 'physical_sports',
    icon: '🏏',
    governingBody: 'BCCI / Premier League Format',
    squadMin: 11,
    squadMax: 15,
    purseLimit: 100000,
    minBasePrice: 5000,
    roles: [
      {
        id: 'batsman',
        label: 'Batsman',
        labelHinglish: 'Ballebaaz (Batsman)',
        min: 4,
        max: 8,
        description: 'Top-order, middle-order, and explosive death-over finishers',
        subRoles: ['Opening Batsman', 'Top Order (No. 3/4)', 'Middle Order Finisher'],
      },
      {
        id: 'bowler',
        label: 'Bowler',
        labelHinglish: 'Gendbaaz (Bowler)',
        min: 4,
        max: 8,
        description: 'Frontline pacers and spin wizards to restrict opponent runs',
        subRoles: ['Fast Bowler (Pacer)', 'Fast Medium Seamer', 'Off-Spin Specialist', 'Leg-Spin / Googly Master', 'Left-Arm Orthodox Spin'],
      },
      {
        id: 'all_rounder',
        label: 'All-Rounder',
        labelHinglish: 'All-Rounder (Harfanmaula)',
        min: 2,
        max: 5,
        description: 'Crucial dual-threat players who contribute with both bat and ball',
        subRoles: ['Batting All-Rounder', 'Bowling All-Rounder'],
      },
      {
        id: 'wicketkeeper',
        label: 'Wicketkeeper Batsman',
        labelHinglish: 'Wicketkeeper (WK)',
        min: 1,
        max: 3,
        description: 'Mandatory gloveman behind the stumps who also anchors the batting order',
        subRoles: ['Wicketkeeper Opener', 'Wicketkeeper Middle Order Finisher'],
      },
    ],
    battingStyles: [
      { id: 'rhb', label: 'Right-Hand Bat (RHB)' },
      { id: 'lhb', label: 'Left-Hand Bat (LHB)' },
    ],
    bowlingStyles: [
      { id: 'raf', label: 'Right-Arm Fast (140+ kmph)' },
      { id: 'rafm', label: 'Right-Arm Fast-Medium' },
      { id: 'ram', label: 'Right-Arm Medium' },
      { id: 'raos', label: 'Right-Arm Off-Spin' },
      { id: 'rals', label: 'Right-Arm Leg-Spin / Googly' },
      { id: 'laf', label: 'Left-Arm Fast / Swing' },
      { id: 'laos', label: 'Left-Arm Orthodox Spin' },
      { id: 'lac', label: 'Left-Arm Chinaman (Unorthodox Spin)' },
      { id: 'none', label: 'Does Not Bowl (Specialist Batsman/WK)' },
    ],
    categories: [
      { id: 'capped', label: 'Capped (International / State Ranji Pro)' },
      { id: 'uncapped', label: 'Uncapped (Emerging Talent / Local Club / Box Star)' },
      { id: 'overseas', label: 'Overseas International Player' },
    ],
    basePriceSlabs: [
      { value: 5000, label: '₹5,000 (Base Floor / Uncapped S2)' },
      { value: 10000, label: '₹10,000 (Established Domestic / Ranji)' },
      { value: 20000, label: '₹20,000 (Senior State / Box Icon)' },
      { value: 50000, label: '₹50,000 (Marquee International Star)' },
    ],
    keyRules: [
      'Squad must consist of minimum 11 active players (max 15).',
      'Mandatory 1 Wicketkeeper slot must be filled before squad qualification.',
      'Franchise must have at least 4 specialist Bowlers and 2 All-Rounders.',
      'Purse Reserve Rule: Team must preserve enough budget to buy remaining minimum squad slots at base price.',
    ],
  },

  bgmi: {
    gameSlug: 'bgmi',
    gameTitle: 'BGMI (Battlegrounds Mobile India)',
    categoryType: 'esports',
    icon: '🎮',
    governingBody: 'Krafton Competitive Esports Circuit',
    squadMin: 4,
    squadMax: 5,
    purseLimit: 50000,
    minBasePrice: 2500,
    roles: [
      {
        id: 'igl',
        label: 'In-Game Leader (IGL)',
        labelHinglish: 'IGL (Team Leader / Shot Caller)',
        min: 1,
        max: 1,
        description: 'Tactical mastermind who directs rotations, zone positioning and fight calls',
        subRoles: ['Aggressive Zone Caller', 'Heal & Placement Specialist'],
      },
      {
        id: 'assaulter',
        label: 'Assaulter / Entry Fragger',
        labelHinglish: 'Assaulter / Entry Fragger (Frontline)',
        min: 2,
        max: 3,
        description: 'High-damage frontline breachers who secure opening finishes and wipe compounds',
        subRoles: ['Entry Fragger', 'Secondary Assaulter / Re-fragger'],
      },
      {
        id: 'sniper',
        label: 'Sniper / DMR Marksman',
        labelHinglish: 'Sniper / DMR Long-Range',
        min: 1,
        max: 2,
        description: 'Long-range marksman providing knockdowns and high-ground map control',
        subRoles: ['Bolt-Action Specialist (AWM/M24)', 'DMR Spammer (Mini14/SLR)'],
      },
      {
        id: 'support',
        label: 'Support / Filter',
        labelHinglish: 'Support & Medic / Utility Master',
        min: 0,
        max: 1,
        description: 'Utility supplier, reviver, flank watcher, and resource management',
        subRoles: ['Utility & Smokes Master', 'Flank Anchor'],
      },
    ],
    devices: [
      { id: 'mobile_ios', label: 'iPhone (Competitive Tier)' },
      { id: 'mobile_android', label: 'Android Flagship (ROG / OnePlus / iQOO)' },
      { id: 'tablet', label: 'iPad / Tablet (Community / League Spec)' },
    ],
    controls: [
      { id: '2finger', label: '2-Finger Thumb Player' },
      { id: '3finger', label: '3-Finger Claw' },
      { id: '4finger', label: '4-Finger Claw / 5-Finger Claw' },
      { id: 'full_gyro', label: 'Full Gyroscope (Always On)' },
      { id: 'scope_gyro', label: 'Scope-Only Gyroscope' },
      { id: 'non_gyro', label: 'Non-Gyro (Touch Screen Only)' },
    ],
    rankTiers: [
      { id: 'conqueror', label: 'Conqueror (Top 500 Regional)' },
      { id: 'ace_dominator', label: 'Ace Dominator (10+ Stars)' },
      { id: 'ace_master', label: 'Ace Master' },
      { id: 'ace', label: 'Ace' },
    ],
    basePriceSlabs: [
      { value: 2500, label: '₹2,500 (Tier 3 Emerging Scrims Talent)' },
      { value: 5000, label: '₹5,000 (Semi-Pro Verified BGIS Contender)' },
      { value: 10000, label: '₹10,000 (Tier 1 Pro Official Finalist)' },
      { value: 25000, label: '₹25,000 (Superstar MVP / National Champion)' },
    ],
    keyRules: [
      'Official roster requires 4 starters + 1 substitute (max 5 players).',
      'Exactly 1 designated IGL is required for tactical accountability.',
      'At least 2 verified Assaulters for close-quarters fighting capacity.',
      'Players must compete on verified mobile devices according to Krafton handbook.',
    ],
  },

  valorant: {
    gameSlug: 'valorant',
    gameTitle: 'Valorant (Tactical FPS)',
    categoryType: 'esports',
    icon: '⚡',
    governingBody: 'Riot Games VCT Tier-2 & Challenger Format',
    squadMin: 5,
    squadMax: 6,
    purseLimit: 60000,
    minBasePrice: 3000,
    roles: [
      {
        id: 'duelist',
        label: 'Duelist (Entry)',
        labelHinglish: 'Duelist (Jett, Reyna, Raze)',
        min: 1,
        max: 2,
        description: 'First blood creators who take space on bomb sites',
        subRoles: ['Primary Entry (Jett/Raze)', 'Secondary Duelist (Reyna/Phoenix/Yoru)'],
      },
      {
        id: 'controller',
        label: 'Controller (Smokes)',
        labelHinglish: 'Controller (Omen, Viper, Brimstone)',
        min: 1,
        max: 2,
        description: 'Block enemy vision and control map choke points with smoke screens',
        subRoles: ['Dome Smoker (Omen/Clove/Brimstone)', 'Wall Smoker (Viper/Harbor)'],
      },
      {
        id: 'initiator',
        label: 'Initiator (Info & Flash)',
        labelHinglish: 'Initiator (Sova, Fade, Breach, Skye)',
        min: 1,
        max: 2,
        description: 'Gather critical enemy site intel and blind opponents for team takes',
        subRoles: ['Recon Master (Sova/Fade)', 'Flash Breaker (Breach/Skye/Gekko)'],
      },
      {
        id: 'sentinel',
        label: 'Sentinel (Site Anchor)',
        labelHinglish: 'Sentinel (Killjoy, Cypher, Chamber)',
        min: 1,
        max: 2,
        description: 'Lock down bombsite defense, delay pushes and secure flank info',
        subRoles: ['Trap Master (Killjoy/Cypher)', 'Fragging Anchor (Chamber/Deadlock)'],
      },
      {
        id: 'flex',
        label: 'Flex (Multi-Role)',
        labelHinglish: 'Flex (All-Agent Specialist)',
        min: 0,
        max: 1,
        description: 'Adapts to any map requirements and fills gaps seamlessly',
        subRoles: ['Duelist / Initiator Flex', 'Controller / Sentinel Flex'],
      },
    ],
    rankTiers: [
      { id: 'radiant', label: 'Radiant (Top 500 Leaderboard)' },
      { id: 'immortal3', label: 'Immortal 3 (300+ RR)' },
      { id: 'immortal12', label: 'Immortal 1 - 2' },
      { id: 'ascendant', label: 'Ascendant 1 - 3' },
      { id: 'diamond', label: 'Diamond' },
    ],
    basePriceSlabs: [
      { value: 3000, label: '₹3,000 (Premier Contender)' },
      { value: 6000, label: '₹6,000 (Challengers Qualifier Pro)' },
      { value: 12000, label: '₹12,000 (Ascension Finalist)' },
      { value: 30000, label: '₹30,000 (VCT Franchise Marquee)' },
    ],
    keyRules: [
      '5 Active Roster slots + 1 Substitute.',
      'Must have at least 1 Duelist, 1 Controller, 1 Initiator, and 1 Sentinel for balanced site takes.',
      'Riot ID with tag line (#IND, #SEA) mandatory for account authentication.',
    ],
  },

  football: {
    gameSlug: 'football',
    gameTitle: 'Football / Turf Soccer',
    categoryType: 'physical_sports',
    icon: '⚽',
    governingBody: 'All-India Turf Soccer Championship',
    squadMin: 7,
    squadMax: 10,
    purseLimit: 80000,
    minBasePrice: 4000,
    roles: [
      {
        id: 'goalkeeper',
        label: 'Goalkeeper (GK)',
        labelHinglish: 'Goalkeeper (Goal Rakkshak)',
        min: 1,
        max: 2,
        description: 'Shot-stopper and leader of defensive communication',
        subRoles: ['Shot Stopper', 'Sweeper Keeper'],
      },
      {
        id: 'defender',
        label: 'Defender',
        labelHinglish: 'Defender (Rakshak CB/LB/RB)',
        min: 2,
        max: 4,
        description: 'Tacklers, aerial interceptors, and wing fullbacks',
        subRoles: ['Center Back (CB)', 'Attacking Fullback (LB/RB)'],
      },
      {
        id: 'midfielder',
        label: 'Midfielder',
        labelHinglish: 'Midfielder (Playmaker CDM/CAM)',
        min: 2,
        max: 4,
        description: 'Engine room controlling possession and distributing key passes',
        subRoles: ['Defensive Mid (CDM)', 'Box-to-Box (CM)', 'Playmaker (CAM)'],
      },
      {
        id: 'forward',
        label: 'Forward / Striker',
        labelHinglish: 'Forward / Striker (Goal Scorer)',
        min: 1,
        max: 3,
        description: 'Clinical finishers and explosive wingers',
        subRoles: ['Center Forward (Striker)', 'Winger (LW/RW)'],
      },
    ],
    preferredFoot: [
      { id: 'right', label: 'Right Foot Only' },
      { id: 'left', label: 'Left Foot Only' },
      { id: 'both', label: 'Ambidextrous (Both Feet)' },
    ],
    basePriceSlabs: [
      { value: 4000, label: '₹4,000 (Turf Emerging Talent)' },
      { value: 8000, label: '₹8,000 (State League Regular)' },
      { value: 16000, label: '₹16,000 (National Turf Cup MVP)' },
      { value: 35000, label: '₹35,000 (Pro League Forward)' },
    ],
    keyRules: [
      'Minimum 7 players (5 starters + 2 rolling subs) up to 10 players.',
      'Mandatory 1 verified Goalkeeper on the team sheet.',
      'At least 2 Defenders and 2 Midfielders required for defensive balance.',
    ],
  },

  kabaddi: {
    gameSlug: 'kabaddi',
    gameTitle: 'Kabaddi Pro League',
    categoryType: 'physical_sports',
    icon: '🤼',
    governingBody: 'State Kabaddi Federation Format',
    squadMin: 7,
    squadMax: 10,
    purseLimit: 60000,
    minBasePrice: 3000,
    roles: [
      {
        id: 'raider',
        label: 'Raider',
        labelHinglish: 'Raider (Chhaapa Maanekaari)',
        min: 3,
        max: 5,
        description: 'Point-scoring attackers who raid opponent mat half',
        subRoles: ['Main Raider', 'Do-or-Die Specialist', 'Left Raider', 'Right Raider'],
      },
      {
        id: 'defender',
        label: 'Defender',
        labelHinglish: 'Defender (Pakarne Waala)',
        min: 3,
        max: 5,
        description: 'Corner and cover specialists who execute ankle holds and dashes',
        subRoles: ['Right Corner', 'Left Corner', 'Right Cover', 'Left Cover'],
      },
      {
        id: 'all_rounder',
        label: 'Kabaddi All-Rounder',
        labelHinglish: 'All-Rounder (Raider + Defender)',
        min: 1,
        max: 3,
        description: 'Dual-skilled players active in both defense chains and bonus point raids',
        subRoles: ['Cover & Raider Flex'],
      },
    ],
    basePriceSlabs: [
      { value: 3000, label: '₹3,000 (District Mat Talent)' },
      { value: 6000, label: '₹6,000 (State Championship Raider)' },
      { value: 15000, label: '₹15,000 (National Games Gold Medalist)' },
    ],
    keyRules: [
      '7 Mat starters + 3 substitutes.',
      'At least 3 specialist Raiders and 3 Defenders required per team.',
    ],
  },

  chess: {
    gameSlug: 'chess',
    gameTitle: 'Chess (Global League & Blitz)',
    categoryType: 'physical_sports',
    icon: '♟️',
    governingBody: 'FIDE / Global Chess League Format',
    squadMin: 6,
    squadMax: 6,
    purseLimit: 80000,
    minBasePrice: 5000,
    roles: [
      {
        id: 'board1_icon',
        label: 'Board 1 Icon (Super GM)',
        labelHinglish: 'Board 1 Super Grandmaster (2650+ Rating)',
        min: 1,
        max: 1,
        description: 'World-class Grandmaster leading Board 1 against rival captains',
        subRoles: ['Super GM (FIDE 2650+)'],
      },
      {
        id: 'superstar_men',
        label: 'Men Superstars (Board 2 & 3)',
        labelHinglish: 'Men Superstars (Board 2 & 3)',
        min: 2,
        max: 2,
        description: 'Grandmasters / International Masters anchoring middle boards',
        subRoles: ['Tactical Attacker', 'Solid Positional Master'],
      },
      {
        id: 'women_masters',
        label: 'Women Superstars (Board 4 & 5)',
        labelHinglish: 'Women Masters (Board 4 & 5 - WGM/IM)',
        min: 2,
        max: 2,
        description: 'Top-ranked Women Grandmasters competing on dedicated boards',
        subRoles: ['WGM / IM'],
      },
      {
        id: 'u21_prodigy',
        label: 'Junior Prodigy (Board 6)',
        labelHinglish: 'U-21 Prodigy (Young Talent)',
        min: 1,
        max: 1,
        description: 'Under-21 prodigy representing emerging youth talent',
        subRoles: ['U-21 FIDE Master'],
      },
    ],
    basePriceSlabs: [
      { value: 5000, label: '₹5,000 (U-21 Prodigy / FIDE Master)' },
      { value: 10000, label: '₹10,000 (International Master / WGM)' },
      { value: 20000, label: '₹20,000 (Grandmaster)' },
      { value: 40000, label: '₹40,000 (Super GM 2700+ World Elite)' },
    ],
    keyRules: [
      'Exactly 6 Boards: Board 1 Icon, 2 Men Superstars, 2 Women Masters, 1 U-21 Prodigy.',
      'FIDE Classical & Rapid ratings verified before registration.',
    ],
  },
};

/**
 * Calculates current squad breakdown against tournament rules
 * @param {Array} roster - list of acquired players
 * @param {string} gameSlug - 'cricket', 'bgmi', 'valorant', etc.
 */
export function evaluateSquadCompliance(roster = [], gameSlug = 'cricket') {
  const config = SQUAD_RULES_CONFIG[gameSlug] || SQUAD_RULES_CONFIG.cricket;
  const currentCount = roster.length;
  const isSquadSizeValid = currentCount >= config.squadMin && currentCount <= config.squadMax;

  // Breakdown by role
  const roleBreakdown = config.roles.map((role) => {
    // Count how many players in roster match this role
    const matchedPlayers = roster.filter((p) => {
      const pRole = (p.role || p.primaryRole || '').toLowerCase();
      const rId = role.id.toLowerCase();
      const rLabel = role.label.toLowerCase();

      // Check variations
      if (rId === 'batsman') {
        return pRole.includes('bat') && !pRole.includes('wicket') && !pRole.includes('all-round');
      }
      if (rId === 'bowler') {
        return pRole.includes('bowl') || pRole.includes('pace') || pRole.includes('spin');
      }
      if (rId === 'all_rounder') {
        return pRole.includes('all-round') || pRole.includes('allrounder');
      }
      if (rId === 'wicketkeeper') {
        return pRole.includes('wicket') || pRole.includes('wk') || pRole.includes('keeper');
      }
      if (rId === 'igl') {
        return pRole.includes('igl') || pRole.includes('leader');
      }
      if (rId === 'assaulter') {
        return pRole.includes('assault') || pRole.includes('entry') || pRole.includes('fragger');
      }
      if (rId === 'sniper') {
        return pRole.includes('sniper') || pRole.includes('dmr');
      }
      if (rId === 'support') {
        return pRole.includes('support') || pRole.includes('medic') || pRole.includes('filter');
      }
      if (rId === 'duelist') {
        return pRole.includes('duelist');
      }
      if (rId === 'controller') {
        return pRole.includes('controller') || pRole.includes('smoke');
      }
      if (rId === 'initiator') {
        return pRole.includes('initiator') || pRole.includes('flash') || pRole.includes('recon');
      }
      if (rId === 'sentinel') {
        return pRole.includes('sentinel') || pRole.includes('anchor');
      }
      return pRole.includes(rId) || pRole.includes(rLabel);
    });

    const count = matchedPlayers.length;
    const isMinMet = count >= role.min;
    const isMaxExceeded = count > role.max;
    const needed = Math.max(0, role.min - count);

    return {
      roleId: role.id,
      label: role.label,
      labelHinglish: role.labelHinglish,
      count,
      min: role.min,
      max: role.max,
      isMinMet,
      isMaxExceeded,
      needed,
      players: matchedPlayers,
    };
  });

  const allRolesMet = roleBreakdown.every((r) => r.isMinMet);
  const anyRoleExceeded = roleBreakdown.some((r) => r.isMaxExceeded);

  // Remaining slots to reach minimum squad size
  const slotsNeededForMin = Math.max(0, config.squadMin - currentCount);

  // Overall qualification percentage
  const totalMinRequirements = config.squadMin;
  const progressPercentage = Math.min(100, Math.round((currentCount / totalMinRequirements) * 100));

  return {
    gameConfig: config,
    currentCount,
    squadMin: config.squadMin,
    squadMax: config.squadMax,
    isSquadSizeValid,
    slotsNeededForMin,
    roleBreakdown,
    allRolesMet,
    anyRoleExceeded,
    isQualified: isSquadSizeValid && allRolesMet && !anyRoleExceeded,
    progressPercentage,
  };
}

/**
 * Validates a live bid against IPL Purse Reserve & Roster limits
 * @param {object} team - { remainingBudget, roster }
 * @param {object} lot - current player lot
 * @param {number} bidAmount - attempted bid
 * @param {string} gameSlug - 'cricket', 'bgmi', etc.
 */
export function validatePurseAndSquadLimits(team, lot, bidAmount, gameSlug = 'cricket') {
  const config = SQUAD_RULES_CONFIG[gameSlug] || SQUAD_RULES_CONFIG.cricket;
  const currentRoster = team.roster || [];
  const currentRosterCount = currentRoster.length;

  const errors = [];
  const warnings = [];

  // 1. Direct Purse Check
  if (bidAmount > team.remainingBudget) {
    errors.push(
      `Bid of ₹${bidAmount.toLocaleString()} exceeds your team's remaining purse of ₹${team.remainingBudget.toLocaleString()}.`
    );
  }

  // 2. Max Squad Size Check
  if (currentRosterCount >= config.squadMax) {
    errors.push(
      `Your squad is already full at the tournament maximum of ${config.squadMax} players.`
    );
  }

  // 3. IPL Purse Reserve Rule Check:
  // After paying this bid, will the team have enough money to buy the remaining players
  // needed to reach the MINIMUM squad size at base price?
  const slotsRemainingAfterThis = Math.max(0, config.squadMin - (currentRosterCount + 1));
  const mandatoryReserveRequired = slotsRemainingAfterThis * config.minBasePrice;
  const remainingBudgetAfterBid = team.remainingBudget - bidAmount;

  if (remainingBudgetAfterBid < mandatoryReserveRequired) {
    const safeMaxBid = Math.max(0, team.remainingBudget - mandatoryReserveRequired);
    warnings.push(
      `⚠️ IPL Purse Reserve Warning: Bidding ₹${bidAmount.toLocaleString()} leaves only ₹${Math.max(
        0,
        remainingBudgetAfterBid
      ).toLocaleString()}. You need at least ₹${mandatoryReserveRequired.toLocaleString()} in reserve to acquire ${slotsRemainingAfterThis} more players to reach the mandatory minimum ${config.squadMin} squad size! Safe max bid is ₹${safeMaxBid.toLocaleString()}.`
    );
  }

  // 4. Role Cap Check
  if (lot?.primaryRole) {
    const lotRole = lot.primaryRole.toLowerCase();
    const compliance = evaluateSquadCompliance(currentRoster, gameSlug);

    compliance.roleBreakdown.forEach((rb) => {
      let matchesThis = false;
      if (rb.roleId === 'batsman' && lotRole.includes('bat') && !lotRole.includes('wicket') && !lotRole.includes('all-round')) matchesThis = true;
      if (rb.roleId === 'bowler' && (lotRole.includes('bowl') || lotRole.includes('pace') || lotRole.includes('spin'))) matchesThis = true;
      if (rb.roleId === 'all_rounder' && (lotRole.includes('all-round') || lotRole.includes('allrounder'))) matchesThis = true;
      if (rb.roleId === 'wicketkeeper' && (lotRole.includes('wicket') || lotRole.includes('wk'))) matchesThis = true;
      if (rb.roleId === 'igl' && lotRole.includes('igl')) matchesThis = true;
      if (rb.roleId === 'assaulter' && (lotRole.includes('assault') || lotRole.includes('entry'))) matchesThis = true;
      if (rb.roleId === 'sniper' && (lotRole.includes('sniper') || lotRole.includes('dmr'))) matchesThis = true;
      if (rb.roleId === 'duelist' && lotRole.includes('duelist')) matchesThis = true;
      if (rb.roleId === 'controller' && (lotRole.includes('controller') || lotRole.includes('smoke'))) matchesThis = true;

      if (matchesThis) {
        if (rb.count >= rb.max) {
          warnings.push(
            `⚠️ Role Quota Warning: Your team already has ${rb.count} ${rb.label}s (Tournament Cap: ${rb.max}). This player will occupy a bench reserve slot.`
          );
        } else if (rb.needed > 0) {
          warnings.push(
            `🎯 High-Priority Target: Your squad currently needs ${rb.needed} more ${rb.label} to qualify for tournament play!`
          );
        }
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    mandatoryReserveRequired,
    slotsRemainingAfterThis,
    safeMaxBid: Math.max(0, team.remainingBudget - mandatoryReserveRequired),
  };
}
