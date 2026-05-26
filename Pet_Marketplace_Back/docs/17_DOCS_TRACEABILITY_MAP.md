# 17 — Mapa de Rastreabilidade entre Documentos

Este documento conecta as especificações do projeto para evitar que agentes ou desenvolvedores implementem funcionalidades fora de contexto.

## Fonte oficial

A fonte oficial do projeto é a pasta `docs/`.

Ordem obrigatória de leitura:

1. `00_INDICE_DOCUMENTACAO.md`
2. `01_ESCOPO_CLIENTE_LINGUAGEM_NATURAL.md`
3. `02_DOCUMENTACAO_TECNICA_PROJETO.md`
4. `03_SPEC_PRODUCT.md`
5. Documento específico da área de atuação do agente

## Mapa de dependência entre specs

| Documento | Depende de | Alimenta |
|---|---|---|
| `03_SPEC_PRODUCT.md` | Escopo do cliente | Mobile, API, Admin, Database |
| `04_SPEC_USER_FLOWS.md` | Produto | Mobile, API, Admin, Testes |
| `05_SPEC_API.md` | Produto, User Flows, Database | Backend, Mobile, Admin, Testes |
| `06_SPEC_DATABASE.md` | Produto, API, Privacidade | Backend, Migrations, Rollback |
| `07_SPEC_MOBILE.md` | Produto, API, Design, Play Store | App Android |
| `08_SPEC_ADMIN.md` | Produto, API, Operação | Painel Admin |
| `09_SPEC_DESIGN_SYSTEM.md` | Produto, Play Store, Apple futura | Mobile, Admin |
| `10_SPEC_PLAYSTORE_RELEASE.md` | Mobile, Privacidade, Testes | Release Android |
| `11_SPEC_PRIVACY_DATA_SAFETY.md` | Produto, Database, API | Play Store, Segurança, UX |
| `12_SPEC_OPERATIONS_MODERATION.md` | Produto, Admin, Trust/Safety | Admin, Suporte, Métricas |
| `13_SPEC_NOTIFICATIONS.md` | User Flows, API, Mobile | Mobile, Backend |
| `14_SPEC_TEST_PLAN.md` | Todas as specs | QA, Release |
| `15_SPEC_MIGRATIONS_ROLLBACK.md` | Database, API | Backend, DevOps |
| `16_RISK_REGISTER.md` | Todas as specs | Decisões de produto |
| `18_SPEC_DATABASE_SQL_DRAFT.md` | Database | Backend, Migrations |
| `19_SPEC_API_EXAMPLES.md` | API | Backend, Mobile, Admin |
| `20_SPEC_KPIS_SLA.md` | Produto, Operação | Admin, Métricas |
| `21_SPEC_TIMELINE_DEPENDENCIES.md` | Produto, Specs técnicas | Planejamento |
| `22_GLOSSARY.md` | Todas as specs | Padronização de termos |
| `30_PLAYSTORE_RELEASE_READINESS.md` | Play Store, Mobile, Privacy, Testes | Release Android, PROGRESS |
| `32_SPEC_ASSET_ICON_SPLASH.md` | Design, Play Store | Mobile app assets, Release Android |
| `33_PLAYSTORE_APP_ACCESS_REVIEWER_PACKAGE.md` | Auth, Fixture, Play Store | Play Console App Access |
| `34_PLAYSTORE_LISTING_SCREENSHOT_PACKAGE.md` | Produto, Mobile, Play Store | Store Listing, Screenshots |
| `36_PLAYSTORE_REVIEW_FIXTURE_CONFIRMATION.md` | Fixture reviewer, Auth, Backend | Screenshots, App Access |
| `37_PLAYSTORE_LEGAL_DATA_SAFETY_CLOSURE.md` | Privacy, Legal, Play Store | Data Safety, Release gates |
| `38_PLAYSTORE_FINAL_SCREENSHOTS_READINESS.md` | Fixture, Mobile screenshots, Legal gates | EAS preflight, Store Listing |
| `39_EAS_BUILD_PREFLIGHT_READINESS.md` | `10`, `30`, `32`, `37`, `38`, Mobile `app.json`, Mobile `eas.json` | EAS build checkpoint, signed-build smoke, Release Android |
| `40_EAS_ASSET_AVATAR_PERMISSION_READINESS.md` | `10`, `11`, `30`, `32`, `39`, Mobile `app.json`, Mobile package/dependencies | Checkpoint 089, Play-ready asset gate, avatar permission posture |

