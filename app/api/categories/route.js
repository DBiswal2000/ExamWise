import { connectDB } from '@/lib/db';
import { NextResponse } from 'next/server';
import Category from '@/models/Category';

export async function GET() {
    await connectDB();
    const categories = await Category.find({});
    return NextResponse.json({ success: true, categories });
}
