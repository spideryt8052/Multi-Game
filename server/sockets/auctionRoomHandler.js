import Auction from '../models/Auction.js';
import AuctionParticipant from '../models/AuctionParticipant.js';
import Team from '../models/Team.js';
import Bid from '../models/Bid.js';
import { SOCKET_EVENTS, AUCTION_STATUS, LOT_STATUS, PARTICIPANT_STATUS } from '../utils/constants.js';

export const registerAuctionSocketHandlers = (io, socket) => {
  // Join specific auction room
  socket.on(SOCKET_EVENTS.JOIN_AUCTION, async ({ auctionId, userId, teamId }) => {
    try {
      const roomName = `auction:${auctionId}`;
      socket.join(roomName);
      console.log(` Socket ${socket.id} joined ${roomName} (User: ${userId}, Team: ${teamId})`);

      socket.emit(SOCKET_EVENTS.ROOM_JOINED, {
        room: roomName,
        connectedAt: Date.now(),
      });
    } catch (err) {
      socket.emit(SOCKET_EVENTS.ERROR, { message: err.message });
    }
  });

  // Leave auction room
  socket.on(SOCKET_EVENTS.LEAVE_AUCTION, ({ auctionId }) => {
    const roomName = `auction:${auctionId}`;
    socket.leave(roomName);
    console.log(` Socket ${socket.id} left ${roomName}`);
  });

  // Place Atomic Bid
  socket.on(SOCKET_EVENTS.PLACE_BID, async ({ auctionId, lotId, amount, teamId, teamName, teamTag }) => {
    try {
      const serverReceivedAt = Date.now();
      const roomName = `auction:${auctionId}`;

      // 1. Fetch auction state
      const auction = await Auction.findById(auctionId);
      if (!auction) {
        return socket.emit(SOCKET_EVENTS.BID_REJECTED, { reason: 'Auction does not exist' });
      }

      if (auction.status !== AUCTION_STATUS.LIVE) {
        return socket.emit(SOCKET_EVENTS.BID_REJECTED, {
          reason: `Auction is currently ${auction.status}. Bids are only accepted during Live status.`,
        });
      }

      const currentBid = auction.currentLot?.currentBid || auction.startingBid;
      const minIncrement = auction.minimumIncrement || 250;

      // 2. Validate Bid Amount against current bid
      if (amount <= currentBid) {
        return socket.emit(SOCKET_EVENTS.BID_REJECTED, {
          reason: `Bid ₹${amount} must be higher than current bid of ₹${currentBid}`,
        });
      }

      // 3. Validate Minimum Increment
      if (amount < currentBid + minIncrement) {
        return socket.emit(SOCKET_EVENTS.BID_REJECTED, {
          reason: `Bid must be at least ₹${currentBid + minIncrement} (Min Increment: +₹${minIncrement})`,
        });
      }

      // 4. Validate Team Purse Budget if teamId is provided
      if (teamId) {
        const team = await Team.findById(teamId);
        if (team && team.remainingBudget < amount) {
          return socket.emit(SOCKET_EVENTS.BID_REJECTED, {
            reason: `Insufficient clan purse. Remaining budget is ₹${team.remainingBudget}, but bid was ₹${amount}`,
          });
        }
      }

      // 5. Concurrency Resolution: Atomic Pre-conditioned update
      const updatedAuction = await Auction.findOneAndUpdate(
        {
          _id: auctionId,
          status: AUCTION_STATUS.LIVE,
          'currentLot.currentBid': { $lte: amount - minIncrement },
        },
        {
          $set: {
            'currentLot.currentBid': amount,
            'currentLot.currentBidderTeam': teamId || null,
            'currentLot.lotEndsAt': new Date(Date.now() + 25000), // Reset clock to 25s
            'currentLot.lotStatus': LOT_STATUS.BIDDING,
          },
        },
        { new: true }
      );

      // If condition failed, someone outbid in the exact millisecond
      if (!updatedAuction) {
        return socket.emit(SOCKET_EVENTS.BID_REJECTED, {
          reason: 'Outbid! Another clan placed a higher bid milliseconds before you.',
        });
      }

      // 6. Record immutable bid audit log
      if (lotId) {
        await Bid.create({
          auction: auctionId,
          participant: lotId,
          team: teamId,
          bidder: socket.handshake.auth?.userId || null,
          amount,
          bidType: 'quick_bid',
          serverReceivedAt,
        }).catch((e) => console.warn('Bid logging warn:', e.message));
      }

      // 7. Broadcast new valid bid to everyone in the room
      io.to(roomName).emit(SOCKET_EVENTS.NEW_BID, {
        amount,
        teamName: teamName || 'Challenger Clan',
        teamTag: teamTag || 'CHLG',
        newLotEndsAt: updatedAuction.currentLot.lotEndsAt,
        timestamp: new Date().toLocaleTimeString(),
      });

      console.log(`⚡ Bid Accepted: ₹${amount} in ${roomName} by ${teamName}`);
    } catch (err) {
      console.error('Bid Processing Error:', err);
      socket.emit(SOCKET_EVENTS.BID_REJECTED, { reason: 'Internal server error processing bid' });
    }
  });

  // Admin Hammer Sold
  socket.on(SOCKET_EVENTS.ADMIN_HAMMER_SOLD, async ({ auctionId, lotId, teamId, finalPrice }) => {
    try {
      const roomName = `auction:${auctionId}`;

      // Deduct budget from team
      if (teamId && finalPrice) {
        await Team.findByIdAndUpdate(teamId, {
          $inc: { remainingBudget: -finalPrice },
        });
      }

      if (lotId) {
        await AuctionParticipant.findByIdAndUpdate(lotId, {
          status: PARTICIPANT_STATUS.SOLD,
          soldPrice: finalPrice,
          soldToTeam: teamId,
        });
      }

      io.to(roomName).emit(SOCKET_EVENTS.LOT_SOLD, {
        lotId,
        finalPrice,
        teamId,
      });

      console.log(`🔨 HAMMER STRUCK: Lot ${lotId} SOLD for ₹${finalPrice}`);
    } catch (err) {
      console.error('Hammer Sold Error:', err);
    }
  });
};

