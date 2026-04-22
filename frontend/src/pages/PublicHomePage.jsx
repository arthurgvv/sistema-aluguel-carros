import { useState, useRef } from "react";
import { srcFotoAutomovel } from "../utils/fotoAutomovelLocal";
import LocationPicker from "../components/LocationPicker";
import DatePicker from "../components/DatePicker";

const CAPITAIS = [
  "Rio Branco", "Maceió", "Macapá", "Manaus", "Salvador", "Fortaleza",
  "Brasília", "Vitória", "Goiânia", "São Luís", "Cuiabá", "Campo Grande",
  "Belo Horizonte", "Belém", "João Pessoa", "Curitiba", "Recife", "Teresina",
  "Rio de Janeiro", "Natal", "Porto Alegre", "Porto Velho", "Boa Vista",
  "Florianópolis", "São Paulo", "Aracaju", "Palmas",
].sort(() => Math.random() - 0.5);

const PARTNERS = [
  { src: "/logo-brand-1.png", alt: "Parceiro 1" },
  { src: "/logo-brand-2.png", alt: "Parceiro 2" },
  { src: "/logo-brand-3.png", alt: "BMW" },
  { src: "/logo-brand-4.png", alt: "Volkswagen" },
  { src: "/logo-brand-5.svg", alt: "Fiat" },
  { src: "/logo-brand-6.svg", alt: "Mercedes-Benz" },
];

