import { useState, useRef, useEffect } from "react";

export const POPULAR_LOCATIONS = [
  // AC, AL, AP, AM, BA, CE, DF, ES, GO
  "Rio Branco", "Maceió", "Macapá", "Manaus", "Salvador", "Fortaleza", "Brasília", "Vitória", "Goiânia",
  // MA, MT, MS, MG, PA, PB, PR, PE, PI
  "São Luís", "Cuiabá", "Campo Grande", "Belo Horizonte", "Belém", "João Pessoa", "Curitiba", "Recife", "Teresina",
  // RJ, RN, RS, RO, RR, SC, SP, SE, TO
  "Rio de Janeiro", "Natal", "Porto Alegre", "Porto Velho", "Boa Vista", "Florianópolis", "São Paulo", "Aracaju", "Palmas",
  // Extra cidades populares
  "Campinas", "Santos", "Ribeirão Preto", "Uberlândia", "Feira de Santana", "Joinville", "Londrina", "Sorocaba",
];

export default function LocationPicker({ value, onChange, placeholder }) {
  const [aberto, setAberto] = useState(false);
  const [filtro, setFiltro] = useState("");
  const ref = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    function fechar(e) { if (ref.current && !ref.current.contains(e.target)) setAberto(false); }
    document.addEventListener("mousedown", fechar);
    return () => document.removeEventListener("mousedown", fechar);
  }, []);

  function abrir() { setAberto(true); setFiltro(""); setTimeout(() => inputRef.current?.focus(), 0); }
  function selecionar(loc) { onChange(loc); setAberto(false); setFiltro(""); }

  const locaisFiltrados = POPULAR_LOCATIONS.filter(l =>
    l.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .includes(filtro.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))
  );

  return (
    <div className="lp-lp-wrap" ref={ref}>
      <button type="button" className="lp-lp-trigger" onClick={abrir}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
        </svg>
        {value
          ? <span className="lp-lp-valor">{value}</span>
          : <span className="lp-lp-placeholder">{placeholder}</span>}
      </button>

      {aberto && (
        <div className="lp-lp-popup">
          <div className="lp-lp-search-row">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, color: "#aaa" }}>
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              ref={inputRef}
              className="lp-lp-input"
              placeholder="Buscar cidade..."
              value={filtro}
              onChange={e => setFiltro(e.target.value)}
            />
          </div>
          <ul className="lp-lp-list">
            {locaisFiltrados.length > 0 ? locaisFiltrados.map(loc => (
              <li key={loc}>
                <button
                  type="button"
                  className={`lp-lp-item${value === loc ? " lp-lp-item--sel" : ""}`}
                  onClick={() => selecionar(loc)}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, opacity: 0.4 }}>
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                  {loc}
                </button>
              </li>
            )) : (
              <li className="lp-lp-empty">Nenhuma cidade encontrada</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
