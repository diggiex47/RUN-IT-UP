import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { sendVerificationEmail } from '@/helper/verifyMail';
import crypto from 'crypto';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { username, email, password, confirmPassword } = body;

        // Basic validation
        if (!username || !email || !password || !confirmPassword) {
            return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
        }

        if (password !== confirmPassword) {
            return NextResponse.json({ error: 'Passwords do not match.' }, { status: 400 });
        }

        // Check if user already exists
        const existingUserByEmail = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUserByEmail) {
            return NextResponse.json({ error: 'Email already in use.' }, { status: 400 });
        }

        const existingUserByUsername = await prisma.user.findUnique({
            where: { username }
        });

        if (existingUserByUsername) {
            return NextResponse.json({ error: 'Username already in use.' }, { status: 400 });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const THIRTY_MINUTES = 30 * 60 * 1000;

        // Create the user in DB
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                role: 'user',
                verificationToken,
                verificationTokenExpiry: new Date(Date.now() + THIRTY_MINUTES)
            }
        });

        // Send verification email
        await sendVerificationEmail(email, verificationToken);

        return NextResponse.json({
            message: 'User created successfully. Please check your email to verify your account.',
            success: true,
            user: { username, email }
        }, { status: 201 });

    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
