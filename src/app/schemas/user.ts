import { z } from 'zod';
import { zodSchema } from '@zodyac/zod-mongoose';
import { model, models } from 'mongoose';
const UserSchema = z.object({
    fullName: z.string(),
    email: z.string().email(),
    password: z.string().optional(),
    provider: z.enum(['password','google'])
})

const schema = zodSchema(UserSchema);
export const UserModel = models?.User || model('User', schema);