/**
 * Retorna a imagem do automóvel.
 * Prioridade: base64 do backend → arquivo local em /public → null (placeholder).
 */

const LOCAL_PHOTOS = {
   1: "/car-1.avif",
   2: "/car-2.avif",
   3: "/car-3.avif",
   4: "/car-4.avif",
   5: "/car-5.avif",
   6: "/car-6.jpg",
   7: "/car-7.avif",
   8: "/car-8.avif",
   9: "/car-9.avif",
  10: "/car-10.avif",
};

export function srcFotoAutomovel(automovel) {
  if (!automovel) return null;
  const api = automovel.imagemBase64?.trim() ?? "";
  if (api.length > 0 && !api.startsWith("data:image/svg+xml")) return api;
  return LOCAL_PHOTOS[automovel.id] ?? null;
}
