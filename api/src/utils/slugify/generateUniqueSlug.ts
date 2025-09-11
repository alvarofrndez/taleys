import { getSlugFromText } from './getSlugFromText'

/**
 * Genera un slug único basado en el texto proporcionado
 * Si el slug ya existe, añade un sufijo incremental hasta encontrar uno único
 * 
 * @param text - El texto original para generar el slug
 * @param checkSlugExists - Función que verifica si un slug ya existe
 * @returns Un slug único
 */
export const generateUniqueSlug = async (
    text: string, 
    checkSlugExists: (slug: string) => Promise<boolean>
): Promise<string> => {
    let baseSlug = getSlugFromText(text)
    let slug = baseSlug
    let counter = 1

    while (await checkSlugExists(slug)) {
        slug = `${baseSlug}-${counter}`
        counter++
    }

    return slug
}
