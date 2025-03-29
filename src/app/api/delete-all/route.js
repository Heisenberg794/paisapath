import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Income from '@/models/Income';
import Spending from '@/models/Spending';

export async function DELETE() {
  try {
    await connectDB();
    
    // Delete all income records
    const incomeResult = await Income.deleteMany({});
    
    // Delete all spending records
    const spendingResult = await Spending.deleteMany({});
    
    return NextResponse.json({
      success: true,
      message: 'All data deleted successfully',
      deletedCount: {
        income: incomeResult.deletedCount,
        spending: spendingResult.deletedCount
      }
    });
  } catch (error) {
    console.error('Error deleting data:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'Failed to delete data'
      }, 
      { status: 500 }
    );
  }
} 