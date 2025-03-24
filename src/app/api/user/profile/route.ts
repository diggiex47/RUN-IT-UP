import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { tokenExtract } from "@/helper/tokenExtract";

export async function POST(request: NextRequest){

   const userId = await tokenExtract(request);
    const user = await prisma.user.findUnique({ where: {id: userId},
    select: {
        id: true,
        username: true,
        email: true,
    }});

    return NextResponse.json({message: "User profile", data: user})

}
