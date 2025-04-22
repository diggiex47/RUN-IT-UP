import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import prisma from '@/lib/prisma';
import { tokenExtract } from "@/helper/tokenExtract";

export async function GET(request: NextRequest) {
    try {
        const token = request.headers.get('Authorization')?.split(' ')[1];
        if (!token) {
            return NextResponse.json({ error: 'Authorization required' }, { status: 401 });
        }

        const requesterId = await tokenExtract(request);
        const requester = await prisma.user.findUnique({
            where: { id: requesterId },
        });

        if (!requester || requester.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized. Only admins can view all users' }, { status: 403 });
        }

        const users = await prisma.user.findMany({
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
            },
        });

        return NextResponse.json({ users }, { status: 200 });
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}