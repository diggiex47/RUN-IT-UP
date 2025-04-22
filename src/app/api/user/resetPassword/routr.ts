import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';


export async function POST(request: NextRequest){

        try{

            const reqBody = await request.json()
            const {token} = reqBody
            // console.log(token)

            const user = await prisma.user.findFirst({
                where: {
                    forgotPasswordToken: token, forgotPasswordTokenExpiry: {
                        gte: new Date(Date.now())
                }
            },
             })

             if (!user){
                return NextResponse.json({error: "Invalid or expired token."}, {status: 401});
             }

            //  console.log(user)

                await prisma.user.update({
                    where: { id: user.id },
                    data: {
                        forgotPasswordToken: null,
                        forgotPasswordTokenExpiry: null
                    }
                })
                console.log("Password changed successfully")
                // Send a success response
                return NextResponse.json({message: "Password changed successfully."}, {status: 200});
        }
        catch(error: any){
            return NextResponse.json({error: "An unexpected error occurred."}, {status: 500});
        }


}