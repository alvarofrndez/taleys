'use client'

import React, { createContext, useContext } from 'react'

const ProjectContext = createContext()

export function ProjectProvider({ children, project, setProject, view_mode, setViewMode }) {
  return (
    <ProjectContext.Provider value={{ project, setProject, view_mode, setViewMode }}>
      {children}
    </ProjectContext.Provider>
  )
}

export function useProject() {
  const context = useContext(ProjectContext)
  if (!context) {
    throw new Error('useProject debe usarse dentro de un ProjectProvider')
  }
  return context
}
