import { ForgotPasswordDto } from "@/app/dto/forgot-password.dto"
import { UserModel } from "@/app/schemas/user"
import { transporter } from "@/utils/emailService.server"
import ErrorHandler from "@/utils/errorHandler.server"
import { SignJWT } from "@/utils/jwt.server"
import ConnectDB from "@/utils/mongoose.server"
import { compareSync, hashSync } from 'bcryptjs'
import { sign } from "jsonwebtoken"
import { cookies } from "next/headers"
export async function POST(request: Request) {
    try {
        await ConnectDB()
        let body = await request.json()
        let { email } = ForgotPasswordDto.parse(body)
        try {
            let user = await UserModel.findOne({ email: email })
            if (!user) {
                throw new Error("User does not exists")
            }
            let token = sign({ email, role: 'reset' }, process.env.JWT_SECRET!, { expiresIn: "15m" })
            await transporter.sendMail({
                subject:"RESET PASSWORD",
                to:email,
                text:`Please following the link http://localhost:3000/reset-password?token=${token} to Reset your password.`
            })
            return Response.json({ success: true })
        } catch (err: any) {
            if (new Error(err).message.includes("E11000 duplicate key")) {
                throw new Error("Email already exists. Please Sign In.")
            }
            throw err
        }
    } catch (err: any) {
        return ErrorHandler(err)
    }
}