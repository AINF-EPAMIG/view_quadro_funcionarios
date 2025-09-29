"use client"

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Filter, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'
import AppHeader from '@/components/AppHeader'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'


type Colab = {
  id: number
  chapa: string | null
  nome: string | null
  cpf: string | null
  email: string | null
  cargo: string | null
  funcao: string | null
  data_admissao: string | null
  data_demissao: string | null
  chefe: string | null
  chefe_substituto: string | null
  status_colaborador: string | null
  regional: string | null
  departamento: string | null
  divisao: string | null
  assessoria: string | null
  fazenda: string | null
  diretoria: string | null
  gabinete: string | null
  nivel: string | null
}

export default function ViewPage() {
  return (
    <ProtectedRoute>
      <ViewContent />
    </ProtectedRoute>
  )
}

function ViewContent() {
  const [data, setData] = useState<Colab[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selected, setSelected] = useState<Colab | null>(null)
  const [open, setOpen] = useState(false)
  const [showEmpty, setShowEmpty] = useState(false)
  const [filters, setFilters] = useState({
    chapa: '',
    nome: '',
    email: '',
    cargo: '',
    funcao: '',
    regional: '',
    departamento: '',
    divisao: '',
    status_colaborador: '',
  })

  type SortKey = 'id' | 'chapa' | 'nome' | 'cpf' | 'email' | 'cargo' | 'funcao' | 'data_admissao' | 'data_demissao' | 'chefe' | 'chefe_substituto' | 'status_colaborador' | 'regional' | 'departamento' | 'nivel'
  const [sort, setSort] = useState<{ key: SortKey; dir: 'asc' | 'desc' } | null>({ key: 'id', dir: 'asc' })

  const toggleSort = (key: SortKey) => {
    setSort((prev) => {
      if (!prev || prev.key !== key) return { key, dir: 'desc' } // primeiro clique: maior -> menor
      return { key, dir: prev.dir === 'desc' ? 'asc' : 'desc' }
    })
    setPage(1)
  }

  const getSortValue = useCallback((item: Colab, key: SortKey): string | number | null => {
    switch (key) {
      case 'id':
        return item.id
      case 'data_admissao':
        return item.data_admissao ? new Date(item.data_admissao).getTime() : null
      case 'data_demissao':
        return item.data_demissao ? new Date(item.data_demissao).getTime() : null
      default: {
        const v = item[key as keyof Colab]
        if (v === undefined || v === null) return null
        if (typeof v === 'number') return v
        return String(v).trim().toLowerCase() || null
      }
    }
  }, [])

  const sortedData = useMemo(() => {
    if (!sort) return data
    const arr = [...data]
    arr.sort((a, b) => {
      const av = getSortValue(a, sort.key)
      const bv = getSortValue(b, sort.key)
      // Nulls sempre por último
      const aNull = av === null || av === undefined || av === ''
      const bNull = bv === null || bv === undefined || bv === ''
      if (aNull && !bNull) return 1
      if (!aNull && bNull) return -1
      if (aNull && bNull) return 0
      // Comparação numérica vs string
      if (typeof av === 'number' && typeof bv === 'number') {
        return av - bv
      }
      const as = String(av)
      const bs = String(bv)
      if (as < bs) return -1
      if (as > bs) return 1
      return 0
    })
    if (sort.dir === 'desc') arr.reverse()
    return arr
  }, [data, sort, getSortValue])

  const renderSortIcon = (key: SortKey, s: { key: SortKey; dir: 'asc' | 'desc' } | null) => {
    if (!s || s.key !== key) return <ChevronsUpDown className="h-3.5 w-3.5 opacity-80" aria-hidden="true" />
    return s.dir === 'asc' ? (
      <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
    ) : (
      <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
    )
  }

  // (removido: contagem de filtros não utilizada)

  const queryString = useMemo(() => {
    const params = new URLSearchParams()
    params.set('page', String(page))
    params.set('pageSize', '20')
    if (filters.chapa) params.set('chapa', filters.chapa)
    if (filters.nome) params.set('nome', filters.nome)
    if (filters.email) params.set('email', filters.email)
    if (filters.cargo) params.set('cargo', filters.cargo)
    if (filters.funcao) params.set('funcao', filters.funcao)
    if (filters.regional) params.set('regional', filters.regional)
    if (filters.departamento) params.set('departamento', filters.departamento)
    if (filters.divisao) params.set('divisao', filters.divisao)
    if (filters.status_colaborador) params.set('status_colaborador', filters.status_colaborador)
    return params.toString()
  }, [page, filters])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/view?${queryString}`)
        const json = await res.json()
        setData(json.data || [])
        setTotalPages(json.pagination?.totalPages || 1)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [queryString])

  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader />
      <div className="w-full p-4">
        <Card className="w-full">
          <CardHeader>
          </CardHeader>
          <CardContent>
            <Collapsible>
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Quadro Funcionários</h1>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-slate-700">Filtros:</p>
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 rounded-full border-[#025C3E] text-[#025C3E] hover:bg-[#025C3E]/10 hover:text-[#025C3E]"
                    >
                      <Filter className="h-4 w-4 mr-1" />
                      <span className="text-xs">Clique para filtrar</span>
                    </Button>
                  </CollapsibleTrigger>
                </div>
              </div>
              <CollapsibleContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                  <Input
                    placeholder="Filtrar por chapa"
                    value={filters.chapa}
                    onChange={(e) => setFilters((f) => ({ ...f, chapa: e.target.value }))}
                  />
                  <Input
                    placeholder="Filtrar por nome"
                    value={filters.nome}
                    onChange={(e) => setFilters((f) => ({ ...f, nome: e.target.value }))}
                  />
                  <Input
                    placeholder="Filtrar por email"
                    value={filters.email}
                    onChange={(e) => setFilters((f) => ({ ...f, email: e.target.value }))}
                  />
                  <Input
                    placeholder="Filtrar por cargo"
                    value={filters.cargo}
                    onChange={(e) => setFilters((f) => ({ ...f, cargo: e.target.value }))}
                  />
                  <Input
                    placeholder="Filtrar por função"
                    value={filters.funcao}
                    onChange={(e) => setFilters((f) => ({ ...f, funcao: e.target.value }))}
                  />
                  <Input
                    placeholder="Filtrar por regional"
                    value={filters.regional}
                    onChange={(e) => setFilters((f) => ({ ...f, regional: e.target.value }))}
                  />
                  <Input
                    placeholder="Filtrar por departamento"
                    value={filters.departamento}
                    onChange={(e) => setFilters((f) => ({ ...f, departamento: e.target.value }))}
                  />
                  <Input
                    placeholder="Filtrar por divisão"
                    value={filters.divisao}
                    onChange={(e) => setFilters((f) => ({ ...f, divisao: e.target.value }))}
                  />
                  <Input
                    placeholder="Filtrar por status"
                    value={filters.status_colaborador}
                    onChange={(e) => setFilters((f) => ({ ...f, status_colaborador: e.target.value }))}
                  />
                </div>

                <div className="flex gap-2 mb-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setFilters({
                        chapa: '',
                        nome: '',
                        email: '',
                        cargo: '',
                        funcao: '',
                        regional: '',
                        departamento: '',
                        divisao: '',
                        status_colaborador: '',
                      })
                      setPage(1)
                    }}
                  >
                    Limpar filtros
                  </Button>
                </div>
              </CollapsibleContent>
            </Collapsible>

            <div className="flex items-center justify-end text-xs text-slate-600 mb-2">
              {loading ? null : (
                <span>
                  {data.length > 0 ? `Exibindo ${data.length} itens nesta página` : 'Nenhum item' }
                </span>
              )}
            </div>
            <div className="w-full overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm text-sm">
              <Table>
                <TableHeader className="bg-[#025C3E] [&_tr]:border-[#025C3E] [&_th]:text-white [&_th]:font-semibold">
                  <TableRow className="hover:bg-transparent">
                    <TableHead onClick={() => toggleSort('id')} className="cursor-pointer select-none" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleSort('id') } }}>
                      <div className="flex items-center gap-1">ID {renderSortIcon('id', sort)}</div>
                    </TableHead>
                    <TableHead onClick={() => toggleSort('chapa')} className="cursor-pointer select-none" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleSort('chapa') } }}>
                      <div className="flex items-center gap-1">Chapa {renderSortIcon('chapa', sort)}</div>
                    </TableHead>
                    <TableHead onClick={() => toggleSort('nome')} className="cursor-pointer select-none" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleSort('nome') } }}>
                      <div className="flex items-center gap-1">Nome {renderSortIcon('nome', sort)}</div>
                    </TableHead>
                    <TableHead onClick={() => toggleSort('cpf')} className="cursor-pointer select-none" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleSort('cpf') } }}>
                      <div className="flex items-center gap-1">CPF {renderSortIcon('cpf', sort)}</div>
                    </TableHead>
                    <TableHead onClick={() => toggleSort('email')} className="cursor-pointer select-none" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleSort('email') } }}>
                      <div className="flex items-center gap-1">Email {renderSortIcon('email', sort)}</div>
                    </TableHead>
                    <TableHead onClick={() => toggleSort('cargo')} className="cursor-pointer select-none" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleSort('cargo') } }}>
                      <div className="flex items-center gap-1">Cargo {renderSortIcon('cargo', sort)}</div>
                    </TableHead>
                    <TableHead onClick={() => toggleSort('funcao')} className="cursor-pointer select-none" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleSort('funcao') } }}>
                      <div className="flex items-center gap-1">Função {renderSortIcon('funcao', sort)}</div>
                    </TableHead>
                    <TableHead onClick={() => toggleSort('data_admissao')} className="cursor-pointer select-none" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleSort('data_admissao') } }}>
                      <div className="flex items-center gap-1">Data Admissão {renderSortIcon('data_admissao', sort)}</div>
                    </TableHead>
                    <TableHead onClick={() => toggleSort('chefe')} className="cursor-pointer select-none" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleSort('chefe') } }}>
                      <div className="flex items-center gap-1">Chefe {renderSortIcon('chefe', sort)}</div>
                    </TableHead>
                    <TableHead onClick={() => toggleSort('chefe_substituto')} className="cursor-pointer select-none" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleSort('chefe_substituto') } }}>
                      <div className="flex items-center gap-1">Chefe Substituto {renderSortIcon('chefe_substituto', sort)}</div>
                    </TableHead>
                    <TableHead onClick={() => toggleSort('status_colaborador')} className="cursor-pointer select-none" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleSort('status_colaborador') } }}>
                      <div className="flex items-center gap-1">Status {renderSortIcon('status_colaborador', sort)}</div>
                    </TableHead>
                    <TableHead onClick={() => toggleSort('regional')} className="cursor-pointer select-none" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleSort('regional') } }}>
                      <div className="flex items-center gap-1">Regional {renderSortIcon('regional', sort)}</div>
                    </TableHead>
                    <TableHead onClick={() => toggleSort('departamento')} className="cursor-pointer select-none" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleSort('departamento') } }}>
                      <div className="flex items-center gap-1">Departamento {renderSortIcon('departamento', sort)}</div>
                    </TableHead>
                    <TableHead onClick={() => toggleSort('nivel')} className="cursor-pointer select-none" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleSort('nivel') } }}>
                      <div className="flex items-center gap-1">Nível {renderSortIcon('nivel', sort)}</div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={14}>Carregando...</TableCell>
                    </TableRow>
                  ) : data.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={14}>Nenhum resultado</TableCell>
                    </TableRow>
                  ) : (
                    sortedData.map((c) => (
                      <TableRow
                        key={c.id}
                        className="cursor-pointer hover:bg-slate-50 focus:bg-slate-100"
                        tabIndex={0}
                        role="button"
                        onClick={() => {
                          setSelected(c)
                          setOpen(true)
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            setSelected(c)
                            setOpen(true)
                          }
                        }}
                      >
                        <TableCell>{c.id}</TableCell>
                        <TableCell>{display(c.chapa)}</TableCell>
                        <TableCell>{display(c.nome)}</TableCell>
                        <TableCell>{display(c.cpf)}</TableCell>
                        <TableCell className="min-w-[200px]">{display(c.email)}</TableCell>
                        <TableCell>{display(c.cargo)}</TableCell>
                        <TableCell>{display(c.funcao)}</TableCell>
                        <TableCell className="whitespace-nowrap">{formatDate(c.data_admissao)}</TableCell>
                        <TableCell>{display(c.chefe)}</TableCell>
                        <TableCell>{display(c.chefe_substituto)}</TableCell>
                        <TableCell>
                          <StatusBadge status={c.status_colaborador ?? ''} displayLabel={tableStatusLabelOverride(c.status_colaborador)} />
                        </TableCell>
                        <TableCell>{display(c.regional)}</TableCell>
                        <TableCell>{display(c.departamento)}</TableCell>
                        <TableCell>{display(c.nivel)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-between mt-4">
              <span className="text-[13px] text-slate-600">Página {page} de {totalPages}</span>
              <div className="flex items-center">
                <div className="flex items-center gap-1 bg-slate-100 border border-slate-200 rounded-full px-2 py-1 shadow-sm">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 rounded-full text-[#025C3E] hover:bg-[#025C3E]/10"
                    aria-label="Primeira página"
                    disabled={page <= 1 || loading}
                    onClick={() => setPage(1)}
                  >
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 rounded-full text-[#025C3E] hover:bg-[#025C3E]/10"
                    aria-label="Página anterior"
                    disabled={page <= 1 || loading}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="px-1">
                    <Select value={String(page)} onValueChange={(v) => setPage(Number(v))}>
                      <SelectTrigger className="h-8 w-[90px] rounded-full bg-white border-slate-200 focus:ring-0">
                        <SelectValue placeholder="Página" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: totalPages }, (_, i) => (
                          <SelectItem key={i} value={String(i + 1)}>
                            {i + 1}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 rounded-full text-[#025C3E] hover:bg-[#025C3E]/10"
                    aria-label="Próxima página"
                    disabled={page >= totalPages || loading}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 rounded-full text-[#025C3E] hover:bg-[#025C3E]/10"
                    aria-label="Última página"
                    disabled={page >= totalPages || loading}
                    onClick={() => setPage(totalPages)}
                  >
                    <ChevronsRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Details Modal */}
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setSelected(null) }}>
          <DialogContent className="w-[calc(100vw-2rem)] sm:max-w-2xl max-h-[80vh] sm:max-h-[85vh] overflow-y-auto">
            <DialogHeader className="bg-[#025C3E] text-white -m-6 mb-4 p-6 rounded-t-lg sticky top-0 z-10 shadow-sm">
              <DialogTitle className="flex flex-col text-white">
                <span className="text-sm font-medium text-slate-100">Chapa {selected?.chapa}</span>
                <span className="text-xl font-semibold text-white">{selected?.nome}</span>
              </DialogTitle>
              <DialogDescription className="text-slate-100">
                Informações detalhadas do colaborador
              </DialogDescription>
            </DialogHeader>
            {(() => {
              type FieldItem = { label: string; raw: string | number | null | undefined; value: string | number | null }
              const fields: FieldItem[] = [
                { label: 'ID', raw: selected?.id, value: selected?.id ?? null },
                { label: 'Chapa', raw: selected?.chapa, value: selected?.chapa ?? null },
                { label: 'Nome', raw: selected?.nome, value: selected?.nome ?? null },
                { label: 'CPF', raw: selected?.cpf, value: selected?.cpf ?? null },
                { label: 'Email', raw: selected?.email, value: selected?.email ?? null },
                { label: 'Cargo', raw: selected?.cargo, value: selected?.cargo ?? null },
                { label: 'Função', raw: selected?.funcao, value: selected?.funcao ?? null },
                { label: 'Data Admissão', raw: selected?.data_admissao, value: formatDate(selected?.data_admissao) },
                { label: 'Data Demissão', raw: selected?.data_demissao, value: formatDate(selected?.data_demissao) },
                { label: 'Chefe', raw: selected?.chefe, value: selected?.chefe ?? null },
                { label: 'Chefe Substituto', raw: selected?.chefe_substituto, value: selected?.chefe_substituto ?? null },
                { label: 'Regional', raw: selected?.regional, value: selected?.regional ?? null },
                { label: 'Departamento', raw: selected?.departamento, value: selected?.departamento ?? null },
                { label: 'Divisão', raw: selected?.divisao, value: selected?.divisao ?? null },
                { label: 'Assessoria', raw: selected?.assessoria, value: selected?.assessoria ?? null },
                { label: 'Fazenda', raw: selected?.fazenda, value: selected?.fazenda ?? null },
                { label: 'Diretoria', raw: selected?.diretoria, value: selected?.diretoria ?? null },
                { label: 'Gabinete', raw: selected?.gabinete, value: selected?.gabinete ?? null },
                { label: 'Nível', raw: selected?.nivel, value: selected?.nivel ?? null },
              ]
              const isEmpty = (v: unknown) => v === undefined || v === null || (typeof v === 'string' && v.trim() === '')
              const visible = fields.filter(f => !isEmpty(f.raw))
              const empty = fields.filter(f => isEmpty(f.raw))
              const statusEmpty = isEmpty(selected?.status_colaborador)

              return (
                <>
                  {/* Campos com valor */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {visible.map((f) => (
                      <InfoItem key={f.label} label={f.label} value={f.value} />
                    ))}
                    {!statusEmpty && (
                      <div className="border rounded-md p-3">
                        <div className="text-xs uppercase tracking-wide text-slate-500">Status</div>
                        <div className="mt-1">
                          <StatusBadge status={selected?.status_colaborador ?? ''} />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Toggle para exibir campos vazios */}
                  {empty.length > 0 || statusEmpty ? (
                    <Collapsible open={showEmpty} onOpenChange={setShowEmpty}>
                      <div className="flex items-center justify-between mt-4 mb-2">
                        <CollapsibleTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-9 rounded-full border-[#025C3E] text-[#025C3E] hover:bg-[#025C3E]/10 hover:text-[#025C3E]"
                          >
                            {showEmpty ? 'Ocultar campos vazios' : `Exibir campos vazios (${empty.length + (statusEmpty ? 1 : 0)})`}
                          </Button>
                        </CollapsibleTrigger>
                      </div>
                      <CollapsibleContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {empty.map((f) => (
                            <InfoItem key={f.label} label={f.label} value={f.value} />
                          ))}
                          {statusEmpty && (
                            <div className="border rounded-md p-3">
                              <div className="text-xs uppercase tracking-wide text-slate-500">Status</div>
                              <div className="mt-1">
                                <StatusBadge status={selected?.status_colaborador ?? ''} />
                              </div>
                            </div>
                          )}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : null}
                </>
              )
            })()}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

// Simple field presenter
function InfoItem({ label, value }: { label: string; value?: string | number | null }) {
  const content =
    value === undefined || value === null || (typeof value === 'string' && value.trim() === '')
      ? '—'
      : String(value)
  return (
    <div className="border rounded-md p-3">
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
      <div className="text-sm text-slate-900 break-words">{content}</div>
    </div>
  )
}

function normalizeStatus(s: string) {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
}

// Map normalized keys to a color family. Treat anything that contains
// 'afastamento' (e.g., 'atestado medico/afastamento') as 'afastamento'.
function getStatusColorKey(key: string) {
  if (key.includes('afastamento')) return 'afastamento' as const
  if (key === 'ativo') return 'ativo' as const
  if (key === 'inativo') return 'inativo' as const
  if (key === 'ferias') return 'ferias' as const
  if (key === 'ar') return 'ar' as const
  if (key === 'licenca') return 'licenca' as const
  return 'default' as const
}

function StatusBadge({ status, displayLabel }: { status: string; displayLabel?: string }) {
  const key = normalizeStatus(status || '')
  const colorKey = getStatusColorKey(key)
  let cls = 'bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200 hover:border-slate-300 transition-colors'
  switch (colorKey) {
    case 'ativo':
      cls = 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200 hover:border-green-300 transition-colors'
      break
    case 'inativo':
      cls = 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200 hover:border-red-300 transition-colors'
      break
    case 'ferias':
      cls = 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200 hover:border-yellow-300 transition-colors'
      break
    case 'ar':
      cls = 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200 hover:border-blue-300 transition-colors'
      break
    case 'licenca':
      cls = 'bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200 hover:border-orange-300 transition-colors'
      break
    case 'afastamento':
      cls = 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200 hover:border-purple-300 transition-colors'
      break
  }
  const label = displayLabel ?? (status || '—')
  return <Badge className={cls}>{label}</Badge>
}

function display(v?: string | null) {
  return v && String(v).trim() ? v : '—'
}

function formatDate(v?: string | null) {
  if (!v) return '—'
  // Expecting ISO or YYYY-MM-DD; display as DD/MM/YYYY
  const d = new Date(v)
  if (isNaN(d.getTime())) return v
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = d.getFullYear()
  return `${dd}/${mm}/${yyyy}`
}

// Display helper: in the table, show 'Afastamento' for
// 'Atestado Médico/Afastamento' while keeping original in the modal.
function tableStatusLabelOverride(status?: string | null) {
  if (!status) return undefined
  const k = normalizeStatus(status)
  if (k.includes('afastamento')) return 'Afastamento'
  return undefined
}