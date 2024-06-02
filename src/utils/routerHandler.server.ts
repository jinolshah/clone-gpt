import ConnectDB from "./mongoose.server";

export default async function RouterHandler(fn: (request: Request) => Promise<Response>) {
    return async (request: Request) => {
        await ConnectDB()
        console.log(fn)
        return fn(request)
    }
}