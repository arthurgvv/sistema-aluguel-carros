import { useEffect, useState } from "react";
import {
  aprovarPedido,
  avaliarPedido,
  buscarClientePorId,
  cancelarPedido,
  encerrarContratoAluguel,
  listarPedidos,
  listarPedidosPorCliente,
  rejeitarPedido
} from "../services/clientesApi";
import { srcFotoAutomovel } from "../utils/fotoAutomovelLocal";

const STATUS_LABELS = {
  PENDENTE:   "Pendente",
  EM_ANALISE: "Em análise",
  APROVADO:   "Aprovado",
  REJEITADO:  "Rejeitado",
  CANCELADO:  "Cancelado",
  CONCLUIDO:  "Concluído"
};

const STATUS_CLASS = {
  PENDENTE:   "status-badge--pendente",
  EM_ANALISE: "status-badge--analise",
  APROVADO:   "status-badge--aprovado",
  REJEITADO:  "status-badge--rejeitado",
  CANCELADO:  "status-badge--cancelado",
  CONCLUIDO:  "status-badge--concluido"
};

const STEPS = ["Enviado", "Em Análise", "Aprovado", "Concluído"];
const STATUS_STEP = { PENDENTE: 0, EM_ANALISE: 1, APROVADO: 2, CONCLUIDO: 3 };

function formatarData(data) {
  if (!data) return "—";
  return new Date(data + "T00:00:00").toLocaleDateString("pt-BR");
}

function formatarMoeda(valor) {
  if (valor == null) return "—";
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor);
}

function getProximoEvento(pedido) {
  const hoje = new Date(); hoje.setHours(0, 0, 0, 0);
  if (pedido.status !== "APROVADO") return null;
  const inicio = pedido.dataInicio ? new Date(pedido.dataInicio + "T00:00:00") : null;
  const fim    = pedido.dataFim    ? new Date(pedido.dataFim    + "T00:00:00") : null;
  if (inicio && inicio >= hoje) return { label: "Retirada em",  data: pedido.dataInicio };
  if (fim    && fim    >= hoje) return { label: "Devolução em", data: pedido.dataFim };
  return null;
}

