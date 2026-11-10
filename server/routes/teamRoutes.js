import express from 'express';
import {
  getTeams,
  getTeamById,
  createTeam,
  updateTeamBudget,
} from '../controllers/teamController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import { ROLES } from '../utils/constants.js';

const router = express.Router();

router.route('/').get(getTeams).post(protect, createTeam);
router.route('/:id').get(getTeamById);
router.route('/:id/budget').put(protect, authorize(ROLES.ADMIN, ROLES.ORGANIZER), updateTeamBudget);

export default router;

