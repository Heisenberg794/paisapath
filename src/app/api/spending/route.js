import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Spending from '@/models/Spending';

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    
    const spending = await Spending.create(body);
    return NextResponse.json(spending, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const spendings = await Spending.find().sort({ date: -1 });
    return NextResponse.json(spendings);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 