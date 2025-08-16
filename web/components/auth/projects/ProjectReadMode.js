'use client'

import styles from '@/assets/auth/projects/read-mode.module.scss'

export default function ProjectReadMode({ project }) {
  return (
    <section >
      <h2>Modo Lectura</h2>
      {project.books?.length > 0 ? (
        project.books.map((book) => (
          <div key={book.id} >
            <h3>{book.title}</h3>
            <div dangerouslySetInnerHTML={{ __html: book.content }} />
          </div>
        ))
      ) : (
        <p>No hay libros disponibles.</p>
      )}
    </section>
  )
}
