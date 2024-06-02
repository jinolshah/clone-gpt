export default function ErrorHandler(err:Error){
    return Response.json({
        message: err.message
    })
}