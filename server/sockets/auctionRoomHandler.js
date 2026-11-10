import mongoose from 'mongoose';
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

      const isValidAuctionId = mongoose.Types.ObjectId.isValid(auctionId);
      let auction = null;
      if (isValidAuctionId) {
        auction = await Auction.findById(auctionId);
      }

      // If auction exists in DB, perform strict DB validation and atomic update
      if (auction) {
        if (auction.status !== AUCTION_STATUS.LIVE) {
          return socket.emit(SOCKET_EVENTS.BID_REJECTED, {
            reason: `Auction is currently ${auction.status}. Bids are only accepted during Live status.`,
          });
        }

        const currentBid = auction.currentLot?.currentBid || auction.startingBid;
        const minIncrement = auction.minimumIncrement || 250;

        if (amount <= currentBid) {
          return socket.emit(SOCKET_EVENTS.BID_REJECTED, {
            reason: `Bid ₹${amount} must be higher than current bid of ₹${currentBid}`,
          });
        }

        if (amount < currentBid + minIncrement) {
          return socket.emit(SOCKET_EVENTS.BID_REJECTED, {
            reason: `Bid must be at least ₹${currentBid + minIncrement} (Min Increment: +₹${minIncrement})`,
          });
        }

        const isValidTeamId = teamId && mongoose.Types.ObjectId.isValid(teamId);
        if (isValidTeamId) {
          const team = await Team.findById(teamId);
          if (team && team.remainingBudget < amount) {
            return socket.emit(SOCKET_EVENTS.BID_REJECTED, {
              reason: `Insufficient clan purse. Remaining budget is ₹${team.remainingBudget}, but bid was ₹${amount}`,
            });
          }
        }

        const updatedAuction = await Auction.findOneAndUpdate(
          {
            _id: auction._id,
            status: AUCTION_STATUS.LIVE,
            'currentLot.currentBid': { $lte: amount - minIncrement },
          },
          {
            $set: {
              'currentLot.currentBid': amount,
              'currentLot.currentBidderTeam': isValidTeamId ? teamId : null,
              'currentLot.lotEndsAt': new Date(Date.now() + 25000),
              'currentLot.lotStatus': LOT_STATUS.BIDDING,
            },
          },
          { new: true }
        );

        if (!updatedAuction) {
          return socket.emit(SOCKET_EVENTS.BID_REJECTED, {
            reason: 'Outbid! Another clan placed a higher bid milliseconds before you.',
          });
        }

        if (lotId && mongoose.Types.ObjectId.isValid(lotId)) {
          await Bid.create({
            auction: auction._id,
            participant: lotId,
            team: isValidTeamId ? teamId : null,
            bidder: socket.handshake.auth?.userId || null,
            amount,
            bidType: 'quick_bid',
            serverReceivedAt,
          }).catch((e) => console.warn('Bid logging warn:', e.message));
        }
      }

      // Broadcast new valid bid to everyone in the room (works for both DB and demo lots)
      io.to(roomName).emit(SOCKET_EVENTS.NEW_BID, {
        amount,
        teamName: teamName || 'Challenger Clan',
        teamTag: teamTag || 'CHLG',
        newLotEndsAt: new Date(Date.now() + 25000),
        timestamp: new Date().toLocaleTimeString(),
      });

      console.log(`⚡ Bid Accepted: ₹${amount} in ${roomName} by ${teamName || 'Clan'}`);
    } catch (err) {
      console.error('Bid Processing Error:', err);
      socket.emit(SOCKET_EVENTS.BID_REJECTED, { reason: 'Internal server error processing bid' });
    }
  });

  // Admin Hammer Sold
  socket.on(SOCKET_EVENTS.ADMIN_HAMMER_SOLD, async ({ auctionId, lotId, teamId, finalPrice }) => {
    try {
      const roomName = `auction:${auctionId}`;

      // Deduct budget from team if teamId is valid ObjectId
      if (teamId && mongoose.Types.ObjectId.isValid(teamId) && finalPrice) {
        await Team.findByIdAndUpdate(teamId, {
          $inc: { remainingBudget: -finalPrice },
        }).catch(() => {});
      }

      if (lotId && mongoose.Types.ObjectId.isValid(lotId)) {
        await AuctionParticipant.findByIdAndUpdate(lotId, {
          status: PARTICIPANT_STATUS.SOLD,
          soldPrice: finalPrice,
          soldToTeam: teamId,
        }).catch(() => {});
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
