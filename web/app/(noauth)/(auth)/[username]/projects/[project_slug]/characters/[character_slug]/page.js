'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { apiCall } from '@/services/apiCall'
import GlobalLoader from '@/components/GlobalLoader'
import CharacterView from '@/components/auth/projects/characters/CharacterView'
import { useProject } from '@/context/ProjectContext'

export default function CharacterPage() {
	const router = useRouter()
	const params = useParams()
	
	const { project } = useProject()
	const character_slug = params['character_slug']
	const [character, setCharacter] = useState(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		async function fetchCharacter() {
			setLoading(true)

			const response = await apiCall('GET', `/projects/${project.id}/characters/slug/${character_slug}`)
			if (response?.success){
				setCharacter(response.data)
			}
			else{
				router.push('/not-found')
			}
			
			setLoading(false)
		}
		fetchCharacter()
	}, [character_slug])

	if (loading || !character) return <GlobalLoader />
	return <CharacterView character={character} />
}


