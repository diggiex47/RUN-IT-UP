import { NextResponse, NextRequest } from "next/server";
import prisma from '@/lib/prisma';
import { tokenExtract } from "@/helper/tokenExtract";

// GET - Fetch all products
export async function GET(request: NextRequest) {
    try {
        const token = request.headers.get('Authorization')?.split(' ')[1];
        if (!token) {
            return NextResponse.json({ error: 'Authorization required' }, { status: 401 });
        }

        const products = await prisma.product.findMany({
            orderBy: {
                lastModified: 'desc'
            }
        });

        return NextResponse.json({ products }, { status: 200 });
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST - Create a new product
export async function POST(request: NextRequest) {
    try {
        const token = request.headers.get('Authorization')?.split(' ')[1];
        if (!token) {
            return NextResponse.json({ error: 'Authorization required' }, { status: 401 });
        }

        // Check if user has permission to create products
        const requesterId = await tokenExtract(request);
        const requester = await prisma.user.findUnique({
            where: { id: requesterId },
        });

        if (!requester || !['admin', 'content manager'].includes(requester.role)) {
            return NextResponse.json({ error: 'Unauthorized. Only admins and content managers can create products' }, { status: 403 });
        }

        const { title, description } = await request.json();

        if (!title || !description) {
            return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
        }

        const product = await prisma.product.create({
            data: {
                title,
                description,
                modifiedBy: requester.username,
            },
        });

        return NextResponse.json({ product }, { status: 201 });
    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}