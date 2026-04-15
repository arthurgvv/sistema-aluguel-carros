import { useState } from "react";
import { criarContratoCredito } from "../services/clientesApi";

const formInicial = { valor: "", parcelas: "12" };

export default function ContratoCreditoPage({ pedido, usuarioLogado, onCancelar, onSucesso }) {
  const [formulario, setFormulario] = useState(formInicial);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  function atualizarCampo(event) {
    const { name, value } = event.target;
    setFormulario((atual) => ({ ...atual, [name]: value }));
  }

  function calcularParcela() {
    if (!formulario.valor || !formulario.parcelas) return null;
    const taxaMensal = (usuarioLogado?.taxaJuros ?? 2) / 100;
    const n = parseInt(formulario.parcelas, 10);
    const pv = parseFloat(formulario.valor);
    if (n <= 0 || pv <= 0) return null;
    const parcela = (pv * taxaMensal) / (1 - Math.pow(1 + taxaMensal, -n));
    return parcela.toFixed(2);
  }

  async function salvar(event) {
    event.preventDefault();
    setSalvando(true);
    setErro("");
    try {
      await criarContratoCredito({
        valor: parseFloat(formulario.valor),
        parcelas: parseInt(formulario.parcelas, 10),
        banco: { id: usuarioLogado.id },
        pedidoAluguel: { id: pedido.id }
      });
      onSucesso();
    } catch (error) {
      setErro(error.message || "Nao foi possivel criar o contrato de credito.");
    } finally {
      setSalvando(false);
    }
  }

  const valorParcela = calcularParcela();

  return (
    <section className="page-card form-page">
      <header className="split-header">
        <div>
          <p className="eyebrow">Pedido #{pedido.id} — {pedido.cliente?.nome}</p>
          <h1>Contrato de credito</h1>
          <p className="page-subtitle">
            Defina o valor financiado e o numero de parcelas para este pedido.
          </p>
        </div>
        <button type="button" className="secondary-button" onClick={onCancelar}>
          Voltar
        </button>
      </header>

      {erro && <p className="feedback error">{erro}</p>}

      <form className="form-card" onSubmit={salvar}>
        <div className="form-grid">
          <div className="form-grid form-grid--2col">
            <label>
              Valor financiado (R$) *
              <input
                name="valor"
                type="number"
                min="0"
                step="0.01"
                placeholder="Ex: 15000.00"
                value={formulario.valor}
                onChange={atualizarCampo}
                required
              />
            </label>
            <label>
              Numero de parcelas *
              <input
                name="parcelas"
                type="number"
                min="1"
                max="60"
                placeholder="Ex: 12"
                value={formulario.parcelas}
                onChange={atualizarCampo}
                required
              />
            </label>
          </div>

          {valorParcela && (
            <div className="valor-estimado">
              <span className="valor-estimado-label">Parcela estimada:</span>
              <span className="valor-estimado-valor">R$ {valorParcela}</span>
              <span className="valor-estimado-obs">(taxa {usuarioLogado?.taxaJuros ?? 2}% a.m.)</span>
            </div>
          )}
        </div>

        <div className="form-actions">
          <button type="button" className="ghost-button" onClick={onCancelar}>Cancelar</button>
          <button type="submit" className="primary-button" disabled={salvando}>
            {salvando ? "Criando contrato..." : "Conceder credito"}
          </button>
        </div>
      </form>
    </section>
  );
}
