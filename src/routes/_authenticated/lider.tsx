import { createFileRoute, Link } from "@tanstack/react-router";
import { ThemeToggle } from "@/components/ThemeToggle";
import { 
  ArrowLeft, 
  TrendingUp, 
  AlertTriangle, 
  Users, 
  Plus, 
  Send, 
  Calendar, 
  Building2,
  Search,
  X,
  CheckCircle,
  UserPlus,
  UserCheck,
  MessageSquare,
  Clock
} from "lucide-react";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/_authenticated/lider")({
  component: LiderPage,
});

// ============================================
// INTERFACES E TIPOS
// ============================================

interface Discipulo {
  id: string;
  name: string;
  level: number;
  streak: number;
  alert: string | null;
  progress: number;
  email?: string;
  telefone?: string;
  status: 'ativo' | 'inativo' | 'pendente';
  dataEntrada: string;
}

interface Grupo {
  id: string;
  nome: string;
  membros: string[];
  dataCriacao: string;
  status: 'ativo' | 'inativo';
}

interface Mensagem {
  id: string;
  destinatario: string;
  conteudo: string;
  dataEnvio: string;
  lida: boolean;
}

interface Encontro {
  id: string;
  grupo: string;
  data: string;
  assunto: string;
  status: 'agendado' | 'realizado' | 'cancelado';
}

// ============================================
// DADOS MOCK (SUBSTITUIR PELO SUPABASE/CLOUD)
// ============================================

const mockDiscipulos: Discipulo[] = [
  { 
    id: '1', 
    name: "Lucas F.", 
    level: 3, 
    streak: 9, 
    alert: null, 
    progress: 40,
    email: "lucas@email.com",
    telefone: "(11) 99999-9999",
    status: 'ativo',
    dataEntrada: "2026-01-15"
  },
  { 
    id: '2', 
    name: "Rebeca S.", 
    level: 5, 
    streak: 0, 
    alert: "Streak quebrado há 3 dias", 
    progress: 62,
    email: "rebeca@email.com",
    telefone: "(11) 88888-8888",
    status: 'ativo',
    dataEntrada: "2026-02-01"
  },
  { 
    id: '3', 
    name: "Ana C.", 
    level: 4, 
    streak: 21, 
    alert: null, 
    progress: 88,
    email: "ana@email.com",
    telefone: "(11) 77777-7777",
    status: 'pendente',
    dataEntrada: "2026-03-10"
  },
  { 
    id: '4', 
    name: "Tiago N.", 
    level: 2, 
    streak: 4, 
    alert: "Baixo desempenho em quiz", 
    progress: 15,
    email: "tiago@email.com",
    telefone: "(11) 66666-6666",
    status: 'ativo',
    dataEntrada: "2026-01-20"
  },
];

const mockGrupos: Grupo[] = [
  {
    id: '1',
    nome: 'Grupo Fogo',
    membros: ['1', '2'],
    dataCriacao: '2026-01-10',
    status: 'ativo'
  }
];

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

