import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';

// // Define the expected shape of the request body
// interface SignupRequestBody {
//   username: string;
//   email: string;
//   password: string;
//   confirmPassword: string;
  
// }

// // Define a simplified User response type
// interface UserResponse {
//   id: string;
//   user: string | null; // Allow null
//   email: string;
// }

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
      where: { email: email },
    });

    if (existingUserByEmail) {
      return NextResponse.json({ user:null, message: 'Mail already being used.' }, { status: 400 });
    }

    const existingUserByUsername = await prisma.user.findUnique({
      where: { username: username },
    });

    if (existingUserByUsername) {
      return NextResponse.json({ user: null, message: 'username already being used.' }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user in DB
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      }
    });

    // Send success response
    return NextResponse.json({user: username, email: email, message: 'User created successfully.'}, { status: 201 });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}