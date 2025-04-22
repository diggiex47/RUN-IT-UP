import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose';

type ValidPaths = '/admin' | '/profile' | '/product' | '/verifyemail' | '/verify-email';
type UserRole = 'user' | 'admin' | 'content manager';

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    const isPublicPath = path === '/login' || 
                        path === '/signup' || 
                        path === '/verifyemail' ||
                        path === '/verify-email';

    const token = request.cookies.get('token')?.value || '';

    let userRole = 'user'; // Default role

    if (token) {
        try {
            const secret = new TextEncoder().encode(process.env.TOKEN_SECRET!);
            const { payload } = await jwtVerify(token, secret);
            userRole = payload.role as string;
        } catch (error: any) {
            if (error.code === 'ERR_JWT_EXPIRED') {
                const response = NextResponse.redirect(new URL('/login', request.url));
                response.cookies.delete('token');
                return response;
            }
            // For any other token error, redirect to login
            const response = NextResponse.redirect(new URL('/login', request.url));
            response.cookies.delete('token');
            return response;
        }
    }

    // Role based access control with specific permissions
    const roleBasedAccess: Record<ValidPaths, UserRole[]> = {
        '/admin': ['admin'],
        '/profile': ['user', 'admin', 'content manager'],
        '/product': ['admin', 'content manager'],
        '/verifyemail': ['user', 'admin', 'content manager'],
        '/verify-email': ['user', 'admin', 'content manager'],
    };

    // Handle public paths
    if (isPublicPath && token) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // Handle protected paths
    if (!isPublicPath && !token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Check role-based access
    const allowedRoles = roleBasedAccess[path as ValidPaths];
    if (allowedRoles && !allowedRoles.includes(userRole as UserRole)) {
        // Redirect unauthorized users to home page with error message
        const url = new URL('/', request.url);
        url.searchParams.set('error', 'unauthorized');
        return NextResponse.redirect(url);
    }
}

export const config = {
    matcher: [
        '/login',
        '/signup',
        '/profile',
        '/product',
        '/admin',
        '/verifyemail',
        '/verify-email'
    ]
};