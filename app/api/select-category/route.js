import { connectDB } from '@/lib/db';
import User from '@/models/User';

export async function POST(req) {
  const { userId, category } = await req.json();
  await connectDB();
  await User.findByIdAndUpdate(userId, { category });
  return new Response("Category updated", { status: 200 });
}


