import { createFileRoute, Link } from "@tanstack/react-router";
import { ThemeToggle } from "@/components/ThemeToggle";
import { 
  ArrowLeft, 
  TrendingUp, 
  AlertTriangle, 
  Users, 
  Calendar, 
  Building2,
  Search,
  X,
  CheckCircle,
  UserPlus,
  MessageSquare,
  Loader2
} from "lucide-react";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/_authenticated/lider")({
  component: LiderPage,
});

// ============================================
// INTERFACES
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

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

function LiderPage() {
  // ESTADOS
  const [discipulos, setDiscipulos] = useState<Discipulo[]>([]);
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para diálogos
  const [openAddDiscipulo, setOpenAddDiscipulo] = useState(false);
  const [openAddPorID, setOpenAddPorID] = useState(false);
  const [openNovoGrupo, setOpenNovoGrupo] = useState(false);
  const [openMensagem, setOpenMensagem] = useState(false);
  const [openEncontro, setOpenEncontro] = useState(false);

  // Estados para formulários
  const [searchTerm, setSearchTerm] = useState('');
  const [discipuloSelecionado, setDiscipuloSelecionado] = useState<Discipulo | null>(null);
  const [novoGrupoNome, setNovoGrupoNome] = useState('');
  const [mensagemTexto, setMensagemTexto] = useState('');
  const [encontroAssunto, setEncontroAssunto] = useState('');
  const [encontroData, setEncontroData] = useState('');
  const [idBusca, setIdBusca] = useState('');
  const [discipuloEncontrado, setDiscipuloEncontrado] = useState<Discipulo | null>(null);
  const [buscandoPorID, setBuscandoPorID] = useState(false);
  const [feedback, setFeedback] = useState<{ show: boolean; message: string; type: 'success' | 'error' | 'warning' }>({
    show: false,
    message: '',
    type: 'success'
  });

  // ============================================
  // FUNÇÃO PARA CARREGAR DADOS (LOCALSTORAGE)
  // ============================================
  const carregarDados = () => {
    setLoading(true);
    setError(null);
    
    try {
      // Dados iniciais para teste
      const dadosIniciais: Discipulo[] = [
        { 
          id: '1', 
          name: "João Silva", 
          level: 3, 
          streak: 9, 
          alert: null, 
          progress: 40,
          email: "joao@email.com",
          telefone: "(11) 99999-9999",
          status: 'ativo',
          dataEntrada: new Date().toISOString().split('T')[0]
        },
        { 
          id: '2', 
          name: "Maria Oliveira", 
          level: 5, 
          streak: 0, 
          alert: "Streak quebrado há 3 dias", 
          progress: 62,
          email: "maria@email.com",
          telefone: "(11) 88888-8888",
          status: 'ativo',
          dataEntrada: new Date().toISOString().split('T')[0]
        },
        { 
          id: '3', 
          name: "Ana Costa", 
          level: 4, 
          streak: 21, 
          alert: null, 
          progress: 88,
          email: "ana@email.com",
          telefone: "(11) 77777-7777",
          status: 'pendente',
          dataEntrada: new Date().toISOString().split('T')[0]
        },
        { 
          id: '4', 
          name: "Tiago Nunes", 
          level: 2, 
          streak: 4, 
          alert: "Baixo desempenho em quiz", 
          progress: 15,
          email: "tiago@email.com",
          telefone: "(11) 66666-6666",
          status: 'ativo',
          dataEntrada: new Date().toISOString().split('T')[0]
        }
      ];

      // Carregar do localStorage ou usar dados iniciais
      const saved = localStorage.getItem('discipulos_reais');
      if (saved) {
        setDiscipulos(JSON.parse(saved));
      } else {
        setDiscipulos(dadosIniciais);
        localStorage.setItem('discipulos_reais', JSON.stringify(dadosIniciais));
      }

      // Grupos
      const gruposIniciais: Grupo[] = [
        {
          id: '1',
          nome: 'Grupo Fogo',
          membros: ['1', '2'],
          dataCriacao: new Date().toISOString().split('T')[0],
          status: 'ativo'
        }
      ];

      const savedGrupos = localStorage.getItem('grupos_reais');
      if (savedGrupos) {
        setGrupos(JSON.parse(savedGrupos));
      } else {
        setGrupos(gruposIniciais);
        localStorage.setItem('grupos_reais', JSON.stringify(gruposIniciais));
      }
      
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      setError('Erro ao carregar dados. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // CARREGAR DADOS AO ABRIR A PÁGINA
  // ============================================
  useEffect(() => {
    carregarDados();
  }, []);

  // ============================================
  // FUNÇÕES DOS BOTÕES
  // ============================================

  const showFeedback = (message: string, type: 'success' | 'error' | 'warning') => {
    setFeedback({ show: true, message, type });
    setTimeout(() => setFeedback({ ...feedback, show: false }), 3000);
  };

  // 1. ADICIONAR DISCÍPULO
  const handleAdicionarDiscipulo = () => {
    setOpenAddDiscipulo(true);
    setSearchTerm('');
    setDiscipuloSelecionado(null);
  };

  const handleSelecionarDiscipulo = (discipulo: Discipulo) => {
    setDiscipuloSelecionado(discipulo);
  };

  const handleConfirmarAdicionar = () => {
    if (!discipuloSelecionado) {
      showFeedback('Selecione um discípulo para adicionar', 'warning');
      return;
    }

    const discipulosAtualizados = discipulos.map(d => 
      d.id === discipuloSelecionado.id 
        ? { ...d, status: 'ativo' as const, dataEntrada: new Date().toISOString().split('T')[0] }
        : d
    );
    
    setDiscipulos(discipulosAtualizados);
    localStorage.setItem('discipulos_reais', JSON.stringify(discipulosAtualizados));

    showFeedback(`Discípulo ${discipuloSelecionado.name} adicionado com sucesso!`, 'success');
    setOpenAddDiscipulo(false);
    setDiscipuloSelecionado(null);
    setSearchTerm('');
  };

  // 2. ADICIONAR POR ID
  const handleBuscarPorID = () => {
    if (!idBusca.trim()) {
      showFeedback('Digite um ID válido', 'warning');
      return;
    }

    setBuscandoPorID(true);
    
    try {
      // Simula busca
      const encontrado = discipulos.find(d => d.id === idBusca);
      
      setTimeout(() => {
        if (encontrado) {
          setDiscipuloEncontrado(encontrado);
          showFeedback(`Usuário ${encontrado.name} encontrado!`, 'success');
        } else {
          setDiscipuloEncontrado(null);
          showFeedback('Usuário não encontrado com este ID', 'error');
        }
        setBuscandoPorID(false);
      }, 500);
    } catch (err) {
      showFeedback('Erro ao buscar usuário', 'error');
      setBuscandoPorID(false);
    }
  };

  const handleConfirmarAdicionarPorID = () => {
    if (!discipuloEncontrado) {
      showFeedback('Usuário não encontrado', 'warning');
      return;
    }

    const discipulosAtualizados = discipulos.map(d => 
      d.id === discipuloEncontrado.id 
        ? { ...d, status: 'ativo' as const, dataEntrada: new Date().toISOString().split('T')[0] }
        : d
    );
    
    setDiscipulos(discipulosAtualizados);
    localStorage.setItem('discipulos_reais', JSON.stringify(discipulosAtualizados));

    showFeedback(`Discípulo ${discipuloEncontrado.name} adicionado com sucesso!`, 'success');
    setOpenAddPorID(false);
    setDiscipuloEncontrado(null);
    setIdBusca('');
  };

  // 3. NOVO GRUPO
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

    const gruposAtualizados = [...grupos, novoGrupo];
    setGrupos(gruposAtualizados);
    localStorage.setItem('grupos_reais', JSON.stringify(gruposAtualizados));
    
    showFeedback(`Grupo "${novoGrupoNome}" criado com sucesso!`, 'success');
    setOpenNovoGrupo(false);
    setNovoGrupoNome('');
  };

  // 4. MENSAGEM
  const handleEnviarMensagem = () => {
    if (!mensagemTexto.trim()) {
      showFeedback('Digite uma mensagem', 'warning');
      return;
    }

    const discipulosAtivos = discipulos.filter(d => d.status === 'ativo');
    showFeedback(`Mensagem enviada para ${discipulosAtivos.length} discípulos!`, 'success');
    setOpenMensagem(false);
    setMensagemTexto('');
  };

  // 5. ENCONTRO
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

    showFeedback('Encontro registrado com sucesso!', 'success');
    setOpenEncontro(false);
    setEncontroAssunto('');
    setEncontroData('');
  };

  // ============================================
  // RENDERIZAÇÃO
  // ============================================

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
        <p className="text-center text-red-500">{error}</p>
        <button 
          onClick={carregarDados}
          className="mt-4 rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/90"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

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

      {/* AÇÕES RÁPIDAS */}
      <div className="grid grid-cols-4 gap-2">
        <ActionBtn 
          icon={UserPlus} 
          label="Adicionar" 
          onClick={handleAdicionarDiscipulo}
          className="bg-primary/10 hover:bg-primary/20"
        />
        <ActionBtn 
          icon={Users} 
          label="Novo grupo" 
          onClick={() => setOpenNovoGrupo(true)}
        />
        <ActionBtn 
          icon={MessageSquare} 
          label="Mensagem" 
          onClick={() => setOpenMensagem(true)}
        />
        <ActionBtn 
          icon={Calendar} 
          label="Encontro" 
          onClick={() => setOpenEncontro(true)}
          className="bg-success/10 hover:bg-success/20"
        />
      </div>

      {/* FEEDBACK */}
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
        {discipulos.filter(d => d.status === 'ativo' || d.status === 'pendente').length === 0 ? (
          <div className="card-elevated p-8 text-center">
            <p className="text-sm text-muted-foreground">Nenhum discípulo adicionado ainda</p>
            <button 
              onClick={handleAdicionarDiscipulo}
              className="mt-2 text-sm text-primary hover:underline"
            >
              Adicionar seu primeiro discípulo
            </button>
          </div>
        ) : (
          discipulos.filter(d => d.status === 'ativo' || d.status === 'pendente').map((d) => (
            <div key={d.id} className="card-elevated p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-sm font-semibold text-primary">
                  {d.name[0]}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{d.name}</p>
                  <p className="text-[11px] text-muted-foreground">
                    ID: {d.id} · Nv {d.level} · {d.streak}d de ofensiva
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
          ))
        )}
      </section>

      {/* ============================================ */}
      {/* DIÁLOGOS (MODAIS) */}
      {/* ============================================ */}

      {/* 1. ADICIONAR DISCÍPULO */}
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
              {(() => {
                const resultados = searchTerm.trim() ? discipulos.filter(d => 
                  d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  d.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  d.id.includes(searchTerm)
                ) : discipulos;
                
                if (resultados.length === 0) {
                  return <p className="text-center text-sm text-muted-foreground py-4">Nenhum usuário encontrado</p>;
                }
                
                return resultados.map((d) => (
                  <div
                    key={d.id}
                    onClick={() => handleSelecionarDiscipulo(d)}
                    className={`flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-all hover:bg-surface ${
                      discipuloSelecionado?.id === d.id ? 'border-primary bg-primary/5' : 'border-border'
                    }`}
                  >
                    <div>
                      <p className="font-medium">{d.name}</p>
                      <p className="text-xs text-muted-foreground">ID: {d.id} · Status: {d.status}</p>
                    </div>
                    {discipuloSelecionado?.id === d.id && (
                      <CheckCircle className="h-5 w-5 text-primary" />
                    )}
                  </div>
                ));
              })()}
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

      {/* 2. ADICIONAR POR ID */}
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
                placeholder="Digite o ID do usuário"
                value={idBusca}
                onChange={(e) => setIdBusca(e.target.value)}
                className="flex-1 rounded-lg border border-border bg-surface px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={handleBuscarPorID}
                disabled={buscandoPorID}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50"
              >
                {buscandoPorID ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Buscar'}
              </button>
            </div>

            {discipuloEncontrado && (
              <div className="rounded-lg border border-green-500 bg-green-50 p-4 dark:bg-green-900/20 mb-4">
                <p className="font-medium">{discipuloEncontrado.name}</p>
                <p className="text-sm text-muted-foreground">
                  ID: {discipuloEncontrado.id} · {discipuloEncontrado.email || 'Sem email'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Status atual: {discipuloEncontrado.status}
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

      {/* 3. NOVO GRUPO */}
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

      {/* 4. MENSAGEM */}
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

      {/* 5. ENCONTRO */}
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
