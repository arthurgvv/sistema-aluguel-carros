import { useEffect, useState } from "react";
import {
  aprovarPedido,
  avaliarPedido,
  encerrarContratoAluguel,
  listarPedidos,
  listarPedidosPorCliente,
  rejeitarPedido
} from "../services/clientesApi";

const STATUS_LABELS = {
  PENDENTE: "Pendente",
  EM_ANALISE: "Em analise",
  APROVADO: "Aprovado",
  REJEITADO: "Rejeitado",
  CANCELADO: "Cancelado",
  CONCLUIDO: "Concluido"
};

const STATUS_CLASS = {
  PENDENTE: "status-badge--pendente",
  EM_ANALISE: "status-badge--analise",
  APROVADO: "status-badge--aprovado",
  REJEITADO: "status-badge--rejeitado",
  CANCELADO: "status-badge--cancelado",
  CONCLUIDO: "status-badge--concluido"
};

function formatarData(data) {
  if (!data) return "—";
  return new Date(data + "T00:00:00").toLocaleDateString("pt-BR");
}

function formatarMoeda(valor) {
  if (valor == null) return "—";
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor);
}

function calcularEstatisticas(pedidos) {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const totalAlugado = pedidos
    .filter(p => ["APROVADO", "CONCLUIDO"].includes(p.status))
    .reduce((acc, p) => acc + (p.valorTotal || 0), 0);

  const aprovados = pedidos.filter(p => p.status === "APROVADO");

  const proximaRetirada = aprovados
    .filter(p => p.dataInicio && new Date(p.dataInicio + "T00:00:00") >= hoje)
    .sort((a, b) => new Date(a.dataInicio) - new Date(b.dataInicio))[0] || null;

  const proximaDevolucao = proximaRetirada
    ? null
    : aprovados
        .filter(p => p.dataFim && new Date(p.dataFim + "T00:00:00") >= hoje)
        .sort((a, b) => new Date(a.dataFim) - new Date(b.dataFim))[0] || null;

  return { totalAlugado, proximaRetirada, proximaDevolucao };
}

