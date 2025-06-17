import { connectDB } from "@/lib/db";
import Question from "@/models/Question";
import { NextResponse } from "next/server";

export async function GET(req) {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    if (!category) {
        return NextResponse.json({ success: false, message: "Category required" });
    }

    const questions = await Question.find({ category: { $regex: new RegExp(`^${category}$`, "i") } })
        .select("questionText optionA optionB optionC optionD correctAnswer category topic difficulty explanation").limit(20);
    return NextResponse.json({ success: true, questions });
}