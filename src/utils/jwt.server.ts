import {JwtPayload, sign, verify} from 'jsonwebtoken'
export function SignJWT(payload:any){
    return sign(payload,process.env.JWT_SECRET!)
}

export function VerifyJWT(token:string){
    return verify(token,process.env.JWT_SECRET!) as JwtPayload
}