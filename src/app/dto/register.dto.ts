import { z } from "zod";

export const RegisterDto = z.object({
    fullName: z.string(),
    email: z.string().email(),
    password: z.string().optional(),
})