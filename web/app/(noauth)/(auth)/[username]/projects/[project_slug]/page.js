'use client'

import { useProject } from '@/context/ProjectContext'
import ProjectFullMode from '@/components/auth/projects/ProjectFullMode'
import GlobalLoader from '@/components/GlobalLoader'

export default function ProjectViewPage() {
  const { project } = useProject()

  if (!project) return <GlobalLoader />

  return (
    <ProjectFullMode project={project} />
  )
}