const CATEGORIAS = {
  golf: "Hatchback", polo: "Hatchback", clio: "Hatchback", yaris: "Hatchback",
  "208": "Hatchback", "3008": "SUV", tiguan: "SUV", q5: "SUV", rav4: "SUV",
  corolla: "Sedan", a4: "Sedan", "c-class": "Sedan", "3 series": "Sedan",
  passat: "Sedan", octavia: "Sedan",
  sportage: "SUV", xc60: "SUV", discovery: "SUV", x3: "SUV", "hr-v": "SUV",
  territory: "SUV", gla: "SUV", hilux: "Picape",
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

function norm(s) {
  return String(s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
function getCategoria(modelo) { return CATEGORIAS[norm(modelo)] ?? "Automóvel"; }
function getTransmissao(modelo) { return TRANSMISSAO[norm(modelo)] ?? "Automático"; }
function getCombustivel(modelo) { return COMBUSTIVEL[norm(modelo)] ?? "Flex"; }

const FROTA = [
  { id:  1, marca: "Volkswagen",    modelo: "Golf",        ano: 2023, isDisponivel: true,  imagemBase64: null },
  { id:  2, marca: "Toyota",        modelo: "Corolla",     ano: 2023, isDisponivel: true,  imagemBase64: null },
  { id:  3, marca: "BMW",           modelo: "3 Series",    ano: 2023, isDisponivel: true,  imagemBase64: null },
  { id:  4, marca: "Mercedes-Benz", modelo: "C-Class",     ano: 2024, isDisponivel: true,  imagemBase64: null },
  { id:  5, marca: "Audi",          modelo: "A4",          ano: 2023, isDisponivel: true,  imagemBase64: null },
  { id:  6, marca: "Renault",       modelo: "Clio",        ano: 2022, isDisponivel: false, imagemBase64: null },
  { id:  7, marca: "Volkswagen",    modelo: "Tiguan",      ano: 2023, isDisponivel: true,  imagemBase64: null },
  { id:  8, marca: "Toyota",        modelo: "RAV4",        ano: 2024, isDisponivel: true,  imagemBase64: null },
  { id:  9, marca: "Honda",         modelo: "Civic",       ano: 2023, isDisponivel: true,  imagemBase64: null },
  { id: 10, marca: "Jeep",          modelo: "Compass",     ano: 2024, isDisponivel: true,  imagemBase64: null },
  { id: 11, marca: "Hyundai",       modelo: "Tucson",      ano: 2023, isDisponivel: false, imagemBase64: null },
  { id: 12, marca: "Fiat",          modelo: "Pulse",       ano: 2024, isDisponivel: true,  imagemBase64: null },
  { id: 13, marca: "Chevrolet",     modelo: "Onix",        ano: 2023, isDisponivel: true,  imagemBase64: null },
  { id: 14, marca: "Nissan",        modelo: "Kicks",       ano: 2024, isDisponivel: true,  imagemBase64: null },
  { id: 15, marca: "Ford",          modelo: "Territory",   ano: 2023, isDisponivel: true,  imagemBase64: null },
  { id: 16, marca: "Peugeot",       modelo: "3008",        ano: 2024, isDisponivel: false, imagemBase64: null },
  { id: 17, marca: "Kia",           modelo: "Sportage",    ano: 2023, isDisponivel: true,  imagemBase64: null },
  { id: 18, marca: "Skoda",         modelo: "Octavia",     ano: 2023, isDisponivel: true,  imagemBase64: null },
  { id: 19, marca: "Volvo",         modelo: "XC60",        ano: 2024, isDisponivel: true,  imagemBase64: null },
  { id: 20, marca: "Land Rover",    modelo: "Discovery",   ano: 2023, isDisponivel: true,  imagemBase64: null },
  { id: 21, marca: "BMW",           modelo: "X3",          ano: 2024, isDisponivel: true,  imagemBase64: null },
  { id: 22, marca: "Audi",          modelo: "Q5",          ano: 2023, isDisponivel: false, imagemBase64: null },
  { id: 23, marca: "Mercedes-Benz", modelo: "GLA",         ano: 2024, isDisponivel: true,  imagemBase64: null },
  { id: 24, marca: "Honda",         modelo: "HR-V",        ano: 2023, isDisponivel: true,  imagemBase64: null },
  { id: 25, marca: "Toyota",        modelo: "Hilux",       ano: 2024, isDisponivel: true,  imagemBase64: null },
];


export default function PublicHomePage({ onEntrar, onSelecionarAutomovel }) {
  const [automoveis] = useState(FROTA);
  const [busca, setBusca] = useState({ retirada: "", devolucao: "", dataRetirada: "", dataDevolucao: "" });
  const [erroBusca, setErroBusca] = useState("");
  const [resultadosBusca, setResultadosBusca] = useState(null);
  const frotaRef = useRef(null);
  const searchRef = useRef(null);

  function scrollParaFrota() {
    frotaRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  function selecionarLocalPopular(cidade) {
    setBusca((p) => ({ ...p, retirada: cidade }));
    searchRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function handleBuscar() {
    if (!busca.retirada.trim()) { setErroBusca("Informe o local de retirada."); return; }
    if (!busca.dataRetirada) { setErroBusca("Informe a data de retirada."); return; }
    if (!busca.dataDevolucao) { setErroBusca("Informe a data de devolução."); return; }
    if (busca.dataRetirada >= busca.dataDevolucao) { setErroBusca("A data de devolução deve ser após a de retirada."); return; }
    setErroBusca("");
    setResultadosBusca(automoveis.filter((a) => a.isDisponivel));
    scrollParaFrota();
  }

  return (
    <div className="lp-root">

      {/* ── HERO (com nav sobreposta) ─────────────────────────── */}
      <section className="lp-hero">
        <div className="lp-hero-overlay" />

        {/* Nav dentro da imagem */}
        <nav className="lp-hero-nav">
          <span className="lp-hero-nav-logo">VERBUM</span>
          <ul className="lp-hero-nav-links">
            <li><button type="button" className="lp-hero-nav-link lp-hero-nav-link--active" onClick={scrollParaFrota}>Aluguel de Carros</button></li>
            <li><button type="button" className="lp-hero-nav-link" onClick={scrollParaFrota}>Frota</button></li>
            <li><button type="button" className="lp-hero-nav-link" onClick={() => document.getElementById("ofertas")?.scrollIntoView({ behavior: "smooth" })}>Ofertas</button></li>
            <li><button type="button" className="lp-hero-nav-link" onClick={() => document.getElementById("locais")?.scrollIntoView({ behavior: "smooth" })}>Locais</button></li>
          </ul>
          <div className="lp-hero-nav-actions">
            <button type="button" className="lp-hero-btn-login" onClick={onEntrar}>Entrar</button>
            <button type="button" className="lp-hero-btn-signup" onClick={onEntrar}>Cadastrar</button>
          </div>
        </nav>

        <div className="lp-hero-content">
          <h1 className="lp-hero-title">
            Alugue um carro<br />para cada viagem
          </h1>

          <div className="lp-search-card" ref={searchRef}>
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
                <span className="lp-search-label">Local de devolução</span>
                <LocationPicker
                  value={busca.devolucao}
                  placeholder="Cidade, aeroporto ou estação"
                  onChange={(v) => setBusca((p) => ({ ...p, devolucao: v }))}
                />
              </div>

              <div className="lp-search-sep" />

              <div className="lp-search-field">
                <span className="lp-search-label">Data de retirada</span>
                <DatePicker
                  value={busca.dataRetirada}
                  min={new Date().toISOString().slice(0, 10)}
                  placeholder="Selecionar data"
                  onChange={(v) => setBusca((p) => ({ ...p, dataRetirada: v }))}
                />
              </div>

              <div className="lp-search-sep" />

              <div className="lp-search-field">
                <span className="lp-search-label">Data de devolução</span>
                <DatePicker
                  value={busca.dataDevolucao}
                  min={busca.dataRetirada || new Date().toISOString().slice(0, 10)}
                  placeholder="Selecionar data"
                  onChange={(v) => setBusca((p) => ({ ...p, dataDevolucao: v }))}
                />
              </div>

              <button type="button" className="lp-search-btn" onClick={handleBuscar}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <span>Buscar</span>
              </button>

            </div>
            {erroBusca && <p className="lp-search-erro">{erroBusca}</p>}
          </div>
        </div>
      </section>

      {/* ── TOP PICKS ────────────────────────────────────────── */}
      <section className="lp-section" ref={frotaRef} id="frota">
        <div className="lp-section-inner">
          <div className="lp-section-header">
            <div>
              {resultadosBusca ? (
                <>
                  <h2 className="lp-section-title">Veículos disponíveis em {busca.retirada}</h2>
                  <p className="lp-section-sub">{resultadosBusca.length} veículo{resultadosBusca.length !== 1 ? "s" : ""} disponível{resultadosBusca.length !== 1 ? "s" : ""} para o período selecionado.</p>
                </>
              ) : (
                <>
                  <h2 className="lp-section-title">Veículos em destaque este mês</h2>
                  <p className="lp-section-sub">Experimente o melhor da nossa frota com nossas seleções especiais.</p>
                </>
              )}
            </div>
          </div>

          {(resultadosBusca ?? automoveis.filter(a => a.isDisponivel)).length > 0 && (
            <>
              <div className="lp-vehicles-grid lp-vehicles-grid--light">
                {(resultadosBusca ?? automoveis.filter(a => a.isDisponivel).slice(0, 8)).map((auto, idx) => {
                  const foto = srcFotoAutomovel(auto);
                  const categoria = getCategoria(auto.modelo);
                  const trans = getTransmissao(auto.modelo);
                  const combustivel = getCombustivel(auto.modelo);
                  return (
                    <div
                      key={auto.id}
                      className="lp-vehicle-card lp-vehicle-card--avail"
                      onClick={() => onSelecionarAutomovel(auto)}
                    >
                      {/* Foto */}
                      <div className="lp-vc-photo">
                        <img src={foto ?? "/getimage.png"} alt={`${auto.marca} ${auto.modelo}`} loading="lazy" />
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
                          {auto.isDisponivel ? (
                            <button
                              type="button"
                              className="lp-vc-btn"
                              onClick={(e) => { e.stopPropagation(); onSelecionarAutomovel(auto); }}
                            >
                              Alugar agora
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

              <div className="lp-see-more">
                <button type="button" className="lp-see-more-btn" onClick={onEntrar}>
                  Ver todos os modelos →
                </button>
              </div>
            </>
          )}

          {automoveis.length === 0 && (
            <div className="lp-empty-state">
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.3">
                <path d="M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1l2-3h12l2 3h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2"/>
                <circle cx="12" cy="13" r="3"/>
              </svg>
              <h3>Nenhum veículo disponível</h3>
              <p>Faça login para ver nossa frota completa.</p>
              <button type="button" className="lp-btn-signup" onClick={onEntrar}>Entrar</button>
            </div>
          )}
        </div>
      </section>

      {/* ── POPULAR LOCATIONS + STATS ───────────────────────── */}
      <section className="lp-section lp-section--gray" id="locais">
        <div className="lp-section-inner">
          <div className="lp-locais-header">
            <div>
              <h2 className="lp-section-title">Descubra aluguéis populares pelo Brasil</h2>
              <p className="lp-section-sub">Explore nossa ampla rede de locais de retirada e devolução.</p>
            </div>
            <div className="lp-locais-stats">
              <div className="lp-locais-stat">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="lp-locais-stat-icon">
                  <path d="M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1l2-3h12l2 3h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2"/>
                  <circle cx="7.5" cy="17" r="2.5"/><circle cx="16.5" cy="17" r="2.5"/>
                </svg>
                <div className="lp-locais-stat-text">
                  <span className="lp-locais-stat-num">{automoveis.length}</span>
                  <span className="lp-locais-stat-label">Veículos na frota</span>
                </div>
              </div>
              <div className="lp-locais-stat-divider" />
              <div className="lp-locais-stat">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="lp-locais-stat-icon">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                <div className="lp-locais-stat-text">
                  <span className="lp-locais-stat-num">{automoveis.filter(a => a.isDisponivel).length}</span>
                  <span className="lp-locais-stat-label">Disponíveis agora</span>
                </div>
              </div>
            </div>
          </div>
          <div className="lp-locations-wrap">
            {CAPITAIS.map((loc) => (
              <button
                key={loc}
                type="button"
                className="lp-location-pill"
                onClick={() => selecionarLocalPopular(loc)}
              >
                Aluguel em {loc}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── DEALS ───────────────────────────────────────────── */}
      <section className="lp-section" id="ofertas">
        <div className="lp-section-inner">
          <div className="lp-section-header">
            <div>
              <h2 className="lp-section-title">Aproveite nossas melhores ofertas</h2>
            </div>
            <button type="button" className="lp-see-all" onClick={onEntrar}>Ver todas →</button>
          </div>
          <div className="lp-deals-grid">
            <div className="lp-deal-card" style={{ backgroundImage: "url('/oferta1.avif')" }}>
              <div className="lp-deal-overlay" />
              <div className="lp-deal-content">
                <span className="lp-deal-badge">Válido de 14 Jan – 19 Jan 2025</span>
                <p className="lp-deal-title">Aproveite as férias com nossas promoções de temporada</p>
                <div className="lp-deal-percent">40%</div>
                <p className="lp-deal-terms">*Com termos e condições</p>
              </div>
            </div>
            <div className="lp-deal-card" style={{ backgroundImage: "url('/oferta2.avif')" }}>
              <div className="lp-deal-overlay" />
              <div className="lp-deal-content">
                <span className="lp-deal-badge">Válido de 8 Jan – 22 Jan 2025</span>
                <p className="lp-deal-title">Descontos exclusivos online para uma reserva perfeita</p>
                <div className="lp-deal-percent">65%</div>
                <p className="lp-deal-terms">*Com termos e condições</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PARTNERS ────────────────────────────────────────── */}
      <div className="lp-partners-bar">
        <div className="lp-section-inner lp-partners-inner">
          {PARTNERS.map((p) => (
            <img key={p.src} src={p.src} alt={p.alt} className="lp-partner-logo" />
          ))}
        </div>
      </div>


{/* ── FOOTER ──────────────────────────────────────────── */}

      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <div className="lp-footer-brand">
            <span className="lp-footer-logo">VERBUM</span>
            <p className="lp-footer-tagline">
              Nossa missão é oferecer veículos modernos, funcionais e elegantes que elevam cada aventura.
            </p>
          </div>
          <div className="lp-footer-col">
            <h4 className="lp-footer-col-title">Sobre</h4>
            <ul className="lp-footer-links">
              <li>Sobre nós</li>
              <li>Blog</li>
              <li>Carreiras</li>
            </ul>
          </div>
          <div className="lp-footer-col">
            <h4 className="lp-footer-col-title">Suporte</h4>
            <ul className="lp-footer-links">
              <li>Contato</li>
              <li>Devoluções</li>
              <li>FAQ</li>
            </ul>
          </div>
          <div className="lp-footer-col">
            <h4 className="lp-footer-col-title">Novidades</h4>
            <div className="lp-footer-newsletter">
              <input type="email" placeholder="Seu e-mail" className="lp-footer-email" />
              <button type="button" className="lp-footer-subscribe" onClick={onEntrar}>Assinar</button>
            </div>
          </div>
        </div>
        <div className="lp-footer-bottom">
          <span>©2025 VERBUM. Todos os direitos reservados.</span>
          <div className="lp-footer-legal">
            <span>Privacidade</span>
            <span>Termos de Serviço</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
