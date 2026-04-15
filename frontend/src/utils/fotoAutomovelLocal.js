/**
 * Fotos estáticas em /public/carros — usadas quando o backend não tem imagemBase64.
 * Chave: marca|modelo normalizados (minúsculas, sem acentos).
 */
const FOTOS_POR_MARCA_MODELO = {
  "toyota|corolla": "/carros/corolla.jpg",
  "honda|civic": "/carros/HondaCivic.jpg",
  "volkswagen|polo": "/carros/polo.jpg",
  "chevrolet|onix": "/carros/onix.jpg",
  "hyundai|hb20": "/carros/HyundaiHB20.jpg",
  "ford|ka": "/carros/fordka.jpg",
  "fiat|argo": "/carros/fiatargo.jpg",
  "renault|kwid": "/carros/Renault-Kwid.jpg"
};

function normalizar(str) {
  return String(str || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/**
 * Retorna URL pública (/carros/...) ou null se não houver arquivo mapeado.
 */
export function urlFotoAutomovelLocal(marca, modelo) {
  const chave = `${normalizar(marca)}|${normalizar(modelo)}`;
  return FOTOS_POR_MARCA_MODELO[chave] ?? null;
}

/**
 * Prioridade: upload real (nao-SVG) da API > foto em /public/carros quando o backend so tem placeholder SVG > API.
 */
export function srcFotoAutomovel(automovel) {
  if (!automovel) return null;
  const api = automovel.imagemBase64?.trim() ?? "";
  const local = urlFotoAutomovelLocal(automovel.marca, automovel.modelo);
  const apiEhSvgPlaceholder = api.startsWith("data:image/svg+xml");
  if (local && (!api || apiEhSvgPlaceholder)) {
    return local;
  }
  if (api.length > 0) return api;
  return null;
}
