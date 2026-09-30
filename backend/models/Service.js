import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide service name'],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Please specify service fee'],
      min: [0, 'Price must be a positive number'],
    },
    duration: {
      type: String,
      required: [true, 'Please provide estimated duration (e.g. 30 mins)'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Service = mongoose.model('Service', serviceSchema);
export default Service;
