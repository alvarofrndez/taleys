import fs from 'fs'
import path from 'path'
import db from '../connection'
import executeCreateIndexs from './createIndexs'

const files_not_to_execute = [
  // 'runMigrations.ts',
  'createIndexs.ts'
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

async function runMigrations() {
  const files = fs.readdirSync(migrations_dir).sort()

  console.log('corriendo migraciones...')
  for (const file of files) {
    if(!files_not_to_execute.includes(file)){
        const file_path = path.join(migrations_dir, file)
        const sql = fs.readFileSync(file_path, 'utf8')
    
        console.log(`ejecutando ${file}...`)
        try {
          await db.query(sql)
          console.log(`${file} ejecutado correctamente.`)
        } catch (error) {
          console.error(`error al ejecutar ${file}:`, error)
        }
    }
  }

  await executeCreateIndexs()

  console.log('migraciones completadas.')
  await db.end()
}

runMigrations().catch((error) => {
  console.error('migraciones fallidas:', error)
  process.exit(1)
})