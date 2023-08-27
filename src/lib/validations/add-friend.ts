import { z } from 'zod'

export const AddFriendValidator = z.object({
	email: z.string().email(),
})
