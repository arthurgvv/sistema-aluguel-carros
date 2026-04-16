import { useState, useRef } from "react";
import { srcFotoAutomovel } from "../utils/fotoAutomovelLocal";

const POPULAR_LOCATIONS = [
  "Rio de Janeiro", "São Paulo", "Belo Horizonte", "Curitiba",
  "Salvador", "Fortaleza", "Manaus", "Porto Alegre",
  "Recife", "Brasília", "Florianópolis", "Natal",
];

const PARTNERS = ["AutoFácil", "RentMax", "CarTech", "AutoPlus", "DriveNow", "FleetPro"];

const CATEGORIAS = {
  golf: "Hatchback", polo: "Hatchback", clio: "Hatchback", yaris: "Hatchback",
  "208": "Hatchback", "3008": "SUV", tiguan: "SUV", "q5": "SUV", rav4: "SUV",
  corolla: "Sedan", a4: "Sedan", "c-class": "Sedan", "3 series": "Sedan",
  passat: "Sedan", octavia: "Sedan",
};

function getCategoria(modelo) {
  const m = String(modelo || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return CATEGORIAS[m] ?? "Automóvel";
}

const FROTA = [
  { id: 1, marca: "Volkswagen",    modelo: "Golf",      ano: 2023, isDisponivel: true,  imagemBase64: null },
  { id: 2, marca: "Toyota",        modelo: "Corolla",   ano: 2023, isDisponivel: true,  imagemBase64: null },
  { id: 3, marca: "BMW",           modelo: "3 Series",  ano: 2023, isDisponivel: true,  imagemBase64: null },
  { id: 4, marca: "Mercedes-Benz", modelo: "C-Class",   ano: 2024, isDisponivel: true,  imagemBase64: null },
  { id: 5, marca: "Audi",          modelo: "A4",        ano: 2023, isDisponivel: true,  imagemBase64: null },
  { id: 6, marca: "Renault",       modelo: "Clio",      ano: 2022, isDisponivel: false, imagemBase64: null },
  { id: 7, marca: "Volkswagen",    modelo: "Tiguan",    ano: 2023, isDisponivel: true,  imagemBase64: null },
  { id: 8, marca: "Toyota",        modelo: "RAV4",      ano: 2024, isDisponivel: true,  imagemBase64: null },
];

export default function PublicHomePage({ onEntrar, onSelecionarAutomovel }) {
  const [automoveis] = useState(FROTA);
  const frotaRef = useRef(null);

  function scrollParaFrota() {
    frotaRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="lp-root">

      {/* ── HERO (com nav sobreposta) ─────────────────────────── */}
      <section className="lp-hero">
        <div className="lp-hero-overlay" />

        {/* Nav dentro da imagem */}
        <nav className="lp-hero-nav">
          <img src="/bycarspng.png" alt="byCars" className="lp-hero-nav-logo" />
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

          <div className="lp-search-card">
            <div className="lp-search-fields">

              <div className="lp-search-field">
                <span className="lp-search-label">Retirada</span>
                <div className="lp-search-input-row">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  <span className="lp-search-placeholder">Cidade, aeroporto ou estação</span>
                </div>
              </div>

              <div className="lp-search-sep" />

              <div className="lp-search-field">
                <span className="lp-search-label">Local de devolução</span>
                <div className="lp-search-input-row">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  <span className="lp-search-placeholder">Cidade, aeroporto ou estação</span>
                </div>
              </div>

              <div className="lp-search-sep" />

              <div className="lp-search-field">
                <span className="lp-search-label">Data de retirada</span>
                <div className="lp-search-input-row">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  <span className="lp-search-placeholder">Selecionar data e hora</span>
                </div>
              </div>

              <div className="lp-search-sep" />

              <div className="lp-search-field">
                <span className="lp-search-label">Data de devolução</span>
                <div className="lp-search-input-row">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  <span className="lp-search-placeholder">Selecionar data e hora</span>
                </div>
              </div>

              <button type="button" className="lp-search-btn" onClick={scrollParaFrota}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <span>Buscar</span>
              </button>

            </div>
          </div>
        </div>
      </section>

      {/* ── TOP PICKS ────────────────────────────────────────── */}
      <section className="lp-section" ref={frotaRef} id="frota">
        <div className="lp-section-inner">
          <div className="lp-section-header">
            <div>
              <h2 className="lp-section-title">Veículos em destaque este mês</h2>
              <p className="lp-section-sub">Experimente o melhor da nossa frota com nossas seleções especiais.</p>
            </div>
          </div>

          {automoveis.length > 0 && (
            <>
              <div className="lp-vehicles-grid">
                {automoveis.slice(0, 8).map((auto) => {
                  const foto = srcFotoAutomovel(auto);
                  const categoria = getCategoria(auto.modelo);
                  return (
                    <div
                      key={auto.id}
                      className={`lp-vehicle-card${auto.isDisponivel ? " lp-vehicle-card--avail" : " lp-vehicle-card--unavail"}`}
                      onClick={auto.isDisponivel ? () => onSelecionarAutomovel(auto) : undefined}
                    >
                      {/* Foto */}
                      <div className="lp-vc-photo">
                        <span className="lp-vc-category">{categoria}</span>
                        <img
                          src={foto ?? "/getimage.png"}
                          alt={`${auto.marca} ${auto.modelo}`}
                          loading="lazy"
                        />
                      </div>

                      {/* Info */}
                      <div className="lp-vc-body">
                        <div className="lp-vc-name">{auto.marca} {auto.modelo}</div>

                        <div className="lp-vc-attrs">
                          {/* Transmissão */}
                          <div className="lp-vc-attr">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="5" cy="6" r="2"/><circle cx="19" cy="6" r="2"/><circle cx="12" cy="18" r="2"/><line x1="5" y1="8" x2="5" y2="12"/><line x1="19" y1="8" x2="19" y2="12"/><line x1="5" y1="12" x2="12" y2="16"/><line x1="19" y1="12" x2="12" y2="16"/></svg>
                            Automático
                          </div>
                        </div>

                        <div className="lp-vc-icons-row">
                          {/* Passageiros */}
                          <span className="lp-vc-icon-item">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                            5
                          </span>
                          {/* Malas */}
                          <span className="lp-vc-icon-item">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
                            2
                          </span>
                          {/* Ano */}
                          <span className="lp-vc-icon-item">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                            {auto.ano}
                          </span>
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

      {/* ── POPULAR LOCATIONS ───────────────────────────────── */}
      <section className="lp-section lp-section--gray" id="locais">
        <div className="lp-section-inner">
          <h2 className="lp-section-title">Descubra aluguéis populares pelo Brasil</h2>
          <p className="lp-section-sub">Explore nossa ampla rede de locais de retirada e devolução.</p>
          <div className="lp-locations-wrap">
            {POPULAR_LOCATIONS.map((loc) => (
              <span key={loc} className="lp-location-pill">Aluguel em {loc}</span>
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
            <div className="lp-deal-card lp-deal-card--dark">
              <span className="lp-deal-badge">Válido de 14 Jan – 19 Jan 2025</span>
              <p className="lp-deal-title">Aproveite as férias com nossas promoções de temporada</p>
              <div className="lp-deal-percent">40%</div>
              <p className="lp-deal-terms">*Com termos e condições</p>
            </div>
            <div className="lp-deal-card lp-deal-card--medium">
              <span className="lp-deal-badge">Válido de 8 Jan – 22 Jan 2025</span>
              <p className="lp-deal-title">Descontos exclusivos online para uma reserva perfeita</p>
              <div className="lp-deal-percent">65%</div>
              <p className="lp-deal-terms">*Com termos e condições</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── PARTNERS ────────────────────────────────────────── */}
      <div className="lp-partners-bar">
        <div className="lp-section-inner lp-partners-inner">
          {PARTNERS.map((p) => (
            <span key={p} className="lp-partner-name">{p}</span>
          ))}
        </div>
      </div>

      {/* ── CTA BANNERS ─────────────────────────────────────── */}
      <section className="lp-section lp-section--flush">
        <div className="lp-section-inner">
          <div className="lp-cta-grid">
            <div className="lp-cta-dark">
              <svg className="lp-cta-icon" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.5">
                <path d="M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1l2-3h12l2 3h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2"/>
                <circle cx="12" cy="13" r="3"/>
              </svg>
              <h3 className="lp-cta-title">Explore mais para encontrar seu veículo ideal</h3>
              <p className="lp-cta-body">Reserve sua viagem perfeita conosco.</p>
              <button type="button" className="lp-cta-btn" onClick={scrollParaFrota}>
                Reservar agora →
              </button>
            </div>
            <div className="lp-cta-image">
              <div className="lp-cta-image-overlay" />
              <p className="lp-cta-image-text">Além do transporte,<br />criando memórias de vida.</p>
            </div>
          </div>
          <div className="lp-stats-bar">
            <div className="lp-stat">
              <span className="lp-stat-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.6">
                  <path d="M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1l2-3h12l2 3h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2"/>
                  <circle cx="12" cy="13" r="3"/>
                </svg>
              </span>
              <span className="lp-stat-num">{automoveis.length > 0 ? automoveis.length : "—"}</span>
              <span className="lp-stat-label">Veículos na frota</span>
            </div>
            <div className="lp-stat">
              <span className="lp-stat-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.6">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </span>
              <span className="lp-stat-num">
                {automoveis.filter((a) => a.isDisponivel).length > 0
                  ? automoveis.filter((a) => a.isDisponivel).length
                  : "—"}
              </span>
              <span className="lp-stat-label">Disponíveis agora</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────── */}
      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <div className="lp-footer-brand">
            <img src="/bycarspng.png" alt="byCars" className="lp-footer-logo" />
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
          <span>©2025 byCars. Todos os direitos reservados.</span>
          <div className="lp-footer-legal">
            <span>Privacidade</span>
            <span>Termos de Serviço</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
