import { AddFriendButton } from '@/components'
import { FC } from 'react'

const AddPage: FC = () => {
	return (
		<main className='pt-8 pl-8'>
			<h1 className='font-bold text-5xl mb-8'> Add a friend </h1>

			<AddFriendButton />
		</main>
	)
}

export default AddPage
