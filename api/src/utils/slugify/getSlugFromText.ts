import slugify from 'slugify'

export const getSlugFromText = (text: string) => {
    /**
     * Convierte un texxto en un slug seguro para URLs
     * @param {string} text - El texto original
     * @returns {string} Slug seguro
    */
   
    return slugify(text, {
        lower: true,   // convierte todo a minúsculas
        strict: true,  // elimina caracteres especiales
        trim: true     // elimina espacios al inicio/fin
    })
}