'use client'

import styles from '@/assets/auth/projects/view.module.scss'
import { useState, useEffect } from 'react'
import { useRouter, useParams, usePathname } from 'next/navigation'
import { apiCall } from '@/services/apiCall'
import GlobalLoader from '@/components/GlobalLoader'
import { ProjectHeader } from '@/components/auth/projects/ProjectHeader'
import { ProjectProvider } from '@/context/ProjectContext'
import ProjectReadMode from '@/components/auth/projects/ProjectReadMode'

export default function ProjectLayout({ children }) {
  const router = useRouter()
  const params = useParams()
  const pathname = usePathname()
  const username = params['username']
  const project_slug = params['project_slug']

  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [view_mode, setViewMode] = useState('full')

  useEffect(() => {
    async function fetchProject() {
      setLoading(true)
      const response = await apiCall('GET', `/projects/slug/${project_slug}/users/username/${username}`)
      if (response.success) {
        setProject(response.data)
      } else {
        // router.push('/not-found')
      }
      setLoading(false)
    }
    fetchProject()
  }, [project_slug, username, router, pathname])

  if (loading) return <GlobalLoader />
  if (!project) return null

  return (
    <ProjectProvider project={project} setProject={setProject} view_mode={view_mode} setViewMode={setViewMode}>
      <div className={styles.container}>
        <section className={styles.wrapper}>
          <ProjectHeader />
          {view_mode === 'full' ? (
            children
          ) : (
            <ProjectReadMode project={project} />
          )}
        </section>
      </div>
    </ProjectProvider>
  )
}
