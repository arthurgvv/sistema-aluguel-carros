import { useEffect, useState } from "react";
import {
  aprovarContratoCredito,
  listarOfertasCreditoCliente,
  recusarContratoCredito
} from "../services/clientesApi";
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

export default function OfertasCreditoPage({ usuarioLogado }) {
  const [ofertas, setOfertas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [processando, setProcessando] = useState(null);

  async function carregar() {
    setCarregando(true);
    setErro("");
    try {
      const lista = await listarOfertasCreditoCliente(usuarioLogado.id);
      setOfertas(lista || []);
    } catch (error) {
      setErro(error.message || "Nao foi possivel carregar as ofertas de credito.");
    } finally {
      setCarregando(false);
    }
  }

  async function decidir(acao, oferta, label) {
    if (!window.confirm(`Confirmar: ${label}?`)) return;
    setProcessando(oferta.id);
    setErro("");
    try {
      await acao(oferta.id);
      setMensagem(`Oferta ${label.toLowerCase()} com sucesso.`);
      await carregar();
    } catch (error) {
      setErro(error.message || `Nao foi possivel ${label.toLowerCase()} a oferta.`);
    } finally {
      setProcessando(null);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  return (
    <section className="page-card">
      <header className="page-header">
        <p className="eyebrow">Credito</p>
        <h1>Ofertas de credito</h1>
        <p className="page-subtitle">
          Avalie as propostas enviadas pelos bancos para seus pedidos.
        </p>
      </header>

      {erro && <p className="feedback error">{erro}</p>}
      {mensagem && <p className="feedback success">{mensagem}</p>}

      {carregando && (
        <div className="empty-state">
          <h2>Carregando ofertas...</h2>
          <p>Aguarde a busca dos registros.</p>
        </div>
      )}

      {!carregando && ofertas.length === 0 && !erro && (
        <div className="empty-state">
          <h2>Nenhuma oferta disponivel</h2>
          <p>Quando um banco enviar uma proposta, ela aparecera aqui.</p>
        </div>
      )}

      {!carregando && ofertas.length > 0 && (
        <>
          <div className="table-toolbar">
            <span className="table-toolbar-title">Minhas ofertas</span>
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
                  <th>Banco</th>
                  <th>Veiculo</th>
                  <th>Valor financiado</th>
                  <th>Parcelas</th>
                  <th>Data emissao</th>
                  <th>Status</th>
                  <th style={{ textAlign: "center" }}>Acoes</th>
                </tr>
              </thead>
              <tbody>
                {ofertas.map((oferta) => (
                  <tr key={oferta.id}>
                    <td>{oferta.id}</td>
                    <td>{oferta.banco?.nomeFantasia || `Banco #${oferta.banco?.id || "—"}`}</td>
                    <td>
                      <div className="vehicle-cell">
                        {srcFotoAutomovel(oferta.pedidoAluguel?.automovel) ? (
                          <img
                            src={srcFotoAutomovel(oferta.pedidoAluguel.automovel)}
                            alt={`${oferta.pedidoAluguel.automovel.marca} ${oferta.pedidoAluguel.automovel.modelo}`}
                            className="car-thumb"
                          />
                        ) : (
                          <div className="car-thumb-placeholder" />
                        )}
                        <span>
                          {oferta.pedidoAluguel?.automovel
                            ? `${oferta.pedidoAluguel.automovel.marca} ${oferta.pedidoAluguel.automovel.modelo}`
                            : `Pedido #${oferta.pedidoAluguel?.id || "—"}`}
                        </span>
                      </div>
                    </td>
                    <td>{formatarMoeda(oferta.valor)}</td>
                    <td>{oferta.parcelas ?? "—"}</td>
                    <td>{formatarData(oferta.dataConcessao)}</td>
                    <td>
                      <span className={`status-badge ${STATUS_CLASS[oferta.status] || ""}`}>
                        {STATUS_LABELS[oferta.status] || oferta.status || "—"}
                      </span>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      {oferta.status === "PENDENTE" ? (
                        <div className="row-actions" style={{ justifyContent: "center" }}>
                          <button
                            type="button"
                            className="primary-button"
                            disabled={processando === oferta.id}
                            onClick={() => decidir(aprovarContratoCredito, oferta, "Aceitar")}
                          >
                            Aceitar
                          </button>
                          <button
                            type="button"
                            className="danger-button"
                            disabled={processando === oferta.id}
                            onClick={() => decidir(recusarContratoCredito, oferta, "Recusar")}
                          >
                            Recusar
                          </button>
                        </div>
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
