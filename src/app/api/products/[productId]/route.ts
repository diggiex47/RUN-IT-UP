import { NextResponse, NextRequest } from "next/server";
import prisma from '@/lib/prisma';
import { tokenExtract } from "@/helper/tokenExtract";

// PUT - Update a product
export async function PUT(
    request: NextRequest,
    { params }: { params: { productId: string } }
) {
    try {
        const token = request.headers.get('Authorization')?.split(' ')[1];
        if (!token) {
            return NextResponse.json({ error: 'Authorization required' }, { status: 401 });
        }

        // Check if user has permission to update products
        const requesterId = await tokenExtract(request);
        const requester = await prisma.user.findUnique({
            where: { id: requesterId },
        });

        if (!requester || !['admin', 'content manager'].includes(requester.role)) {
            return NextResponse.json({ error: 'Unauthorized. Only admins and content managers can update products' }, { status: 403 });
        }

        const { title, description } = await request.json();

        if (!title || !description) {
            return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
        }

        const product = await prisma.product.update({
            where: { id: params.productId },
            data: {
                title,
                description,
                modifiedBy: requester.username,
                lastModified: new Date(),
            },
        });

        return NextResponse.json(product, { status: 200 });
    } catch (error) {
        console.error('Error updating product:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// DELETE - Delete a product
export async function DELETE(
    request: NextRequest,
    { params }: { params: { productId: string } }
) {
    try {
        const token = request.headers.get('Authorization')?.split(' ')[1];
        if (!token) {
            return NextResponse.json({ error: 'Authorization required' }, { status: 401 });
        }

        // Check if user has permission to delete products
        const requesterId = await tokenExtract(request);
        const requester = await prisma.user.findUnique({
            where: { id: requesterId },
        });

        if (!requester || requester.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized. Only admins can delete products' }, { status: 403 });
        }

        await prisma.product.delete({
            where: { id: params.productId },
        });

        return NextResponse.json({ message: 'Product deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting product:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}