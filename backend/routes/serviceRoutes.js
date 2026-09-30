import express from 'express';
import {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} from '../controllers/serviceController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getServices)
  .post(protect, authorize('admin', 'veterinarian'), createService);

router.route('/:id')
  .get(getServiceById)
  .put(protect, authorize('admin', 'veterinarian'), updateService)
  .delete(protect, authorize('admin', 'veterinarian'), deleteService);

export default router;
