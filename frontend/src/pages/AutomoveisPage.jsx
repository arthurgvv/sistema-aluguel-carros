import { useRef, useEffect, useState } from "react";
import {
  atualizarAutomovel,
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
  isDisponivel: true,
  imagemBase64: null
};

function lerArquivoBase64(arquivo) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(arquivo);
  });
}

export default function AutomoveisPage({ usuarioLogado }) {
  const [automoveis, setAutomoveis] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [formulario, setFormulario] = useState(formularioInicial);
  const [salvando, setSalvando] = useState(false);
  const [uploadando, setUploadando] = useState(null);

  const inputNovaImagem = useRef(null);
  const inputsImagem = useRef({});

  const isAgente = usuarioLogado?.tipoUsuario === "AGENTE";

  async function carregar() {
    setCarregando(true);
    setErro("");
    try {
      const lista = await listarAutomoveis();
      const ordenada = (lista || []).sort((a, b) => {
        if (a.isDisponivel === b.isDisponivel) return 0;
        return a.isDisponivel ? -1 : 1;
      });
      setAutomoveis(ordenada);
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

  async function selecionarImagemNova(event) {
    const arquivo = event.target.files?.[0];
    if (!arquivo) return;
    const base64 = await lerArquivoBase64(arquivo);
    setFormulario((atual) => ({ ...atual, imagemBase64: base64 }));
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

  async function trocarImagem(automovel, event) {
    const arquivo = event.target.files?.[0];
    if (!arquivo) return;
    setUploadando(automovel.id);
    setErro("");
    try {
      const base64 = await lerArquivoBase64(arquivo);
      await atualizarAutomovel(automovel.id, { ...automovel, imagemBase64: base64 });
      setMensagem("Imagem atualizada com sucesso.");
      await carregar();
    } catch (error) {
      setErro(error.message || "Nao foi possivel atualizar a imagem.");
    } finally {
      setUploadando(null);
    }
  }

  return (
    <section className="page-card">
      <header className="split-header">
        <div>
          <p className="eyebrow">Frota de veiculos</p>
          <h1>Automoveis</h1>
          <p className="page-subtitle">
            {isAgente
              ? "Gerencie a frota disponivel para aluguel."
              : "Consulte os veiculos disponiveis para alugar."}
          </p>
        </div>
        <div className="header-actions">
          {isAgente && (
            <button
              type="button"
              className="primary-button btn-gradient"
              onClick={() => { setMostrarFormulario(!mostrarFormulario); setErro(""); }}
            >
              {mostrarFormulario ? "Cancelar" : "+ Novo automovel"}
            </button>
          )}
          <button type="button" className="ghost-button" onClick={carregar}>
            Atualizar
          </button>
        </div>
      </header>

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
            <label className="img-upload-label">
              Foto do veiculo
              <input
                ref={inputNovaImagem}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={selecionarImagemNova}
              />
              <div className="img-upload-area">
                {formulario.imagemBase64 ? (
                  <img src={formulario.imagemBase64} alt="Preview" className="img-upload-preview" />
                ) : (
                  <div className="img-upload-preview-placeholder">Selecionar foto</div>
                )}
                <span className="img-upload-hint">
                  {formulario.imagemBase64 ? "Clique para trocar" : "Clique para selecionar"}
                </span>
              </div>
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
                <th>Foto</th>
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
                  <td
                    style={{ width: "72px", cursor: isAgente ? "pointer" : "default" }}
                    onClick={isAgente ? () => inputsImagem.current[auto.id]?.click() : undefined}
                    title={isAgente ? (uploadando === auto.id ? "Enviando..." : "Clique para trocar a foto") : undefined}
                  >
                    {isAgente && (
                      <input
                        ref={el => { inputsImagem.current[auto.id] = el; }}
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(e) => trocarImagem(auto, e)}
                      />
                    )}
                    {auto.imagemBase64 ? (
                      <img src={auto.imagemBase64} alt={`${auto.marca} ${auto.modelo}`} className="car-thumb" />
                    ) : (
                      <div className="car-thumb-placeholder" />
                    )}
                  </td>
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
