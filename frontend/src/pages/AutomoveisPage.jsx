import { useRef, useEffect, useState } from "react";
import {
  atualizarAutomovel,
  cadastrarAutomovel,
  deletarAutomovel,
  listarAutomoveis,
  marcarAutomovelDisponivel,
  marcarAutomovelIndisponivel
} from "../services/clientesApi";
import { srcFotoAutomovel } from "../utils/fotoAutomovelLocal";

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

export default function AutomoveisPage({
  usuarioLogado,
  onSelecionarAutomovel,
  onEntrar,
  acaoSelecionarLabel = "Selecionar carro"
}) {
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
  const podeSelecionar = !isAgente && typeof onSelecionarAutomovel === "function";

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
          {!usuarioLogado && typeof onEntrar === "function" && (
            <button type="button" className="primary-button btn-gradient" onClick={onEntrar}>
              Entrar
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
        <div className="cars-grid">
          {automoveis.map((auto) => {
            const fotoSrc = srcFotoAutomovel(auto);
            return (
            <div
              key={auto.id}
              className={`car-card${podeSelecionar && auto.isDisponivel ? " car-card--selectable" : ""}`}
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

              <div className="car-card-photo">
                {fotoSrc ? (
                  <img src={fotoSrc} alt={`${auto.marca} ${auto.modelo}`} />
                ) : (
                  <div className="car-card-photo-placeholder">
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1l2-3h12l2 3h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2" />
                      <circle cx="12" cy="13" r="3" />
                    </svg>
                  </div>
                )}

                <div className="car-card-status">
                  <span className={`status-badge ${auto.isDisponivel ? "status-badge--disponivel" : "status-badge--indisponivel"}`}>
                    {auto.isDisponivel ? "Disponivel" : "Indisponivel"}
                  </span>
                </div>

                {isAgente && (
                  <div
                    className="car-card-upload-overlay"
                    onClick={() => inputsImagem.current[auto.id]?.click()}
                    title={uploadando === auto.id ? "Enviando..." : "Trocar foto"}
                  >
                    <span>{uploadando === auto.id ? "Enviando..." : "Trocar foto"}</span>
                  </div>
                )}
              </div>

              <div className="car-card-body">
                <div className="car-card-title">
                  <strong>{auto.marca}</strong> {auto.modelo}
                </div>
                <div className="car-card-meta">
                  <span>{auto.placa}</span>
                  <span className="car-card-meta-sep">·</span>
                  <span>{auto.ano}</span>
                </div>
              </div>

              {isAgente && (
                <div className="car-card-actions">
                  <button
                    type="button"
                    className={auto.isDisponivel ? "ghost-button" : "secondary-button"}
                    onClick={() => alternarDisponibilidade(auto)}
                  >
                    {auto.isDisponivel ? "Indisponivel" : "Disponivel"}
                  </button>
                  <button
                    type="button"
                    className="danger-button"
                    onClick={() => excluir(auto.id)}
                  >
                    Excluir
                  </button>
                </div>
              )}

              {!isAgente && podeSelecionar && (
                <div className="car-card-actions">
                  <button
                    type="button"
                    className="primary-button btn-gradient"
                    disabled={!auto.isDisponivel}
                    onClick={() => onSelecionarAutomovel(auto)}
                  >
                    {auto.isDisponivel ? acaoSelecionarLabel : "Indisponivel"}
                  </button>
                </div>
              )}
            </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
