import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { FC } from 'react'

interface DashbaordProps {}

const DashboardPage: FC<DashbaordProps> = async () => {
	const session = await getServerSession(authOptions)
	return <p> {JSON.stringify(session)}</p>
}

export default DashboardPage
