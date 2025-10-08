import CustomError from '@/modules/customerror/CustomError'
import fs from 'fs'
import path from 'path'

const loadTempate = (name: string, data: object) => {
    const TEMPLATE_PATH = path.join(__dirname, `../../assets/templates/${name}.html`)

    console.log(TEMPLATE_PATH)

    if (!fs.existsSync(TEMPLATE_PATH)) throw new CustomError(`Error al cargar el contenido de la plantilla`, 404)

    let html = fs.readFileSync(TEMPLATE_PATH, 'utf8')

    for (const [key, value] of Object.entries(data)) {
        const regex = new RegExp(`{{${key}}}`, 'g')
        html = html.replace(regex, value)
    }

    return html
}

export default loadTempate