import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

// Campos válidos para filtro (evita SQL injection em colunas)
const ALLOWED_FILTERS = new Set([
  'nome',
  'chapa',
  'cpf',
  'email',
  'cargo',
  'funcao',
  'status_colaborador',
  'regional',
  'departamento',
  'divisao',
  'assessoria',
  'fazenda',
  'diretoria',
  'gabinete',
  'nivel',
])

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    // Paginação e ordenação
    const page = parseInt(searchParams.get('page') || '1', 10)
    const pageSize = Math.min(parseInt(searchParams.get('pageSize') || '20', 10), 200)
    const offset = (page - 1) * pageSize

    const sortBy = searchParams.get('sortBy') || 'nome'
    const sortDir = (searchParams.get('sortDir') || 'asc').toLowerCase() === 'desc' ? 'DESC' : 'ASC'

    // Filtros dinâmicos (nome, regional, etc.)
    const whereClauses: string[] = []
    const params: unknown[] = []

    for (const [key, value] of searchParams.entries()) {
      if (key === 'page' || key === 'pageSize' || key === 'sortBy' || key === 'sortDir') continue
      if (!value) continue
      if (ALLOWED_FILTERS.has(key)) {
        whereClauses.push(`\`${key}\` LIKE ?`)
        params.push(`%${value}%`)
      }
    }

    const whereSQL = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : ''

    // Valida sortBy
    const safeSortBy = ALLOWED_FILTERS.has(sortBy) || sortBy === 'id' ? sortBy : 'nome'

    // Query principal
    // Garante números inteiros e limites razoáveis antes de interpolar
    const safeOffset = Math.max(0, Number.isFinite(offset) ? offset : 0)
    const safePageSize = Math.min(Math.max(1, Number.isFinite(pageSize) ? pageSize : 20), 200)

    const sql = `
      SELECT 
        id, chapa, nome, cpf, email, cargo, funcao, data_admissao, data_demissao,
        chefe, chefe_substituto, status_colaborador, regional, departamento,
        divisao, assessoria, fazenda, diretoria, gabinete, nivel
      FROM vw_colaboradores_completos
      ${whereSQL}
      ORDER BY \`${safeSortBy}\` ${sortDir}
      LIMIT ${safeOffset}, ${safePageSize}
    `

    const countSql = `
      SELECT COUNT(*) as total
      FROM vw_colaboradores_completos
      ${whereSQL}
    `

    // Executa em paralelo
    const [rows, countRows] = await Promise.all([
      query(sql, params) as Promise<any[]>,
      query(countSql, params) as Promise<any[]>,
    ])

    const total = countRows?.[0]?.total || 0

    return NextResponse.json({
      data: rows,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    })
  } catch (error: any) {
    console.error('Erro na API /api/view:', error)
    return NextResponse.json({ error: 'Erro ao buscar colaboradores' }, { status: 500 })
  }
}
