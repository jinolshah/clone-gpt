import { RegisterDto } from "@/app/dto/register.dto"
import { UserModel } from "@/app/schemas/user"
import ErrorHandler from "@/utils/errorHandler.server"
import ConnectDB from "@/utils/mongoose.server"

export async function POST(request: Request) {
    try {
        await ConnectDB()
        let body = await request.json()
        let { email, password, fullName } = RegisterDto.parse(body)
        let user = await UserModel.create({ email, password, fullName, provider: "password" })
        return Response.json(user)
    } catch (err: any) {
        return ErrorHandler(err)
    }
}