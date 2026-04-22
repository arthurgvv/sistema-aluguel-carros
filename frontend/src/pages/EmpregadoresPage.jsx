import { useEffect, useState } from "react";
import { adicionarEmpregador, buscarClientePorId, removerEmpregador } from "../services/clientesApi";

const formInicial = { nomeEmpresa: "", rendimento: "" };

export default function EmpregadoresPage({ usuarioLogado }) {
  const [empregadores, setEmpregadores] = useState([]);
  const [formulario, setFormulario] = useState(formInicial);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [removendo, setRemovendo] = useState(null);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  async function carregar() {
    setCarregando(true);
    setErro("");
    try {
      const cliente = await buscarClientePorId(usuarioLogado.id);
      setEmpregadores(cliente.empregadores || []);
    } catch (error) {
      setErro(error.message || "Nao foi possivel carregar os empregadores.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => { carregar(); }, []);

  function atualizarCampo(event) {
    const { name, value } = event.target;
    setFormulario((atual) => ({ ...atual, [name]: value }));
  }

  async function adicionar(event) {
    event.preventDefault();
    if (empregadores.length >= 3) {
      setErro("Limite de 3 empregadores atingido.");
      return;
    }
    setSalvando(true);
    setErro("");
    setMensagem("");
    try {
      await adicionarEmpregador(usuarioLogado.id, {
        nomeEmpresa: formulario.nomeEmpresa,
        rendimento: parseFloat(formulario.rendimento)
      });
      setFormulario(formInicial);
      setMensagem("Empregador adicionado com sucesso.");
      await carregar();
    } catch (error) {
      setErro(error.message || "Nao foi possivel adicionar o empregador.");
    } finally {
      setSalvando(false);
    }
  }

  async function remover(empregadorId) {
    if (!window.confirm("Remover este empregador?")) return;
    setRemovendo(empregadorId);
    setErro("");
    setMensagem("");
    try {
      await removerEmpregador(usuarioLogado.id, empregadorId);
      setMensagem("Empregador removido.");
      await carregar();
    } catch (error) {
      setErro(error.message || "Nao foi possivel remover o empregador.");
    } finally {
      setRemovendo(null);
    }
  }

  function formatarMoeda(valor) {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor);
  }

  return (
    <section className="page-card form-page">
      <header className="page-header">
        <p className="eyebrow">Conta</p>
        <h1>Empregadores</h1>
        <p className="page-subtitle">
          Gerencie suas fontes de renda. Maximo de 3 empregadores.
        </p>
      </header>

      {erro && <p className="feedback error">{erro}</p>}
      {mensagem && <p className="feedback success">{mensagem}</p>}

      {carregando ? (
        <div className="empty-state"><h2>Carregando...</h2></div>
      ) : (
        <>
          {empregadores.length === 0 ? (
            <div className="empty-state">
              <h2>Nenhum empregador cadastrado</h2>
              <p>Adicione abaixo suas fontes de renda.</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="clients-table">
                <thead>
                  <tr>
                    <th>Empresa</th>
                    <th>Rendimento</th>
                    <th>Acao</th>
                  </tr>
                </thead>
                <tbody>
                  {empregadores.map((emp) => (
                    <tr key={emp.id}>
                      <td>{emp.nomeEmpresa}</td>
                      <td>{formatarMoeda(emp.rendimento)}</td>
                      <td>
                        <button
                          type="button"
                          className="danger-button"
                          disabled={removendo === emp.id}
                          onClick={() => remover(emp.id)}
                        >
                          {removendo === emp.id ? "Removendo..." : "Remover"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {empregadores.length < 3 && (
            <form className="form-card" onSubmit={adicionar} style={{ marginTop: "24px" }}>
              <p className="eyebrow">Adicionar empregador ({empregadores.length}/3)</p>
              <div className="form-grid form-grid--2col">
                <label>
                  Nome da empresa *
                  <input
                    name="nomeEmpresa"
                    type="text"
                    placeholder="Ex: Empresa ABC Ltda"
                    value={formulario.nomeEmpresa}
                    onChange={atualizarCampo}
                    required
                  />
                </label>
                <label>
                  Rendimento mensal (R$) *
                  <input
                    name="rendimento"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Ex: 5000.00"
                    value={formulario.rendimento}
                    onChange={atualizarCampo}
                    required
                  />
                </label>
              </div>
              <div className="form-actions">
                <button type="submit" className="primary-button" disabled={salvando}>
                  {salvando ? "Adicionando..." : "+ Adicionar"}
                </button>
              </div>
            </form>
          )}
        </>
      )}
    </section>
  );
}
