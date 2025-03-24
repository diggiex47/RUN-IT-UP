import { NextResponse } from "next/server";
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
            username: existingUser.username,
            email: existingUser.email,
        }
        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, { expiresIn: "1h" })
        
        const response = NextResponse.json({ message: 'logged in' }, { status: 200 })

        response.cookies.set('token', token, {
            httpOnly: true
        })
        return response
    }

    catch(err){
        console.error(err);
        return NextResponse.json({error: "An unexpected error occurred."}, {status: 500});
    }
}