import { useState, useRef, useEffect } from "react";

const MESES = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
const DIAS_SEMANA = ["Seg","Ter","Qua","Qui","Sex","Sáb","Dom"];

export default function DatePicker({ value, onChange, min, placeholder }) {
  const [aberto, setAberto] = useState(false);
  const [pagina, setPagina] = useState(() => {
    const base = value ? new Date(value + "T00:00:00") : new Date();
    return { ano: base.getFullYear(), mes: base.getMonth() };
  });
  const ref = useRef(null);

  useEffect(() => {
    function fechar(e) { if (ref.current && !ref.current.contains(e.target)) setAberto(false); }
    document.addEventListener("mousedown", fechar);
    return () => document.removeEventListener("mousedown", fechar);
  }, []);

  const hoje = new Date(); hoje.setHours(0, 0, 0, 0);
  const minDate = min ? new Date(min + "T00:00:00") : hoje;
  const selDate = value ? new Date(value + "T00:00:00") : null;

  const { ano, mes } = pagina;
  const totalDias = new Date(ano, mes + 1, 0).getDate();
  const primeiroDia = new Date(ano, mes, 1).getDay();
  const offset = primeiroDia === 0 ? 6 : primeiroDia - 1;

  function selecionar(dia) {
    const m = String(mes + 1).padStart(2, "0");
    const d = String(dia).padStart(2, "0");
    onChange(`${ano}-${m}-${d}`);
    setAberto(false);
  }

  function navMes(delta) {
    setPagina(p => {
      let m = p.mes + delta, a = p.ano;
      if (m < 0) { m = 11; a--; } else if (m > 11) { m = 0; a++; }
      return { ano: a, mes: m };
    });
  }

  function formatarExibicao(str) {
    if (!str) return null;
    const [a, m, d] = str.split("-");
    return `${d}/${m}/${a}`;
  }

  return (
    <div className="lp-dp-wrap" ref={ref}>
      <button type="button" className="lp-dp-trigger" onClick={() => setAberto(o => !o)}>
        {value
          ? <span className="lp-dp-valor">{formatarExibicao(value)}</span>
          : <span className="lp-dp-placeholder">{placeholder}</span>}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      </button>

      {aberto && (
        <div className="lp-dp-popup">
          <div className="lp-dp-header">
            <button type="button" className="lp-dp-nav" onClick={() => navMes(-1)}>‹</button>
            <span className="lp-dp-titulo">{MESES[mes]} {ano}</span>
            <button type="button" className="lp-dp-nav" onClick={() => navMes(1)}>›</button>
          </div>
          <div className="lp-dp-grid">
            {DIAS_SEMANA.map(d => <span key={d} className="lp-dp-dow">{d}</span>)}
            {Array.from({ length: offset }).map((_, i) => <span key={"v" + i} />)}
            {Array.from({ length: totalDias }, (_, i) => i + 1).map(dia => {
              const thisDate = new Date(ano, mes, dia);
              const disabled = thisDate < minDate;
              const selected = selDate && selDate.getFullYear() === ano && selDate.getMonth() === mes && selDate.getDate() === dia;
              const isToday = hoje.getFullYear() === ano && hoje.getMonth() === mes && hoje.getDate() === dia;
              return (
                <button
                  key={dia} type="button"
                  className={`lp-dp-dia${selected ? " lp-dp-dia--sel" : ""}${isToday && !selected ? " lp-dp-dia--hoje" : ""}${disabled ? " lp-dp-dia--off" : ""}`}
                  onClick={() => !disabled && selecionar(dia)}
                  disabled={disabled}
                >{dia}</button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
