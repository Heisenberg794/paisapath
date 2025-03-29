import mongoose from 'mongoose';

const incomeSchema = new mongoose.Schema({
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

const Income = mongoose.models.Income || mongoose.model('Income', incomeSchema);

export default Income; 