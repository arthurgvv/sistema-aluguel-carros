import { useEffect, useState } from "react";
import { listarContratosCredito } from "../services/clientesApi";

const STATUS_LABELS = {
  ATIVO: "Ativo",
  ENCERRADO: "Encerrado",
  RECUSADO: "Recusado",
  PENDENTE: "Pendente"
};

const STATUS_CLASS = {
  ATIVO: "status-badge--aprovado",
  ENCERRADO: "status-badge--concluido",
  RECUSADO: "status-badge--rejeitado",
  PENDENTE: "status-badge--pendente"
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

  useEffect(() => {
    carregar();
  }, []);

  const totalConcedido = contratos
    .filter(c => c.status === "ATIVO" || c.status === "ENCERRADO")
    .reduce((acc, c) => acc + (c.valorFinanciado || 0), 0);

  return (
    <section className="page-card">
      <header className="page-header">
        <p className="eyebrow">Painel do banco</p>
        <h1>Contratos de credito</h1>
        <p className="page-subtitle">
          Creditos concedidos pelo banco para financiamento de alugueis.
        </p>
      </header>

      {!carregando && contratos.length > 0 && (
        <div className="stat-cards">
          <div className="stat-card">
            <p className="stat-card-label">Total concedido</p>
            <p className="stat-card-value">{formatarMoeda(totalConcedido)}</p>
            <p className="stat-card-sub">
              {contratos.filter(c => c.status === "ATIVO").length} contrato(s) ativo(s)
            </p>
          </div>
          <div className="stat-card">
            <p className="stat-card-label">Contratos emitidos</p>
            <p className="stat-card-value">{contratos.length}</p>
            <p className="stat-card-sub">
              {contratos.filter(c => c.status === "ENCERRADO").length} encerrado(s)
            </p>
          </div>
        </div>
      )}

      {erro && <p className="feedback error">{erro}</p>}

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
            <div className="header-actions">
              <button type="button" className="ghost-button" onClick={carregar}>
                Atualizar
              </button>
            </div>
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
                  <th>Valor parcela</th>
                  <th>Data emissao</th>
                  <th>Status</th>
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
                      {contrato.pedidoAluguel?.automovel
                        ? `${contrato.pedidoAluguel.automovel.marca} ${contrato.pedidoAluguel.automovel.modelo}`
                        : `Pedido #${contrato.pedidoAluguel?.id || "—"}`}
                    </td>
                    <td>{formatarMoeda(contrato.valorFinanciado)}</td>
                    <td>{contrato.numeroParcelas ?? "—"}</td>
                    <td>{formatarMoeda(contrato.valorParcela)}</td>
                    <td>{formatarData(contrato.dataEmissao || contrato.dataCriacao)}</td>
                    <td>
                      <span className={`status-badge ${STATUS_CLASS[contrato.status] || ""}`}>
                        {STATUS_LABELS[contrato.status] || contrato.status || "—"}
                      </span>
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
