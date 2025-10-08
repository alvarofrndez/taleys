import fs from 'fs'
import path from 'path'
import db from '../connection'

let files_no_to_execute = [
  'runSeeds.ts',
  // '1000_seed_roles.sql',
]

const getDirname = (importMetaUrl: string) => {
  const url = new URL(importMetaUrl)
  let directory = path.dirname(url.pathname)

  if (directory.startsWith('/')) {
    directory = directory.substring(1)
  }

  return directory
}

const migrations_dir = __dirname

async function runSeeds() {
  if (!fs.existsSync(migrations_dir)) {
    fs.mkdirSync(migrations_dir, { recursive: true })
  }

  console.log('Corriendo seeds...')

  const files = fs.readdirSync(migrations_dir).sort()
  for (const file of files) {
    if (!files_no_to_execute.includes(file)) {
      const file_path = path.join(migrations_dir, file)
      let sql = fs.readFileSync(file_path, 'utf8')

      console.log(`Ejecutando ${file}...`)

      const queries = sql.split(';').map(q => q.trim()).filter(q => q)

      for (const query of queries) {
        try {
          await db.query(query)
        } catch (error) {
          console.error(`Error al ejecutar la consulta: ${query}`)
          console.error(error.message)
        }
      }
      console.log(`${file} ejecutado correctamente.`)
    }
  }

  console.log('Seeds completadas.')
  await db.end()
}

runSeeds().catch((error) => {
  console.error('Seeds fallidas:', error)
  process.exit(1)
})