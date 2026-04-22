import { useEffect, useState } from "react";
import { criarPedido, listarAutomoveisDisponiveis } from "../services/clientesApi";
import { srcFotoAutomovel } from "../utils/fotoAutomovelLocal";
import { MODELOS_DESTAQUE } from "../utils/frotaDestaque";
import DatePicker from "../components/DatePicker";

/* ── Mapeamentos de atributos ──────────────────────────────── */
const CATEGORIAS = {
  golf: "Hatchback", polo: "Hatchback", clio: "Hatchback", yaris: "Hatchback",
  "208": "Hatchback", "3008": "SUV", tiguan: "SUV", q5: "SUV", rav4: "SUV",
  corolla: "Sedan", a4: "Sedan", "c-class": "Sedan", "3 series": "Sedan",
  passat: "Sedan", octavia: "Sedan", sportage: "SUV", xc60: "SUV",
  discovery: "SUV", x3: "SUV", "hr-v": "SUV", territory: "SUV", gla: "SUV",
  hilux: "Picape",
};
const TRANSMISSAO = {
  clio: "Manual", "208": "Manual", yaris: "Manual", passat: "Manual", octavia: "Manual",
};
const COMBUSTIVEL = {
  corolla: "Híbrido", rav4: "Híbrido", xc60: "Híbrido",
  golf: "Flex", polo: "Flex", clio: "Flex", yaris: "Flex", "208": "Flex",
  tiguan: "Flex", passat: "Flex", territory: "Flex", "hr-v": "Flex", hilux: "Flex",
  sportage: "Gasolina", octavia: "Gasolina", a4: "Gasolina", "c-class": "Gasolina",
  "3 series": "Gasolina", q5: "Gasolina", discovery: "Gasolina", x3: "Gasolina", gla: "Gasolina",
};

function norm(s) {
  return String(s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
const getCategoria   = m => CATEGORIAS[norm(m)]   ?? "Automóvel";
const getTransmissao = m => TRANSMISSAO[norm(m)]  ?? "Automático";
const getCombustivel = m => COMBUSTIVEL[norm(m)]  ?? "Flex";

function formatarMoeda(v) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);
}

function calcularDias(inicio, fim) {
  if (!inicio || !fim) return 0;
  const d = Math.ceil((new Date(fim) - new Date(inicio)) / 86_400_000);
  return d > 0 ? d : 0;
}

