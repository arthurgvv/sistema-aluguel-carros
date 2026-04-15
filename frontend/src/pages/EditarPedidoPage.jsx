import { useEffect, useState } from "react";
import { buscarPedidoPorId, listarAutomoveisDisponiveis, modificarPedido } from "../services/clientesApi";

export default function EditarPedidoPage({ pedidoId, onCancelar, onSucesso }) {
  const [formulario, setFormulario] = useState({ dataInicio: "", dataFim: "", automovelId: "" });
  const [automoveis, setAutomoveis] = useState([]);
  const [automovelAtual, setAutomovelAtual] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregar() {
      try {
        const [pedido, disponiveis] = await Promise.all([
          buscarPedidoPorId(pedidoId),
          listarAutomoveisDisponiveis()
        ]);

        setAutomovelAtual(pedido.automovel);

        const todos = [pedido.automovel, ...(disponiveis || []).filter(a => a.id !== pedido.automovel?.id)];
        setAutomoveis(todos);

        setFormulario({
          dataInicio: pedido.dataInicio || "",
          dataFim: pedido.dataFim || "",
          automovelId: pedido.automovel?.id?.toString() || ""
        });
      } catch (error) {
        setErro(error.message || "Nao foi possivel carregar o pedido.");
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, [pedidoId]);

  function atualizarCampo(event) {
    const { name, value } = event.target;
    setFormulario((atual) => ({ ...atual, [name]: value }));
  }

  function calcularValorEstimado() {
    if (!formulario.dataInicio || !formulario.dataFim) return null;
    const dias = Math.ceil((new Date(formulario.dataFim) - new Date(formulario.dataInicio)) / 86400000);
    if (dias <= 0) return null;
    return (dias * 100).toFixed(2);
  }

  async function salvar(event) {
    event.preventDefault();
    setSalvando(true);
    setErro("");
    try {
      await modificarPedido(pedidoId, {
        dataInicio: formulario.dataInicio,
        dataFim: formulario.dataFim,
        automovel: { id: parseInt(formulario.automovelId, 10) }
      });
      onSucesso();
    } catch (error) {
      setErro(error.message || "Nao foi possivel salvar as alteracoes.");
    } finally {
      setSalvando(false);
    }
  }

  const valorEstimado = calcularValorEstimado();

  if (carregando) {
    return (
      <section className="page-card form-page">
        <div className="empty-state"><h2>Carregando pedido...</h2></div>
      </section>
    );
  }

  return (
    <section className="page-card form-page">
      <header className="split-header">
        <div>
          <p className="eyebrow">Pedido #{pedidoId}</p>
          <h1>Editar pedido</h1>
          <p className="page-subtitle">Altere as datas ou o veiculo. Apenas pedidos pendentes podem ser modificados.</p>
        </div>
        <button type="button" className="secondary-button" onClick={onCancelar}>
          Voltar
        </button>
      </header>

      {erro && <p className="feedback error">{erro}</p>}

      <form className="form-card" onSubmit={salvar}>
        <div className="form-grid">
          <label>
            Veiculo *
            <select
              name="automovelId"
              className="form-select"
              value={formulario.automovelId}
              onChange={atualizarCampo}
              required
            >
              {automoveis.map((auto) => (
                <option key={auto.id} value={auto.id}>
                  {auto.marca} {auto.modelo} ({auto.ano}) — Placa: {auto.placa}
                  {auto.id === automovelAtual?.id ? " (atual)" : ""}
                </option>
              ))}
            </select>
          </label>

          <div className="form-grid form-grid--2col">
            <label>
              Data de inicio *
              <input
                name="dataInicio"
                type="date"
                value={formulario.dataInicio}
                onChange={atualizarCampo}
                required
              />
            </label>
            <label>
              Data de devolucao *
              <input
                name="dataFim"
                type="date"
                value={formulario.dataFim}
                onChange={atualizarCampo}
                min={formulario.dataInicio}
                required
              />
            </label>
          </div>

          {valorEstimado && (
            <div className="valor-estimado">
              <span className="valor-estimado-label">Novo valor estimado:</span>
              <span className="valor-estimado-valor">R$ {valorEstimado}</span>
              <span className="valor-estimado-obs">(R$ 100,00 por dia)</span>
            </div>
          )}
        </div>

        <div className="form-actions">
          <button type="button" className="ghost-button" onClick={onCancelar}>Cancelar</button>
          <button type="submit" className="primary-button" disabled={salvando}>
            {salvando ? "Salvando..." : "Salvar alteracoes"}
          </button>
        </div>
      </form>
    </section>
  );
}
