"use client"

import { useEffect, useMemo, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Filter } from 'lucide-react'
import AppHeader from '@/components/AppHeader'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'


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

  // Contagem de filtros ativos para exibir no "chip" (X/Y)
  const { activeCount, totalCount } = useMemo(() => {
    const entries = Object.entries(filters)
    const active = entries.reduce((acc, [_, v]) => (String(v).trim() ? acc + 1 : acc), 0)
    return { activeCount: active, totalCount: entries.length }
  }, [filters])

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
            <div className="w-full overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
              <Table>
                <TableHeader className="bg-[#025C3E] [&_tr]:border-[#025C3E] [&_th]:text-white [&_th]:font-semibold">
                  <TableRow className="hover:bg-transparent">
                    <TableHead>ID</TableHead>
                    <TableHead>Chapa</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>CPF</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Cargo</TableHead>
                    <TableHead>Função</TableHead>
                    <TableHead>Data Admissão</TableHead>
                    <TableHead>Data Demissão</TableHead>
                    <TableHead>Chefe</TableHead>
                    <TableHead>Chefe Substituto</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Regional</TableHead>
                    <TableHead>Departamento</TableHead>
                    <TableHead>Nível</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={15}>Carregando...</TableCell>
                    </TableRow>
                  ) : data.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={15}>Nenhum resultado</TableCell>
                    </TableRow>
                  ) : (
                    data.map((c) => (
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
                        <TableCell className="whitespace-nowrap">{formatDate(c.data_demissao)}</TableCell>
                        <TableCell>{display(c.chefe)}</TableCell>
                        <TableCell>{display(c.chefe_substituto)}</TableCell>
                        <TableCell>
                          <StatusBadge status={c.status_colaborador ?? ''} />
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
              <Button
                variant="outline"
                disabled={page <= 1 || loading}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Anterior
              </Button>
              <span className="text-sm text-slate-600">
                Página {page} de {totalPages}
              </span>
              <Button
                variant="outline"
                disabled={page >= totalPages || loading}
                onClick={() => setPage((p) => p + 1)}
              >
                Próxima
              </Button>
            </div>
          </CardContent>
        </Card>
        {/* Details Modal */}
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setSelected(null) }}>
          <DialogContent className="max-w-2xl">
            <DialogHeader className="bg-[#025C3E] text-white -m-6 mb-4 p-6 rounded-t-lg">
              <DialogTitle className="flex flex-col text-white">
                <span className="text-sm font-medium text-slate-100">Chapa {selected?.chapa}</span>
                <span className="text-xl font-semibold text-white">{selected?.nome}</span>
              </DialogTitle>
              <DialogDescription className="text-slate-100">
                Informações detalhadas do colaborador
              </DialogDescription>
            </DialogHeader>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InfoItem label="ID" value={selected?.id} />
                <InfoItem label="Chapa" value={selected?.chapa} />
                <InfoItem label="Nome" value={selected?.nome} />
              <InfoItem label="CPF" value={selected?.cpf} />
              <InfoItem label="Email" value={selected?.email} />
              <InfoItem label="Cargo" value={selected?.cargo} />
              <InfoItem label="Função" value={selected?.funcao} />
              <InfoItem label="Data Admissão" value={formatDate(selected?.data_admissao)} />
              <InfoItem label="Data Demissão" value={formatDate(selected?.data_demissao)} />
              <InfoItem label="Chefe" value={selected?.chefe} />
              <InfoItem label="Chefe Substituto" value={selected?.chefe_substituto} />
              <InfoItem label="Regional" value={selected?.regional} />
              <InfoItem label="Departamento" value={selected?.departamento} />
              <InfoItem label="Divisão" value={selected?.divisao} />
              <InfoItem label="Assessoria" value={selected?.assessoria} />
              <InfoItem label="Fazenda" value={selected?.fazenda} />
              <InfoItem label="Diretoria" value={selected?.diretoria} />
              <InfoItem label="Gabinete" value={selected?.gabinete} />
              <InfoItem label="Nível" value={selected?.nivel} />
              <div className="border rounded-md p-3">
                <div className="text-xs uppercase tracking-wide text-slate-500">Status</div>
                <div className="mt-1">
                  <StatusBadge status={selected?.status_colaborador ?? ''} />
                </div>
              </div>
            </div>
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

function StatusBadge({ status }: { status: string }) {
  const key = normalizeStatus(status || '')
  let cls = 'bg-slate-100 text-slate-800 border-slate-200'
  let label = status || '—'
  switch (key) {
    case 'ativo':
      cls = 'bg-green-100 text-green-800 border-green-200'
      break
    case 'inativo':
      cls = 'bg-red-100 text-red-800 border-red-200'
      break
    case 'ferias':
      cls = 'bg-yellow-100 text-yellow-800 border-yellow-200'
      break
    case 'ar':
      cls = 'bg-blue-100 text-blue-800 border-blue-200'
      break
    case 'licenca':
      cls = 'bg-orange-100 text-orange-800 border-orange-200'
      break
    case 'afastamento':
      cls = 'bg-purple-100 text-purple-800 border-purple-200'
      break
  }
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