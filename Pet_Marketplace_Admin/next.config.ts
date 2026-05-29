import type { NextConfig } from "next";

/**
 * Bloco 9 — Fatia mínima. Configuração mínima do Next 15.
 * Sem reescritas (toda chamada ao backend remoto é server-to-server,
 * com URL absoluta via ADMIN_API_BASE_URL). Sem images remote pattern
 * nesta fatia: o Admin não renderiza imagens de usuário.
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Não tipar/transpilar pacotes externos extras nesta fatia.
};

export default nextConfig;
