'use client'

import { useProject } from '@/context/ProjectContext'
import ProjectFullMode from '@/components/auth/projects/ProjectFullMode'
import ProjectReadMode from '@/components/auth/projects/ProjectReadMode'
import GlobalLoader from '@/components/GlobalLoader'

export default function ProjectViewPage() {
  const { project, view_mode } = useProject()

  if (!project) return <GlobalLoader />

  return (
    <>
      {view_mode === 'full' ? (
        <ProjectFullMode project={project} />
      ) : (
        <ProjectReadMode project={project} />
      )}
    </>
  )
}
