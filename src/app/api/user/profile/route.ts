import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { tokenExtract } from "@/helper/tokenExtract";

export async function GET(request: NextRequest) {
    try {
        const userId = await tokenExtract(request);
        
        if (!userId) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
                isVerified: true,
                emailVerified: true,
            }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ user }, { status: 200 });
    } catch (error: any) { // Added proper error typing
        console.error('Error fetching user profile:', error);
        if (error?.message?.includes('JWT')) {
            return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
        }
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
