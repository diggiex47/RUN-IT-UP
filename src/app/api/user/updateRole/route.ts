import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { tokenExtract } from '@/helper/tokenExtract';

export async function POST(request: NextRequest) {
    try {
        const token = request.headers.get('Authorization')?.split(' ')[1];

        if (!token) {
            return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
        }

        const body = await request.json();
        const { userId, newRole } = body;

        if (!userId || !newRole) {
            return NextResponse.json({ error: 'User ID and new role are required' }, { status: 400 });
        }

        const validRoles = ['user', 'admin', 'content manager'];
        if (!validRoles.includes(newRole)) {
            return NextResponse.json({ error: 'Invalid role specified' }, { status: 400 });
        }

        const requesterId = await tokenExtract(request);
        const requester = await prisma.user.findUnique({ 
            where: { id: requesterId },
            select: { role: true }
        });

        if (!requester || requester.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized. Only admins can update roles.' }, { status: 403 });
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { role: newRole },
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
            },
        });

        return NextResponse.json({ 
            message: 'User role updated successfully',
            user: updatedUser 
        }, { status: 200 });

    } catch (error) {
        console.error('Error updating user role:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}