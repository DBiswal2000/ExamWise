import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function POST(req) {
  try {
    const { name, email, image } = await req.json();
    await connectDB();

    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return new Response(JSON.stringify({ message: "User already exists" }), { status: 200 });
    }

    // Create new user
    const newUser = new User({ name, email, image });
    await newUser.save();

    return new Response(JSON.stringify({ message: "User registered successfully" }), { status: 201 });
  } catch (err) {
    console.error("Error registering user:", err);
    return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
  }
}
