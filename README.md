# ⚡ ARENA AUCTIONS — Multi-Game Live Esports Auction Platform

A professional, modern, responsive, and full-stack **Live Gaming Auction Platform** built on the **MERN Stack** (MongoDB, Express, React, Node.js) with real-time **Socket.IO** bidding synchronization, game-specific tournament rules, and dynamic **Bilingual (English & Hinglish)** support.

---

## 🎮 Key Features

1. **Dedicated Game Hubs**:
   - Independent auction sections for **BGMI**, **Valorant**, **Free Fire MAX**, **Counter-Strike 2**, **FIFA / EA FC**, **GTA V Online**, etc.
   - Dynamic game-specific rules (BGMI squad limits, Valorant role caps, FIFA budgets).
2. **Real-Time Live Auction Room**:
   - Sub-second synchronized bidding via **Socket.IO**.
   - Server-side atomic validation preventing race conditions, duplicate bids, and purse overdrafts.
   - 30-second live digital hammer clock with anti-snipe extension.
   - Dynamic quick bid buttons (`+₹250`, `+₹500`, `+₹1,000`), custom bid input, live bidding feed, and audio-visual celebration on lot sold.
3. **Role-Based Access Control (RBAC)**:
   - 5 User Roles: `user` (Spectator), `gamer` (Athlete), `team_owner` (Clan Manager), `organizer` (Host), and `admin` (Platform Operator).
   - JWT authentication + bcrypt password hashing.
4. **Bilingual Localization (English & Hinglish)**:
   - Seamless instant toggle between English and natural Hinglish in the top navigation bar.
   - Persistent preference stored in `localStorage` without page reloads.
5. **Team Hub & Budget Management**:
   - Real-time clan purse tracker with dynamic budget deduction on winning bids.
   - Roster lock and contract management.
6. **Esports Cyber-Dark Design System**:
   - Tailored high-contrast cyber dark aesthetics (`#0B0E14` base, `#00E599` emerald accents, `#FF4655` live alerts, `#F5A623` champion gold).
   - Fully responsive on Desktop, Tablet, and Mobile.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB** (Local instance or MongoDB Atlas connection string)

### 2. Installation
Both backend and frontend dependencies are pre-installed. If running on a new machine:
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Environment Configuration
The server environment is located in `server/.env`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/multi-game-auction
JWT_SECRET=arena_auctions_jwt_secret_production_ready_9921_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

### 4. Seed Database with Realistic Gaming Data (Optional)
To populate MongoDB with games, sample auctions, active player lots, and test organizations:
```bash
cd server
npm run seed
```

### 5. Running the Application

**Run Server (Backend API + WebSockets on port 5000):**
```bash
cd server
npm run dev
```

**Run Client (React Frontend on port 5173):**
```bash
cd client
npm run dev
```

Open your browser at `http://localhost:5173`.

---

## 🔑 Demo Accounts

| Role | Email / Username | Password |
| :--- | :--- | :--- |
| **SuperAdmin** | `admin@arenaauctions.gg` | `Admin@123` |
| **Team Owner (GodLike)** | `owner@godl.gg` | `Owner@123` |
| **Gamer / Athlete** | `akshat@soul.gg` | `Gamer@123` |

---

## 📁 Project Structure

```
Multi-Game/
├── client/                     # React 18 + Vite + Tailwind CSS Frontend
│   ├── src/
│   │   ├── components/         # Reusable UI, Layout, Cards & Auction widgets
│   │   ├── context/            # Auth, Socket.IO & Bilingual Language Providers
│   │   ├── locales/            # en.json (English) and hi-en.json (Hinglish)
│   │   ├── pages/              # 21 Complete Routes (Home, Live, GameDetail, Admin...)
│   │   └── utils/              # Mock datasets, currency & date formatters
├── server/                     # Node.js + Express.js + Socket.IO Backend
│   ├── config/                 # MongoDB & Socket.IO server initialization
│   ├── controllers/            # Auth, Game, Auction, and Team controllers
│   ├── middleware/             # JWT protect, RBAC authorize, error handlers
│   ├── models/                 # Mongoose schemas (User, Game, Auction, Lot, Team, Bid)
│   ├── routes/                 # REST API endpoints
│   ├── sockets/                # Atomic live bidding room handlers
│   └── utils/                  # Seeder, constants & standard API responses
└── package.json
```

