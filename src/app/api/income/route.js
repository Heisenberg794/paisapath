import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Income from '@/models/Income';

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    
    const income = await Income.create(body);
    return NextResponse.json(income, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const incomes = await Income.find().sort({ date: -1 });
    return NextResponse.json(incomes);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 