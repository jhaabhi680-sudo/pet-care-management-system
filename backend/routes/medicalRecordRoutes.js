import express from 'express';
import {
  getMedicalRecords,
  getMedicalRecordById,
  createMedicalRecord,
  updateMedicalRecord,
  deleteMedicalRecord,
} from '../controllers/medicalRecordController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getMedicalRecords)
  .post(protect, authorize('admin', 'veterinarian'), createMedicalRecord);

router.route('/:id')
  .get(protect, getMedicalRecordById)
  .put(protect, authorize('admin', 'veterinarian'), updateMedicalRecord)
  .delete(protect, authorize('admin', 'veterinarian'), deleteMedicalRecord);

export default router;
