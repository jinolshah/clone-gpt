import { LoginDto } from "@/app/dto/login.dto"
import { RegisterDto } from "@/app/dto/register.dto"
import { UserModel } from "@/app/schemas/user"
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
        let { email, password } = LoginDto.parse(body)
        try {
            let user = await UserModel.findOne({ email: email })
            if (!user) {
                throw new Error("Invalid Login Credentials")
            }
            if (!compareSync(password!, user.password)) {
                throw new Error("Invalid Login Credentials")
            }
            let token = sign({ email }, process.env.JWT_SECRET!, { expiresIn: "24h" })
            const cookieStore = cookies()
            cookieStore.set("session",token)
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