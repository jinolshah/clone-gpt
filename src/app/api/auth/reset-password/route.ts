import { ResetPasswordDto } from "@/app/dto/reset-password.dto"
import { UserModel } from "@/app/schemas/user"
import ErrorHandler from "@/utils/errorHandler.server"
import ConnectDB from "@/utils/mongoose.server"
import { hashSync } from 'bcryptjs'
import { JwtPayload, sign, verify } from "jsonwebtoken"
export async function POST(request: Request) {
    try {
        await ConnectDB()
        let body = await request.json()
        let { token,password } = ResetPasswordDto.parse(body)
        try {
            let {email,role} = verify(token,process.env.JWT_SECRET!) as JwtPayload
            if(role != 'verify'){
                throw new Error("Invalid Token")
            }
            let user = await UserModel.findOne({ email: email })
            if (!user) {
                throw new Error("User does not exists")
            }
            await UserModel.updateOne({email:email},{password:hashSync(password)})
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