import { IProjectMember } from './projectMember.interface'
import db from '@/database/connection'
import { env } from '@/config/config_env'

export const projectMemberModel = {
    getAllUserProjects: async (user_id: number) => {
        /**
         * Obtiene todos los proyectos a los que un usuario está asociado.
         * 
         * Pasos:
         * 1. Ejecuta una consulta SQL que selecciona todas las filas de la tabla de miembros de proyectos (`DB_TABLE_PROJECT_MEMBERS`),
         *    donde el `user_id` coincide con el proporcionado.
         * 2. Devuelve los proyectos (en forma de filas) asociados a ese `user_id` desde la base de datos.
         * 
         * @param {number} user_id - ID del usuario cuyo proyectos queremos obtener.
         * 
         * @returns {Promise<IProjectMember[]>} - Lista de proyectos en los que el usuario está asociado.
         */
        const result = await db.query(
            `SELECT * FROM ${env.DB_TABLE_PROJECT_MEMBERS} WHERE user_id = $1`,
            [user_id]
        )
        
        return result.rows
    },

    getAllByProject: async (project_id: number) => {
        /**
         * Obtiene todos los miembros de un proyecto
         * 
         * Pasos:
         * 1. Ejecuta una consulta SQL que selecciona todas las filas de la tabla de miembros de proyectos (`DB_TABLE_PROJECT_MEMBERS`),
         *    donde el `project_id` coincide con el proporcionado.
         * 2. Devuelve los miembros (en forma de filas) asociados a ese `project_id` desde la base de datos.
         * 
         * @param {number} project_id - ID del proyecto.
         * 
         * @returns {Promise<IProjectMember[]>} - Lista de los miembros del proyecto.
         */
        const result = await db.query(
            `SELECT * FROM ${env.DB_TABLE_PROJECT_MEMBERS} WHERE project_id = $1`,
            [project_id]
        )
        
        return result.rows
    },

    create: async (project_id: number, data: IProjectMember) => {
        /**
         * Crea una relación de miembro entre un usuario y un proyecto.
         * 
         * Pasos:
         * 1. Ejecuta una consulta SQL que inserta una nueva fila en la tabla de miembros de proyectos (`DB_TABLE_PROJECT_MEMBERS`),
         *    usando el `project_id` y `user_id` proporcionados.
         * 2. Devuelve el registro insertado utilizando `RETURNING *` para obtener todos los campos de la fila recién creada.
         * 
         * @param {number} project_id - ID del proyecto al que se va a añadir el miembro.
         * @param {IProjectMember} data - Datos del miembro que se va a asociar al proyecto, principalmente el `user_id`.
         * 
         * @returns {Promise<IProjectMember>} - El miembro del proyecto recién creado.
         */
        const result = await db.query(
            `
            INSERT INTO ${env.DB_TABLE_PROJECT_MEMBERS} 
                (project_id, user_id)
            VALUES 
                ($1, $2)
            RETURNING *
            `,
            [project_id, data.user_id]
        )

        return result.rows[0]
    },

    deleteAllByProject: async (project_id: number) => {
        /**
         * Elimina todas las relaciones de miembros de un proyecto específico.
         * 
         * Pasos:
         * 1. Ejecuta una consulta SQL que elimina todas las filas de la tabla de miembros de proyectos (`DB_TABLE_PROJECT_MEMBERS`)
         *    donde el `project_id` coincide con el proporcionado.
         * 2. Devuelve el número de filas afectadas por la eliminación.
         * 
         * @param {number} project_id - ID del proyecto cuyos miembros se van a eliminar.
         * 
         * @returns {Promise<number>} - El número de relaciones eliminadas.
         */
        const result = await db.query(
            `DELETE FROM ${env.DB_TABLE_PROJECT_MEMBERS} WHERE project_id = $1`,
            [project_id]
          )
          
        return result.rowCount
    },

    delete: async (id: number) => {
        /**
         * Elimina a um miebro del proyecto.
         * 
         * Pasos:
         * 1. Ejecuta una consulta SQL que elimina la fila de la tabla (`DB_TABLE_PROJECT_MEMBERS`)
         *    donde el `id` coincide con el proporcionado.
         * 2. Devuelve el número de filas afectadas por la eliminación.
         * 
         * @param {number} id - ID ddel miembro.
         * 
         * @returns {Promise<number>} - El número de relaciones eliminadas.
         */
        const result = await db.query(
            `DELETE FROM ${env.DB_TABLE_PROJECT_MEMBERS} WHERE id = $1`,
            [id]
          )
          
        return result.rowCount
    }
}