export default function PedidosPage({ usuarioLogado, onNovoPedido, onConcederCredito }) {
  const [pedidos, setPedidos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [processando, setProcessando] = useState(null);

  const isAgente = usuarioLogado?.tipoUsuario === "AGENTE";

  async function carregar() {
    setCarregando(true);
    setErro("");
    try {
      const lista = isAgente
        ? await listarPedidos()
        : await listarPedidosPorCliente(usuarioLogado.id);
      setPedidos(lista || []);
    } catch (error) {
      setErro(error.message || "Nao foi possivel carregar os pedidos.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  async function executarAcao(acao, pedidoId, label) {
    if (!window.confirm(`Confirmar: ${label}?`)) return;
    setProcessando(pedidoId);
    setErro("");
    try {
      await acao(pedidoId);
      setMensagem(`Acao "${label}" realizada com sucesso.`);
      await carregar();
    } catch (error) {
      setErro(error.message || `Nao foi possivel executar: ${label}.`);
    } finally {
      setProcessando(null);
    }
  }

  const { totalAlugado, proximaRetirada, proximaDevolucao } = calcularEstatisticas(pedidos);
  const cardDestaque = proximaRetirada || proximaDevolucao;

  return (
    <section className="page-card">
      <header className="page-header">
        <p className="eyebrow">{isAgente ? "Painel do agente" : "Meus pedidos"}</p>
        <h1>Pedidos de aluguel</h1>
        <p className="page-subtitle">
          {isAgente
            ? "Avalie, aprove ou rejeite os pedidos de aluguel dos clientes."
            : "Acompanhe o status dos seus pedidos de aluguel."}
        </p>
      </header>

      {/* Cards de resumo — apenas para clientes */}
      {!isAgente && !carregando && pedidos.length > 0 && (
        <div className="stat-cards">
          <div className="stat-card">
            <p className="stat-card-label">Total alugado</p>
            <p className="stat-card-value">{formatarMoeda(totalAlugado)}</p>
            <p className="stat-card-sub">
              {pedidos.filter(p => ["APROVADO", "CONCLUIDO"].includes(p.status)).length} pedido(s) aprovado(s)
            </p>
          </div>

          <div className="stat-card">
            <p className="stat-card-label">
              {proximaRetirada
                ? "Proxima retirada"
                : proximaDevolucao
                  ? "Proxima devolucao"
                  : "Sem agenda ativa"}
            </p>
            {cardDestaque ? (
              <div className="stat-card-car-info">
                <p className="stat-card-car-name">
                  {cardDestaque.automovel
                    ? `${cardDestaque.automovel.marca} ${cardDestaque.automovel.modelo}`
                    : `Pedido #${cardDestaque.id}`}
                </p>
                <p className="stat-card-car-date">
                  {proximaRetirada
                    ? `Retirada em ${formatarData(cardDestaque.dataInicio)}`
                    : `Devolucao em ${formatarData(cardDestaque.dataFim)}`}
                </p>
                <span className="stat-card-badge">
                  <span className="stat-card-badge-dot" />
                  {proximaRetirada ? "Aguardando retirada" : "Em curso"}
                </span>
              </div>
            ) : (
              <p className="stat-card-value" style={{ fontSize: "1rem", marginTop: "12px", color: "rgba(255,255,255,0.35)" }}>
                Nenhum aluguel ativo
              </p>
            )}
          </div>
        </div>
      )}

      {erro && <p className="feedback error">{erro}</p>}
      {mensagem && <p className="feedback success">{mensagem}</p>}

      {carregando && (
        <div className="empty-state">
          <h2>Carregando pedidos...</h2>
          <p>Aguarde a busca dos registros.</p>
        </div>
      )}

      {!carregando && pedidos.length === 0 && (
        <div className="empty-state">
          <h2>Nenhum pedido encontrado</h2>
          {!isAgente && onNovoPedido && (
            <p>Clique em &ldquo;Novo pedido&rdquo; para solicitar seu primeiro aluguel.</p>
          )}
        </div>
      )}

      {!carregando && pedidos.length > 0 && (
        <>
          <div className="table-toolbar">
            <span className="table-toolbar-title">
              {isAgente ? "Pedidos de aluguel" : "Meus pedidos"}
            </span>
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
          <div className="table-wrapper">
          <table className="clients-table">
            <thead>
              <tr>
                {isAgente && <th>Cliente</th>}
                <th>Veiculo</th>
                <th>Periodo</th>
                <th>Valor</th>
                <th>Status</th>
                {isAgente && <th>Acoes</th>}
              </tr>
            </thead>
            <tbody>
              {pedidos.map((pedido) => (
                <tr key={pedido.id}>
                  {isAgente && (
                    <td>{pedido.cliente?.nome || `Cliente #${pedido.cliente?.id}`}</td>
                  )}
                  <td>
                    <div className="vehicle-cell">
                      {pedido.automovel?.imagemBase64 ? (
                        <img
                          src={pedido.automovel.imagemBase64}
                          alt={`${pedido.automovel.marca} ${pedido.automovel.modelo}`}
                          className="car-thumb"
                        />
                      ) : (
                        <div className="car-thumb-placeholder" />
                      )}
                      <span>
                        {pedido.automovel
                          ? `${pedido.automovel.marca} ${pedido.automovel.modelo}`
                          : `Auto #${pedido.automovel?.id}`}
                      </span>
                    </div>
                  </td>
                  <td>{formatarData(pedido.dataInicio)} a {formatarData(pedido.dataFim)}</td>
                  <td>{formatarMoeda(pedido.valorTotal)}</td>
                  <td>
                    <span className={`status-badge ${STATUS_CLASS[pedido.status] || ""}`}>
                      {STATUS_LABELS[pedido.status] || pedido.status}
                    </span>
                  </td>
                  {isAgente && (
                    <td>
                      <div className="row-actions">
                        {pedido.status === "PENDENTE" && (
                          <button
                            type="button"
                            className="secondary-button"
                            disabled={processando === pedido.id}
                            onClick={() => executarAcao(avaliarPedido, pedido.id, "Iniciar analise")}
                          >
                            Analisar
                          </button>
                        )}
                        {(pedido.status === "PENDENTE" || pedido.status === "EM_ANALISE") && (
                          <>
                            <button
                              type="button"
                              className="primary-button"
                              disabled={processando === pedido.id}
                              onClick={() => executarAcao(aprovarPedido, pedido.id, "Aprovar pedido")}
                            >
                              Aprovar
                            </button>
                            <button
                              type="button"
                              className="danger-button"
                              disabled={processando === pedido.id}
                              onClick={() => executarAcao(rejeitarPedido, pedido.id, "Rejeitar pedido")}
                            >
                              Rejeitar
                            </button>
                          </>
                        )}
                        {pedido.status === "APROVADO" && pedido.contratoAluguel?.id && (
                          <button
                            type="button"
                            className="ghost-button"
                            disabled={processando === pedido.id}
                            onClick={() => executarAcao(
                              () => encerrarContratoAluguel(pedido.contratoAluguel.id),
                              pedido.id,
                              "Encerrar contrato"
                            )}
                          >
                            Encerrar
                          </button>
                        )}
                        {usuarioLogado?.tipo === "BANCO" && pedido.status === "APROVADO" && !pedido.contratoCredito && onConcederCredito && (
                          <button
                            type="button"
                            className="secondary-button"
                            disabled={processando === pedido.id}
                            onClick={() => onConcederCredito(pedido)}
                          >
                            Credito
                          </button>
                        )}
                        {(pedido.status === "REJEITADO" || pedido.status === "CANCELADO" || pedido.status === "CONCLUIDO") && (
                          <span className="text-muted">—</span>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </>
      )}
    </section>
  );
}
