export const ROLES = {
  USER: 'user',
  GAMER: 'gamer',
  TEAM_OWNER: 'team_owner',
  ORGANIZER: 'organizer',
  ADMIN: 'admin',
};

export const AUCTION_TYPES = {
  PLAYER: 'player',
  TEAM: 'team',
  SQUAD: 'squad',
  TOURNAMENT: 'tournament',
  CUSTOM: 'custom',
};

export const AUCTION_STATUS = {
  DRAFT: 'draft',
  UPCOMING: 'upcoming',
  LIVE: 'live',
  PAUSED: 'paused',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const LOT_STATUS = {
  WAITING: 'waiting',
  BIDDING: 'bidding',
  GOING_ONCE: 'going_once',
  GOING_TWICE: 'going_twice',
  SOLD: 'sold',
  UNSOLD: 'unsold',
};

export const PARTICIPANT_STATUS = {
  REGISTERED: 'registered',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  IN_POOL: 'in_pool',
  ACTIVE_LOT: 'active_lot',
  SOLD: 'sold',
  UNSOLD: 'unsold',
};

export const SOCKET_EVENTS = {
  // Client to Server
  JOIN_AUCTION: 'auction:join_room',
  LEAVE_AUCTION: 'auction:leave_room',
  PLACE_BID: 'auction:place_bid',
  ADMIN_START_AUCTION: 'auction:admin_start',
  ADMIN_PAUSE_AUCTION: 'auction:admin_pause',
  ADMIN_RESUME_AUCTION: 'auction:admin_resume',
  ADMIN_ADVANCE_LOT: 'auction:admin_next_lot',
  ADMIN_HAMMER_SOLD: 'auction:admin_hammer_sold',
  ADMIN_HAMMER_UNSOLD: 'auction:admin_hammer_unsold',

  // Server to Client
  ROOM_JOINED: 'auction:room_joined',
  NEW_BID: 'auction:new_bid',
  BID_REJECTED: 'auction:bid_rejected',
  TIMER_TICK: 'auction:timer_tick',
  STATUS_CHANGED: 'auction:status_changed',
  LOT_ADVANCED: 'auction:lot_advanced',
  LOT_SOLD: 'auction:lot_sold',
  LOT_UNSOLD: 'auction:lot_unsold',
  AUCTION_ENDED: 'auction:ended',
  ERROR: 'auction:error',
};

