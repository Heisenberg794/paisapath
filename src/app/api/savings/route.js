import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Savings from '@/models/Savings';

export async function GET() {
  try {
    await connectDB();
    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
    const currentYear = currentDate.getFullYear();

    // Get current month's savings
    const currentSavings = await Savings.findOne({
      month: currentMonth,
      year: currentYear
    });

    // Get all savings for the current year
    const yearlySavings = await Savings.find({
      year: currentYear
    });

    const totalYearlySavings = yearlySavings.reduce((sum, saving) => sum + saving.amount, 0);

    return NextResponse.json({
      currentMonth: {
        amount: currentSavings?.amount || 0,
        month: currentMonth,
        year: currentYear
      },
      yearlyTotal: totalYearlySavings
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch savings data' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const { amount } = await request.json();
    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
    const currentYear = currentDate.getFullYear();

    // Update or create savings for current month
    const savings = await Savings.findOneAndUpdate(
      {
        month: currentMonth,
        year: currentYear
      },
      {
        amount,
        month: currentMonth,
        year: currentYear
      },
      {
        new: true,
        upsert: true
      }
    );

    return NextResponse.json(savings);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to save data' },
      { status: 500 }
    );
  }
} 