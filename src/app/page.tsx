import { Button } from '@/components/ui'
import { db } from '@/lib/db'
import React from 'react'

const HomePage = async () => {
	await db.set('hello', 'hello')
	return (
		<div className='text-green-500'>
			<Button> Hello World </Button>
		</div>
	)
}

export default HomePage