function LiderPage() {
  // ESTADOS
  const [discipulos, setDiscipulos] = useState<Discipulo[]>(mockDiscipulos);
  const [grupos, setGrupos] = useState<Grupo[]>(mockGrupos);
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [encontros, setEncontros] = useState<Encontro[]>([]);

  // Estados para diálogos
  const [openAddDiscipulo, setOpenAddDiscipulo] = useState(false);
  const [openNovoGrupo, setOpenNovoGrupo] = useState(false);
  const [openMensagem, setOpenMensagem] = useState(false);
  const [openEncontro, setOpenEncontro] = useState(false);
  const [openAddPorID, setOpenAddPorID] = useState(false);

  // Estados para formulários
  const [searchTerm, setSearchTerm] = useState('');
  const [discipuloSelecionado, setDiscipuloSelecionado] = useState<Discipulo | null>(null);
  const [novoGrupoNome, setNovoGrupoNome] = useState('');
  const [mensagemTexto, setMensagemTexto] = useState('');
  const [encontroAssunto, setEncontroAssunto] = useState('');
  const [encontroData, setEncontroData] = useState('');
  const [idBusca, setIdBusca] = useState('');
  const [discipuloEncontrado, setDiscipuloEncontrado] = useState<Discipulo | null>(null);
  const [feedback, setFeedback] = useState<{ show: boolean; message: string; type: 'success' | 'error' | 'warning' }>({
    show: false,
    message: '',
    type: 'success'
  });

  // ============================================
  // FUNÇÕES - ADICIONAR DISCÍPULO
  // ============================================

  const handleAdicionarDiscipulo = () => {
    setOpenAddDiscipulo(true);
    setSearchTerm('');
    setDiscipuloSelecionado(null);
  };

  const handleBuscarDiscipulos = () => {
    if (!searchTerm.trim()) return discipulos;
    
    return discipulos.filter(d => 
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.id.includes(searchTerm)
    );
  };

  const handleSelecionarDiscipulo = (discipulo: Discipulo) => {
    setDiscipuloSelecionado(discipulo);
  };

  const handleConfirmarAdicionar = () => {
    if (!discipuloSelecionado) {
      showFeedback('Selecione um discípulo para adicionar', 'warning');
      return;
    }

    // Atualiza o status do discípulo
    setDiscipulos(prev => prev.map(d => 
      d.id === discipuloSelecionado.id 
        ? { ...d, status: 'ativo' as const, dataEntrada: new Date().toISOString().split('T')[0] }
        : d
    ));

    showFeedback(`Discípulo ${discipuloSelecionado.name} adicionado com sucesso!`, 'success');
    setOpenAddDiscipulo(false);
    setDiscipuloSelecionado(null);
    setSearchTerm('');
  };

  // ============================================
  // FUNÇÕES - ADICIONAR POR ID
  // ============================================

  const handleBuscarPorID = () => {
    if (!idBusca.trim()) {
      showFeedback('Digite um ID válido', 'warning');
      return;
    }

    const encontrado = discipulos.find(d => d.id === idBusca);
    
    if (encontrado) {
      setDiscipuloEncontrado(encontrado);
      showFeedback('Discípulo encontrado!', 'success');
    } else {
      setDiscipuloEncontrado(null);
      showFeedback('Discípulo não encontrado com este ID', 'error');
    }
  };

  const handleConfirmarAdicionarPorID = () => {
    if (!discipuloEncontrado) {
      showFeedback('Discípulo não encontrado', 'warning');
      return;
    }

    setDiscipulos(prev => prev.map(d => 
      d.id === discipuloEncontrado.id 
        ? { ...d, status: 'ativo' as const, dataEntrada: new Date().toISOString().split('T')[0] }
        : d
    ));

    showFeedback(`Discípulo ${discipuloEncontrado.name} adicionado com sucesso!`, 'success');
    setOpenAddPorID(false);
    setDiscipuloEncontrado(null);
    setIdBusca('');
  };

  // ============================================
  // FUNÇÕES - NOVO GRUPO
  // ============================================

  const handleCriarGrupo = () => {
    if (!novoGrupoNome.trim()) {
      showFeedback('Digite um nome para o grupo', 'warning');
      return;
    }

    const novoGrupo: Grupo = {
      id: `grupo_${Date.now()}`,
      nome: novoGrupoNome,
      membros: [],
      dataCriacao: new Date().toISOString().split('T')[0],
      status: 'ativo'
    };

    setGrupos(prev => [...prev, novoGrupo]);
    showFeedback(`Grupo "${novoGrupoNome}" criado com sucesso!`, 'success');
    setOpenNovoGrupo(false);
    setNovoGrupoNome('');
  };

  // ============================================
  // FUNÇÕES - MENSAGEM
  // ============================================

  const handleEnviarMensagem = () => {
    if (!mensagemTexto.trim()) {
      showFeedback('Digite uma mensagem', 'warning');
      return;
    }

    const discipulosAtivos = discipulos.filter(d => d.status === 'ativo');
    
    const novasMensagens: Mensagem[] = discipulosAtivos.map(d => ({
      id: `msg_${Date.now()}_${d.id}`,
      destinatario: d.name,
      conteudo: mensagemTexto,
      dataEnvio: new Date().toISOString(),
      lida: false
    }));

    setMensagens(prev => [...prev, ...novasMensagens]);
    showFeedback(`Mensagem enviada para ${discipulosAtivos.length} discípulos!`, 'success');
    setOpenMensagem(false);
    setMensagemTexto('');
  };

  // ============================================
  // FUNÇÕES - ENCONTRO
  // ============================================

  const handleRegistrarEncontro = () => {
    if (!encontroAssunto.trim() || !encontroData) {
      showFeedback('Preencha todos os campos', 'warning');
      return;
    }

    const grupoAtivo = grupos.find(g => g.status === 'ativo');
    
    if (!grupoAtivo) {
      showFeedback('Nenhum grupo ativo encontrado', 'warning');
      return;
    }

    const novoEncontro: Encontro = {
      id: `enc_${Date.now()}`,
      grupo: grupoAtivo.nome,
      data: encontroData,
      assunto: encontroAssunto,
      status: 'realizado'
    };

    setEncontros(prev => [...prev, novoEncontro]);
    showFeedback('Encontro registrado com sucesso!', 'success');
    setOpenEncontro(false);
    setEncontroAssunto('');
    setEncontroData('');
  };

  // ============================================
  // FUNÇÕES AUXILIARES
  // ============================================

  const showFeedback = (message: string, type: 'success' | 'error' | 'warning') => {
    setFeedback({ show: true, message, type });
    setTimeout(() => setFeedback({ ...feedback, show: false }), 3000);
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="mx-auto max-w-lg space-y-5 px-4 pt-6 pb-20">
      {/* HEADER */}
      <header className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Link to="/home" className="rounded-full p-2 hover:bg-surface">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <p className="text-xs text-muted-foreground">Painel</p>
            <h1 className="text-xl font-semibold">Modo Líder</h1>
          </div>
        </div>
        <ThemeToggle />
      </header>

      {/* PAINEL IGREJA */}
      <section className="card-elevated overflow-hidden">
        <div className="flex items-center gap-2 border-b border-border px-5 py-3">
          <Building2 className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold">Painel da Igreja</h2>
        </div>
        <div className="grid grid-cols-3 divide-x divide-border">
          <div className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">{discipulos.filter(d => d.status === 'ativo').length}</p>
            <p className="text-[10px] uppercase text-muted-foreground">Ativos</p>
          </div>
          <div className="p-4 text-center">
            <p className="text-2xl font-bold text-success">18</p>
            <p className="text-[10px] uppercase text-muted-foreground">Novos convertidos</p>
          </div>
          <div className="p-4 text-center">
            <p className="text-2xl font-bold text-ancient">67%</p>
            <p className="text-[10px] uppercase text-muted-foreground">Engajamento</p>
          </div>
        </div>
        <p className="border-t border-border px-5 py-3 text-xs text-muted-foreground">
          Trilha mais realizada: <span className="font-semibold text-foreground">Novo Convertido</span>
        </p>
      </section>

      {/* ============================================ */}
      {/* AÇÕES RÁPIDAS - REORGANIZADAS CONFORME SOLICITADO */}
      {/* ============================================ */}
      <div className="grid grid-cols-4 gap-2">
        {/* 1º - ADICIONAR DISCÍPULO (substitui "Mensagem" original) */}
        <ActionBtn 
          icon={UserPlus} 
          label="Adicionar" 
          onClick={handleAdicionarDiscipulo}
          className="bg-primary/10 hover:bg-primary/20"
        />
        
        {/* 2º - NOVO GRUPO (substitui "Encontro" original) */}
        <ActionBtn 
          icon={Users} 
          label="Novo grupo" 
          onClick={() => setOpenNovoGrupo(true)}
        />
        
        {/* 3º - MENSAGEM (substitui "Aprovar etapa" original) */}
        <ActionBtn 
          icon={MessageSquare} 
          label="Mensagem" 
          onClick={() => setOpenMensagem(true)}
        />
        
        {/* 4º - ENCONTRO (substitui "Aprovar etapa" e agora vai aqui) */}
        <ActionBtn 
          icon={Calendar} 
          label="Encontro" 
          onClick={() => setOpenEncontro(true)}
          className="bg-success/10 hover:bg-success/20"
        />
      </div>

      {/* FEEDBACK RÁPIDO */}
      {feedback.show && (
        <div className={`card-elevated p-3 text-sm ${
          feedback.type === 'success' ? 'border-green-500 bg-green-50 dark:bg-green-900/20' :
          feedback.type === 'error' ? 'border-red-500 bg-red-50 dark:bg-red-900/20' :
          'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
        }`}>
          <p className="font-medium">{feedback.message}</p>
        </div>
      )}

      {/* DISCÍPULOS */}
      <section className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-semibold text-muted-foreground">Seus discípulos</h2>
          <span className="text-xs text-muted-foreground">
            {discipulos.filter(d => d.status === 'ativo').length} ativos
          </span>
        </div>
        {discipulos.filter(d => d.status === 'ativo' || d.status === 'pendente').map((d) => (
          <div key={d.id} className="card-elevated p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-sm font-semibold text-primary">
                {d.name[0]}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">{d.name}</p>
                <p className="text-[11px] text-muted-foreground">
                  Nv {d.level} · {d.streak}d de ofensiva
                  {d.status === 'pendente' && (
                    <span className="ml-2 text-xs text-yellow-500">(Pendente)</span>
                  )}
                </p>
              </div>
              <TrendingUp className="h-4 w-4 text-success" />
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-2">
              <div className="h-full bg-primary" style={{ width: `${d.progress}%` }} />
            </div>
            {d.alert && (
              <div className="mt-2 flex items-center gap-1.5 rounded-lg bg-streak/10 px-2 py-1 text-[11px] text-streak">
                <AlertTriangle className="h-3 w-3" /> {d.alert}
              </div>
            )}
          </div>
        ))}
      </section>

      {/* ============================================ */}
      {/* DIÁLOGOS */}
      {/* ============================================ */}

      {/* 1. DIÁLOGO: ADICIONAR DISCÍPULO */}
      {openAddDiscipulo && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center">
          <div className="w-full max-w-md rounded-t-2xl bg-background p-6 sm:rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Adicionar Discípulo</h2>
              <button onClick={() => setOpenAddDiscipulo(false)} className="p-1 hover:bg-surface rounded-full">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Buscar por nome, email ou ID"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-border bg-surface px-4 py-2 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2 mb-4">
              {handleBuscarDiscipulos().length > 0 ? (
                handleBuscarDiscipulos().map((d) => (
                  <div
                    key={d.id}
                    onClick={() => handleSelecionarDiscipulo(d)}
                    className={`flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-all hover:bg-surface ${
                      discipuloSelecionado?.id === d.id ? 'border-primary bg-primary/5' : 'border-border'
                    }`}
                  >
                    <div>
                      <p className="font-medium">{d.name}</p>
                      <p className="text-xs text-muted-foreground">ID: {d.id} · {d.status}</p>
                    </div>
                    {discipuloSelecionado?.id === d.id && (
                      <CheckCircle className="h-5 w-5 text-primary" />
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center text-sm text-muted-foreground py-4">Nenhum discípulo encontrado</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  setOpenAddDiscipulo(false);
                  setOpenAddPorID(true);
                }}
                className="w-full rounded-lg border border-border py-2 text-sm font-medium hover:bg-surface"
              >
                Adicionar por ID
              </button>
              <button
                onClick={handleConfirmarAdicionar}
                disabled={!discipuloSelecionado}
                className="w-full rounded-lg bg-primary py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Adicionar Discípulo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 1.1 DIÁLOGO: ADICIONAR POR ID */}
      {openAddPorID && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center">
          <div className="w-full max-w-md rounded-t-2xl bg-background p-6 sm:rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Adicionar por ID</h2>
              <button onClick={() => setOpenAddPorID(false)} className="p-1 hover:bg-surface rounded-full">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Digite o ID do discípulo"
                value={idBusca}
                onChange={(e) => setIdBusca(e.target.value)}
                className="flex-1 rounded-lg border border-border bg-surface px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={handleBuscarPorID}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
              >
                Buscar
              </button>
            </div>

            {discipuloEncontrado && (
              <div className="rounded-lg border border-green-500 bg-green-50 p-4 dark:bg-green-900/20 mb-4">
                <p className="font-medium">{discipuloEncontrado.name}</p>
                <p className="text-sm text-muted-foreground">
                  ID: {discipuloEncontrado.id} · {discipuloEncontrado.email || 'Sem email'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Status: {discipuloEncontrado.status}
                </p>
              </div>
            )}

            <button
              onClick={handleConfirmarAdicionarPorID}
              disabled={!discipuloEncontrado}
              className="w-full rounded-lg bg-primary py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Adicionar Discípulo
            </button>
          </div>
        </div>
      )}

      {/* 2. DIÁLOGO: NOVO GRUPO */}
      {openNovoGrupo && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center">
          <div className="w-full max-w-md rounded-t-2xl bg-background p-6 sm:rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Criar Novo Grupo</h2>
              <button onClick={() => setOpenNovoGrupo(false)} className="p-1 hover:bg-surface rounded-full">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <input
              type="text"
              placeholder="Nome do grupo"
              value={novoGrupoNome}
              onChange={(e) => setNovoGrupoNome(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary mb-4"
            />

            <button
              onClick={handleCriarGrupo}
              disabled={!novoGrupoNome.trim()}
              className="w-full rounded-lg bg-primary py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Criar Grupo
            </button>
          </div>
        </div>
      )}

      {/* 3. DIÁLOGO: MENSAGEM */}
      {openMensagem && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center">
          <div className="w-full max-w-md rounded-t-2xl bg-background p-6 sm:rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Enviar Mensagem</h2>
              <button onClick={() => setOpenMensagem(false)} className="p-1 hover:bg-surface rounded-full">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <p className="text-xs text-muted-foreground mb-3">
              Enviar para {discipulos.filter(d => d.status === 'ativo').length} discípulos ativos
            </p>
            
            <textarea
              placeholder="Digite sua mensagem..."
              value={mensagemTexto}
              onChange={(e) => setMensagemTexto(e.target.value)}
              rows={4}
              className="w-full rounded-lg border border-border bg-surface px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none mb-4"
            />

            <button
              onClick={handleEnviarMensagem}
              disabled={!mensagemTexto.trim()}
              className="w-full rounded-lg bg-primary py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Enviar Mensagem
            </button>
          </div>
        </div>
      )}

      {/* 4. DIÁLOGO: ENCONTRO */}
      {openEncontro && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center">
          <div className="w-full max-w-md rounded-t-2xl bg-background p-6 sm:rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Registrar Encontro</h2>
              <button onClick={() => setOpenEncontro(false)} className="p-1 hover:bg-surface rounded-full">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <input
              type="text"
              placeholder="Assunto do encontro"
              value={encontroAssunto}
              onChange={(e) => setEncontroAssunto(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary mb-3"
            />
            
            <input
              type="date"
              value={encontroData}
              onChange={(e) => setEncontroData(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary mb-3"
            />

            <p className="text-xs text-muted-foreground mb-4">
              Grupo: {grupos.find(g => g.status === 'ativo')?.nome || 'Nenhum grupo ativo'}
            </p>

            <button
              onClick={handleRegistrarEncontro}
              disabled={!encontroAssunto.trim() || !encontroData}
              className="w-full rounded-lg bg-success py-2 text-sm font-medium text-white hover:bg-success/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Registrar Encontro
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// COMPONENTE ACTION BUTTON
// ============================================

function ActionBtn({ 
  icon: Icon, 
  label, 
  onClick,
  className = ''
}: { 
  icon: React.ElementType; 
  label: string; 
  onClick: () => void;
  className?: string;
}) {
  return (
    <button 
      onClick={onClick}
      className={`card-elevated flex flex-col items-center justify-center gap-1 p-3 text-xs font-medium transition-all hover:border-primary/50 ${className}`}
    >
      <Icon className="h-5 w-5 text-primary" /> 
      <span>{label}</span>
    </button>
  );
}
