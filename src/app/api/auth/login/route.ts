import { UserModel } from "@/app/schemas/user"
import ConnectDB from "@/utils/mongoose.server"

export async function GET(request:Request) {
    await ConnectDB()
    return Response.json({name:"Rushabh"})
}