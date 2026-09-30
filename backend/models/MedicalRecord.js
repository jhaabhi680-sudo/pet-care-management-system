import mongoose from 'mongoose';

const medicalRecordSchema = new mongoose.Schema(
  {
    pet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pet',
      required: [true, 'Medical record must be associated with a pet'],
    },
    veterinarian: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Attending veterinarian is required'],
    },
    visitDate: {
      type: Date,
      default: Date.now,
    },
    diagnosis: {
      type: String,
      required: [true, 'Clinical diagnosis is required'],
      trim: true,
    },
    symptoms: {
      type: String,
      trim: true,
    },
    treatment: {
      type: String,
      required: [true, 'Treatment or medical procedure details required'],
      trim: true,
    },
    prescription: {
      type: String,
      trim: true,
    },
    vaccination: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const MedicalRecord = mongoose.model('MedicalRecord', medicalRecordSchema);
export default MedicalRecord;
