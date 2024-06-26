import { RegisterDto } from "@/app/dto/register.dto"
import { UserModel } from "@/app/schemas/user"
import { transporter } from "@/utils/emailService.server"
import ErrorHandler from "@/utils/errorHandler.server"
import { SignJWT } from "@/utils/jwt.server"
import ConnectDB from "@/utils/mongoose.server"
import { hashSync } from 'bcryptjs'
import { sign } from "jsonwebtoken"
import { cookies } from "next/headers"
export async function POST(request: Request) {
    try {
        await ConnectDB()
        let body = await request.json()
        let { email, password, fullName } = RegisterDto.parse(body)
        try {
            let user = await UserModel.create({ email, password: hashSync(password!), fullName, provider: "password" })
            let token = sign({ email }, process.env.JWT_SECRET!, { expiresIn: "24h" })
            let verifyToken = sign({email,role:'verify'},process.env.JWT_SECRET!, { expiresIn: "24h" })
            await transporter.sendMail({
                subject:"VERIFY EMAIL",
                to:email,
                text:`Please following the link http://localhost:3000/verify?token=${verifyToken} to verify your email address.`
            }).catch(console.error)
            const cookieStore = cookies()
            cookieStore.set("session",token)
            return Response.json({success:true})
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