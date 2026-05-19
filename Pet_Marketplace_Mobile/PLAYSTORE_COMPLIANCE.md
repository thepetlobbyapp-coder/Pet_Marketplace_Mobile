# PLAYSTORE_COMPLIANCE — Pet Marketplace (Mobile)

> Evidência de conformidade Android/Play Store. Arquivo no **root do app**
> (NÃO em `.codex/`, NÃO em `docs/` — ambos fora do escopo de edição).
> Atualizado por S1+S2 em 2026-05-18. Fontes oficiais reverificadas 2026-05-19.

## Permissões Android (S1 — evidência do manifest gerado)

Gerado via `expo prebuild --platform android` (efêmero, `android/` nunca
commitado — Expo managed). `AndroidManifest.xml` resultante:

| Permissão | Origem | Necessária? | Decisão | Estado no manifest final |
|---|---|---|---|---|
| `INTERNET` | chamadas à API | **Sim** | manter | presente |
| `READ_EXTERNAL_STORAGE` | RN/Expo legacy | Não | bloquear | `tools:node="remove"` |
| `WRITE_EXTERNAL_STORAGE` | RN/Expo legacy | Não | bloquear | `tools:node="remove"` |
| `SYSTEM_ALERT_WINDOW` | dev launcher | Não (prod) | bloquear | `tools:node="remove"` |
| `VIBRATE` | RN core | Não (sem haptics) | bloquear | `tools:node="remove"` |

`blockedPermissions` declarado em `app.json` → `expo.android.blockedPermissions`.
**Gatilho de reauditoria:** toda nova dependência nativa (Supabase Auth,
push, câmera, etc.) exige refazer este passo antes de release.

## Transporte / cleartext (S2 — evidência do manifest gerado)

- `<application android:usesCleartextTraffic="false" android:networkSecurityConfig="@xml/network_security_config">` (confirmado no manifest gerado).
- `res/xml/network_security_config.xml`: `base-config cleartextTrafficPermitted="false"`;
  exceção `cleartextTrafficPermitted="true"` **somente** para `localhost`,
  `127.0.0.1`, `10.0.2.2` (dev/emulador).
- Camada complementar mantida: `src/config/env.ts` lança em produção se a
  URL não for HTTPS (app-layer; **não removida**).
- Implementado via config plugin local `plugins/with-network-security.js`.
  `@expo/config-plugins` fica declarado explicitamente em `devDependencies`
  para compatibilidade com pnpm/native build.

## Target SDK / API

- Regra oficial (verificada 2026-05-19): novos apps/updates devem mirar
  **API 35 (Android 15)+** — https://developer.android.com/google/play/requirements/target-sdk
- Stack: Expo SDK 55. O changelog oficial do SDK 55 trata de "targeting
  Android 16+" (edge-to-edge obrigatório) → default ≥ API 35.
- **LACUNA (honestidade epistêmica):** o número literal de `targetSdk` é
  resolvido pelo plugin Gradle do Expo em build-time; **não** é extraível
  de arquivo estático sem Gradle/Android SDK. **FATO** só num build EAS.
  Classificação atual: **INFERÊNCIA forte**, pendente de prova em EAS.

## Itens fora do escopo de S1/S2 (continuam bloqueando release)

Política de privacidade, exclusão de conta (back Bloco 4), Data Safety,
App Access, ícone/splash reais, AAB assinado. Ver `MOBILE_RELEASE.md`.
