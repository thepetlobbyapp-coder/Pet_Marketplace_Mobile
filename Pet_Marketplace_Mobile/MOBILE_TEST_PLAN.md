# MOBILE_TEST_PLAN — Pet Marketplace (Mobile, UK, Fase 1)

> Plano de teste/regressão como gate de qualidade Play Store
> (`docs/14_SPEC_TEST_PLAN.md`, `docs/07_SPEC_MOBILE.md` §8/§11).
> Arquivo na raiz do app (sobrevive ao `sync-shared`).
>
> Legenda: ✅ coberto · 🟡 parcial · ⚪ pendente · **[GATE]** bloqueia release.

## 1. Estado atual (Bloco 3 — 2026-05-18)

Runner oficial **jest-expo** configurado. Os specs zero-dep do harness
(`src/__tests__/`) rodam **sem reescrita** via bridge
(`src/__jest__/harness-bridge.jest.test.ts` → `runAllSuites()`).
Resultado: **4 suites / 9 testes jest passando** (16 specs do harness
dentro da bridge); typecheck strict + lint + `expo export` Android verdes.

| Spec | Cobre | Status |
|---|---|---|
| `me.contract.test.ts` (harness) | parse seguro de `/me`, roles múltiplas, descarte de campos proibidos | ✅ |
| `session-state.test.ts` (harness) | bootstrap: token ok / 401 / 403 / offline / sem token | ✅ |
| `roles.test.ts` (harness) | RBAC: tutor fallback, admin nunca obrigatório | ✅ |
| `harness-bridge.jest.test.ts` | roda os 16 specs do harness sob jest | ✅ |
| `token-store.jest.test.ts` | SecureStore: roundtrip, falha de leitura/limpeza | ✅ |
| `session-provider.jest.test.tsx` | wiring real: token→authenticated / 401→limpa / sem token | ✅ |
| `routing.jest.test.ts` | guard: rota inicial e acesso protegido por sessão | ✅ |

## 2. Matriz de testes

| Fluxo | Tipo | Prioridade | Observação | Status |
|---|---|---|---|---|
| Restauração de sessão (`/me`) | unit | alta | token válido/expirado, offline | ✅ |
| RBAC tutor/provider/admin | unit | alta | múltiplas roles não quebram | ✅ |
| Contrato `/me` defensivo | unit | alta | não depende de campos proibidos | ✅ |
| Login / cadastro | integration/e2e | alta | sem crash (gate Play) | ⚪ backend login pendente |
| Navegação pública/protegida | integration | alta | guard por sessão/role | ✅ `routing.jest.test.ts` |
| Exclusão de conta | integration/e2e | alta | confirma, desloga, bloqueia re-login | ⚪ Bloco 4 |
| Persistência de token (SecureStore) | integration | alta | set/get/clear + falha tolerada | ✅ `token-store.jest.test.ts` |
| API base URL por ambiente | unit | alta | HTTPS em produção (lança) | ✅ enforcement em `env.ts` |
| Booking (sem duplicar em retry) | integration | alta | idempotência | ⚪ bloco booking |
| Chat texto | integration | média | estados vazio/erro/denúncia | ⚪ bloco chat |

## 3. Estados obrigatórios por tela (docs/07 §8) — **[GATE]**

Toda tela deve tratar: loading · empty · erro de rede · erro de permissão ·
erro de validação · retry · usuário bloqueado · sessão expirada.
Lógica base pronta em `src/auth/session-state.ts` (`idle/bootstrapping/
authenticated/unauthenticated/blocked/error`) — falta ligar à UI no Bloco 3.

## 4. Device smoke (Bloco 3+) — **[GATE]** antes de submeter

- [ ] Android real · [ ] Emulador Android · [ ] Rede lenta · [ ] Sem internet
- [ ] App fechado/reaberto (sessão restaurada) · [ ] Permissão negada (fallback)
- [ ] Token expirado em uso real (401 → relogin) · [ ] Conta bloqueada (403)

## 5. Regressão crítica (rodar a cada release)

- [ ] Auth / restauração de sessão · [ ] Navegação protegida
- [ ] API base URL por ambiente (HTTPS prod) · [ ] Persistência local segura
- [ ] Exclusão de conta · [ ] Build EAS gera AAB assinado
- [ ] Nenhum texto pt-BR no app final · [ ] Sem promessa de pagamento/seguro/verificação

## 6. Como rodar

- `pnpm test` — jest-expo (todas as suites, inclui a bridge do harness).
- `pnpm run typecheck` — tsc strict.
- `pnpm run lint` — ESLint 9 flat (config Expo).
- `pnpm exec expo export --platform android` — valida que o app bundla.

Nenhum teste depende de Supabase/contas reais (SecureStore e `fetch`
são mockados).
