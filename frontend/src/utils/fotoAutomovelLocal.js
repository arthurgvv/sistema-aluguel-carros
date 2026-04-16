/**
 * Retorna a imagem do automóvel (upload base64 real do agente).
 * Retorna null quando não há imagem — o componente exibe o placeholder.
 */
export function srcFotoAutomovel(automovel) {
  if (!automovel) return null;
  const api = automovel.imagemBase64?.trim() ?? "";
  if (api.length > 0 && !api.startsWith("data:image/svg+xml")) return api;
  return null;
}
