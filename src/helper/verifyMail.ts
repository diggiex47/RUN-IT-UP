import prisma from '@/lib/prisma';
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';

interface SendMailParams {
    email: string;
    emailType: 'Verify' | 'Reset';
    userId: string;
}

export const sendMail = async ({ email, emailType, userId }: SendMailParams) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD,
        },
    });

    const hashedToken = await bcrypt.hash(userId.toString(), 10);

    const mailOptions = { 
        from: `Run-it-up <${process.env.GMAIL_USER}>`, // Corrected to use backticks
        to: email,  // list of receivers
        subject: emailType === 'Verify' ? 'Verify your email' : "Reset your password", // Subject line
        html: emailType === 'Verify' 
            ? `${process.env.NEXTAUTH_URL}/api/user/verifymail?token=${hashedToken}` 
            : `${process.env.NEXTAUTH_URL}/api/user/resetpassword?token=${hashedToken}`, // Corrected to use hashedToken
    };

    try {
        if (emailType === "Verify") {
            await prisma.user.update({
                where: { id: userId },
                data: {
                    verificationToken: hashedToken,
                    verificationTokenExpiry: new Date(Date.now() + 60 * 60 * 1000), // 1 hour expiry
                },
            });
        } else if (emailType === "Reset") {
            await prisma.user.update({
                where: { id: userId },
                data: {
                    forgotPasswordToken: hashedToken,
                    forgotPasswordTokenExpiry: new Date(Date.now() + 60 * 60 * 1000), // 1 hour expiry
                },
            });
        }

        const mailResponse = await transporter.sendMail(mailOptions);
        return mailResponse;
    } catch (error:any) {
        throw new Error("Failed to send email. Please try again later.");
        return false;
    }
};

export const sendVerificationEmail = async (email: string, token: string) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD,
        },
    });

    const verificationUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}`;

    const mailOptions = {
        from: `Run-it-up <${process.env.GMAIL_USER}>`,
        to: email,
        subject: 'Verify your email address',
        html: `
            <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
                <h1 style="color: #2563eb; margin-bottom: 20px;">Verify your email address</h1>
                <p style="margin-bottom: 20px; font-size: 16px;">
                    Thank you for signing up! Please click the button below to verify your email address.
                </p>
                <a href="${verificationUrl}" 
                   style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
                    Verify Email
                </a>
                <p style="margin-top: 20px; font-size: 14px; color: #666;">
                    If you didn't request this email, you can safely ignore it.
                </p>
                <p style="margin-top: 20px; font-size: 14px; color: #666;">
                    This link will expire in 30 minutes.
                </p>
            </div>
        `
    };

    try {
        const mailResponse = await transporter.sendMail(mailOptions);
        return mailResponse;
    } catch (error: any) {
        console.error('Email sending error:', error);
        throw new Error("Failed to send verification email. Please try again later.");
    }
};