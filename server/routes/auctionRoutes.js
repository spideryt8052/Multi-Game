import express from 'express';
import {
  getAuctions,
  getAuctionById,
  createAuction,
  registerParticipant,
  updateAuctionStatus,
} from '../controllers/auctionController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import { ROLES } from '../utils/constants.js';

const router = express.Router();

router.route('/').get(getAuctions).post(protect, authorize(ROLES.ADMIN, ROLES.ORGANIZER), createAuction);
router.route('/:id').get(getAuctionById);
router.route('/:id/register').post(protect, registerParticipant);
router.route('/:id/status').put(protect, authorize(ROLES.ADMIN, ROLES.ORGANIZER), updateAuctionStatus);

export default router;

