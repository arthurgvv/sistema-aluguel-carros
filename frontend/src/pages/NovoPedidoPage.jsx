import { useEffect, useState } from "react";
import { criarPedido, listarAutomoveisDisponiveis } from "../services/clientesApi";

const formularioInicial = {
  dataInicio: "",
  dataFim: "",
  automovelId: ""
};

export default function NovoPedidoPage({ usuarioLogado, automovelPreSelecionado, onCancelar, onSucesso }) {
  const [formulario, setFormulario] = useState({
    ...formularioInicial,
    automovelId: automovelPreSelecionado?.id ? String(automovelPreSelecionado.id) : ""
  });
  const [automoveis, setAutomoveis] = useState([]);
  const [carregandoAutos, setCarregandoAutos] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarAutomoveis() {
      try {
        const lista = await listarAutomoveisDisponiveis();
        setAutomoveis(lista || []);
      } catch (error) {
        setErro(error.message || "Nao foi possivel carregar os automoveis disponíveis.");
      } finally {
        setCarregandoAutos(false);
      }
    }
    carregarAutomoveis();
  }, []);

  function atualizarCampo(event) {
    const { name, value } = event.target;
    setFormulario((atual) => ({ ...atual, [name]: value }));
  }

  function calcularValorEstimado() {
    if (!formulario.dataInicio || !formulario.dataFim) return null;
    const inicio = new Date(formulario.dataInicio);
    const fim = new Date(formulario.dataFim);
    const dias = Math.ceil((fim - inicio) / (1000 * 60 * 60 * 24));
    if (dias <= 0) return null;
    return (dias * 100).toFixed(2);
  }

  async function salvar(event) {
    event.preventDefault();
    setErro("");

    if (!formulario.automovelId) {
      setErro("Selecione um automovel.");
      return;
    }

    setSalvando(true);
    try {
      await criarPedido({
        cliente: { id: usuarioLogado.id },
        automovel: { id: parseInt(formulario.automovelId, 10) },
        dataInicio: formulario.dataInicio,
        dataFim: formulario.dataFim
      });
      onSucesso();
    } catch (error) {
      setErro(error.message || "Nao foi possivel criar o pedido.");
    } finally {
      setSalvando(false);
    }
  }

  const valorEstimado = calcularValorEstimado();

  return (
    <section className="page-card form-page">
      <header className="split-header">
        <div>
          <p className="eyebrow">Novo pedido de aluguel</p>
          <h1>Solicitar aluguel</h1>
          <p className="page-subtitle">Escolha o veiculo e o periodo desejado para solicitar o aluguel.</p>
        </div>
        <button type="button" className="secondary-button" onClick={onCancelar}>
          Voltar
        </button>
      </header>

      {erro && <p className="feedback error">{erro}</p>}

      <form className="form-card" onSubmit={salvar}>
        <div className="form-grid">
          <label>
            Automovel *
            {automovelPreSelecionado ? (
              <input
                disabled
                value={`${automovelPreSelecionado.marca} ${automovelPreSelecionado.modelo} (${automovelPreSelecionado.ano}) — Placa: ${automovelPreSelecionado.placa}`}
              />
            ) : carregandoAutos ? (
              <input disabled value="Carregando automoveis disponíveis..." />
            ) : automoveis.length === 0 ? (
              <input disabled value="Nenhum automovel disponivel no momento" />
            ) : (
              <select
                name="automovelId"
                className="form-select"
                value={formulario.automovelId}
                onChange={atualizarCampo}
                required
              >
                <option value="">Selecione um automovel...</option>
                {automoveis.map((auto) => (
                  <option key={auto.id} value={auto.id}>
                    {auto.marca} {auto.modelo} ({auto.ano}) — Placa: {auto.placa}
                  </option>
                ))}
              </select>
            )}
          </label>

          <div className="form-grid form-grid--2col">
            <label>
              Data de inicio *
              <input
                name="dataInicio"
                type="date"
                value={formulario.dataInicio}
                onChange={atualizarCampo}
                min={new Date().toISOString().split("T")[0]}
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
                min={formulario.dataInicio || new Date().toISOString().split("T")[0]}
                required
              />
            </label>
          </div>

          {valorEstimado && (
            <div className="valor-estimado">
              <span className="valor-estimado-label">Valor estimado:</span>
              <span className="valor-estimado-valor">R$ {valorEstimado}</span>
              <span className="valor-estimado-obs">(R$ 100,00 por dia)</span>
            </div>
          )}
        </div>

        <div className="form-actions">
          <button type="button" className="ghost-button" onClick={onCancelar}>
            Cancelar
          </button>
          <button type="submit" className="primary-button" disabled={salvando || automoveis.length === 0}>
            {salvando ? "Enviando pedido..." : "Enviar pedido"}
          </button>
        </div>
      </form>
    </section>
  );
}