export default function PedidosPage({ usuarioLogado, onNovoPedido, onEditarPedido, onConcederCredito }) {
  const [pedidos,    setPedidos]    = useState([]);
  const [rendaMap,   setRendaMap]   = useState({});
  const [carregando, setCarregando] = useState(true);
  const [erro,       setErro]       = useState("");
  const [mensagem,   setMensagem]   = useState("");
  const [processando,setProcessando]= useState(null);

  const isAgente  = usuarioLogado?.tipoUsuario === "AGENTE";
  const isBanco   = isAgente && usuarioLogado?.tipo === "BANCO";
  const isEmpresa = isAgente && usuarioLogado?.tipo === "EMPRESA";

  async function carregar() {
    setCarregando(true); setErro("");
    try {
      const lista = isAgente
        ? await listarPedidos()
        : await listarPedidosPorCliente(usuarioLogado.id);
      const pedidosCarregados = lista || [];
      setPedidos(pedidosCarregados);

      if (isBanco && pedidosCarregados.length > 0) {
        const idsUnicos = [...new Set(pedidosCarregados.map(p => p.cliente?.id).filter(Boolean))];
        const resultados = await Promise.allSettled(idsUnicos.map(id => buscarClientePorId(id)));
        const mapa = {};
        resultados.forEach((res, i) => {
          if (res.status === "fulfilled" && res.value) {
            const emps = res.value.empregadores || [];
            mapa[idsUnicos[i]] = emps.reduce((acc, e) => acc + (e.rendimento || 0), 0);
          }
        });
        setRendaMap(mapa);
      }
    } catch (error) {
      setErro(error.message || "Não foi possível carregar os pedidos.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => { carregar(); }, []);

  async function executarAcao(acao, pedidoId, label) {
    if (!window.confirm(`Confirmar: ${label}?`)) return;
    setProcessando(pedidoId); setErro("");
    try {
      await acao(pedidoId);
      setMensagem(`Ação "${label}" realizada com sucesso.`);
      await carregar();
    } catch (error) {
      setErro(error.message || `Não foi possível executar: ${label}.`);
    } finally {
      setProcessando(null);
    }
  }

  const pedidosAtivos   = pedidos.filter(p => ["PENDENTE","EM_ANALISE","APROVADO"].includes(p.status));
  const pedidosHistorico= pedidos.filter(p => ["CONCLUIDO","CANCELADO","REJEITADO"].includes(p.status));

  /* ── Card de pedido ativo ─────────────────────────────────── */
  function OrdCard({ pedido }) {
    const foto       = srcFotoAutomovel(pedido.automovel);
    const nomeVeic   = pedido.automovel
      ? `${pedido.automovel.marca} ${pedido.automovel.modelo}`
      : `Pedido #${pedido.id}`;
    const step     = STATUS_STEP[pedido.status] ?? 0;
    const evento   = getProximoEvento(pedido);
    const isFinal  = ["CANCELADO","REJEITADO"].includes(pedido.status);
    const busy     = processando === pedido.id;

    return (
      <div className="ord-card">
        {/* Foto */}
        <div className="ord-card-photo">
          <img src={foto ?? "/getimage.png"} alt={nomeVeic} />
          <div className="ord-card-photo-overlay">
            <span className={`ord-status-pill ${STATUS_CLASS[pedido.status]}`}>
              {STATUS_LABELS[pedido.status]}
            </span>
            <div className="ord-card-car-name">{nomeVeic.toUpperCase()}</div>
          </div>
        </div>

        {/* Info */}
        <div className="ord-card-info">
          <span className="ord-booking-id">
            BOOKING ID: #PEDIDO-{String(pedido.id).padStart(4, "0")}
          </span>

          <div className="ord-dates">
            {formatarData(pedido.dataInicio)} — {formatarData(pedido.dataFim)}
          </div>

          {evento && (
            <div className="ord-evento">
              <span className="ord-evento-label">{evento.label}</span>
              <span className="ord-evento-data">{formatarData(evento.data)}</span>
            </div>
          )}

          {pedido.valorTotal != null && (
            <div className="ord-valor">{formatarMoeda(pedido.valorTotal)}</div>
          )}

          {/* Steps */}
          {!isFinal && (
            <div className="ord-steps">
              {STEPS.map((s, i) => (
                <div
                  key={s}
                  className={`ord-step${i < step ? " ord-step--done" : i === step ? " ord-step--active" : ""}`}
                >
                  <div className="ord-step-dot" />
                  <span className="ord-step-label">{s}</span>
                </div>
              ))}
            </div>
          )}

          {/* Ações */}
          <div className="ord-card-actions">
            {/* Cliente */}
            {!isAgente && pedido.status === "PENDENTE" && (
              <>
                {onEditarPedido && (
                  <button className="ord-btn ord-btn--ghost" disabled={busy}
                    onClick={() => onEditarPedido(pedido.id)}>
                    Editar
                  </button>
                )}
                <button className="ord-btn ord-btn--danger" disabled={busy}
                  onClick={() => executarAcao(cancelarPedido, pedido.id, "Cancelar pedido")}>
                  Cancelar
                </button>
              </>
            )}

            {/* Empresa */}
            {isEmpresa && pedido.status === "PENDENTE" && (
              <button className="ord-btn" disabled={busy}
                onClick={() => executarAcao(avaliarPedido, pedido.id, "Iniciar análise")}>
                Analisar
              </button>
            )}
            {isEmpresa && (pedido.status === "PENDENTE" || pedido.status === "EM_ANALISE") && (
              <>
                <button className="ord-btn ord-btn--primary" disabled={busy}
                  onClick={() => executarAcao(aprovarPedido, pedido.id, "Aprovar pedido")}>
                  Aprovar
                </button>
                <button className="ord-btn ord-btn--danger" disabled={busy}
                  onClick={() => executarAcao(rejeitarPedido, pedido.id, "Rejeitar pedido")}>
                  Rejeitar
                </button>
              </>
            )}
            {isEmpresa && pedido.status === "APROVADO" && pedido.contratoAluguel?.id && (
              <button className="ord-btn" disabled={busy}
                onClick={() => executarAcao(
                  () => encerrarContratoAluguel(pedido.contratoAluguel.id),
                  pedido.id, "Encerrar contrato"
                )}>
                Encerrar
              </button>
            )}

            {/* Banco */}
            {isBanco && pedido.status === "APROVADO" && !pedido.contratoCredito && onConcederCredito && (
              <button className="ord-btn" disabled={busy}
                onClick={() => onConcederCredito(pedido)}>
                Conceder Crédito
              </button>
            )}

            {isBanco && pedido.cliente?.id && rendaMap[pedido.cliente.id] != null && (
              <span className="ord-renda-badge">
                Renda: {formatarMoeda(rendaMap[pedido.cliente.id])}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ── Linha do histórico ───────────────────────────────────── */
  function HistRow({ pedido }) {
    const foto    = srcFotoAutomovel(pedido.automovel);
    const nomeVeic= pedido.automovel
      ? `${pedido.automovel.marca} ${pedido.automovel.modelo}`
      : `Pedido #${pedido.id}`;
    const busy    = processando === pedido.id;

    return (
      <div className="ord-hist-row">
        <div className="ord-hist-vehicle">
          {foto
            ? <img src={foto} alt={nomeVeic} className="ord-hist-thumb" />
            : <div className="ord-hist-thumb ord-hist-thumb--empty" />}
          <div>
            <div className="ord-hist-name">{nomeVeic.toUpperCase()}</div>
            <div className="ord-hist-sub">#{String(pedido.id).padStart(4,"0")}</div>
          </div>
        </div>
        <div className="ord-hist-dates">
          {formatarData(pedido.dataInicio)} — {formatarData(pedido.dataFim)}
        </div>
        <div className="ord-hist-total">{formatarMoeda(pedido.valorTotal)}</div>
        <span className={`status-badge ${STATUS_CLASS[pedido.status]}`}>
          {STATUS_LABELS[pedido.status]}
        </span>
        <div className="ord-hist-actions">
          {isEmpresa && pedido.status === "APROVADO" && pedido.contratoAluguel?.id && (
            <button className="ord-btn ord-btn--ghost" disabled={busy}
              onClick={() => executarAcao(
                () => encerrarContratoAluguel(pedido.contratoAluguel.id),
                pedido.id, "Encerrar contrato"
              )}>
              Encerrar
            </button>
          )}
        </div>
      </div>
    );
  }

  /* ── Render ───────────────────────────────────────────────── */
  return (
    <section className="page-card">

      {/* Hero header */}
      <div className="ord-hero">
        <div className="ord-watermark">PEDIDOS</div>
        <div className="ord-hero-left">
          <p className="eyebrow">{isAgente ? "Painel do agente" : "Meus pedidos"}</p>
          <h1 className="ord-title">
            {isAgente ? "PEDIDOS DE ALUGUEL" : "MEUS PEDIDOS"}
          </h1>
        </div>
        <div className="header-actions">
          {!isAgente && onNovoPedido && (
            <button type="button" className="primary-button btn-gradient" onClick={onNovoPedido}>
              + Novo pedido
            </button>
          )}
          <button type="button" className="ghost-button" onClick={carregar}>
            Atualizar
          </button>
        </div>
      </div>

      {erro    && <p className="feedback error">{erro}</p>}
      {mensagem && <p className="feedback success">{mensagem}</p>}

      {carregando && (
        <div className="empty-state"><h2>Carregando pedidos...</h2></div>
      )}

      {!carregando && pedidos.length === 0 && (
        <div className="empty-state">
          <h2>Nenhum pedido encontrado</h2>
          {!isAgente && onNovoPedido && (
            <>
              <p>Você ainda não possui pedidos de aluguel.</p>
              <button type="button" className="primary-button btn-gradient"
                style={{ marginTop: "16px" }} onClick={onNovoPedido}>
                + Novo pedido
              </button>
            </>
          )}
        </div>
      )}

      {!carregando && pedidos.length > 0 && (
        <>
          {/* Ativos */}
          {pedidosAtivos.length > 0 && (
            <div className="ord-section">
              <div className="ord-section-label">
                Active Rentals&ensp;/&ensp;Em Andamento
              </div>
              <div className="ord-active-list">
                {pedidosAtivos.map(p => <OrdCard key={p.id} pedido={p} />)}
              </div>
            </div>
          )}

          {/* Histórico */}
          {pedidosHistorico.length > 0 && (
            <div className="ord-section">
              <div className="ord-section-label">
                Past Journeys&ensp;/&ensp;Histórico
              </div>
              <div className="ord-hist-header">
                <span>Veículo</span>
                <span>Período</span>
                <span>Total</span>
                <span>Status</span>
                <span />
              </div>
              <div className="ord-hist-list">
                {pedidosHistorico.map(p => <HistRow key={p.id} pedido={p} />)}
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}
