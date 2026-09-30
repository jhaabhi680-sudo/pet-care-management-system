import express from 'express';
import {
  getUsers,
  getUserById,
  updateUserProfile,
  deleteUser,
} from '../controllers/userController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, authorize('admin', 'veterinarian'), getUsers);

router.route('/profile')
  .put(protect, updateUserProfile);

router.route('/:id')
  .get(protect, getUserById)
  .delete(protect, authorize('admin'), deleteUser);

export default router;