/* ── Componente ────────────────────────────────────────────── */
export default function NovoPedidoPage({ usuarioLogado, automovelPreSelecionado, onCancelar, onSucesso }) {
  const [step,            setStep]            = useState(automovelPreSelecionado ? 2 : 1);
  const [automoveis,      setAutomoveis]      = useState([]);
  const [carregando,      setCarregando]      = useState(true);
  const [autoSelecionado, setAutoSelecionado] = useState(automovelPreSelecionado || null);
  const [dataInicio,      setDataInicio]      = useState("");
  const [dataFim,         setDataFim]         = useState("");
  const [salvando,        setSalvando]        = useState(false);
  const [erro,            setErro]            = useState("");

  const hoje = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    listarAutomoveisDisponiveis()
      .then(lista => {
        const ordenada = (lista || []).slice().sort((a, b) => {
          const aD = MODELOS_DESTAQUE.has(a.modelo);
          const bD = MODELOS_DESTAQUE.has(b.modelo);
          if (aD && !bD) return -1;
          if (!aD && bD) return 1;
          return 0;
        });
        setAutomoveis(ordenada);
      })
      .catch(e => setErro(e.message || "Não foi possível carregar os veículos."))
      .finally(() => setCarregando(false));
  }, []);

  function selecionarAuto(auto) {
    setAutoSelecionado(auto);
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function confirmar() {
    if (!dataInicio) { setErro("Informe a data de início."); return; }
    if (!dataFim)    { setErro("Informe a data de devolução."); return; }
    if (dataInicio >= dataFim) { setErro("A data de devolução deve ser após o início."); return; }
    setErro(""); setSalvando(true);
    try {
      await criarPedido({
        cliente:    { id: usuarioLogado.id },
        automovel:  { id: autoSelecionado.id },
        dataInicio,
        dataFim,
      });
      onSucesso();
    } catch (e) {
      setErro(e.message || "Não foi possível criar o pedido.");
    } finally {
      setSalvando(false);
    }
  }

  const dias           = calcularDias(dataInicio, dataFim);
  const valorEstimado  = dias > 0 ? dias * 100 : null;

  /* ── STEP 1: Seleção de veículo ──────────────────────────── */
  if (step === 1) {
    return (
      <section className="page-card np-step1">
        {/* Header */}
        <header className="split-header">
          <div>
            <p className="eyebrow">Novo pedido — Etapa 1 de 2</p>
            <h1>Escolha seu veículo</h1>
            <p className="page-subtitle">Selecione um dos veículos disponíveis para continuar.</p>
          </div>
          <button type="button" className="ghost-button" onClick={onCancelar}>
            Cancelar
          </button>
        </header>

        {erro && <p className="feedback error">{erro}</p>}

        {carregando && (
          <div className="empty-state"><h2>Carregando veículos...</h2></div>
        )}

        {!carregando && automoveis.length === 0 && (
          <div className="empty-state">
            <h2>Nenhum veículo disponível</h2>
            <p>No momento não há veículos disponíveis para aluguel.</p>
          </div>
        )}

        {!carregando && automoveis.length > 0 && (
          <div className="np-grid">
            {automoveis.map((auto, idx) => {
              const foto  = srcFotoAutomovel(auto);
              const trans = getTransmissao(auto.modelo);
              const comb  = getCombustivel(auto.modelo);
              const cat   = getCategoria(auto.modelo);
              return (
                <button
                  key={auto.id}
                  type="button"
                  className="np-car-card"
                  onClick={() => selecionarAuto(auto)}
                >
                  <div className="np-car-photo">
                    <img src={foto ?? "/getimage.png"} alt={`${auto.marca} ${auto.modelo}`} loading="lazy" />
                    {MODELOS_DESTAQUE.has(auto.modelo) && (
                      <span className="np-car-badge">Destaque</span>
                    )}
                    <span className="np-car-num">{String(idx + 1).padStart(2, "0")}</span>
                  </div>
                  <div className="np-car-body">
                    <div className="np-car-name">{auto.marca} {auto.modelo}</div>
                    <div className="np-car-sub">{cat} · {auto.ano}</div>
                    <div className="np-car-specs">
                      <span>{trans}</span>
                      <span>5 lugares</span>
                      <span>{comb}</span>
                    </div>
                    <div className="np-car-price">
                      R$ 100<span>/dia</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </section>
    );
  }

  /* ── STEP 2: Datas + confirmação ─────────────────────────── */
  const foto        = srcFotoAutomovel(autoSelecionado);
  const nomeVeic    = autoSelecionado
    ? `${autoSelecionado.marca} ${autoSelecionado.modelo}`
    : "";
  const cat         = getCategoria(autoSelecionado?.modelo);
  const trans       = getTransmissao(autoSelecionado?.modelo);
  const comb        = getCombustivel(autoSelecionado?.modelo);

  return (
    <section className="page-card np-step2">
      <div className="np-booking">

        {/* Painel esquerdo — foto do carro */}
        <div className="np-booking-photo">
          <img src={foto ?? "/getimage.png"} alt={nomeVeic} />
          <div className="np-booking-overlay">
            <div className="np-booking-badge">{cat}</div>
            <div className="np-booking-carname">{nomeVeic.toUpperCase()}</div>
            <div className="np-booking-car-specs">
              <span>{trans}</span>
              <span>·</span>
              <span>5 lugares</span>
              <span>·</span>
              <span>{comb}</span>
            </div>
          </div>
          {/* Voltar */}
          {!automovelPreSelecionado && (
            <button
              type="button"
              className="np-back-btn"
              onClick={() => { setStep(1); setErro(""); }}
            >
              ← Trocar veículo
            </button>
          )}
        </div>

        {/* Painel direito — formulário */}
        <div className="np-booking-form">
          <div className="np-booking-form-inner">
            <p className="eyebrow">Novo pedido — Etapa 2 de 2</p>
            <h2 className="np-booking-title">Período de aluguel</h2>

            {erro && <p className="feedback error" style={{ marginBottom: 8 }}>{erro}</p>}

            <div className="np-date-row">
              <div className="np-date-field">
                <span className="np-field-label">Data de retirada</span>
                <DatePicker
                  value={dataInicio}
                  min={hoje}
                  placeholder="Selecione a data"
                  onChange={v => { setDataInicio(v); if (dataFim && v >= dataFim) setDataFim(""); }}
                />
              </div>
              <div className="np-date-field">
                <span className="np-field-label">Data de devolução</span>
                <DatePicker
                  value={dataFim}
                  min={dataInicio || hoje}
                  placeholder="Selecione a data"
                  onChange={setDataFim}
                />
              </div>
            </div>

            {/* Resumo */}
            {dias > 0 && (
              <div className="np-summary">
                <div className="np-summary-row">
                  <span className="np-summary-label">Duração</span>
                  <span className="np-summary-val">{dias} dia{dias > 1 ? "s" : ""}</span>
                </div>
                <div className="np-summary-row">
                  <span className="np-summary-label">Diária</span>
                  <span className="np-summary-val">R$ 100,00</span>
                </div>
                <div className="np-summary-divider" />
                <div className="np-summary-row np-summary-row--total">
                  <span className="np-summary-label">Total estimado</span>
                  <span className="np-summary-val">{formatarMoeda(valorEstimado)}</span>
                </div>
                <p className="np-summary-obs">
                  * Valor sujeito a confirmação após aprovação do pedido.
                </p>
              </div>
            )}

            <div className="np-booking-actions">
              <button type="button" className="ghost-button" onClick={onCancelar}>
                Cancelar
              </button>
              <button
                type="button"
                className="np-confirm-btn"
                disabled={salvando || !dataInicio || !dataFim || dias <= 0}
                onClick={confirmar}
              >
                {salvando ? "Enviando..." : "Confirmar Pedido"}
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
