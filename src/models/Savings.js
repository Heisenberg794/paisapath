import mongoose from 'mongoose';

const savingsSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  month: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Savings || mongoose.model('Savings', savingsSchema); 