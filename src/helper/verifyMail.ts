import prisma from '@/lib/prisma';
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';



export const sendMail = async ({email, emailType, userId}:any) => {

    try {

        // todo : mail for usage

        const hashedToken = await bcrypt.hash(userId.toString(), 10)

        if (emailType === "Verify") {
        await prisma.user.update({where: {id: userId}, data:{verificationToken: hashedToken, verificationTokenExpiry: new Date(Date.now() + 60 * 60 * 1000)}})
        } else if (emailType === "Reset") {
        await prisma.user.update({where: {id: userId}, data:{forgotPasswordToken: hashedToken, forgotPasswordTokenExpiry: new Date(Date.now() + 60 * 60 * 1000)}})

        }
          
       // Looking to send emails in production? Check out our Email API/SMTP product!
var transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "5743940e0204d7",
      pass: "d4e5545cd376c0"
    }
  });


         const mailOptions = { 
                  from: 'runitup.ai', // sender address
                  to: email,  // list of receivers
                  subject: emailType === 'Verify' ? 'Verify your email': "Reset your password", // Subject line
                  html: "<p>phale test kele phir dekhte hai😭</p>", // html body
        }


        const mailResponse = await transporter.sendMail(mailOptions)
        return mailResponse;

    }
    catch (error: any) {
        throw new Error(error.message)
    }
}