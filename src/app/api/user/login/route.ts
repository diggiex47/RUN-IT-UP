import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {

    try{
        const body = await req.json();

        const { email, password } = body;
        console.log(body);

        if(!email || !password){
            return NextResponse.json({error: "All fields requeried"}, {status: 400});
        }

        const existingUser = await prisma.user.findUnique({ where: { email: email } });

        if(!existingUser){
            return NextResponse.json({error: "User not found"}, {status: 404});
        }

        const passwordMatch = await bcrypt.compare(password, existingUser.password);

        if (!passwordMatch) {
            return NextResponse.json({ error: "Invalid password" }, { status: 400 });
        }

        const tokenData = {
            userId: existingUser.id,
            email: existingUser.email,
        }
        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, { expiresIn: "1h" });
        
        return NextResponse.json({ token }, { status: 200 });

    }
    catch(err){
        console.error(err);
        return NextResponse.json({error: "An unexpected error occurred."}, {status: 500});
    }
}