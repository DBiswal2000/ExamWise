import { NextResponse } from 'next/server';
import { currentUser } from "@clerk/nextjs/server";
import { connectDB } from '@/lib/db';
import Result from '@/models/Result';

export async function POST(req) {
    try {
        const user = await currentUser();
        if (!user) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const userEmail = user.emailAddresses[0].emailAddress;
        const data = await req.json();

        await connectDB();
        const savedResult = await Result.create({ ...data, email: userEmail });

        return NextResponse.json({ success: true, result: savedResult }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function GET() {
    try {
        const user = await currentUser();
        if (!user) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }
        const userEmail = user.emailAddresses[0].emailAddress;
        await connectDB();
        const latestResult = await Result.findOne({ email: userEmail }).sort({ submittedAt: -1 });


        if (!latestResult) {
            return NextResponse.json({ success: false, message: 'No result found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, result: latestResult });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}