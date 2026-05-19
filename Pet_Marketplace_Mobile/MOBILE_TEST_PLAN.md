# MOBILE_TEST_PLAN — Pet Marketplace (Mobile, UK, Fase 1)

> Plano de teste/regressão como gate de qualidade Play Store
> (`docs/14_SPEC_TEST_PLAN.md`, `docs/07_SPEC_MOBILE.md` §8/§11).
> Arquivo na raiz do app (sobrevive ao `sync-shared`).
>
> Legenda: ✅ coberto · 🟡 parcial · ⚪ pendente · **[GATE]** bloqueia release.

## 1. Estado atual (Bloco 1)

Sem runner oficial (chega no Bloco 3). Specs zero-dep em `src/__tests__/`
executados via harness — **16/16 passando**, typecheck strict limpo.

| Spec | Cobre | Status |
|---|---|---|
| `me.contract.test.ts` | parse seguro de `/me`, roles múltiplas, descarte de campos proibidos | ✅ |
| `session-state.test.ts` | bootstrap: token ok / 401 limpa sessão / 403 bloqueia / offline / sem token | ✅ |
| `roles.test.ts` | RBAC: tutor fallback, admin nunca obrigatório no mobile | ✅ |

## 2. Matriz de testes

| Fluxo | Tipo | Prioridade | Observação | Status |
|---|---|---|---|---|
| Restauração de sessão (`/me`) | unit | alta | token válido/expirado, offline | ✅ |
| RBAC tutor/provider/admin | unit | alta | múltiplas roles não quebram | ✅ |
| Contrato `/me` defensivo | unit | alta | não depende de campos proibidos | ✅ |
| Login / cadastro | integration/e2e | alta | sem crash (gate Play) | ⚪ Bloco 3 |
| Navegação pública/protegida | integration | alta | guard por sessão/role | ⚪ Bloco 3 |
| Exclusão de conta | integration/e2e | alta | confirma, desloga, bloqueia re-login | ⚪ Bloco 4 |
| Persistência de token (SecureStore) | integration/device | alta | sobrevive reabertura | ⚪ Bloco 3 |
| API base URL por ambiente | integration | alta | HTTPS em produção | ⚪ Bloco 3 |
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

## 6. Como rodar hoje (sem runner)

`pnpm dlx tsx` efêmero importando os specs + `runAllSuites()` do harness.
Bloco 3 substitui por runner oficial **sem reescrever os testes** (harness
neutro). Não depender de Supabase/contas reais em nenhum teste.