## Rastreabilidade de entrega - Checkpoint 093

Feature documentada: tutor autenticado abre ou retoma conversa 1:1 com provider
via `POST /api/v1/conversations`, e o Mobile navega para
`/chat?conversationId=<uuid>` abrindo a thread somente se ela existir na lista
autenticada de conversas.

| Area | Fonte de verdade | Alimenta |
|---|---|---|
| API de conversa cold-start | `Pet_Marketplace_Back/src/conversations/*`, `Pet_Marketplace_Back/src/common/supabase/supabase-admin.service.ts` | Mobile client, testes e docs de release |
| Contrato mobile | `Pet_Marketplace_Mobile/src/api/client.ts`, `Pet_Marketplace_Mobile/src/api/types.ts` | Provider Detail, Chat tab, QA |
| UX de Provider Detail -> Chat | `Pet_Marketplace_Mobile/app/provider/[id].tsx`, `Pet_Marketplace_Mobile/app/(tabs)/chat.tsx` | Design system, smoke Play Store |
| Texto visivel | `Pet_Marketplace_Mobile/src/i18n/en-GB.ts` | Design system, release screenshots |
| Privacidade/UGC | `docs/11_SPEC_PRIVACY_DATA_SAFETY.md`, `docs/30_PLAYSTORE_RELEASE_READINESS.md` | Data Safety, App Access, backlog de release |

Ressalvas rastreadas:

- Rate limit de cold-start atomico: fechado no Checkpoint 094 por RPC SQL com
  advisory lock transacional por tutor.
- Semantica de `providers.is_available`: manter decisao explicita no produto.
- RLS/grants diretos: API segura, mas hardening de acesso Supabase direto pode
  ser tratado em ciclo dedicado.
- Teste mobile automatizado de deep-link: backlog de QA enquanto o app nao tem
  runner de testes de UI.

## Rastreabilidade de entrega - Checkpoint 094

Ressalva fechada: o rate limit de cold-start de `POST /api/v1/conversations`
passou a ser atomico no banco.

| Area | Fonte de verdade | Alimenta |
|---|---|---|
| RPC atomica de cold-start | `Pet_Marketplace_Back/supabase/migrations/20260526_010_conversation_cold_start_atomic.sql` | Backend, migrations, release readiness |
| Delegacao backend para RPC | `Pet_Marketplace_Back/src/common/supabase/supabase-admin.service.ts` | Conversations API, testes e erros HTTP |
| Tipagem da RPC | `Pet_Marketplace_Back/src/common/supabase/database.types.ts` | Typecheck backend |
| Teste focado | `Pet_Marketplace_Back/test/conversations-open-cold-start.e2e-spec.ts` | Harness backend e regressao de rate limit |

Garantias mantidas:

- `403` para conversa bloqueada.
- `404` generico para provider/tutor indisponivel, inexistente ou self-target.
- `429` para retorno `status = 'rate_limited'` da RPC.
- Sem alteracao de Mobile, deploy, EAS, Play Console ou escrita remota neste
  checkpoint.

## Regra para agentes

Antes de implementar qualquer módulo, o agente deve responder:

- qual documento consultou;
- quais requisitos serão implementados;
- quais requisitos ficaram fora;
- quais riscos ou ambiguidades encontrou;
- quais arquivos serão criados ou alterados.

## Regra para mudanças de escopo

Qualquer alteração de escopo deve atualizar, no mínimo:

1. `03_SPEC_PRODUCT.md`
2. spec técnica afetada;
3. `16_RISK_REGISTER.md`, se criar risco;
4. `20_SPEC_KPIS_SLA.md`, se afetar operação;
5. `22_GLOSSARY.md`, se introduzir novo termo.

## Convenção de status

Cada requisito pode receber um dos status:

- `PLANNED`: previsto, ainda não implementado.
- `IN_PROGRESS`: em implementação.
- `DONE`: implementado e testado.
- `DEFERRED`: adiado para fase futura.
- `OUT_OF_SCOPE`: fora do escopo contratado.
- `BLOCKED`: depende de decisão externa.
