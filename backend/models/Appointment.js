import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    pet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pet',
      required: [true, 'Appointment must be linked to a pet'],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Appointment must be linked to a pet owner'],
    },
    veterinarian: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    service: {
      type: String,
      required: [true, 'Please specify the clinic service requested'],
      trim: true,
    },
    appointmentDate: {
      type: Date,
      required: [true, 'Appointment date is required'],
    },
    appointmentTime: {
      type: String,
      required: [true, 'Appointment time slot is required'],
    },
    reason: {
      type: String,
      required: [true, 'Please provide the primary reason or symptom for the visit'],
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

const Appointment = mongoose.model('Appointment', appointmentSchema);
export default Appointment;
