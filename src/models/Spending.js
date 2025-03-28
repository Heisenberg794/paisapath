import mongoose from 'mongoose';

const spendingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  description: {
    type: String,
    trim: true,
  },
  userId: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

const Spending = mongoose.models.Spending || mongoose.model('Spending', spendingSchema);

export default Spending; 