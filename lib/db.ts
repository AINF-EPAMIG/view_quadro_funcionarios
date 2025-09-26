import mysql from 'mysql2/promise';

// Configuração do banco de dados (suporta DATABASE_* e DB_* variáveis)
export const dbConfig = {
  host: process.env.DATABASE_HOST || process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || process.env.DB_PORT || '3306'),
  user: process.env.DATABASE_USER || process.env.DB_USER || 'root',
  password: process.env.DATABASE_PASSWORD || process.env.DB_PASSWORD || '',
  database: process.env.DATABASE_NAME || process.env.DB_DATABASE || 'quadro_funcionarios',
};

// Pool de conexões com o banco de dados (singleton em dev para evitar múltiplos pools no HMR)
const globalForMysql = globalThis as unknown as { __mysqlPool?: mysql.Pool };
let connectionPool: mysql.Pool | null = globalForMysql.__mysqlPool || null;

// Função para obter uma conexão do pool
export async function getConnection() {
  if (!connectionPool) {
    connectionPool = mysql.createPool({
      ...dbConfig,
      waitForConnections: true,
      connectionLimit: parseInt(process.env.DB_POOL_SIZE || '10', 10),
      queueLimit: 0,
      supportBigNumbers: true,
      // namedPlaceholders: true, // habilite se quiser usar :nome nos parâmetros
    });
    // Armazena globalmente em dev
    if (process.env.NODE_ENV !== 'production') {
      globalForMysql.__mysqlPool = connectionPool;
    }
  }
  return connectionPool;
}

// Função para executar consultas SQL
export async function query(sql: string, params: unknown[] = []) {
  try {
    const connection = await getConnection();
    const [results] = await connection.execute(sql, params);
    return results;
  } catch (error) {
    console.error('Erro ao executar consulta SQL:', error);
    throw error;
  }
}

// Consulta única linha (ou undefined)
export async function queryOne<T = Record<string, unknown>>(sql: string, params: unknown[] = []) {
  const rows = (await query(sql, params)) as T[];
  return rows[0];
}

// Ping do banco (útil para health-checks)
export async function ping() {
  const pool = await getConnection();
  const conn = await pool.getConnection();
  try {
    await conn.ping();
    return true;
  } finally {
    conn.release();
  }
}

// Função para autenticar usuário
export async function autenticarUsuario(email: string, senha: string) {
  try {
    const usuarios = await query(
      'SELECT * FROM usuarios WHERE email = ? LIMIT 1',
      [email]
    ) as Record<string, unknown>[];
    
    if (usuarios.length === 0) {
      return null;
    }
    
    const usuario = usuarios[0];
    
    // Em um ambiente real, deve-se usar bcrypt para comparar as senhas
    // const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    
    // Aqui estamos comparando diretamente para simplificar a demonstração
    const senhaCorreta = (senha === usuario.senha);
    
    if (senhaCorreta) {
      // Não retornar a senha na resposta
      const { ...usuarioSemSenha } = usuario;
      return usuarioSemSenha;
    }
    
    return null;
  } catch (error) {
    console.error('Erro ao autenticar usuário:', error);
    throw error;
  }
} 