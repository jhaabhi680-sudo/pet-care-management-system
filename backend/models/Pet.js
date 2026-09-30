import mongoose from 'mongoose';

const petSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide pet name'],
      trim: true,
    },
    species: {
      type: String,
      required: [true, 'Please specify animal species (Dog, Cat, etc.)'],
      trim: true,
    },
    breed: {
      type: String,
      required: [true, 'Please provide pet breed'],
      trim: true,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female'],
      default: 'Male',
    },
    age: {
      type: Number,
      required: [true, 'Please specify pet age in years'],
      min: [0, 'Age cannot be negative'],
    },
    dateOfBirth: {
      type: Date,
    },
    weight: {
      type: Number,
      min: [0, 'Weight must be a positive number'],
    },
    color: {
      type: String,
      trim: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Pet must be associated with an owner'],
    },
    vaccinationStatus: {
      type: String,
      enum: ['Up to date', 'Pending', 'Not Vaccinated'],
      default: 'Up to date',
    },
    medicalNotes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Pet = mongoose.model('Pet', petSchema);
export default Pet;
