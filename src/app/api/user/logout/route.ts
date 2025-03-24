import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";


export async function GET(req: Request){
    try{
        const response = NextResponse.json({ message: 'logged out', success: true }, { status: 200 })

        response.cookies.set('token', '', {
            httpOnly: true,
            expires: new Date(0)
        })

        return response

    }
    catch(err){
        console.error(err);
        return NextResponse.json({error: "An unexpected error occurred."}, {status: 500});
    }
}