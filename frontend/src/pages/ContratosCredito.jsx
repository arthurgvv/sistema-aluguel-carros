import { useEffect, useState } from "react";
import { cancelarContratoCredito, listarContratosCredito } from "../services/clientesApi";
import { srcFotoAutomovel } from "../utils/fotoAutomovelLocal";

const STATUS_LABELS = {
  PENDENTE: "Pendente",
  APROVADO: "Aprovado",
  RECUSADO: "Recusado",
  CANCELADO: "Cancelado"
};

const STATUS_CLASS = {
  PENDENTE: "status-badge--pendente",
  APROVADO: "status-badge--aprovado",
  RECUSADO: "status-badge--rejeitado",
  CANCELADO: "status-badge--cancelado"
};

function formatarMoeda(valor) {
  if (valor == null) return "—";
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor);
}

function formatarData(data) {
  if (!data) return "—";
  return new Date(data).toLocaleDateString("pt-BR");
}

export default function ContratosCredito({ usuarioLogado }) {
  const [contratos, setContratos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [processando, setProcessando] = useState(null);

  async function carregar() {
    setCarregando(true);
    setErro("");
    try {
      const lista = await listarContratosCredito();
      setContratos(lista || []);
    } catch (error) {
      setErro(error.message || "Nao foi possivel carregar os contratos de credito.");
    } finally {
      setCarregando(false);
    }
  }

  async function cancelar(id) {
    if (!window.confirm("Confirmar cancelamento deste contrato?")) return;
    setProcessando(id);
    setErro("");
    try {
      await cancelarContratoCredito(id);
      setMensagem("Contrato cancelado com sucesso.");
      await carregar();
    } catch (error) {
      setErro(error.message || "Nao foi possivel cancelar o contrato.");
    } finally {
      setProcessando(null);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  const totalConcedido = contratos
    .filter(c => c.status === "APROVADO" || c.status === "PENDENTE")
    .reduce((acc, c) => acc + (c.valor || 0), 0);

  return (
    <section className="page-card">
      <header className="split-header">
        <div>
          <p className="eyebrow">Painel do banco</p>
          <h1>Contratos de credito</h1>
          <p className="page-subtitle">
            Creditos concedidos pelo banco para financiamento de alugueis.
          </p>
        </div>
        <div className="header-actions">
          <button type="button" className="ghost-button" onClick={carregar}>
            Atualizar
          </button>
        </div>
      </header>

      {!carregando && contratos.length > 0 && (
        <div className="stat-cards">
          <div className="stat-card">
            <p className="stat-card-label">Total concedido</p>
            <p className="stat-card-value">{formatarMoeda(totalConcedido)}</p>
            <p className="stat-card-sub">
              {contratos.filter(c => c.status === "APROVADO").length} contrato(s) aprovado(s)
            </p>
          </div>
          <div className="stat-card">
            <p className="stat-card-label">Contratos emitidos</p>
            <p className="stat-card-value">{contratos.length}</p>
            <p className="stat-card-sub">
              {contratos.filter(c => c.status === "RECUSADO").length} recusado(s)
            </p>
          </div>
        </div>
      )}

      {erro && <p className="feedback error">{erro}</p>}
      {mensagem && <p className="feedback success">{mensagem}</p>}

      {carregando && (
        <div className="empty-state">
          <h2>Carregando contratos...</h2>
          <p>Aguarde a busca dos registros.</p>
        </div>
      )}

      {!carregando && contratos.length === 0 && !erro && (
        <div className="empty-state">
          <h2>Nenhum contrato de credito emitido</h2>
          <p>Os contratos aparecerao aqui apos serem concedidos na tela de Pedidos.</p>
        </div>
      )}

      {!carregando && contratos.length > 0 && (
        <>
          <div className="table-toolbar">
            <span className="table-toolbar-title">Contratos de credito</span>
          </div>
          <div className="table-wrapper">
            <table className="clients-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Cliente</th>
                  <th>Veiculo</th>
                  <th>Valor financiado</th>
                  <th>Parcelas</th>
                  <th>Data emissao</th>
                  <th>Status</th>
                  <th style={{ textAlign: "center" }}>Acoes</th>
                </tr>
              </thead>
              <tbody>
                {contratos.map((contrato) => (
                  <tr key={contrato.id}>
                    <td>{contrato.id}</td>
                    <td>
                      {contrato.pedidoAluguel?.cliente?.nome
                        || `Cliente #${contrato.pedidoAluguel?.cliente?.id || "—"}`}
                    </td>
                    <td>
                      <div className="vehicle-cell">
                        {srcFotoAutomovel(contrato.pedidoAluguel?.automovel) ? (
                          <img
                            src={srcFotoAutomovel(contrato.pedidoAluguel.automovel)}
                            alt={`${contrato.pedidoAluguel.automovel.marca} ${contrato.pedidoAluguel.automovel.modelo}`}
                            className="car-thumb"
                          />
                        ) : (
                          <div className="car-thumb-placeholder" />
                        )}
                        <span>
                          {contrato.pedidoAluguel?.automovel
                            ? `${contrato.pedidoAluguel.automovel.marca} ${contrato.pedidoAluguel.automovel.modelo}`
                            : `Pedido #${contrato.pedidoAluguel?.id || "—"}`}
                        </span>
                      </div>
                    </td>
                    <td>{formatarMoeda(contrato.valor)}</td>
                    <td>{contrato.parcelas ?? "—"}</td>
                    <td>{formatarData(contrato.dataConcessao)}</td>
                    <td>
                      <span className={`status-badge ${STATUS_CLASS[contrato.status] || ""}`}>
                        {STATUS_LABELS[contrato.status] || contrato.status || "—"}
                      </span>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      {contrato.status === "PENDENTE" ? (
                        <button
                          type="button"
                          className="danger-button"
                          disabled={processando === contrato.id}
                          onClick={() => cancelar(contrato.id)}
                        >
                          Cancelar
                        </button>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
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
