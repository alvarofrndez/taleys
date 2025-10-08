import db from "../connection"

const indexs = [
  {table: 'users', column: 'email', index_name: 'idx_users_email'},
  {table: 'users', column: 'role_id', index_name: 'idx_users_role_id'},
  {table: 'users_auth_providers', column: 'user_id', index_name: 'idx_users_auth_providers_user_id'},
  {table: 'users_auth_providers', column: 'provider', index_name: 'idx_users_auth_providers_provider'},
  {table: 'users_auth_providers', column: 'provider_id', index_name: 'idx_users_auth_providers_provider_id'},
  {table: 'security', column: 'user_id', index_name: 'idx_security_user_id'},
]

async function createIndexs() {
  for (const { table, column, index_name } of indexs) {
    const result = await db.query(
        `SELECT COUNT(1) as count 
        FROM information_schema.statistics 
        WHERE table_schema = DATABASE() 
            AND table_name = ? 
            AND index_name = ?`,
        [table, index_name]
    );

    const rows = result[0] as any[];

    if (rows[0].count === 0) {
      await db.query(`CREATE INDEX ${index_name} ON ${table} (${column})`)
      console.log(`Índice creado: ${index_name} en ${table}(${column})`)
    }
  }
}

const executeCreateIndexs = async () => {
  await createIndexs().catch((err) => {
    console.error('Error al crear índices:', err)
    process.exit(1)
  })
}

export default executeCreateIndexs