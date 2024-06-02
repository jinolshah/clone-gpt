import { z } from "zod";

export const ResetPasswordDto = z.object({
    token: z.string().email(),
    password: z.string().email()
})
