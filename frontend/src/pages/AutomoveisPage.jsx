import { useEffect, useState } from "react";
import {
  cadastrarAutomovel,
  deletarAutomovel,
  listarAutomoveis,
  marcarAutomovelDisponivel,
  marcarAutomovelIndisponivel
} from "../services/clientesApi";

const formularioInicial = {
  matricula: "",
  placa: "",
  marca: "",
  modelo: "",
  ano: "",
  isDisponivel: true
};

export default function AutomoveisPage({ usuarioLogado, onSair, onVoltar }) {
  const [automoveis, setAutomoveis] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [formulario, setFormulario] = useState(formularioInicial);
  const [salvando, setSalvando] = useState(false);

  const isAgente = usuarioLogado?.tipoUsuario === "AGENTE";

  async function carregar() {
    setCarregando(true);
    setErro("");
    try {
      const lista = await listarAutomoveis();
      setAutomoveis(lista || []);
    } catch (error) {
      setErro(error.message || "Nao foi possivel carregar os automoveis.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  function atualizarCampo(event) {
    const { name, value, type, checked } = event.target;
    setFormulario((atual) => ({
      ...atual,
      [name]: type === "checkbox" ? checked : value
    }));
  }

  async function salvar(event) {
    event.preventDefault();
    setSalvando(true);
    setErro("");
    try {
      await cadastrarAutomovel({
        ...formulario,
        ano: parseInt(formulario.ano, 10)
      });
      setFormulario(formularioInicial);
      setMostrarFormulario(false);
      setMensagem("Automovel cadastrado com sucesso.");
      await carregar();
    } catch (error) {
      setErro(error.message || "Nao foi possivel cadastrar o automovel.");
    } finally {
      setSalvando(false);
    }
  }

  async function alternarDisponibilidade(automovel) {
    try {
      if (automovel.isDisponivel) {
        await marcarAutomovelIndisponivel(automovel.id);
        setMensagem("Automovel marcado como indisponivel.");
      } else {
        await marcarAutomovelDisponivel(automovel.id);
        setMensagem("Automovel marcado como disponivel.");
      }
      await carregar();
    } catch (error) {
      setErro(error.message || "Nao foi possivel alterar a disponibilidade.");
    }
  }

  async function excluir(id) {
    if (!window.confirm("Deseja realmente excluir este automovel?")) return;
    try {
      await deletarAutomovel(id);
      setMensagem("Automovel excluido com sucesso.");
      await carregar();
    } catch (error) {
      setErro(error.message || "Nao foi possivel excluir o automovel.");
    }
  }

  return (
    <section className="page-card">
      <header className="split-header">
        <div>
          <p className="eyebrow">Frota de veiculos</p>
          <h1>Automoveis</h1>
          <p className="page-subtitle">Visualize e gerencie a frota disponivel para aluguel.</p>
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
        {isAgente && (
          <button
            type="button"
            className="primary-button"
            onClick={() => { setMostrarFormulario(!mostrarFormulario); setErro(""); }}
          >
            {mostrarFormulario ? "Cancelar" : "+ Novo automovel"}
          </button>
        )}
        <button type="button" className="ghost-button" onClick={carregar}>
          Atualizar
        </button>
      </div>

      {mostrarFormulario && isAgente && (
        <form className="form-card" onSubmit={salvar} style={{ marginBottom: "24px" }}>
          <p className="eyebrow" style={{ marginBottom: "16px" }}>Novo automovel</p>
          <div className="form-grid form-grid--2col">
            <label>
              Matricula *
              <input name="matricula" value={formulario.matricula} onChange={atualizarCampo} required />
            </label>
            <label>
              Placa *
              <input name="placa" value={formulario.placa} onChange={atualizarCampo} required />
            </label>
            <label>
              Marca *
              <input name="marca" value={formulario.marca} onChange={atualizarCampo} required />
            </label>
            <label>
              Modelo *
              <input name="modelo" value={formulario.modelo} onChange={atualizarCampo} required />
            </label>
            <label>
              Ano *
              <input name="ano" type="number" min="1900" max="2100" value={formulario.ano} onChange={atualizarCampo} required />
            </label>
          </div>
          <div className="form-actions">
            <button type="submit" className="primary-button" disabled={salvando}>
              {salvando ? "Salvando..." : "Cadastrar automovel"}
            </button>
          </div>
        </form>
      )}

      {erro && <p className="feedback error">{erro}</p>}
      {mensagem && <p className="feedback success">{mensagem}</p>}

      {carregando && (
        <div className="empty-state">
          <h2>Carregando...</h2>
          <p>Buscando veiculos no banco de dados.</p>
        </div>
      )}

      {!carregando && automoveis.length === 0 && (
        <div className="empty-state">
          <h2>Nenhum automovel cadastrado</h2>
          {isAgente && <p>Adicione o primeiro veiculo clicando em &ldquo;Novo automovel&rdquo;.</p>}
        </div>
      )}

      {!carregando && automoveis.length > 0 && (
        <div className="table-wrapper">
          <table className="clients-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Marca / Modelo</th>
                <th>Placa</th>
                <th>Ano</th>
                <th>Status</th>
                {isAgente && <th>Acoes</th>}
              </tr>
            </thead>
            <tbody>
              {automoveis.map((auto) => (
                <tr key={auto.id}>
                  <td>{auto.id}</td>
                  <td>
                    <strong>{auto.marca}</strong> {auto.modelo}
                  </td>
                  <td>{auto.placa}</td>
                  <td>{auto.ano}</td>
                  <td>
                    <span className={`status-badge ${auto.isDisponivel ? "status-badge--disponivel" : "status-badge--indisponivel"}`}>
                      {auto.isDisponivel ? "Disponivel" : "Indisponivel"}
                    </span>
                  </td>
                  {isAgente && (
                    <td>
                      <div className="row-actions">
                        <button
                          type="button"
                          className={auto.isDisponivel ? "ghost-button" : "secondary-button"}
                          onClick={() => alternarDisponibilidade(auto)}
                        >
                          {auto.isDisponivel ? "Tornar indisponivel" : "Tornar disponivel"}
                        </button>
                        <button
                          type="button"
                          className="danger-button"
                          onClick={() => excluir(auto.id)}
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
