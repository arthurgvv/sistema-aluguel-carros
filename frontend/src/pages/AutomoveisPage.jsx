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
import LocationPicker from "../components/LocationPicker";
import DatePicker from "../components/DatePicker";

const CATEGORIAS = {
  golf: "Hatchback", polo: "Hatchback", clio: "Hatchback", yaris: "Hatchback",
  "208": "Hatchback", "3008": "SUV", tiguan: "SUV", q5: "SUV", rav4: "SUV",
  corolla: "Sedan", a4: "Sedan", "c-class": "Sedan", "3 series": "Sedan",
  passat: "Sedan", octavia: "Sedan",
  sportage: "SUV", xc60: "SUV", discovery: "SUV", x3: "SUV", "hr-v": "SUV",
  territory: "SUV", "gla": "SUV", hilux: "Picape",
};

const TRANSMISSAO = {
  clio: "Manual", "208": "Manual", yaris: "Manual", passat: "Manual", octavia: "Manual",
};

const COMBUSTIVEL = {
  corolla: "Híbrido", rav4: "Híbrido", xc60: "Híbrido",
  golf: "Flex", polo: "Flex", clio: "Flex", yaris: "Flex", "208": "Flex",
  tiguan: "Flex", passat: "Flex", territory: "Flex", "hr-v": "Flex", hilux: "Flex",
  sportage: "Gasolina", octavia: "Gasolina",
  a4: "Gasolina", "c-class": "Gasolina", "3 series": "Gasolina", q5: "Gasolina",
  discovery: "Gasolina", x3: "Gasolina", gla: "Gasolina",
};

