import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { initSocket } from './config/socket.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';
import { successResponse } from './utils/apiResponse.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import gameRoutes from './routes/gameRoutes.js';
import auctionRoutes from './routes/auctionRoutes.js';
import teamRoutes from './routes/teamRoutes.js';
import { apiLimiter, authLimiter } from './middleware/rateLimiter.js';

// Socket handlers
import { registerAuctionSocketHandlers } from './sockets/auctionRoomHandler.js';

dotenv.config();

const app = express();
const httpServer = http.createServer(app);

// Security & Utility Middlewares
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  return successResponse(res, 'Arena Auctions API is operational', {
    status: 'online',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    platform: 'Multi-Game Live Auction Platform',
  });
});

// Mount API routes
app.use('/api', apiLimiter);
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/auctions', auctionRoutes);
app.use('/api/teams', teamRoutes);

// Initialize Socket.IO
const io = initSocket(httpServer);

io.on('connection', (socket) => {
  console.log(`⚡ WebSocket client connected: ${socket.id}`);
  
  // Register live auction event listeners
  registerAuctionSocketHandlers(io, socket);

  socket.on('disconnect', () => {
    console.log(` WebSocket client disconnected: ${socket.id}`);
  });
});

// Catch 404 & Centralized Error Handler
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  httpServer.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(` ARENA AUCTIONS SERVER RUNNING ON PORT ${PORT}`);
    console.log(` API Endpoint: http://localhost:${PORT}/api/health`);
    console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`======================================================\n`);
  });
};

startServer();

export { app, httpServer, io };
