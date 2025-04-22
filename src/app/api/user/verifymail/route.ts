import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { tokenExtract } from '@/helper/tokenExtract';
import crypto from 'crypto';
import { sendVerificationEmail } from '@/helper/verifyMail';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        
        // If token is provided, verify email
        if (body.token) {
            const user = await prisma.user.findFirst({
                where: {
                    verificationToken: body.token,
                    verificationTokenExpiry: {
                        gte: new Date()
                    }
                },
            });

            if (!user) {
                return NextResponse.json({ error: "Invalid or expired token." }, { status: 401 });
            }

            await prisma.user.update({
                where: { id: user.id },
                data: {
                    emailVerified: true,
                    isVerified: true,
                    verificationToken: null,
                    verificationTokenExpiry: null
                }
            });

            return NextResponse.json({ message: "Email verified successfully." }, { status: 200 });
        } 
        // If no token, generate new verification token and send email
        else {
            const userId = await tokenExtract(request);
            const user = await prisma.user.findUnique({
                where: { id: userId }
            });

            if (!user) {
                return NextResponse.json({ error: "User not found" }, { status: 404 });
            }

            if (user.isVerified) {
                return NextResponse.json({ error: "Email already verified" }, { status: 400 });
            }

            const verificationToken = crypto.randomBytes(32).toString('hex');
            const THIRTY_MINUTES = 30 * 60 * 1000;

            await prisma.user.update({
                where: { id: user.id },
                data: {
                    verificationToken,
                    verificationTokenExpiry: new Date(Date.now() + THIRTY_MINUTES)
                }
            });

            await sendVerificationEmail(user.email, verificationToken);

            return NextResponse.json({ 
                message: "Verification email sent successfully." 
            }, { status: 200 });
        }
    } catch (error: any) {
        console.error("Verification error:", error);
        return NextResponse.json({ 
            error: "An unexpected error occurred." 
        }, { status: 500 });
    }
}