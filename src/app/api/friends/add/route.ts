import { fetchRedis } from '@/helpers/redis'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { AddFriendValidator } from '@/lib/validations/add-friend'
import { getServerSession } from 'next-auth'
import { z } from 'zod'

export async function POST(req: Request) {
	try {
		const body = await req.json()

		//? validated Email
		const { email: emailToAdd } = AddFriendValidator.parse(body.email)

		const idToAdd = (await fetchRedis(
			'get',
			`user:email:${emailToAdd}`,
		)) as string

		// * ----- invalid requests -----

		// ! person does not exists
		if (!idToAdd)
			return new Response('This person does not exists!', { status: 400 })

		// ! unauthorized user
		const session = await getServerSession(authOptions)
		if (!session) return new Response('Unauthorized', { status: 401 })

		// ! user sending self friend request
		if (idToAdd === session.user.id)
			return new Response('You cannot add yourself as friend', { status: 400 })

		// ! check if user is already added
		const isAlreadyAdded = (await fetchRedis(
			'sismember',
			`user:${idToAdd}:incomming_friend_requests`,
			session.user.id,
		)) as 0 | 1

		if (isAlreadyAdded)
			return new Response('Already added this user', { status: 400 })

		// ! check if user is already a friend
		const isAlreadyFriends = (await fetchRedis(
			'sismember',
			`user:${session.user.id}:friends`,
			idToAdd,
		)) as 0 | 1

		if (isAlreadyFriends)
			return new Response('Already friend with this user', { status: 400 })

		// * ----- valid request, send a friend request -----
		db.sadd(`user:${idToAdd}:incoming_friend_request`, session.user.id)

		return new Response('ok', { status: 200 })
	} catch (error) {
		if (error instanceof z.ZodError)
			return new Response('Invalid request payload', { status: 422 })

		return new Response('Invalid request', { status: 400 })
	}
}