function normalize(s) {
  return String(s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
function getCategoria(modelo) { return CATEGORIAS[normalize(modelo)] ?? "Automóvel"; }
function getTransmissao(modelo) { return TRANSMISSAO[normalize(modelo)] ?? "Automático"; }
function getCombustivel(modelo) { return COMBUSTIVEL[normalize(modelo)] ?? "Flex"; }

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
  const [busca, setBusca] = useState({ retirada: "", devolucao: "", dataRetirada: "", dataDevolucao: "" });
  const [devolucaoIgual, setDevolucaoIgual] = useState(true);
  const [erroBusca, setErroBusca] = useState("");
  const [resultadosBusca, setResultadosBusca] = useState(null);
  const [filtroAtivo, setFiltroAtivo] = useState("todos");
  const [buscaTexto, setBuscaTexto] = useState("");

  const inputNovaImagem = useRef(null);
  const inputsImagem = useRef({});

  const isAgente = usuarioLogado?.tipoUsuario === "AGENTE";
  const podeSelecionar = !isAgente && typeof onSelecionarAutomovel === "function";

  function handleBuscar() {
    if (!busca.retirada.trim()) { setErroBusca("Informe o local de retirada."); return; }
    if (!busca.dataRetirada) { setErroBusca("Informe a data de retirada."); return; }
    if (!busca.dataDevolucao) { setErroBusca("Informe a data de devolução."); return; }
    if (busca.dataRetirada >= busca.dataDevolucao) { setErroBusca("A data de devolução deve ser após a de retirada."); return; }
    setErroBusca("");
    setResultadosBusca(automoveis.filter((a) => a.isDisponivel));
  }

  function limparBusca() {
    setBusca({ retirada: "", devolucao: "", dataRetirada: "", dataDevolucao: "" });
    setDevolucaoIgual(true);
    setErroBusca("");
    setResultadosBusca(null);
  }

  const FILTROS = [
    { id: "todos",     label: "Todos",      icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg> },
    { id: "eletrico",  label: "Elétrico",   icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> },
    { id: "esportivo", label: "Esportivo",  icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 17l4-8h10l4 8"/><circle cx="7.5" cy="17" r="1.5"/><circle cx="16.5" cy="17" r="1.5"/></svg> },
    { id: "luxo",      label: "Luxo",       icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> },
    { id: "suv",       label: "SUV",        icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1l3-4h8l3 4h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2"/><circle cx="7.5" cy="17" r="2.5"/><circle cx="16.5" cy="17" r="2.5"/></svg> },
  ];

  function filtrarAutomoveis(lista) {
    let resultado = lista;
    if (filtroAtivo === "eletrico") resultado = resultado.filter(a => getCombustivel(a.modelo) === "Híbrido");
    else if (filtroAtivo === "suv") resultado = resultado.filter(a => getCategoria(a.modelo) === "SUV");
    else if (filtroAtivo === "luxo") resultado = resultado.filter(a => ["BMW","Mercedes-Benz","Audi","Volvo","Land Rover"].includes(a.marca));
    else if (filtroAtivo === "esportivo") resultado = resultado.filter(a => ["Sedan","Hatchback"].includes(getCategoria(a.modelo)));
    if (buscaTexto.trim()) {
      const t = buscaTexto.toLowerCase();
      resultado = resultado.filter(a => `${a.marca} ${a.modelo}`.toLowerCase().includes(t));
    }
    return resultado;
  }

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

      {/* ── SEARCH BAR ─────────────────────────────────────────── */}
      <div className="am-search-card">
        <div className="lp-search-fields">
          <div className="lp-search-field">
            <span className="lp-search-label">Retirada</span>
            <LocationPicker
              value={busca.retirada}
              placeholder="Cidade, aeroporto ou estação"
              onChange={(v) => setBusca((p) => ({ ...p, retirada: v }))}
            />
          </div>

          <div className="lp-search-sep" />

          <div className="lp-search-field">
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span className="lp-search-label">Devolução</span>
              <button
                type="button"
                className={`am-devol-chip${devolucaoIgual ? " am-devol-chip--active" : ""}`}
                onClick={() => setDevolucaoIgual(v => !v)}
              >
                {devolucaoIgual ? "= mesmo local" : "≠ outro local"}
              </button>
            </div>
            {devolucaoIgual ? (
              <span style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.35)", fontWeight: 500 }}>
                {busca.retirada || "Mesmo local de retirada"}
              </span>
            ) : (
              <LocationPicker
                value={busca.devolucao}
                placeholder="Selecionar local"
                onChange={(v) => setBusca((p) => ({ ...p, devolucao: v }))}
              />
            )}
          </div>

          <div className="lp-search-sep" />

          <div className="lp-search-field">
            <span className="lp-search-label">Data de retirada</span>
            <DatePicker
              value={busca.dataRetirada}
              placeholder="Selecione a data"
              min={new Date().toISOString().slice(0, 10)}
              onChange={(v) => setBusca((p) => ({ ...p, dataRetirada: v }))}
            />
          </div>

          <div className="lp-search-sep" />

          <div className="lp-search-field">
            <span className="lp-search-label">Data de devolução</span>
            <DatePicker
              value={busca.dataDevolucao}
              placeholder="Selecione a data"
              min={busca.dataRetirada || new Date().toISOString().slice(0, 10)}
              onChange={(v) => setBusca((p) => ({ ...p, dataDevolucao: v }))}
            />
          </div>

          <button type="button" className="lp-search-btn" onClick={handleBuscar}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </button>
        </div>

        {erroBusca && (
          <div className="am-search-error">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {erroBusca}
          </div>
        )}

        {resultadosBusca !== null && (
          <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 20px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.45)", flex: 1 }}>
              {resultadosBusca.length > 0
                ? `${resultadosBusca.length} veículo(s) disponível(is) em ${busca.retirada}`
                : `Nenhum veículo disponível em ${busca.retirada}`}
            </p>
            <button type="button" onClick={limparBusca} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.35)", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit" }}>
              Limpar
            </button>
          </div>
        )}
      </div>

      {/* ── FILTER BAR ──────────────────────────────────────────── */}
      {!carregando && automoveis.length > 0 && (
        <div className="am-filter-bar">
          <span className="am-filter-label">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></svg>
            Catálogo
          </span>
          <div className="am-filter-tabs">
            {FILTROS.map(f => (
              <button
                key={f.id}
                type="button"
                className={`am-filter-tab${filtroAtivo === f.id ? " am-filter-tab--active" : ""}`}
                onClick={() => setFiltroAtivo(f.id)}
              >
                {f.icon}{f.label}
              </button>
            ))}
          </div>
          <div className="am-filter-search">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "rgba(255,255,255,0.25)", flexShrink: 0 }}>
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              className="am-filter-search-input"
              placeholder="Buscar veículo..."
              value={buscaTexto}
              onChange={e => setBuscaTexto(e.target.value)}
            />
          </div>
        </div>
      )}

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
        <div className="lp-vehicles-grid" style={{ marginTop: "20px" }}>
          {filtrarAutomoveis(resultadosBusca ?? automoveis).map((auto, idx) => {
            const foto = srcFotoAutomovel(auto);
            const categoria = getCategoria(auto.modelo);
            const trans = getTransmissao(auto.modelo);
            const combustivel = getCombustivel(auto.modelo);
            return (
              <div
                key={auto.id}
                className={`lp-vehicle-card${auto.isDisponivel ? " lp-vehicle-card--avail" : " lp-vehicle-card--unavail"}`}
                onClick={podeSelecionar && auto.isDisponivel ? () => onSelecionarAutomovel(auto) : undefined}
              >
                {isAgente && (
                  <input
                    ref={el => { inputsImagem.current[auto.id] = el; }}
                    type="file" accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => trocarImagem(auto, e)}
                  />
                )}

                {/* Foto */}
                <div className="lp-vc-photo">
                  {auto.isDisponivel && <span className="lp-vc-badge">Disponível</span>}
                  <img src={foto ?? "/getimage.png"} alt={`${auto.marca} ${auto.modelo}`} loading="lazy" />
                  {!auto.isDisponivel && (
                    <div className="lp-vc-overlay">
                      <span className="lp-vc-overlay-label">Indisponível</span>
                    </div>
                  )}
                  {isAgente && (
                    <div
                      className="car-card-upload-overlay"
                      onClick={(e) => { e.stopPropagation(); inputsImagem.current[auto.id]?.click(); }}
                      title={uploadando === auto.id ? "Enviando..." : "Trocar foto"}
                      style={{ zIndex: 3 }}
                    >
                      <span>{uploadando === auto.id ? "Enviando..." : "Trocar foto"}</span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="lp-vc-body">
                  <div className="lp-vc-header">
                    <div>
                      <div className="lp-vc-name">{auto.marca} {auto.modelo}</div>
                      <div className="lp-vc-subtitle">{categoria} / {auto.marca}</div>
                    </div>
                    <span className="lp-vc-num">{String(idx + 1).padStart(2, "0")}</span>
                  </div>

                  <div className="lp-vc-specs">
                    <div className="lp-vc-spec">
                      <span className="lp-vc-spec-label">Trans</span>
                      <span className="lp-vc-spec-val">{trans}</span>
                    </div>
                    <div className="lp-vc-spec">
                      <span className="lp-vc-spec-label">Assentos</span>
                      <span className="lp-vc-spec-val">05</span>
                    </div>
                    <div className="lp-vc-spec">
                      <span className="lp-vc-spec-label">Combustível</span>
                      <span className="lp-vc-spec-val">{combustivel}</span>
                    </div>
                  </div>

                  <div className="lp-vc-footer">
                    {isAgente ? (
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button
                          type="button"
                          className="lp-vc-btn"
                          onClick={(e) => { e.stopPropagation(); alternarDisponibilidade(auto); }}
                          style={{ fontSize: "0.6rem" }}
                        >
                          {auto.isDisponivel ? "Tornar Indisp." : "Tornar Disp."}
                        </button>
                        <button
                          type="button"
                          className="lp-vc-btn"
                          onClick={(e) => { e.stopPropagation(); excluir(auto.id); }}
                          style={{ fontSize: "0.6rem", borderColor: "rgba(248,113,113,0.4)", color: "#f87171" }}
                        >
                          Excluir
                        </button>
                      </div>
                    ) : auto.isDisponivel ? (
                      <button
                        type="button"
                        className="lp-vc-btn"
                        onClick={(e) => { e.stopPropagation(); onSelecionarAutomovel?.(auto); }}
                      >
                        Selecionar Veículo
                      </button>
                    ) : (
                      <span className="lp-vc-unavail">Indisponível</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
