import express from 'express';
import {
  getAllGames,
  getGameBySlug,
  createGame,
  updateGame,
  deleteGame,
} from '../controllers/gameController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import { ROLES } from '../utils/constants.js';

const router = express.Router();

router.route('/').get(getAllGames).post(protect, authorize(ROLES.ADMIN), createGame);
router.route('/:slug').get(getGameBySlug);
router.route('/:id').put(protect, authorize(ROLES.ADMIN), updateGame).delete(protect, authorize(ROLES.ADMIN), deleteGame);

export default router;

