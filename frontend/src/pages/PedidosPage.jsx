import { useEffect, useState } from "react";
import {
  aprovarPedido,
  avaliarPedido,
  cancelarPedido,
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

export default function PedidosPage({ usuarioLogado, onNovoPedido, onSair, onVoltar }) {
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

  return (
    <section className="page-card">
      <header className="split-header">
        <div>
          <p className="eyebrow">{isAgente ? "Painel do agente" : "Meus pedidos"}</p>
          <h1>Pedidos de aluguel</h1>
          <p className="page-subtitle">
            {isAgente
              ? "Avalie, aprove ou rejeite os pedidos de aluguel dos clientes."
              : "Acompanhe o status dos seus pedidos de aluguel."}
          </p>
        </div>
        <div className="header-actions">
          <div className="user-chip">
            <strong>{usuarioLogado?.nome || usuarioLogado?.nomeFantasia || usuarioLogado?.login}</strong>
            <span>{usuarioLogado?.tipoUsuario}</span>
          </div>
          {onVoltar && (
            <button type="button" className="ghost-button" onClick={onVoltar}>
              Voltar
            </button>
          )}
          <button type="button" className="secondary-button" onClick={onSair}>
            Sair
          </button>
        </div>
      </header>

      <div className="toolbar">
        {!isAgente && onNovoPedido && (
          <button type="button" className="primary-button" onClick={onNovoPedido}>
            + Novo pedido
          </button>
        )}
        <button type="button" className="ghost-button" onClick={carregar}>
          Atualizar
        </button>
      </div>

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
        <div className="table-wrapper">
          <table className="clients-table">
            <thead>
              <tr>
                <th>ID</th>
                {isAgente && <th>Cliente</th>}
                <th>Veiculo</th>
                <th>Periodo</th>
                <th>Valor</th>
                <th>Status</th>
                <th>Acoes</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((pedido) => (
                <tr key={pedido.id}>
                  <td>#{pedido.id}</td>
                  {isAgente && (
                    <td>{pedido.cliente?.nome || `Cliente #${pedido.cliente?.id}`}</td>
                  )}
                  <td>
                    {pedido.automovel
                      ? `${pedido.automovel.marca} ${pedido.automovel.modelo}`
                      : `Auto #${pedido.automovel?.id}`}
                  </td>
                  <td>
                    {formatarData(pedido.dataInicio)} a {formatarData(pedido.dataFim)}
                  </td>
                  <td>{formatarMoeda(pedido.valorTotal)}</td>
                  <td>
                    <span className={`status-badge ${STATUS_CLASS[pedido.status] || ""}`}>
                      {STATUS_LABELS[pedido.status] || pedido.status}
                    </span>
                  </td>
                  <td>
                    <div className="row-actions">
                      {/* Client actions */}
                      {!isAgente && (pedido.status === "PENDENTE" || pedido.status === "EM_ANALISE") && (
                        <button
                          type="button"
                          className="danger-button"
                          disabled={processando === pedido.id}
                          onClick={() => executarAcao(cancelarPedido, pedido.id, "Cancelar pedido")}
                        >
                          Cancelar
                        </button>
                      )}

                      {/* Agent actions */}
                      {isAgente && pedido.status === "PENDENTE" && (
                        <button
                          type="button"
                          className="secondary-button"
                          disabled={processando === pedido.id}
                          onClick={() => executarAcao(avaliarPedido, pedido.id, "Iniciar analise")}
                        >
                          Analisar
                        </button>
                      )}
                      {isAgente && (pedido.status === "PENDENTE" || pedido.status === "EM_ANALISE") && (
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

                      {/* No actions available */}
                      {(pedido.status === "APROVADO" || pedido.status === "REJEITADO" ||
                        pedido.status === "CANCELADO" || pedido.status === "CONCLUIDO") && (
                        <span className="text-muted">—</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
