// Flat config para Next 15 + ESLint 9.
// Bloco 9 fatia 1: usa FlatCompat para reaproveitar a regra core-web-vitals
// que eslint-config-next ainda exporta no formato legacy (eslintrc).
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

const config = [
  ...compat.extends("next/core-web-vitals"),
  {
    ignores: [
      ".next/**",
      ".tmp/**",
      "node_modules/**",
      "dist/**",
      "build/**",
      "scripts/admin-preview-server.mjs",
    ],
  },
];

export default config;
