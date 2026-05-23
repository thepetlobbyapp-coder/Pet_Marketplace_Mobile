# PROGRESS �?" Pet Marketplace UK

> Arquivo de checkpoint contínuo. Atualizado ao final de cada etapa.
> Fonte oficial do projeto: pasta `docs/`. Agentes oficiais: `.codex/`.

---

## Checkpoint 001 �?" Plano inicial da Fase 1

- **Data/hora:** 2026-05-16 (Europe/London)
- **Tarefa atual:** Análise da estrutura + plano de execução da Fase 1 (sem implementação)
- **Agentes envolvidos:** C10_Maestro (coordenação), A_Architecture, E_Environment, S_Seguranca, I18N_LocalizationUX

### Resumo do estado atual
- Projeto em Fase 0 concluída (documentação). **Nenhum código escrito.**
- Não é repositório git.
- Estrutura física: `Pet_Marketplace_Back/` e `Pet_Marketplace_Front/`, cada um contendo apenas `.codex/` (24 agentes, idênticos/duplicados).
- `docs/` na raiz com 29 documentos oficiais (00�?'28).
- Não existem `package.json`, `pnpm-workspace.yaml`, `apps/`, `packages/`, código de backend/mobile/admin.
- `docs/02` §2 define a estrutura oficial como monorepo único: `/apps/{api,mobile,admin}`, `/packages/shared`, `/docs`, `/.codex` �?" divergente da estrutura física atual.

### Documentos lidos
- `docs/00_INDICE_DOCUMENTACAO.md`
- `docs/01_ESCOPO_CLIENTE_LINGUAGEM_NATURAL.md`
- `docs/02_DOCUMENTACAO_TECNICA_PROJETO.md`
- `docs/03_SPEC_PRODUCT.md`
- `docs/04_SPEC_USER_FLOWS.md`
- `docs/17_DOCS_TRACEABILITY_MAP.md`
- `docs/21_SPEC_TIMELINE_DEPENDENCIES.md`

### Arquivos analisados
- Estrutura de `Pet_Marketplace_Back/.codex/` e `Pet_Marketplace_Front/.codex/` (24 agentes cada, idênticos)
- Listagem completa da raiz e de `docs/`

### Próximos passos
1. Obter decisão sobre topologia do repositório (D-001) e itens D-002 a D-004.
2. Após aprovação, executar **Bloco 0 �?" Fundação do repositório** (somente estrutura, sem produto).

### Pendências (decisões a registrar)
- **D-001:** Monorepo único na raiz vs. manter split Back/Front. *(bloqueante p/ Bloco 0)*
- **D-002:** Gerenciador de pacotes (recomendado: pnpm workspaces).
- **D-003:** `git init` + Conventional Commits.
- **D-004:** Local canônico de `.codex/` (raiz única).
- **D-005:** Não configurar Vercel/deploy agora (já travado por escopo).
- Produto (não bloqueante Bloco 0): chat em `requested` vs `accepted`; prestador inicia `active` vs `pending_review`.

### Riscos
- `.codex/` duplicado em Back e Front (risco de divergência).
- Ausência de git impede convenção de commits até `git init`.
- Dependências externas Fase 1 pendentes: conta Google Play, nome do app, ícone, URL de política de privacidade, chaves Supabase, chave de geocoding, conta Expo/EAS.

### Comandos executados
- `ls` na raiz, `docs/`, `Pet_Marketplace_Back/.codex`, `Pet_Marketplace_Front/.codex` (somente leitura/inspeção). Nenhuma escrita além deste arquivo.

### Testes rodados
- Nenhum (sem stack criada).

### Erros encontrados
- Nenhum.

### Próximo passo recomendado
Aprovar decisões D-001..D-004 e iniciar **Bloco 0 �?" Fundação do repositório**.

---

## Checkpoint 002 �?" Bloco 0: Fundação do repositório

- **Data/hora:** 2026-05-16 (Europe/London)
- **Tarefa atual:** Bloco 0 concluído (esqueleto; sem produto)
- **Agentes envolvidos:** C10_Maestro, A_Architecture, E_Environment, S_Seguranca, I18N_LocalizationUX

### Decisões registradas
- **D-001:** 3 aplicações independentes �?" Back / Mobile / Admin. Cada pasta autocontida com cópia de `docs/` e `.codex/`.
- **D-002:** pnpm (`packageManager: pnpm@9`).
- **D-003:** git init na raiz + Conventional Commits (`COMMITS.md`, `commitlint.config.js`).
- **D-004:** Canônico na raiz (`docs/`, `.codex/`); apps recebem cópia via `scripts/sync-shared.{sh,ps1}` (`pnpm sync`).
- **D-005:** Sem Vercel/deploy nesta fase (mantido).

### O que foi feito
- `Pet_Marketplace_Front/` renomeada �?' `Pet_Marketplace_Mobile/`.
- `Pet_Marketplace_Admin/` criada.
- `.codex/` canônico criado na raiz (a partir da cópia de Back); cópias antigas duplicadas nos apps substituídas pela sincronização.
- Fundação criada (esqueleto, sem framework �?" NestJS/Expo/Next ficam para Blocos 1/3/9).

### Arquivos criados (raiz)
`README.md`, `.gitignore`, `.editorconfig`, `.nvmrc`, `COMMITS.md`, `commitlint.config.js`, `.env.example`, `tsconfig.base.json`, `package.json`, `scripts/sync-shared.sh`, `scripts/sync-shared.ps1`, `.codex/` (canônico).

### Arquivos criados (por app: Back, Mobile, Admin)
`README.md`, `package.json`, `tsconfig.json`, `.env.example`, `src/.gitkeep`, + `docs/` e `.codex/` sincronizados.

### Arquivos alterados
- `docs/PROGRESS.md` (este checkpoint). Nenhum documento spec de `docs/` foi alterado.

### Comandos executados
- `mv Pet_Marketplace_Front Pet_Marketplace_Mobile`
- `mkdir -p Pet_Marketplace_Admin`
- `cp -r Pet_Marketplace_Back/.codex ./.codex`
- `bash scripts/sync-shared.sh`
- `git init` + commit inicial (Conventional Commits)

### Testes rodados
- Nenhum teste automatizado (Bloco 0 não cria stack executável). `typecheck`/`lint` por app são placeholders até Blocos 1/3/9.

### Erros encontrados
- Nenhum.

### Pendências
- Itens externos Fase 1: conta Google Play, nome do app, ícone/logo, URL política de privacidade, chaves Supabase, chave geocoding, conta Expo/EAS.
- Decisões de produto p/ Bloco 6/7: chat em `requested` vs `accepted`; prestador inicia `active` vs `pending_review`.
- Editar `docs/`/`.codex/` **somente na raiz** e rodar `pnpm sync` (risco de divergência se editar nas cópias).

### Próximo passo recomendado
Iniciar **Bloco 1 �?" Backend base** (NestJS, health check, Supabase, auth, RBAC, erros, logging, módulos) em `Pet_Marketplace_Back/`. Agentes: B_BackendDomain, A_Architecture, S_Seguranca, O_Observability.

---

## Checkpoint 003 �?" Plano do Bloco 1 (Backend base)

- **Data/hora:** 2026-05-16 (Europe/London)
- **Tarefa atual:** Plano do Bloco 1 produzido e revisado. **Sem implementação.**
- **Agentes envolvidos:** C10_Maestro (orquestra), B_BackendDomain (autor), C_Cetico + V_Agent_ImpactValidator (revisão), S_Seguranca + O_Observability (consultores), PR_PromptOps (prompt cirúrgico)

### Documentos lidos (adicionais)
- `docs/05_SPEC_API.md`, `docs/11_SPEC_PRIVACY_DATA_SAFETY.md`, `.codex/C10_Maestro/C10_Agent_ProjectRules.md`, `.codex/PR_PromptOps/PR_Agent_PromptRefiner_v2.md`

### Resumo
Plano do Bloco 1 cobre: estrutura de módulos (config, common/erros, logging, guards, auth, users, health, audit �?" esqueleto), dependências, padrão de erro/logging com redaction de PII, Auth Supabase + RBAC pelo backend, validação de env por Zod, rate limit (mecanismo), health check, Swagger. Recorte explícito Bloco 1 vs. blocos 2�?"10. Demais módulos do `docs/05` ficam `PLANNED` (não roteados, p/ não criar telas/rotas falsas �?" regra Play Store).

### Decisões registradas
- **D-006:** Supabase Auth emite token; backend valida e é autoridade de RBAC (guards próprios).
- **D-007:** Contrato congelado: base `/api/v1`; envelope de erro `{error:{code,message,details}}`; tabela HTTP `docs/05` §2.
- **D-008:** Logging pino estruturado + redaction de PII desde o Bloco 1.
- **D-009:** Sem chaves Supabase �?' Auth/DB `BLOCKED`; Bloco 1 prossegue com health/erro/logging/throttler/estrutura.

### Revisão (C_Cetico / V_Agent_ImpactValidator)
- Aprovado **sem bloqueios**, com mitigações: guard degradado (503) sem desabilitar auth; só health/auth/users mínimos expostos; filtro/logging/guards únicos e reutilizáveis; contrato `/api/v1` congelado para não quebrar Mobile/Admin.

### Arquivos criados / alterados
- Criados: nenhum de código (fase de plano). Alterado: `docs/PROGRESS.md` (este checkpoint).

### Comandos executados
- Nenhum comando de build/git nesta etapa (apenas leitura de docs/agentes). `pnpm sync` rodado para propagar este checkpoint.

### Testes rodados
- Nenhum (etapa de planejamento).

### Erros encontrados
- Nenhum.

### Pendências
- `[NECESSÁRIO]` chaves Supabase (`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL`) para Auth/DB end-to-end.
- Aprovação do usuário para iniciar a **implementação** do Bloco 1.

### Próximo passo recomendado
Com aprovação, executar a implementação do Bloco 1 conforme este plano (escopo: `Pet_Marketplace_Back/`), seguida de `pnpm typecheck/lint/build/test` + smoke `GET /api/v1/health`, e Checkpoint 004.

---

## Checkpoint 004 - Bloco 2: Supabase/PostGIS preparado sem aplicar migrations

- **Data/hora:** 2026-05-18 (America/Sao_Paulo)
- **Tarefa atual:** Preparacao segura do Bloco 2 de banco, sem aplicar alteracoes no Supabase.
- **Agentes envolvidos:** C10_Maestro, B_BackendDomain, S_Seguranca, O_Observability

### Resumo
- Backend publicado no GitHub confirmado em `main`.
- `.env`, `node_modules`, `dist`, `.publish`, `.claude` e `BUG_Debugger` confirmados como ignorados.
- Supabase Auth validado com anon key: endpoints de health/settings responderam `200`.
- `SUPABASE_URL` aponta para `https://oumrtrcqsyugdvildfmr.supabase.co`.
- `SUPABASE_SERVICE_ROLE_KEY` e `DATABASE_URL` seguem ausentes; por isso Postgres/PostGIS real ainda nao foi validado.
- Migrations SQL do Bloco 2 foram preparadas, mas **nao aplicadas**.

### Documentos lidos
- `docs/06_SPEC_DATABASE.md`
- `docs/15_SPEC_MIGRATIONS_ROLLBACK.md`
- `docs/18_SPEC_DATABASE_SQL_DRAFT.md`

### Recorte do Bloco 2 preparado
- Extensoes `postgis` e `pgcrypto`.
- Enums/base types.
- `users`, `user_roles`, `tutor_profiles`, `provider_profiles`, `provider_services`, `pets`, `addresses`, `audit_logs`.
- Localizacao armazenada com PostGIS, protegida por RLS; nenhuma policy publica expoe endereco completo ou coordenadas exatas.
- RLS inicial defensiva para owner/admin.
- Indices basicos, incluindo indice GiST de localizacao.
- Smoke SQL somente leitura para validar extensoes, tabelas, tipos, RLS e policies depois da aplicacao.

### Fora do escopo nesta etapa
- Pagamentos, Stripe, Pix, Wise, escrow, payouts.
- Chat, bookings, availability, reviews, reports/admin completo.
- Seeds com dados de teste.
- Aplicacao de migrations no banco remoto.

### Arquivos criados / alterados
- `Pet_Marketplace_Back/supabase/README.md`
- `Pet_Marketplace_Back/supabase/migrations/20260518_001_enable_extensions.sql`
- `Pet_Marketplace_Back/supabase/migrations/20260518_002_core_profiles_location_audit.sql`
- `Pet_Marketplace_Back/supabase/smoke/20260518_001_block2_readiness.sql`
- `docs/PROGRESS.md`

### Comandos executados
- `git status --short --ignored`
- `git check-ignore -v ...`
- `git ls-remote --heads https://github.com/thepetlobbyapp-coder/Pet_Marketplace_Back.git main`
- Validacao Supabase Auth via `fetch` sem imprimir segredos.
- `rg` para checar ausencia de segredos reais fora de `.env`.

### Testes rodados
- `pnpm typecheck` - passou.
- `pnpm lint` - passou.
- `pnpm build` - passou.
- `pnpm test:e2e` - passou (2 testes).

### Pendencias
- `[NECESSARIO]` preencher `SUPABASE_SERVICE_ROLE_KEY` no `.env` local do backend.
- `[NECESSARIO]` preencher `DATABASE_URL` no `.env` local do backend.
- `[NECESSARIO]` instalar/disponibilizar `psql` ou usar Supabase SQL editor/CLI para aplicar e rodar smoke SQL.
- Revisar e aprovar as migrations antes de aplicar no banco.

### Riscos
- As migrations ainda nao foram executadas contra um Postgres real; podem exigir pequenos ajustes de sintaxe/ambiente ao aplicar.
- RLS inicial e defensiva e pode exigir refinamento quando os fluxos Mobile/Admin forem implementados.
- Sem `DATABASE_URL`, nao ha validacao de PostGIS real nem de schema aplicado.

### Proximo passo recomendado
Fornecer `SUPABASE_SERVICE_ROLE_KEY` e `DATABASE_URL`, revisar as migrations preparadas e, apos confirmacao explicita, aplicar em Supabase e rodar `supabase/smoke/20260518_001_block2_readiness.sql`.

---

## Checkpoint 005 - Bloco 2: migrations aplicadas e validadas

- **Data/hora:** 2026-05-18 (America/Sao_Paulo)
- **Tarefa atual:** Aplicacao controlada das migrations 001/002 no Supabase `thepetlobbyapp-dev/main`.
- **Agentes envolvidos:** C10_Maestro, B_BackendDomain, S_Seguranca, O_Observability

### Resumo
- `SUPABASE_SERVICE_ROLE_KEY` e `DATABASE_URL` foram adicionados ao `.env` local do backend.
- `.env` permanece ignorado pelo Git.
- Migration 001 aplicada via SQL Editor: `postgis` e `pgcrypto`.
- Migration 002 aplicada pelo arquivo local com trava `ALLOW_DB_WRITE=APLICAR_MIGRATION_CONFIRMADO`.
- Smoke read-only confirmou conexao, extensoes, tabelas, RLS e ausencia de grants de escrita para `authenticated`.

### Banco validado
- Extensoes:
  - `pgcrypto` 1.3
  - `postgis` 3.3.7
- Tabelas encontradas:
  - `addresses`
  - `audit_logs`
  - `pets`
  - `provider_profiles`
  - `provider_services`
  - `tutor_profiles`
  - `user_roles`
  - `users`
- RLS habilitado em todas as tabelas acima.
- `authenticatedWriteGrants`: vazio.

### Arquivos criados / alterados nesta etapa
- `Pet_Marketplace_Back/scripts/db/env.mjs`
- `Pet_Marketplace_Back/scripts/db/smoke-readonly.mjs`
- `Pet_Marketplace_Back/scripts/db/run-sql-file.mjs`
- `Pet_Marketplace_Back/package.json`
- `Pet_Marketplace_Back/pnpm-lock.yaml`
- `docs/PROGRESS.md`

### Comandos executados
- `pnpm add -D pg`
- `pnpm db:smoke`
- `$env:ALLOW_DB_WRITE='APLICAR_MIGRATION_CONFIRMADO'; pnpm db:run-sql supabase/migrations/20260518_002_core_profiles_location_audit.sql`
- `pnpm typecheck`
- `pnpm lint`
- `pnpm build`
- `pnpm test:e2e`

### Testes rodados
- `pnpm db:smoke` - passou.
- `pnpm typecheck` - passou.
- `pnpm lint` - passou.
- `pnpm build` - passou.
- `pnpm test:e2e` - passou (2 testes).

### Pendencias
- Implementar camada backend que usa o schema real com service role controlada.
- Criar seeds fake/local apenas quando houver decisao sobre dados de teste.
- Definir fluxo de criacao/sincronizacao de `public.users` a partir de `auth.users`.
- Refinar RLS conforme os fluxos Mobile/Admin forem implementados.

### Riscos
- O banco remoto aparece no Supabase como `main`/`PRODUCTION`, mesmo sendo projeto `thepetlobbyapp-dev`; continuar exigindo confirmacao explicita antes de qualquer SQL.
- As policies atuais sao defensivas e privilegiam backend como autoridade; pode ser necessario abrir casos especificos de leitura/escrita com cuidado em blocos futuros.

### Proximo passo recomendado
Iniciar a integracao backend-schema: criar servicos/repositorios para perfis base, sincronizacao de usuario autenticado e smoke e2e com Supabase real, sem expor service role ao cliente.

---

## Checkpoint 006 - Validacao geral de status e regra de cascata

- **Data/hora:** 2026-05-19 (America/Sao_Paulo)
- **Tarefa atual:** Reconciliacao assertiva dos status de Back, Admin, Mobile e status geral.
- **Agentes envolvidos:** C10_Maestro, V_Validation

### Diagnostico de coerencia
- O status geral estava desatualizado: parava no Checkpoint 005, enquanto `Pet_Marketplace_Back/docs/PROGRESS.md` ja registrava avancos ate o Checkpoint 009.
- `Pet_Marketplace_Admin/docs/PROGRESS.md` e `Pet_Marketplace_Mobile/docs/PROGRESS.md` tambem paravam no Checkpoint 005, apesar de haver mudancas reais em Admin e pendencias reais em Mobile.
- A regra antiga de `docs/` canonico na raiz nao era suficiente para relatorios assertivos por diretorio.
- Foi adicionada regra rigida: qualquer alteracao em um diretorio exige atualizacao do `PROGRESS.md` daquele diretorio e do `docs/PROGRESS.md` geral.
- A regra tambem foi adicionada ao `C10_Agent_ProjectRules.md` e ao `V_Agent_QualitySeal.md` da raiz e das copias locais dos tres diretorios.
- `C10_STATUS.md` da raiz e das copias locais foi convertido de template para status vivo coerente com esta validacao.

### Status atual por diretorio
- **Back:** Bloco 2B implementado no codigo; `/me`, RBAC por `public.user_roles`, scripts locais de roles e smokes existem. Validacoes locais de codigo passaram, mas o smoke autenticado real esta pendente porque `BLOCK2B_AUTH_ACCESS_TOKEN` nao foi resolvido no ciclo atual.
- **Admin:** Base TypeScript de auth/session, contrato `/me`, recursos admin, view models de dashboard/listas/tabelas e testes unitarios simples estao presentes. Next.js real ainda nao foi inicializado; lint ainda e placeholder do Bloco 0/9.
- **Mobile:** Expo/app real ainda nao foi inicializado. Existem docs, assets e tsconfig, mas o typecheck falha no ambiente atual porque `tsc` nao esta disponivel localmente e `node_modules` esta ausente.
- **DigitalOcean App Platform env vars:** em andamento por outro agente, considerado meio caminho neste item. Nao foi validado neste ciclo para evitar conflito de escopo.

### Comandos executados neste ciclo
- Raiz: `git status --short`
- Back: `pnpm typecheck`, `pnpm lint`, `pnpm build`, `pnpm test:e2e`, `pnpm db:smoke`, `pnpm db:smoke:block2b`
- Admin: `pnpm typecheck`, `pnpm lint`, `pnpm test`
- Mobile: `pnpm typecheck`

### Resultado das validacoes
- **Back:** `typecheck`, `lint`, `build`, `test:e2e` e `db:smoke` passaram. `db:smoke:block2b` falhou com `BLOCK2B_AUTH_ACCESS_TOKEN could not be resolved`; por isso `db:smoke:me` nao foi executado nesta cadeia.
- **Admin:** `typecheck` passou; `lint` passou como placeholder; `test` passou com 7 suites locais.
- **Mobile:** `typecheck` falhou antes de compilar: `tsc` nao reconhecido e aviso de `node_modules` ausente.

### Pendencias reais
- Regenerar/fornecer token valido para o smoke autenticado do Backend e reexecutar `pnpm db:smoke:block2b` + `pnpm db:smoke:me`.
- Decidir se o Admin deve avancar para Bloco 9/Next.js real ou permanecer como camada TypeScript preparatoria.
- Instalar dependencias/inicializar Expo no Mobile antes de declarar typecheck mobile como valido.
- Validar DigitalOcean App Platform env vars quando o outro agente concluir o trabalho.

### Riscos
- Relatorios antigos que leem apenas o status geral ou apenas o status local podem continuar incoerentes se a regra de cascata nao for seguida.
- O token autenticado do Backend e temporario; qualquer relatorio que marque smoke autenticado como OK precisa citar a data do token e o comando rodado.
- Mobile ainda nao pode ser considerado validado tecnicamente sem dependencias locais.

### Proximo passo recomendado
Fechar o ciclo de DigitalOcean App Platform env vars com o outro agente, regenerar token de teste do Backend se aprovado e reexecutar os smokes autenticados. Para qualquer novo patch, atualizar o status local do diretorio alterado e este status geral.

---

## Checkpoint 007 - DigitalOcean App Platform env vars do Backend preparadas, escrita bloqueada por alvo incerto

- **Data/hora:** 2026-05-19 (America/Sao_Paulo)
- **Tarefa atual:** Preparar suporte de agente e payload seguro para DigitalOcean App Platform env vars.
- **Agentes envolvidos:** E_Environment, F_AgentForge, C10_Maestro

### Resumo
- Criado `Pet_Marketplace_Back/.codex/E_Environment/E_Agent_DigitalOceanEnvironment.md`.
- Atualizado `Pet_Marketplace_Back/.codex/AGENTS.md` para mencionar `@ER`.
- Criado `Pet_Marketplace_Back/scripts/digitalocean/app-platform-env.ps1` para aplicar o pacote depois que o servico alvo for confirmado.
- O backend teve variaveis necessarias mapeadas a partir de `.env`, `.env.example`, `src/config/env.schema.ts`, `src/main.ts` e consumidores Supabase.
- DigitalOcean CLI/API esta autenticada, mas `Pet_Marketplace_Back/` nao esta linkado a nenhum projeto.
- Os projetos DigitalOcean visiveis nao confirmam um servico Pet Marketplace; por seguranca, nenhuma variavel remota foi escrita.

### Variaveis de backend preparadas
- `NODE_ENV`
- `API_PORT`
- `API_BASE_URL`
- `APP_DEFAULT_LOCALE`
- `CORS_ALLOWED_ORIGINS`
- `SWAGGER_ENABLED`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `DATABASE_URL`
- `GEOCODING_API_KEY` quando houver valor real

### Pendencias
- Confirmar/criar/linkar o servico DigitalOcean correto do Backend.
- Confirmar dominios reais de Admin/Frontend para CORS.
- Aplicar variaveis no destino correto e revisar staged changes no DigitalOcean.
- Redeployar e validar health check publico.

### Riscos
- Aplicar `.env` no projeto errado foi evitado, mas continua sendo o maior risco operacional.
- `BLOCK2B_AUTH_ACCESS_TOKEN` e demais variaveis de smoke/local nao devem ser promovidas para production sem ordem explicita.
- `API_PORT` precisa seguir o `PORT` injetado pela DigitalOcean para evitar erro de aplicacao sem resposta.

---

## Checkpoint 008 - Registro legado de provedor anterior sanitizado

- **Data/hora:** 2026-05-19 (America/Sao_Paulo)
- **Tarefa atual:** Retificar registro historico de deploy para refletir a migracao atual para DigitalOcean.
- **Agentes envolvidos:** E_Environment, E_DigitalOceanEnvironment, C10_Maestro

### Resumo
- Este checkpoint originalmente descrevia operacao em provedor anterior e foi sanitizado apos a decisao de usar DigitalOcean.
- Nenhum app id, componente, conta, deployment id ou dominio real de DigitalOcean deve ser inferido a partir deste registro legado.
- O alvo atual e DigitalOcean App Platform, mas app, componente, dominio publico e env vars reais ainda precisam ser confirmados no painel/CLI.
- O dominio temporario documental usado ate confirmacao e `https://pet-marketplace-back.example.ondigitalocean.app`.

### Variaveis esperadas para DigitalOcean Backend
- Runtime: `NODE_ENV`, `PORT`/`API_PORT`, `API_BASE_URL`, `APP_DEFAULT_LOCALE`, `CORS_ALLOWED_ORIGINS`, `SWAGGER_ENABLED`.
- Supabase/DB: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL`.
- Dev/smoke-only nao devem ir para production sem ordem explicita: `BLOCK2B_AUTH_ACCESS_TOKEN`, credenciais de teste e flags de escrita.

### Pendencias
- Confirmar app/componente corretos no DigitalOcean App Platform.
- Aplicar env vars no destino correto sem imprimir segredos.
- Definir `CORS_ALLOWED_ORIGINS` com `http://localhost:8082`, `http://localhost:8081` e dominios reais quando existirem.
- Redeployar e validar `GET /api/v1/health` no dominio real de DigitalOcean.

### Riscos
- Reaproveitar nomes/IDs antigos do provedor anterior como se fossem DigitalOcean criaria risco operacional.
- Sem `CORS_ALLOWED_ORIGINS`, clientes web podem ser bloqueados por CORS.

### Decisao de pausa segura
- Este registro nao deve ser usado como prova de deploy DigitalOcean ativo.
- O proximo ciclo deve confirmar o alvo real no DigitalOcean antes de qualquer alteracao remota.

---

## Checkpoint 008 - Validacao assertiva de progresso do MVP e PDF para cliente

- **Data/hora:** 2026-05-19 (America/Sao_Paulo)
- **Tarefa atual:** Revalidar progresso de Admin, Mobile, Back, Banco e Docs; gerar PDF simples para cliente.
- **Agentes envolvidos:** C10_Maestro, V_Validation

### Percentual assertivo do MVP
- **MVP funcional geral:** 33%.
- Pesos usados para evitar inflar o progresso: Mobile 30%, Back 25%, Banco 20%, Admin 15%, Docs 10%.
- Percentuais por frente:
  - Mobile: 5%.
  - Back: 35%.
  - Banco: 50%.
  - Admin: 25%.
  - Docs: 90%.

### Justificativa do percentual
- O MVP depende fortemente do app mobile; hoje ainda nao ha app Expo/React Native executavel.
- Back e Banco tem base importante validada, mas ainda faltam fluxos centrais do MVP: busca completa, pets, prestadores, agendamentos, chat, avaliacoes, denuncias e admin operacional.
- Admin possui logica preparatoria e testes, mas ainda nao e um painel web real.
- Docs estao avancados e consistentes, mas nao substituem produto funcional.

### Comandos executados nesta nova rodada
- Back: `pnpm typecheck`, `pnpm lint`, `pnpm build`, `pnpm test:e2e`, `pnpm db:smoke`, `pnpm db:smoke:block2b`.
- Admin: `pnpm typecheck`, `pnpm lint`, `pnpm test`.
- Mobile: `pnpm typecheck`.
- Docs/raiz: inspecao de `docs/`, assets, specs de produto e status Git.

### Resultado das validacoes
- **Back:** typecheck, lint, build, e2e e smoke read-only do banco passaram; `db:smoke:block2b` falhou porque `BLOCK2B_AUTH_ACCESS_TOKEN` nao foi resolvido.
- **Banco:** smoke read-only passou com conexao OK, extensoes `pgcrypto`/`postgis`, tabelas base encontradas, RLS ativo e sem grants de escrita para `authenticated`.
- **Admin:** typecheck passou; testes passaram com 7 suites; lint ainda e placeholder.
- **Mobile:** typecheck falhou porque `tsc` nao esta disponivel; app Expo ainda nao iniciado.
- **Docs:** documentacao principal e identidade visual existem; PDF novo foi gerado para cliente.

### Arquivo gerado para cliente
- `docs/status-mvp-cliente-2026-05-19-validacao-assertiva.pdf`
- PDF curto, simples, com identidade visual The Pet Lobby, progresso geral e status por frente em linguagem nao tecnica.
- Layout revisado apos feedback visual do usuario: removida a barra/lista azul de progresso e adotado padrao mais proximo do PDF anterior `docs/status-mvp-cliente-2026-05-19.pdf`.

### Arquivos criados / alterados neste ciclo
- `scripts/generate-client-mvp-status-pdf.py`
- `docs/status-mvp-cliente-2026-05-19-validacao-assertiva.pdf`
- `docs/PROGRESS.md`

### Pendencias reais para avancar o MVP
- Iniciar e validar o app Mobile.
- Completar Back e Banco para fluxos do marketplace: busca, prestadores, pets, agendamentos, chat, avaliacoes e denuncias.
- Transformar Admin em painel web real.
- Confirmar alvo DigitalOcean correto, aplicar variaveis e validar ambiente online.
- Preparar politica de privacidade publica, exclusao de conta e pacote Play Store.

### Proximo passo recomendado
Priorizar Mobile + fluxos centrais do Back/Banco; sem isso, o MVP nao deve ser apresentado como proximo de entrega funcional.

---

## Checkpoint 009 - Registro legado de deploy sanitizado

- **Data/hora:** 2026-05-19 (America/Sao_Paulo)
- **Tarefa atual:** Remover afirmacoes herdadas de deploy anterior e preparar validacao real em DigitalOcean.
- **Agentes envolvidos:** C10_Maestro, E_DigitalOceanEnvironment, V_Validation

### Resumo
- Registro retificado: as evidencias de projeto/deployment anteriores pertenciam ao provedor legado e nao confirmam o estado atual de DigitalOcean.
- Alvo DigitalOcean ainda precisa ser confirmado por app id, componente, dominio publico e variaveis aplicadas.
- Valor documental temporario: `API_BASE_URL=https://pet-marketplace-back.example.ondigitalocean.app`.
- Hotfix de codigo aplicado para runtime DigitalOcean Node 20: Supabase client recebe transporte WebSocket via `ws`, evitando crash em `@supabase/realtime-js`.
- `main.ts` passou a escutar em `0.0.0.0`, necessario para o proxy do container.
- Deploy/health publico em DigitalOcean devem ser revalidados no alvo real antes de serem declarados prontos.

### Arquivos criados / alterados neste ciclo
- `Pet_Marketplace_Back/src/common/supabase/supabase-client-options.ts`
- `Pet_Marketplace_Back/src/common/supabase/supabase-admin.service.ts`
- `Pet_Marketplace_Back/src/common/auth/supabase.service.ts`
- `Pet_Marketplace_Back/src/main.ts`
- `Pet_Marketplace_Back/package.json`
- `Pet_Marketplace_Back/pnpm-lock.yaml`
- `docs/PROGRESS.md`
- `Pet_Marketplace_Back/docs/PROGRESS.md`
- `.codex/C10_Maestro/C10_STATUS.md`
- `.codex/C10_Maestro/C10_LOG.md`

### Comandos executados
- `doctl apps list / doctl apps get`
- `doctl apps spec get / doctl apps get --json` filtrado para nomes
- `doctl apps create-deployment --service Pet_Marketplace_Back --environment production --yes --json`
- `doctl apps logs ... --json`
- `doctl apps get / painel Domains --service Pet_Marketplace_Back --environment production --port 8080 --json`
- deploy/redeploy no provedor anterior: registro legado, sem valor de prova para DigitalOcean atual
- Health publico: `GET https://pet-marketplace-back.example.ondigitalocean.app/api/v1/health`
- Back: `pnpm typecheck`, `pnpm lint`, `pnpm build`, `pnpm test:e2e`, `pnpm db:smoke`, `pnpm db:smoke:block2b`

### Resultado das validacoes
- DigitalOcean atual: pendente de revalidacao no app/componente real.
- Health publico no dominio real: pendente.
- `pnpm typecheck` - passou.
- `pnpm lint` - passou.
- `pnpm build` - passou.
- `pnpm test:e2e` - passou (2 suites, 6 testes).
- `pnpm db:smoke` - passou; confirmou conexao, `pgcrypto`, `postgis`, tabelas esperadas, RLS ativo e nenhum grant de escrita para `authenticated`.
- `pnpm db:smoke:block2b` - falhou: `BLOCK2B_AUTH_ACCESS_TOKEN could not be resolved`.
- `pnpm db:smoke:me` - nao executado porque o token autenticado nao foi resolvido.

### Pendencias reais
- Regenerar ou fornecer `BLOCK2B_AUTH_ACCESS_TOKEN` valido; `BLOCK2B_TEST_EMAIL` e `BLOCK2B_TEST_PASSWORD` nao estao no `.env` local atual.
- Persistir/confirmar o hotfix no repositorio GitHub correto do Backend antes do deploy real em DigitalOcean.
- Definir `CORS_ALLOWED_ORIGINS` quando houver dominio real de Admin/Frontend web.

### Riscos
- Sem persistir o hotfix no repo correto, um redeploy futuro baseado apenas em GitHub pode voltar a quebrar Node 20/Supabase ou bind de container.
- Smoke autenticado real ainda nao deve ser declarado OK neste ciclo.
- `CORS_ALLOWED_ORIGINS` segue pendente para clientes web em producao.

### Proximo passo recomendado
Persistir o hotfix no repositorio correto do Backend e, em seguida, regenerar token de teste para reexecutar `pnpm db:smoke:block2b` e `pnpm db:smoke:me`. Depois disso, avancar para Bloco 3 Mobile Base.

---

## Checkpoint 010 - Registro legado de persistencia sanitizado

- **Data/hora:** 2026-05-19 (America/Sao_Paulo)
- **Tarefa atual:** Corrigir linguagem de deploy legado e manter apenas pendencias verificaveis para DigitalOcean.
- **Agentes envolvidos:** C10_Maestro, E_DigitalOceanEnvironment, V_Validation

### Resumo
- Worktree local continua suja por mudancas anteriores e nao relacionadas; nada foi revertido.
- `git remote -v` no root e em `Pet_Marketplace_Back/` ainda aponta para `Pet_Marketplace_Mobile.git`, portanto nenhum push foi feito a partir desse remote local.
- O repositorio correto `thepetlobbyapp-coder/Pet_Marketplace_Back.git` foi clonado em copia temporaria limpa.
- O hotfix foi persistido em `main` com commit `c3fa1d2` (`fix: stabilize digitalocean runtime`).
- Build automatico, deployment id e health publico em DigitalOcean atual seguem pendentes de confirmacao no App Platform.
- `GET https://pet-marketplace-back.example.ondigitalocean.app/api/v1/health` usa dominio placeholder documental ate o dominio real ser confirmado.

### Arquivos do hotfix versionados no repo Backend
- `package.json`
- `pnpm-lock.yaml`
- `src/main.ts`
- `src/common/auth/supabase.service.ts`
- `src/common/supabase/supabase-admin.service.ts`
- `src/common/supabase/supabase-client-options.ts`

### Comandos executados
- `git status --short`
- `git remote -v`
- `git ls-remote --heads https://github.com/thepetlobbyapp-coder/Pet_Marketplace_Back.git main`
- `git clone https://github.com/thepetlobbyapp-coder/Pet_Marketplace_Back.git ...`
- `git diff --cached --check`
- `git commit -m "fix: stabilize digitalocean runtime"`
- `git push origin main`
- `doctl apps list / doctl apps get`
- Health publico: `GET https://pet-marketplace-back.example.ondigitalocean.app/api/v1/health`
- Back: `pnpm typecheck`, `pnpm lint`, `pnpm build`, `pnpm test:e2e`, `pnpm db:smoke`, `pnpm db:smoke:block2b`
- Tentativa segura de token: `node scripts/auth/get-block2b-token.mjs`

### Resultado das validacoes
- Repo Backend: `main` aponta para `c3fa1d2`.
- DigitalOcean atual: build/deploy/health pendentes de revalidacao no app real.
- `pnpm typecheck` - passou.
- `pnpm lint` - passou.
- `pnpm build` - passou.
- `pnpm test:e2e` - passou (2 suites, 6 testes).
- `pnpm db:smoke` - passou.
- `pnpm db:smoke:block2b` - falhou: `BLOCK2B_AUTH_ACCESS_TOKEN could not be resolved`.
- `node scripts/auth/get-block2b-token.mjs` - falhou por ausencia de `BLOCK2B_TEST_EMAIL`.
- `pnpm db:smoke:me` - nao executado porque nao ha token valido.

### Pendencias reais
- Fornecer ou preencher credenciais de teste seguras (`BLOCK2B_TEST_EMAIL` e `BLOCK2B_TEST_PASSWORD`) para gerar novo `BLOCK2B_AUTH_ACCESS_TOKEN`.
- Reexecutar `pnpm db:smoke:block2b` e `pnpm db:smoke:me` apos token valido.
- Definir `CORS_ALLOWED_ORIGINS` quando houver dominio real de Admin/Frontend web.
- Opcional: corrigir o remote local deste workspace para reduzir risco operacional, ja que ele ainda aponta para Mobile.

### Proximo passo recomendado
Fechar o token autenticado de teste ou aceitar formalmente essa pendencia controlada; em seguida iniciar o Bloco 3 Mobile Base em `Pet_Marketplace_Mobile/`.

---

## Checkpoint 011 - Smoke autenticado Backend fechado com novo usuario

- **Data/hora:** 2026-05-19 (America/Sao_Paulo)
- **Tarefa atual:** Regenerar token local de teste e fechar smoke autenticado do Backend.
- **Agentes envolvidos:** C10_Maestro, V_Validation

### Resumo
- Usuario de teste novo `usuario@teste.com` foi usado pelo operador no `.env` local.
- `node scripts/auth/get-block2b-token.mjs` gerou novo `BLOCK2B_AUTH_ACCESS_TOKEN` sem imprimir o token.
- `pnpm db:smoke:block2b` passou com token resolvido.
- `pnpm db:smoke:me` passou com HTTP `200`.
- Como era um usuario novo, `/me` sincronizou `auth.users -> public.users` e criou a role fallback `tutor`.
- Rechecagem read-only posterior confirmou `optionalAuthToken: resolved_with_public_user`.

### Comandos executados
- `pnpm db:smoke:block2b`
- `pnpm db:smoke:me`
- `pnpm db:smoke:block2b` pos-sync

### Resultado das validacoes
- `pnpm db:smoke:block2b` - passou; service role leu `users`, `user_roles`, `tutor_profiles` e `provider_profiles`.
- `pnpm db:smoke:me` - passou; `/api/v1/me` respondeu HTTP `200`.
- Usuario autenticado: ativo, locale `en-GB`, roles `["tutor"]`.
- `syncCreatedPublicUser: true`, `fallbackRoleCreated: true`, `createdNewDataThisRun: true`.
- Rechecagem final: token resolvido com `public.users` existente.

### Pendencias reais
- `CORS_ALLOWED_ORIGINS` segue pendente ate existir dominio real de Admin/Frontend web.
- Remote Git local deste workspace ainda aponta para `Pet_Marketplace_Mobile`; evitar push backend por esse remote.

### Proximo passo recomendado
Iniciar Bloco 3 Mobile Base em `Pet_Marketplace_Mobile/` com Expo, navegacao, tema, i18n en-GB e shell inicial.

---

## Checkpoint 012 - Regra operacional para comandos PowerShell

- **Data/hora:** 2026-05-20 (America/Sao_Paulo)
- **Tarefa atual:** Formalizar que todo comando PowerShell precisa indicar a pasta de execucao.
- **Agentes envolvidos:** C10_Maestro, V_Validation

### Resumo
- Adicionada regra global para sempre informar `Pasta de execucao: <caminho>` antes de orientar ou executar comandos PowerShell.
- A regra foi registrada no catalogo mestre `.codex/AGENTS.md`.
- A regra foi registrada em `.codex/C10_Maestro/C10_Agent_ProjectRules.md`.
- A copia do Mobile tambem foi atualizada para manter o padrao claro em prompts, checklists e relatorios.

### Comandos executados
- Pasta de execucao: `C:\Users\israe\Downloads\Pet_Marketplace`
- `rg -n "PowerShell|powershell|pasta|diretorio|working directory|cwd|comando" .codex Pet_Marketplace_Mobile/.codex docs Pet_Marketplace_Mobile/docs -S`
- `git status --short -- .codex Pet_Marketplace_Mobile/.codex docs Pet_Marketplace_Mobile/docs`
- `Get-Content` nos arquivos de regras e progresso relevantes.

### Resultado das validacoes
- Regra documentada em raiz e Mobile.
- Validacao final limitada a diff/whitespace dos arquivos tocados neste ciclo.

### Pendencias reais
- A partir deste checkpoint, todo prompt/checklist deve trazer o caminho da pasta antes dos comandos PowerShell.

### Proximo passo recomendado
Usar o novo formato nos proximos prompts de EAS: primeiro indicar a pasta, depois listar os comandos.

---

## Checkpoint 018 - Bloco 3: Mobile Base inicializado

- **Data/hora:** 2026-05-21 (America/Sao_Paulo)
- **Tarefa atual:** Inicializacao segura do app Mobile com Expo/React Native/TypeScript.
- **Agentes envolvidos:** C10_Maestro, M_MobilePlaystore, C_Cetico, V_ImpactValidator, S_Seguranca

### Gates antes da implementacao
- C_Cetico: aprovado com ressalvas.
- V_ImpactValidator: exigiu validacao de seguranca por tocar auth/token/env.
- S_Seguranca: aprovado com ressalvas.
- Ressalvas incorporadas: somente envs publicas no Mobile, Supabase client-side apenas para Auth, sessao persistida via SecureStore, backend como autoridade para RBAC/status, endpoints restritos a `/api/v1/health` e `/api/v1/me`.

### O que foi implementado
- Expo SDK 56 com Expo Router e TypeScript em `Pet_Marketplace_Mobile`.
- Rotas base: login, cadastro placeholder seguro, reset placeholder seguro, home, profile, settings, terms e privacy.
- i18n simples `en-GB` centralizado em `src/i18n/en-GB.ts`.
- Componentes base reutilizaveis: Screen, Button, TextField, Card, LoadingState e ErrorState.
- Cliente API mobile restrito a `GET /api/v1/health` e `GET /api/v1/me`.
- Supabase Auth anon/public no client-side, com sessao persistida por `expo-secure-store`.
- QueryClient para chamadas remotas com retry controlado.
- `.env.example` atualizado apenas com `EXPO_PUBLIC_API_BASE_URL`, `EXPO_PUBLIC_SUPABASE_URL` e `EXPO_PUBLIC_SUPABASE_ANON_KEY`.
- README atualizado com setup, scripts e guardrails.
- Config Android inicial em `app.json`, sem permissoes sensiveis.

### Fora do escopo mantido
- Sem hospedagem de front/admin.
- Sem configuracao de CORS real.
- Sem alteracao em backend, banco, DigitalOcean ou producao.
- Sem busca, booking, chat, reviews, reports, pagamentos ou geolocalizacao.
- Sem service role, `DATABASE_URL`, senhas ou tokens de smoke no Mobile.

### Resultado das validacoes
- `pnpm install` - concluido.
- `pnpm typecheck` - passou.
- `pnpm lint` - passou.
- `pnpm exec expo install --check` - passou.
- `pnpm exec expo config --type public` - passou.
- Health remoto `GET /api/v1/health` - HTTP 200.
- Expo Metro nativo iniciado em `http://localhost:8081` - HTTP 200.
- Expo Web iniciado em `http://localhost:8082` - renderizou `/login` no navegador interno, sem erros de console, com login desabilitado enquanto env Supabase publica nao estiver preenchida.
- Varredura de secrets no Mobile - sem secrets reais; apenas mencoes documentais proibitivas a `SUPABASE_SERVICE_ROLE_KEY`/`DATABASE_URL`.

### Pendencias reais
- Preencher `EXPO_PUBLIC_SUPABASE_URL` e `EXPO_PUBLIC_SUPABASE_ANON_KEY` no `.env` local do Mobile para testar login real no app.
- Validar o app em Expo Go/emulador Android com uma conta de teste aprovada.
- Futuro Bloco 4 deve conectar cadastro, perfil tutor/prestador, pet e endereco.
- CORS/dominio web seguem aguardando hospedagem de front/admin.

### Proximo passo recomendado
Rodar o Mobile no Expo, testar login com usuario de teste e, em seguida, iniciar Bloco 4 (cadastro e perfis) quando o fluxo base estiver aprovado visualmente.

---

## Checkpoint 019 - Mobile auth guard reforcado antes do login real

- **Data/hora:** 2026-05-21 (America/Sao_Paulo)
- **Tarefa atual:** Validar o estado real do Bloco 3 Mobile antes do teste com Supabase Auth real.
- **Agentes envolvidos:** C10_Maestro, M_MobilePlaystore, S_Seguranca, V_Validation

### Resumo
- `Pet_Marketplace_Mobile/.env` nao existe neste workspace; apenas `.env.example` esta presente.
- Login/logout real e persistencia real via `expo-secure-store` nao foram executados por ausencia das envs publicas do Supabase.
- O layout protegido de `(tabs)` foi reforcado: sem sessao, qualquer rota autenticada redireciona para `/(auth)/login`.
- O refresh do perfil foi desabilitado quando nao ha `accessToken`, preservando a regra de nao chamar `/api/v1/me` sem sessao valida.
- Nenhum cadastro foi implementado e nenhum segredo backend foi adicionado ao Mobile.

### Arquivos alterados neste ciclo
- `Pet_Marketplace_Mobile/app/(tabs)/_layout.tsx`
- `Pet_Marketplace_Mobile/app/(tabs)/profile.tsx`
- `Pet_Marketplace_Mobile/docs/PROGRESS.md`
- `docs/PROGRESS.md`

### Validacoes
- Mobile: `pnpm typecheck` - passou.
- Mobile: `pnpm lint` - passou.
- Mobile: `pnpm exec expo install --check` - passou.
- Mobile: `pnpm exec expo config --type public` - passou.
- Backend publico: `GET /api/v1/health` - passou com `status=ok`.
- Expo Metro nativo `http://localhost:8081` - HTTP 200.
- Expo Web `http://localhost:8082/login` - HTTP 200.
- Navegador interno: `/login` com aviso de config ausente, botao `Sign in` desabilitado e `consoleErrors=[]`.
- Navegador interno: acesso direto a `/home` redirecionou para `/login`.
- Scan de secrets no Mobile: sem segredos reais; somente mencoes documentais proibitivas.

### Pendencias
- Preencher `Pet_Marketplace_Mobile/.env` com `EXPO_PUBLIC_SUPABASE_URL` e `EXPO_PUBLIC_SUPABASE_ANON_KEY`.
- Testar login/logout real em Expo Go ou emulador com usuario aprovado.
- Confirmar persistencia nativa da sessao via `expo-secure-store`.
- Confirmar `/api/v1/me` autenticado com token real.

### Proximo passo recomendado
Fornecer as duas envs publicas do Supabase no `.env` local do Mobile e fechar o teste real de auth antes de iniciar Bloco 4: cadastro e perfis.

---

## Checkpoint 020 - Mobile Auth real validado no Expo Web

- **Data/hora:** 2026-05-21 (America/Sao_Paulo)
- **Tarefa atual:** Fechar a pendencia real de Auth Mobile com `.env` local e usuario Supabase de teste.
- **Agentes envolvidos:** C10_Maestro, M_MobilePlaystore, S_Seguranca, V_Validation

### Resumo
- Criado `Pet_Marketplace_Mobile/.env` local, ignorado pelo Git, somente com envs publicas permitidas.
- Foram copiadas apenas as equivalencias publicas: `SUPABASE_URL -> EXPO_PUBLIC_SUPABASE_URL` e `SUPABASE_ANON_KEY -> EXPO_PUBLIC_SUPABASE_ANON_KEY`.
- Nao foram copiadas service role, `DATABASE_URL`, senhas, JWT secrets, tokens de smoke ou segredos backend.
- Expo foi reiniciado e carregou `EXPO_PUBLIC_SUPABASE_ANON_KEY`, `EXPO_PUBLIC_SUPABASE_URL` e `EXPO_PUBLIC_API_BASE_URL`.
- Login real com Supabase Auth passou no Expo Web.
- Logout real passou no Expo Web e rotas protegidas voltaram a redirecionar para `/login`.
- Persistencia de sessao no Web foi validada via reload.
- Storage de sessao recebeu fallback Web para `localStorage`; nativo continua com `expo-secure-store`.
- `AuthProvider` recebeu tratamento para nao travar a inicializacao quando storage/session falhar.

### Arquivos alterados neste ciclo
- `Pet_Marketplace_Mobile/.env` local ignorado pelo Git.
- `Pet_Marketplace_Mobile/src/auth/secureSessionStorage.ts`
- `Pet_Marketplace_Mobile/src/auth/AuthProvider.tsx`
- `Pet_Marketplace_Mobile/app/(tabs)/settings.tsx`
- `Pet_Marketplace_Mobile/docs/PROGRESS.md`
- `docs/PROGRESS.md`

### Validacoes
- Mobile: `pnpm typecheck` - passou.
- Mobile: `pnpm lint` - passou.
- Mobile: `pnpm exec expo config --type public` - passou.
- Mobile `.env`: contem somente `EXPO_PUBLIC_API_BASE_URL`, `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`; arquivo ignorado pelo Git.
- Expo Metro nativo `http://localhost:8081` - HTTP 200.
- Expo Web `http://localhost:8082/login` - HTTP 200.
- Login real: passou e redirecionou para `/home`.
- Logout real: passou e redirecionou para `/login`.
- Sem sessao: acesso direto a `/home` e `/profile` redirecionou para `/login`.
- Persistencia Web: reload em `/profile` manteve usuario autenticado.
- Supabase Auth direto com usuario de teste: HTTP 200, token resolvido sem imprimir token.
- Backend direto `/api/v1/me` com token real: HTTP 200, contrato `roles/status` confirmado sem imprimir dados pessoais.

### Limitacoes e pendencias
- `/api/v1/me` no app Web ainda nao renderiza roles/status por CORS: preflight para `http://localhost:8082` nao retorna `Access-Control-Allow-Origin`.
- `adb` nao esta instalado/disponivel; validacao em Expo Go/emulador Android nao foi executada nesta maquina.
- Persistencia nativa via `expo-secure-store` ainda precisa ser confirmada em Expo Go/emulador.
- Configurar `CORS_ALLOWED_ORIGINS` no Backend/DigitalOcean para desenvolvimento local ou para dominio web real quando existir.

### Proximo passo recomendado
Configurar CORS de desenvolvimento ou validar em ambiente nativo. Em seguida, iniciar Bloco 4: cadastro e perfis, mantendo Backend como autoridade de roles/status.

---

## Checkpoint 021 - CORS Mobile Web preparado localmente; DigitalOcean aguarda acesso e dominio real

- **Data/hora:** 2026-05-21 (America/Sao_Paulo)
- **Tarefa atual:** Corrigir a pendencia de CORS que bloqueia `/api/v1/me` no Mobile Web autenticado.
- **Agentes envolvidos:** C10_Maestro, E_DigitalOceanEnvironment, M_MobilePlaystore, V_Validation

### Resumo
- Backend ja suportava `CORS_ALLOWED_ORIGINS`; o valor remoto esta ausente/vazio na DigitalOcean.
- `Pet_Marketplace_Back/src/main.ts` foi ajustado para filtrar origins vazios na lista separada por virgula.
- `Pet_Marketplace_Back/.env.example` recebeu exemplo de origins para desenvolvimento Mobile Web.
- `Pet_Marketplace_Back/.env` local foi atualizado sem expor valores secretos para aceitar API DigitalOcean e Expo dev origins.
- CORS local foi validado com sucesso para `http://localhost:8082`.
- DigitalOcean ainda nao foi alterado porque falta confirmar acesso/API token, app alvo, componente e dominio publico real do App Platform.
- Mobile `.env` foi restaurado para a API DigitalOcean apos tentativa de revalidacao local.

### Arquivos alterados neste ciclo
- `Pet_Marketplace_Back/src/main.ts`
- `Pet_Marketplace_Back/.env.example`
- `Pet_Marketplace_Back/docs/PROGRESS.md`
- `Pet_Marketplace_Mobile/docs/PROGRESS.md`
- `docs/PROGRESS.md`

### Validacoes
- Backend: `pnpm typecheck` - passou.
- Backend: `pnpm lint` - passou.
- Backend: `pnpm build` - passou.
- Backend: `pnpm test:e2e` - passou.
- Backend local `GET /api/v1/health` - HTTP 200.
- Backend local `OPTIONS /api/v1/me` com `Origin: http://localhost:8082` - HTTP 204 e `Access-Control-Allow-Origin: http://localhost:8082`.
- Backend local `GET /api/v1/health` com `Origin: http://localhost:8082` - HTTP 200 e `Access-Control-Allow-Origin: http://localhost:8082`.
- DigitalOcean `OPTIONS /api/v1/me` - ainda sem `Access-Control-Allow-Origin`.

### Pendencias reais
- Confirmar acesso DigitalOcean (`doctl auth init` ou `DIGITALOCEAN_TOKEN`) sem imprimir token.
- Aplicar no DigitalOcean, servico `Pet_Marketplace_Back`, ambiente `production`:
  - `CORS_ALLOWED_ORIGINS=https://pet-marketplace-back.example.ondigitalocean.app,http://localhost:8082,http://localhost:8081`
- Redeployar se necessario.
- Retestar `OPTIONS /api/v1/me` contra DigitalOcean.
- Retestar Mobile Web `/profile` renderizando `status` e `roles`.

### Proximo passo recomendado
Confirmar app/componente na DigitalOcean, aplicar somente `CORS_ALLOWED_ORIGINS`, validar App Platform e entao fechar o Bloco 3 Mobile Auth.

---

## Checkpoint 022 - Documentacao alinhada para DigitalOcean

- **Data/hora:** 2026-05-21 (America/Sao_Paulo)
- **Tarefa atual:** Remover referencias ao provedor anterior e alinhar a documentacao ao alvo atual DigitalOcean App Platform.
- **Agentes envolvidos:** C10_Maestro, E_DigitalOceanEnvironment, V_Validation

### Resumo
- DigitalOcean App Platform passa a ser o alvo atual para Backend/API.
- Referencias documentais ao provedor anterior, dominio antigo e IDs antigos foram removidas ou sanitizadas.
- Registros historicos que tinham sido migrados mecanicamente para "DigitalOcean" foram corrigidos para nao inventar app id, componente, deployment id, conta ou dominio real.
- O placeholder documental ate confirmacao do dominio real e `https://pet-marketplace-back.example.ondigitalocean.app`.
- Scripts legados de provedor anterior foram retirados; novos scripts devem viver em `Pet_Marketplace_Back/scripts/digitalocean/`.

### Pendencias reais
- Confirmar app id, componente, ambiente e dominio publico reais no DigitalOcean App Platform.
- Atualizar `EXPO_PUBLIC_API_BASE_URL` e `API_BASE_URL` quando o dominio real for confirmado.
- Aplicar `CORS_ALLOWED_ORIGINS` no DigitalOcean com `http://localhost:8082`, `http://localhost:8081` e dominios reais quando existirem.
- Redeployar Backend no DigitalOcean e validar `GET /api/v1/health`.
- Retestar Mobile Web autenticado em `/profile` apos CORS remoto.

### Guardrails
- Nao copiar secrets backend para Mobile.
- Nao publicar `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL`, tokens de smoke, senhas ou JWT secrets em docs.
- Nao iniciar Bloco 4 ate fechar a pendencia real de CORS/deploy DigitalOcean do Bloco 3 Mobile Auth.

---

## Checkpoint 023 - Bloco 3 Mobile Auth fechado com CORS remoto na DigitalOcean

- **Data/hora:** 2026-05-21 (America/Sao_Paulo)
- **Tarefa atual:** Confirmar Backend real na DigitalOcean App Platform, aplicar CORS remoto e revalidar Mobile Web autenticado.
- **Agentes envolvidos:** C10_Maestro, E_DigitalOceanEnvironment, M_MobilePlaystore, V_Validation

### Resumo
- `doctl` instalado e autenticacao confirmada sem imprimir token.
- Contexto DigitalOcean correto: `petmarketplace`.
- App Platform real identificado: `stingray-app` (`b29299e7-2d4b-43f8-b77e-edb52ec405ed`).
- Componente Backend real identificado: service `pet-marketplace-back`.
- Dominio publico real confirmado: `https://stingray-app-vyfrt.ondigitalocean.app`.
- O placeholder `https://pet-marketplace-back.example.ondigitalocean.app` nao deve mais ser usado como fato.
- `CORS_ALLOWED_ORIGINS` foi aplicado no service Backend com `https://stingray-app-vyfrt.ondigitalocean.app,http://localhost:8082,http://localhost:8081`.
- Nenhuma alteracao foi feita em banco, migrations, auth rules, service role, secrets do Mobile ou Bloco 4.

### Auditoria segura de envs no service Backend
- `API_BASE_URL`: presente.
- `API_PORT`: presente.
- `PORT`: ausente.
- `CORS_ALLOWED_ORIGINS`: presente e com valor apos update.
- `SUPABASE_URL`: presente.
- `SUPABASE_ANON_KEY`: presente como `SECRET`.
- `SUPABASE_SERVICE_ROLE_KEY`: presente como `SECRET`.
- `DATABASE_URL`: presente como `SECRET`.
- Valores secretos nao foram impressos.

### Validacoes
- DigitalOcean `GET https://stingray-app-vyfrt.ondigitalocean.app/api/v1/health` - HTTP 200, `status=ok`.
- DigitalOcean `OPTIONS /api/v1/me` com `Origin: http://localhost:8082` - HTTP 204 e `Access-Control-Allow-Origin: http://localhost:8082`.
- Backend local `pnpm typecheck` - passou.
- Backend local `pnpm lint` - passou.
- Backend local `pnpm build` - passou.
- Backend local `pnpm test:e2e` - passou (2 suites, 6 testes).
- Expo Web `http://localhost:8082/login` - HTTP 200, reiniciado com API base apontando para o dominio real.
- Login real com usuario de teste aprovado - passou.
- `/profile` no Mobile Web renderizou dados de `/api/v1/me`: `status=active`, `roles=tutor`, `locale=en-GB`.
- Logout - passou e voltou para `/login`.
- Sem sessao: acesso direto a `/profile` redirecionou para `/login`.
- Console do navegador interno: sem erros.

### Evidencias
- Screenshot local ignorado pelo Git: `Pet_Marketplace_Mobile/.expo/block3-profile-digitalocean-cors.png`.

### Pendencias controladas
- Validar Expo Go/emulador Android quando houver ambiente nativo/adb disponivel.
- Confirmar persistencia nativa via `expo-secure-store` em dispositivo/emulador.

### Proximo passo recomendado
Bloco 3 Mobile Auth esta fechado para Web local contra DigitalOcean. Manter Bloco 4 bloqueado ate aprovacao explicita de inicio.

---

## Checkpoint 024 - Bloco 4A Profile bootstrap pos-auth

- **Data/hora:** 2026-05-22 (America/Sao_Paulo)
- **Tarefa atual:** Iniciar Bloco 4A com edicao minima e segura do proprio perfil autenticado.
- **Agentes envolvidos:** C10_Maestro, B_BackendDomain, M_MobilePlaystore, S_Seguranca, V_Validation

### Resumo
- O Bloco 4A foi limitado a `Profile bootstrap pos-auth`.
- O menor campo seguro ja existente em `public.users` foi `locale`.
- Implementado `PATCH /api/v1/me` aceitando somente `locale`.
- Backend rejeita tentativa de alterar `roles`, `status`, `deleted_at`, `auth_user_id`, auditoria, perfis ou campos fora da allowlist.
- `GET /api/v1/me` segue como fonte de verdade para status, roles, locale e resumos seguros.
- O sync de usuario autenticado foi ajustado para nao sobrescrever `locale` escolhido em logins futuros; em usuarios existentes, sincroniza email sem regravar locale.
- Mobile Profile deixou de ser somente leitura tecnica e agora permite editar o locale.
- UI continua em ingles britanico, com loading, erro, sucesso, refresh e sessao ausente.
- Nenhum escopo de pets, endereco, geolocalizacao, provider onboarding, booking, chat, pagamento, upload ou Bloco 4B+ foi iniciado.

### Arquivos alterados neste ciclo
- `Pet_Marketplace_Back/src/users/users.controller.ts`
- `Pet_Marketplace_Back/src/users/dto/update-me-request.dto.ts`
- `Pet_Marketplace_Back/src/common/supabase/supabase-admin.service.ts`
- `Pet_Marketplace_Back/test/me.e2e-spec.ts`
- `Pet_Marketplace_Mobile/src/api/client.ts`
- `Pet_Marketplace_Mobile/src/api/types.ts`
- `Pet_Marketplace_Mobile/src/i18n/en-GB.ts`
- `Pet_Marketplace_Mobile/app/(tabs)/profile.tsx`
- `docs/PROGRESS.md`
- `Pet_Marketplace_Back/docs/PROGRESS.md`
- `Pet_Marketplace_Mobile/docs/PROGRESS.md`

### Validacoes
- Backend `pnpm typecheck` - passou.
- Backend `pnpm lint` - passou.
- Backend `pnpm build` - passou.
- Backend `pnpm test:e2e` - passou (2 suites, 8 testes).
- Mobile `pnpm typecheck` - passou.
- Mobile `pnpm lint` - passou.
- Mobile `pnpm exec expo config --type public` - passou.
- Backend local `GET /api/v1/health` - HTTP 200.
- Expo Web local `http://localhost:8082/login` - HTTP 200.
- Login real com usuario de teste aprovado - passou.
- `/profile` leu `status=active`, `roles=tutor`, `locale=en-GB`.
- Edicao temporaria `locale=en-US` no Profile - salvou com sucesso.
- Reload de `/profile` confirmou persistencia de `locale=en-US`.
- Conta de teste restaurada para `locale=en-GB` e reload confirmou o valor restaurado.
- Logout - passou e voltou para `/login`.
- Sem sessao: acesso direto a `/profile` redirecionou para `/login`.
- Console do navegador interno: sem erros.

### Guardrails mantidos
- Nenhum segredo foi impresso.
- `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL`, tokens, senhas e JWT secrets nao foram copiados para o Mobile.
- Nenhuma migration, RLS, regra de auth ou banco estrutural foi alterado.
- O backend local usou service role somente server-side.
- O Backend remoto DigitalOcean nao foi redeployado neste ciclo; validacao Web do novo PATCH foi feita contra backend local.

### Pendencias controladas
- Deployar o Bloco 4A no Backend DigitalOcean somente quando houver decisao explicita.
- Revalidar `PATCH /api/v1/me` remoto apos deploy.
- Validar Expo Go/emulador Android e persistencia nativa via `expo-secure-store` quando houver ambiente nativo/adb.

### Proximo passo recomendado
Revisar e aprovar deploy do Bloco 4A no Backend DigitalOcean ou, se preferir continuar local, planejar o Bloco 4B sem tocar pets/provider/endereco ainda.

---

## Checkpoint 025 - Layout do Mobile reconciliado com o brief canonico

- **Data/hora:** 2026-05-21 (America/Sao_Paulo)
- **Tarefa atual:** Corrigir divergencias entre a UI do Mobile e `docs/design.md`.
- **Agentes envolvidos:** Validacao externa (sessao Claude Code), sem agentes .codex.
- **Escopo:** apenas `Pet_Marketplace_Mobile`. Back, Admin, banco e producao nao tocados.

### Motivo
Validacao detectou que o Bloco 3 do Mobile divergia do brief canonico `docs/design.md`
(The Pet Lobby): accent teal em vez do roxo de marca, 3 abas em vez de 5, e componentes
obrigatorios do design system ausentes.

### O que foi feito (Mobile)
- `src/design/tokens.ts`: paleta alinhada a `design.md` secao 4 (`accent = #6F32F0`,
  `accentPressed = #4B16A8`, `accentSoft = #EFE8FF`; neutros/`danger`/`successText`
  ajustados; `space.10 = 40`). Chaves de token mantidas, sem quebra de consumidores.
- Navegacao de 5 abas `Home / Search / Book / Chat / Profile`; `settings` virou rota
  com `href: null` (acessivel via Profile, fora da barra).
- Telas placeholder `search/book/chat` reutilizando `ComingNextScreen`.
- Componentes novos do design system: `Badge`, `Avatar`, `EmptyState`, `ScreenHeader`.
- `src/i18n/en-GB.ts`: strings de abas e placeholders.

### Arquivos criados / alterados
- Criados: `Pet_Marketplace_Mobile/src/components/{Badge,Avatar,EmptyState,ScreenHeader}.tsx`,
  `Pet_Marketplace_Mobile/app/(tabs)/{search,book,chat}.tsx`.
- Alterados: `Pet_Marketplace_Mobile/src/design/tokens.ts`,
  `Pet_Marketplace_Mobile/app/(tabs)/_layout.tsx`,
  `Pet_Marketplace_Mobile/src/i18n/en-GB.ts`,
  `Pet_Marketplace_Mobile/docs/PROGRESS.md`, `docs/PROGRESS.md`.

### Validacoes
- Mobile `pnpm typecheck` - passou.
- Mobile `pnpm lint` - passou.
- Sem validacao de runtime/emulador nesta sessao.

### Pendencias controladas
- Bloco 4+: substituir as telas placeholder de Search/Book/Chat por funcoes reais.
- Adicionar `@expo/vector-icons` e FAB de acao central previstos no brief.
- Risco de merge: trabalho paralelo do codex em `tokens.ts` ou `(tabs)/_layout.tsx` deve
  ser resolvido mantendo a paleta roxa e a estrutura de 5 abas.

### Proximo passo recomendado
Codex prossegue o Bloco 4 sobre os tokens roxos e as 5 abas ja estruturadas.

---

## Checkpoint 026 - Bloco 4A deployado no Backend DigitalOcean

- **Data/hora:** 2026-05-21 23:04 -03:00 (America/Sao_Paulo)
- **Tarefa atual:** Publicar e revalidar remotamente o `PATCH /api/v1/me` minimo.
- **Agentes envolvidos:** E_DigitalOceanEnvironment, B_BackendDomain, V_Validation
- **Escopo:** Backend DigitalOcean e smoke remoto do contrato `/me`; sem pets, endereco, provider onboarding, upload, booking, chat, pagamentos, migrations ou deploy Mobile/Admin.

### Resumo
- Contexto `doctl` correto confirmado: `petmarketplace`.
- App real: `stingray-app` (`b29299e7-2d4b-43f8-b77e-edb52ec405ed`).
- Service real: `pet-marketplace-back`.
- Dominio publico real: `https://stingray-app-vyfrt.ondigitalocean.app`.
- Repo fonte do App Platform: `thepetlobbyapp-coder/Pet_Marketplace_Back`, branch `main`, `deploy_on_push=true`.
- Commit publicado no repo fonte: `d794ad5` (`feat: add safe profile locale update`).
- Deployment ativo apos push: `b750d8e8-f253-41c1-a39a-609e1da931ca`, commit `d794ad5221b6abb82b4808695856ee72f62d795c`.

### Validacoes
- Arvore limpa de publicacao `.publish/Pet_Marketplace_Back_DO_fix`: `pnpm typecheck`, `pnpm lint`, `pnpm build`, `pnpm test:e2e` - passaram (2 suites, 8 testes).
- DigitalOcean `GET /api/v1/health` - HTTP 200.
- DigitalOcean `OPTIONS /api/v1/me` com `Origin: http://localhost:8082` e metodo `PATCH` - HTTP 204, `Access-Control-Allow-Origin: http://localhost:8082`.
- Smoke autenticado remoto: `GET /api/v1/me` retornou `status=active`, `roles=tutor`, `locale=en-GB`.
- Smoke autenticado remoto: `PATCH /api/v1/me` temporario para `locale=en-US` - HTTP 200.
- Reload logico via `GET /api/v1/me` confirmou persistencia de `locale=en-US`.
- Restauracao remota para `locale=en-GB` - HTTP 200 e GET final confirmou `locale=en-GB`.
- Teste negativo remoto com `roles/status` no payload - HTTP 400 com `VALIDATION_ERROR`.
- Logs do deploy mostram `Mapped {/api/v1/me, PATCH} route` e Supabase clients inicializados.

### Guardrails mantidos
- Nenhum segredo, token ou senha foi impresso.
- Nenhum app DigitalOcean fora do contexto `petmarketplace` foi alterado.
- Nenhuma variavel de ambiente, plano, migration, RLS ou schema foi alterado.
- Validacao Mobile Web completa no navegador nao foi repetida neste ciclo; a revalidacao remota foi API-level contra o dominio real.

### Proximo passo recomendado
Fechar Bloco 4A como publicado e planejar Bloco 4B com recorte explicito antes de tocar tutor/provider, pets, endereco ou upload.

---

## Checkpoint 027 - Mobile layout fidelity pass parcial

- **Data/hora:** 2026-05-21 (America/Sao_Paulo)
- **Tarefa atual:** Corrigir o layout do Mobile conforme regras atuais antes de avancar features.
- **Escopo:** `Pet_Marketplace_Mobile` e docs de progresso. Backend/Admin, secrets, deploy, banco, pets, provider, booking e chat real nao foram tocados.

### O que foi feito
- Tabs corrigidas para remover o placeholder quebrado `v v`/setas visuais do Expo Web.
- Adicionada dependencia Expo-compativel `@expo/vector-icons`.
- As 5 tabs agora usam icones reais: Home, Search, Book, Chat e Profile.
- `Card`, `Button`, `TextField` e aviso de Login ficaram com `borderRadius <= 8`.
- Copy in-app de debug/roadmap foi suavizada: removidas referencias visiveis a blocos futuros, bootstrap tecnico e status de backend.
- Paleta roxa do design foi preservada.

### Validacoes
- Mobile `pnpm typecheck` - passou.
- Mobile `pnpm lint` - passou.
- Mobile `pnpm exec expo config --type public` - passou, expondo somente `EXPO_PUBLIC_*`.
- Expo Web autenticado abriu em `http://localhost:8082/home`; Home, Search, Book, Chat e Profile revisados no navegador interno em viewport desktop.
- Console do navegador interno: sem erros nas telas revisadas.
- Screenshots capturados:
  - `Pet_Marketplace_Mobile/.expo/layout-fidelity-home-2026-05-21.png`
  - `Pet_Marketplace_Mobile/.expo/layout-fidelity-profile-2026-05-21.png`
- Busca textual em `app/` e `src/` confirmou ausencia de radius antigo, referencias internas de bloco/bootstrap/status tecnico e placeholder quebrado nas telas/copy alteradas.

### Pendencia de QA visual
- Viewport desktop autenticado passou para Home/Profile/Search/Book/Chat.
- A simulacao mobile no navegador interno com viewport `390x844` renderizou tela preta/DOM vazio, sem erros de console. Ainda precisa ser repetida em browser/mobile confiavel antes de chamar o layout de 100% fiel em mobile.

### Proximo passo recomendado
Resolver a pendencia de QA mobile/responsivo e, so depois, iniciar novo bloco funcional.

---

## Checkpoint 028 - QA responsivo do Mobile fechado

- **Data/hora:** 2026-05-22 09:15 -03:00 (America/Sao_Paulo)
- **Tarefa atual:** Fechar a pendencia de validacao mobile `390x844` do `Pet_Marketplace_Mobile`.
- **Escopo:** `Pet_Marketplace_Mobile` e docs de progresso. Backend/Admin, secrets, deploy, pets, provider, booking, chat real, endereco, pagamentos e upload nao foram tocados.

### Resultado
- A tela preta/DOM vazio vista anteriormente no navegador interno **nao reproduziu**.
- Viewport mobile `390x844`: Login, Home, Profile, Search, Book e Chat renderizaram com DOM preenchido.
- Viewport desktop `1280x720`: Login, Home, Profile, Search, Book e Chat renderizaram com DOM preenchido.
- Nao houve overflow horizontal ou elementos fora da largura nos viewports revisados.
- Console do navegador interno: sem erros.
- Chrome headless via DevTools Protocol confirmou Login em `390x844` com `innerWidth=390`, `scrollWidth=390` e controles dentro da largura.
- Conclusao: layout responsivo Mobile aprovado; a falha anterior fica registrada como instabilidade/limitacao da ferramenta/sessao anterior, nao como bug responsivo reproduzivel.

### Evidencias
- `Pet_Marketplace_Mobile/.expo/qa-home-mobile-2026-05-22.png`
- `Pet_Marketplace_Mobile/.expo/qa-profile-mobile-2026-05-22.png`
- `Pet_Marketplace_Mobile/.expo/qa-login-mobile-chrome-cdp-2026-05-22.png`

### Ressalva nao-layout
- Home/Profile no ambiente atual exibiram estado de erro de servico/perfil, mas sem blank, sem overflow e sem erro de console.
- O endpoint publico de health configurado localmente respondeu `status=ok` em chamada direta; a diferenca fica registrada como pendencia de ambiente/API/sessao, fora do escopo deste QA responsivo.

### Validacoes
- Mobile `pnpm typecheck` - passou.
- Mobile `pnpm lint` - passou.
- Mobile `pnpm exec expo config --type public` - passou.
- Busca textual em `app/` e `src/`: sem `next block`, `bootstrap block`, `Backend status`, `v v` ou placeholder de seta quebrado.
- Radius visivel de Login/Card/Button/TextField segue `<= 8`; `Avatar`/`Badge` existem mas nao aparecem nas telas revisadas.

### Proximo passo recomendado
Mobile pode avancar apos decisao de escopo da proxima etapa. Se a proxima etapa depender de dados reais em Home/Profile, alinhar antes a pendencia de ambiente/API/sessao.

---

## Checkpoint 029 - Ambiente/API/sessao do Mobile alinhados

- **Data/hora:** 2026-05-22 10:54 -03:00 (America/Sao_Paulo)
- **Tarefa atual:** Fechar a pendencia de Home/Profile em estado de erro no Expo Web local.
- **Escopo:** `Pet_Marketplace_Mobile` e docs de progresso. Backend/Admin, deploy, banco, pets, provider, booking, chat real, endereco, pagamentos e upload nao foram tocados.

### Diagnostico
- `.env` local do Mobile contem somente `EXPO_PUBLIC_API_BASE_URL`, `EXPO_PUBLIC_SUPABASE_URL` e `EXPO_PUBLIC_SUPABASE_ANON_KEY`.
- `EXPO_PUBLIC_API_BASE_URL` estava apontando para host legado Railway.
- Chamada direta `GET /api/v1/health` no Railway respondia HTTP 200, mas preflight de `/api/v1/me` para `Origin: http://localhost:8082` nao retornava `Access-Control-Allow-Origin`.
- Backend atual confirmado pelos checkpoints locais: DigitalOcean `stingray-app-vyfrt.ondigitalocean.app`.
- No DigitalOcean, `GET /api/v1/health` respondeu HTTP 200 e preflights `GET/PATCH /api/v1/me` responderam HTTP 204 com CORS correto para `http://localhost:8082`.

### Correcao aplicada
- Atualizado somente o valor publico local `EXPO_PUBLIC_API_BASE_URL` no `.env` ignorado pelo Git para o Backend DigitalOcean atual.
- Nenhum segredo foi impresso ou alterado.
- Nenhuma implementacao de Backend/Admin foi feita.

### Validacao Mobile Web
- Expo Web reiniciado em `http://localhost:8082`.
- Login renderizou sem erro.
- Home autenticada exibiu `Connected: ok`.
- Profile autenticado carregou `/api/v1/me` com `status=active`, `roles=tutor` e `locale=en-GB`.
- Console do navegador interno: sem erros.
- Revalidacao visual feita em viewport `390x844`.

### Validacoes
- Mobile `pnpm typecheck` - passou.
- Mobile `pnpm lint` - passou.
- Mobile `pnpm exec expo config --type public` - passou.

### Resultado
- Pendencia de ambiente/API/sessao fechada para Expo Web local autenticado.
- Causa raiz: API base publica local desatualizada, apontando para host legado sem CORS adequado para `/api/v1/me`.

### Proximo passo recomendado
Mobile pode seguir para o proximo recorte funcional pequeno e explicito. Manter bloqueado qualquer escopo amplo de pets/provider/endereco/booking/chat real ate decisao separada.

---

## Checkpoint 030 - Bloco 4B Mobile Profile minimo

- **Data/hora:** 2026-05-22 11:05 -03:00 (America/Sao_Paulo)
- **Tarefa atual:** Incremento pequeno do Profile Mobile usando somente o contrato atual de `/api/v1/me`.
- **Escopo:** `Pet_Marketplace_Mobile` e docs de progresso. Backend/Admin, deploy, banco, pets, provider onboarding, booking, chat real, endereco, pagamentos e upload nao foram tocados.

### Resumo
- Profile foi reorganizado em secoes `Account`, `Profile details` e `Preferences`.
- A tela agora mostra dados ja existentes no contrato Mobile: email, status, roles, datas de criacao/atualizacao, resumos tutor/provider quando existirem e locale.
- A unica escrita continua sendo `PATCH /api/v1/me` para `locale`.
- Locale ganhou feedback de rascunho local: unsaved changes e botao `Cancel`.

### Arquivos alterados
- `Pet_Marketplace_Mobile/app/(tabs)/profile.tsx`
- `Pet_Marketplace_Mobile/src/i18n/en-GB.ts`
- `Pet_Marketplace_Mobile/docs/PROGRESS.md`
- `docs/PROGRESS.md`

### Validacoes
- Mobile `pnpm typecheck` - passou.
- Mobile `pnpm lint` - passou.
- Mobile `pnpm exec expo config --type public` - passou.
- Expo Web `390x844`: Login, Home e Profile sem blank, sem overflow horizontal e sem erros de console.
- Expo Web `1280x720`: Login, Home e Profile sem blank, sem overflow horizontal e sem erros de console.
- Home autenticada: `Connected: ok`.
- Profile autenticado: secoes `Account`, `Profile details`, `Preferences`; `status=active`, `roles=tutor`, `locale=en-GB`.
- Screenshot de Profile nao foi preservado porque continha email da conta de teste.

### Guardrails
- Nenhum contrato Backend novo.
- Nenhuma dependencia nova.
- Nenhum segredo impresso ou alterado.
- Nenhum escopo de pets/provider/endereco/booking/chat real.
- Paleta roxa mantida; `Card`/`Button`/`TextField` seguem com radius visivel `<= 8`.

### Proximo passo recomendado
Escolher o proximo recorte explicitamente. Para evoluir Profile alem disso, sera necessario contrato Backend novo; para Search/Book/Chat, abrir planejamento separado e pequeno antes de qualquer implementacao real.

---

## Checkpoint 031 - Decisao Profile 4C Tutor profile minimo

- **Data/hora:** 2026-05-22 11:14 -03:00 (America/Sao_Paulo)
- **Tarefa atual:** Diagnosticar se o Mobile ja pode implementar Tutor profile minimo com contrato real.
- **Escopo:** leitura de Mobile, leitura cirurgica de Backend, diagnostico HTTP sem token e docs de progresso. Nenhum Backend/Admin/deploy/secrets/migration/UI nova foi alterado.

### Decisao
- Resultado: **nao implementar UI Mobile agora**.
- Motivo: o Backend ainda nao expoe contrato publico para criar ou editar `tutor_profiles`.
- O contrato atual permite apenas:
  - `GET /api/v1/me` com resumo seguro de `profiles.tutor` quando ja existir.
  - `PATCH /api/v1/me` somente para `locale`.
  - `GET/POST/PATCH/DELETE /api/v1/pets`, mas o happy-path de escrita depende de `tutor_profile` preexistente.

### Evidencias
- Mobile `src/api/client.ts` aceita apenas paths `"/health" | "/me"`.
- Mobile `src/api/types.ts` modela `profiles.tutor` somente como resumo `{ id, displayName }`.
- Backend `UsersController` expoe somente `GET /me` e `PATCH /me`.
- Backend `SupabaseAdminService` possui `loadTutorProfile(userId)`, mas nao possui metodo publico de create/update de `tutor_profiles`.
- Diagnostico remoto sem token:
  - `GET /api/v1/me` -> HTTP 401 `UNAUTHENTICATED` (rota existe).
  - `GET /api/v1/pets` -> HTTP 401 `UNAUTHENTICATED` (rota existe).
  - `GET /api/v1/tutor-profile` -> HTTP 404 `NOT_FOUND`.
  - `GET /api/v1/tutor-profiles` -> HTTP 404 `NOT_FOUND`.
  - `GET /api/v1/profiles/tutor` -> HTTP 404 `NOT_FOUND`.
  - `GET /api/v1/me/tutor-profile` -> HTTP 404 `NOT_FOUND`.

### Plano cirurgico Backend 4C
- Endpoints minimos propostos:
  - `POST /api/v1/me/tutor-profile`: cria o tutor profile do usuario autenticado quando ainda nao existir.
  - `PATCH /api/v1/me/tutor-profile`: atualiza o tutor profile existente do usuario autenticado.
  - Leitura continua via `GET /api/v1/me` para evitar endpoint extra antes de necessidade real.
- Payload permitido:
  - `displayName: string`.
- Campos proibidos:
  - `id`, `userId`, `user_id`, `defaultAddressId`, `default_address_id`, `address`, `location`, `coordinates`, `phone`, `email`, `roles`, `status`, `provider`, `pets`, `createdAt`, `updatedAt`, `deletedAt`, `metadata` e qualquer campo fora da allowlist.
- Validacoes:
  - Usuario autenticado, ativo e nao deletado.
  - Body deve ser objeto JSON.
  - Allowlist estrita com apenas `displayName`.
  - `displayName` obrigatorio no `POST`; opcional no `PATCH`, mas body vazio deve ser rejeitado.
  - `displayName` com `trim`, nao vazio, limite sugerido de 80 caracteres.
  - `POST` retorna `409` se o tutor profile ja existir.
  - `PATCH` retorna `404` se o tutor profile nao existir.
  - Insercao/atualizacao sempre escopada por `user.id`; Mobile nunca envia `userId`.
  - Resposta deve expor somente `{ id, displayName, createdAt?, updatedAt? }` ou o contrato atualizado de `/me`, sem campos sensiveis.
- Riscos:
  - Desbloqueia Pets API em producao para usuarios que criarem tutor profile; validar fluxo com cuidado depois.
  - `tutor_profiles.user_id` ja e unique, entao tratar conflito com resposta segura e idempotencia clara.
  - Evitar misturar endereco/default address neste bloco para nao abrir geolocalizacao.
  - Evitar provider onboarding no mesmo contrato.
- Testes necessarios:
  - E2E `POST /api/v1/me/tutor-profile` cria perfil do proprio usuario e retorna contrato seguro.
  - E2E `PATCH /api/v1/me/tutor-profile` atualiza apenas `displayName`.
  - Rejeitar campos fora da allowlist.
  - Rejeitar display name vazio, tipo invalido e limite acima do permitido.
  - `POST` duplicado retorna conflito seguro.
  - `PATCH` sem perfil retorna 404 seguro.
  - `/me` passa a refletir `profiles.tutor` apos create/update.
  - Garantir ausencia de `user_id`, endereco, telefone, roles/status editaveis, tokens e service role na resposta.

### Checkpoint
- Mobile deve permanecer parado para Tutor profile 4C ate o contrato Backend acima ser aprovado e implementado.
- Nenhuma validacao de `pnpm typecheck/lint/expo config` foi rodada neste checkpoint porque nao houve alteracao de codigo.

---

## Checkpoint 032 - Backend 4C Tutor profile minimo

- **Data/hora:** 2026-05-22 11:22 -03:00 (America/Sao_Paulo)
- **Tarefa atual:** Implementar contrato minimo de bootstrap/edicao de `tutor_profile` para usuario autenticado.
- **Escopo:** `Pet_Marketplace_Back` e docs de progresso. Mobile/Admin/deploy/secrets/migrations/RLS/schema/pets Mobile/provider/endereco/booking/chat/upload/pagamentos nao foram tocados.

### Resumo
- Implementado `POST /api/v1/me/tutor-profile`.
- Implementado `PATCH /api/v1/me/tutor-profile`.
- Payload aceito: somente `displayName`.
- Resposta segura: `id`, `displayName`, `createdAt`, `updatedAt`.
- `GET /api/v1/me` continua sendo a fonte de leitura e reflete `profiles.tutor` apos create/update.
- Escritas sao sempre escopadas por `CurrentUser.id`; cliente nao envia `user_id`.
- Nenhuma migration/schema/RLS foi necessaria porque `tutor_profiles.user_id unique` e `display_name` ja existem.

### Guardrails de contrato
- Campos fora da allowlist sao rejeitados com `VALIDATION_ERROR`.
- `POST` exige `displayName` e retorna `CONFLICT` se o usuario ja tem tutor profile.
- `PATCH` exige tutor profile existente e retorna `NOT_FOUND` quando ausente.
- `displayName` sofre `trim`, nao pode ser vazio e tem limite de 80 caracteres.
- Respostas/testes garantem ausencia de `user_id`, endereco, telefone, tokens, service role, roles/status editaveis e metadata.

### Arquivos alterados
- `Pet_Marketplace_Back/src/users/users.controller.ts`
- `Pet_Marketplace_Back/src/users/dto/tutor-profile.dto.ts`
- `Pet_Marketplace_Back/src/common/supabase/supabase-admin.service.ts`
- `Pet_Marketplace_Back/test/me.e2e-spec.ts`
- `Pet_Marketplace_Back/docs/PROGRESS.md`
- `docs/PROGRESS.md`

### Validacoes
- Backend `pnpm typecheck` - passou.
- Backend `pnpm lint` - passou.
- Backend `pnpm build` - passou.
- Backend `pnpm test:e2e` - passou (3 suites, 32 testes).
- Observacao: todos os comandos emitiram apenas o aviso de engine local `node v24.12.0` versus `node 22.x` declarado no Backend.

### Proximo passo recomendado
Revisar o diff do Backend 4C e decidir se deve ser publicado na DigitalOcean. Apos deploy, validar remotamente `POST/PATCH /api/v1/me/tutor-profile`, confirmar `/me` com `profiles.tutor` e entao completar o happy-path remoto da Pets API.

---

## Checkpoint 033 - Backend 4C publicado na DigitalOcean

- **Data/hora:** 2026-05-22 11:38 -03:00 (America/Sao_Paulo)
- **Tarefa atual:** Publicar e validar remotamente o contrato minimo de `me/tutor-profile`.
- **Escopo:** arvore de publicacao do Backend, GitHub fonte do Backend, DigitalOcean App Platform e smokes HTTP remotos. Mobile/Admin/secrets/envs/migrations/RLS/schema/provider/endereco/booking/chat/upload/pagamentos nao foram tocados.

### Publicacao
- Arvore de publicacao usada: `.publish/Pet_Marketplace_Back_DO_fix`.
- Repo fonte confirmado: `thepetlobbyapp-coder/Pet_Marketplace_Back`, branch `main`.
- App DigitalOcean confirmado: `stingray-app` (`b29299e7-2d4b-43f8-b77e-edb52ec405ed`).
- Service: `pet-marketplace-back`.
- Dominio: `https://stingray-app-vyfrt.ondigitalocean.app`.
- Commit publicado: `76d6f75` (`feat: add tutor profile bootstrap API`).
- Deploy ativo: `1e0c8309-7f5c-4925-9308-48f97ce9c5a9`, commit `76d6f75`.

### Validacoes pre-push na arvore de publicacao
- `pnpm typecheck` - passou.
- `pnpm lint` - passou.
- `pnpm build` - passou.
- `pnpm test:e2e` - passou (3 suites, 32 testes).
- Observacao: os comandos emitiram apenas o aviso de engine local `node v24.12.0` versus `node 22.x` declarado no Backend.

### Validacoes remotas
- `GET /api/v1/health` - HTTP 200, `status=ok`.
- `OPTIONS /api/v1/me/tutor-profile` com `Origin: http://localhost:8082` e metodo `POST` - HTTP 204, `Access-Control-Allow-Origin: http://localhost:8082`.
- `OPTIONS /api/v1/me/tutor-profile` com `Origin: http://localhost:8082` e metodo `PATCH` - HTTP 204, `Access-Control-Allow-Origin: http://localhost:8082`.
- Token salvo em `.env` estava expirado (`GET /me` retornou 401); o token foi renovado em memoria com o usuario de teste aprovado, sem imprimir nem salvar o JWT.
- `GET /api/v1/me` autenticado antes do create - HTTP 200, usuario ativo sem `profiles.tutor`.
- `POST /api/v1/me/tutor-profile` - HTTP 201, criou tutor profile para o usuario de teste.
- `GET /api/v1/me` apos create - HTTP 200, `profiles.tutor` presente.
- `PATCH /api/v1/me/tutor-profile` temporario - HTTP 200.
- `GET /api/v1/me` apos PATCH - HTTP 200, displayName refletiu a alteracao temporaria.
- Restauracao do displayName de teste criado - HTTP 200.
- Payload proibido em `PATCH /api/v1/me/tutor-profile` com `userId`, `defaultAddressId` e `metadata` - HTTP 400 `VALIDATION_ERROR`.

### Guardrails mantidos
- Nenhum token, senha, service role, `DATABASE_URL` ou JWT foi impresso.
- Nenhum Mobile/Admin foi alterado.
- Nenhuma migration, RLS, schema, env privada ou plano de infra foi alterado.
- O smoke autenticado criou apenas o `tutor_profile` necessario do usuario de teste aprovado, usando o contrato publico recem-publicado.

### Proximo passo recomendado
Com o Backend 4C remoto ativo, validar o happy-path remoto da Pets API (`POST/PATCH/DELETE /api/v1/pets`) com o mesmo usuario de teste que agora possui `tutor_profile`, mantendo Mobile ainda parado ate decisao separada.

---

## Checkpoint 034 - Pets API happy-path remoto validado

- **Data/hora:** 2026-05-22 11:43 -03:00 (America/Sao_Paulo)
- **Tarefa atual:** Validar remotamente a Pets API apos o usuario de teste receber `tutor_profile` pelo Backend 4C.
- **Escopo:** smokes HTTP contra Backend DigitalOcean e docs de progresso. Nenhum codigo, deploy, Mobile, Admin, secret/env privada, migration, RLS ou schema foi alterado.

### Baseline remoto
- `GET /api/v1/health` - HTTP 200, `status=ok`.
- Token de teste renovado somente em memoria via Supabase Auth; nenhum JWT foi impresso ou salvo.
- `GET /api/v1/me` autenticado - HTTP 200.
- `/me` confirmou `status=active`, role `tutor` e `profiles.tutor` presente.

### Happy-path Pets API
- `GET /api/v1/pets` inicial - HTTP 200, contagem `0`.
- `POST /api/v1/pets` com pet temporario controlado - HTTP 201.
- `GET /api/v1/pets` apos create - HTTP 200, contagem `1`, pet criado presente.
- `PATCH /api/v1/pets/:id` alterando `name` - HTTP 200.
- `GET /api/v1/pets` apos patch - HTTP 200, alteracao refletida.
- `DELETE /api/v1/pets/:id` - HTTP 204.
- `GET /api/v1/pets` final - HTTP 200, contagem `0`, pet temporario nao aparece.

### Negativos remotos minimos
- `PATCH /api/v1/pets/:id` com campo proibido `deletedAt` - HTTP 400 `VALIDATION_ERROR`, `rejectedFields=["deletedAt"]`.
- `POST /api/v1/pets` com campo proibido `tutorProfileId` - HTTP 400 `VALIDATION_ERROR`, `rejectedFields=["tutorProfileId"]`.
- `GET /api/v1/pets` sem token - HTTP 401 `UNAUTHENTICATED`.

### Guardrails
- Nenhum token, senha, service role, `DATABASE_URL` ou JWT foi impresso.
- IDs foram tratados apenas de forma mascarada no smoke.
- Nenhum pet temporario ficou ativo no banco; o GET final retornou contagem `0`.
- Nenhum Mobile/Admin/codigo/deploy/schema foi tocado.

### Proximo passo recomendado
Planejar o menor recorte Mobile que consome contratos reais agora disponiveis (`/me/tutor-profile` e/ou `/pets`), sem criar UI falsa e sem abrir provider/endereco/booking/chat/upload/pagamentos.

---

## Checkpoint 035 - Mobile Profile 4C Tutor profile minimo

- **Data/hora:** 2026-05-22 11:55 -03:00 (America/Sao_Paulo)
- **Tarefa atual:** Consumir no Mobile o contrato remoto ja publicado de `/api/v1/me/tutor-profile`.
- **Escopo:** `Pet_Marketplace_Mobile` e docs de progresso. Backend/Admin/deploy/secrets/env privada/migrations/RLS/schema/pets Mobile/provider/endereco/booking/chat/upload/pagamentos nao foram tocados.

### Implementacao
- Mobile agora possui tipos `TutorProfileResponse` e `UpsertTutorProfileRequest`.
- Client Mobile agora possui `createTutorProfile` (`POST /me/tutor-profile`) e `updateTutorProfile` (`PATCH /me/tutor-profile`).
- Profile agora permite editar/criar `profiles.tutor.displayName` real, separado do fluxo de `locale`.
- O campo aplica trim, obrigatoriedade, limite de 80 caracteres, bloqueio sem mudanca e bloqueio invalido.
- Apos salvar Tutor profile, o Mobile invalida/refaz `/me` para refletir `profiles.tutor.displayName`.

### Arquivos alterados
- `Pet_Marketplace_Mobile/src/api/types.ts`
- `Pet_Marketplace_Mobile/src/api/client.ts`
- `Pet_Marketplace_Mobile/app/(tabs)/profile.tsx`
- `Pet_Marketplace_Mobile/src/i18n/en-GB.ts`
- `Pet_Marketplace_Mobile/docs/PROGRESS.md`
- `docs/PROGRESS.md`

### Validacoes
- Mobile `pnpm typecheck` - passou.
- Mobile `pnpm lint` - passou.
- Mobile `pnpm exec expo config --type public` - passou e exportou somente `EXPO_PUBLIC_*`.
- Expo Web local abriu, mas nao havia sessao autenticada disponivel no navegador interno nem no Chrome do usuario; `/profile` redirecionou para `/login`.
- Checagem responsiva parcial sem sessao:
  - `390x844`: sem overflow horizontal e sem eventos de erro no estado `/login`.
  - `1280x720`: sem overflow horizontal e sem eventos de erro no estado `/login`.

### Limitacao registrada
- O smoke autenticado real do Profile 4C nao foi concluido nesta sessao por ausencia de sessao local disponivel.
- Nao foi validado visualmente nesta sessao: Home autenticada `Connected: ok`, Profile autenticado com `/me`, save real de `displayName`, refetch/reload autenticado e restauracao do valor original/teste.

### Guardrails
- Nenhum token, JWT, senha, email, service role, `DATABASE_URL` ou segredo foi impresso.
- Nenhum Backend/Admin/deploy/schema/RLS/env privada foi alterado.
- Pets Mobile, provider onboarding, endereco/geolocalizacao, booking, chat real, pagamentos e upload continuam fora do escopo.

### Proximo passo recomendado
Executar o QA autenticado com uma sessao de teste aprovada no Expo Web local: confirmar `/me`, salvar temporariamente `displayName`, confirmar refetch/reload, restaurar valor aprovado e revalidar `locale`.

---

## Checkpoint 036 - QA autenticado Mobile Profile 4C

- **Data/hora:** 2026-05-22 12:11 -03:00 (America/Sao_Paulo)
- **Tarefa atual:** Fechar a validacao autenticada real do recorte Mobile Profile 4C.
- **Escopo:** `Pet_Marketplace_Mobile`, Expo Web local, login de teste aprovado e docs de progresso. Backend/Admin/deploy/secrets/env privada/migrations/RLS/schema/pets Mobile/provider/endereco/booking/chat/upload/pagamentos nao foram tocados.

### Resultado funcional
- Login real no Supabase passou com a segunda senha candidata fornecida pelo usuario; a primeira senha candidata nao autenticou.
- QA aprovado foi executado em `http://localhost:8082` para manter a origem CORS correta com o Backend remoto.
- Home autenticada exibiu `Connected: ok`.
- Profile autenticado carregou `/me`.
- `/me` refletiu:
  - `status=active`
  - `roles` inclui `tutor` (conta tambem possui role administrativa)
  - `locale=en-GB`
  - `profiles.tutor.displayName=Tutor Teste QA`
- Tutor profile:
  - Criacao via `POST /api/v1/me/tutor-profile` passou quando estava ausente.
  - Update temporario via `PATCH /api/v1/me/tutor-profile` passou.
  - Restauracao para `Tutor Teste QA` passou.
  - Reload de Profile confirmou persistencia e ausencia do valor temporario.
- Locale:
  - Alteracao temporaria para `en-US` passou.
  - Restauracao para `en-GB` passou.
  - Reload de Profile confirmou persistencia.

### Validacao visual
- `390x844`: Home/Profile autenticados sem overflow horizontal e sem eventos de erro.
- `1280x720`: Home/Profile autenticados sem overflow horizontal e sem eventos de erro.

### Validacoes estaticas
- Mobile `pnpm typecheck` - passou.
- Mobile `pnpm lint` - passou.
- Mobile `pnpm exec expo config --type public` - passou e exportou somente `EXPO_PUBLIC_*`.

### Guardrails
- Nenhum token, JWT, senha, header Authorization, service role, `DATABASE_URL`, secret ou email completo foi registrado nos docs.
- Nenhum Backend/Admin/deploy/schema/RLS/env privada foi alterado.
- Nenhum Pets Mobile/provider/endereco/booking/chat/pagamentos/upload foi implementado.

### Proximo passo recomendado
Com Mobile Profile 4C validado, escolher o proximo recorte pequeno. A opcao natural e planejar Mobile Pets minimo em bloco separado, consumindo a Pets API ja validada, sem provider onboarding, endereco, booking, chat, pagamentos ou upload.

---

## Checkpoint 037 - Mobile Pets 4D minimo

- **Data/hora:** 2026-05-22 12:34 -03:00 (America/Sao_Paulo)
- **Tarefa atual:** Implementar e validar o menor recorte Mobile real de Pets do tutor.
- **Escopo:** `Pet_Marketplace_Mobile` e docs de progresso. Backend/Admin/deploy/secrets/env privada/migrations/RLS/schema/provider/endereco/booking/chat/upload/pagamentos nao foram tocados.

### Resumo
- Mobile passou a consumir a Pets API remota real:
  - `GET /api/v1/pets`
  - `POST /api/v1/pets`
  - `PATCH /api/v1/pets/:id`
  - `DELETE /api/v1/pets/:id`
- Profile ganhou secao `Pets` com lista real, empty state, criacao, edicao apenas de nome e delete com confirmacao.
- Como o Backend exige `species` no create, a criacao inclui selecao simples `Dog/Cat/Other`; nao foram adicionados raca, foto, nascimento, endereco ou qualquer outro campo.
- O limite client-side de nome ficou em 120 caracteres, alinhado ao contrato Backend.
- Saves de Pets ficaram separados de `locale` e de `Tutor display name`.

### Arquivos alterados
- `Pet_Marketplace_Mobile/src/api/types.ts`
- `Pet_Marketplace_Mobile/src/api/client.ts`
- `Pet_Marketplace_Mobile/app/(tabs)/profile.tsx`
- `Pet_Marketplace_Mobile/src/i18n/en-GB.ts`
- `Pet_Marketplace_Mobile/docs/PROGRESS.md`
- `docs/PROGRESS.md`

### Validacoes
- Mobile `pnpm typecheck` - passou.
- Mobile `pnpm lint` - passou.
- Mobile `pnpm exec expo config --type public` - passou.
- Expo Web autenticado em `http://localhost:8082`:
  - Home `Connected: ok`.
  - Profile carregou `/me`.
  - Locale visivel e salvavel, com alteracao temporaria para `en-US` e restauracao para `en-GB`.
  - Tutor displayName continuou visivel.
  - Pets list carregou.
  - Criacao de pet temporario via UI passou.
  - Edicao de nome do pet temporario via UI passou.
  - Delete do pet temporario foi concluido via contrato publico autenticado apos a automacao nao conseguir aceitar o dialogo nativo de confirmacao do Web.
  - GET final de pets confirmou que nenhum pet temporario permaneceu ativo.
- Viewports:
  - `390x844`: sem overflow horizontal e sem erros de console em Home/Profile autenticados.
  - `1280x720`: sem overflow horizontal e sem erros de console em Home/Profile autenticados.

### Guardrails
- Nenhum token, JWT, senha, header Authorization, service role, `DATABASE_URL`, secret ou email completo foi registrado.
- Nenhum Backend/Admin/deploy/schema/RLS/env privada foi alterado.
- Nenhum provider onboarding, endereco/geolocalizacao, booking, chat real, pagamentos ou upload foi implementado.

### Resultado
Mobile Pets 4D minimo concluido contra o Backend remoto DigitalOcean, sem deixar pet temporario ativo e sem regressao observada no Profile 4C.

---

## Checkpoint 038 - Mobile Pets 4D hardening de delete inline

- **Data/hora:** 2026-05-22 12:57 -03:00 (America/Sao_Paulo)
- **Tarefa atual:** Fechar a ressalva de QA do delete de Pets no Expo Web com confirmacao inline controlada no app.
- **Escopo:** `Pet_Marketplace_Mobile` e docs de progresso. Backend/Admin/deploy/secrets/env privada/migrations/RLS/schema/provider/endereco/booking/chat/upload/pagamentos nao foram tocados.

### Resumo
- O delete de pets no Profile deixou de usar confirmacao nativa do browser.
- O primeiro clique em `Delete` agora abre uma confirmacao inline no proprio item do pet.
- O delete real so e chamado depois do segundo clique confirmado.
- `Cancel` fecha a confirmacao e preserva o pet.
- O estado de confirmacao e independente dos fluxos de criar pet, editar nome, salvar locale e salvar Tutor displayName.

### Arquivos alterados
- `Pet_Marketplace_Mobile/app/(tabs)/profile.tsx`
- `Pet_Marketplace_Mobile/src/i18n/en-GB.ts`
- `Pet_Marketplace_Mobile/docs/PROGRESS.md`
- `docs/PROGRESS.md`

### Validacoes
- Mobile `pnpm typecheck` - passou.
- Mobile `pnpm lint` - passou.
- Mobile `pnpm exec expo config --type public` - passou.
- Expo Web autenticado em `http://localhost:8082`:
  - Home `Connected: ok`.
  - Profile carregou `/me`.
  - Pets list carregou.
  - Criacao de pet temporario via UI passou.
  - Edicao de nome do pet temporario via UI passou.
  - Primeiro clique em `Delete` exibiu `Delete this pet?` inline e nao removeu o pet.
  - `Cancel` fechou a confirmacao e manteve o pet.
  - Segundo fluxo de delete com confirmacao inline removeu o pet.
  - Lista final voltou para empty state, sem pet temporario ativo.
- Viewports:
  - `390x844`: sem overflow horizontal e sem erros de console em Home/Profile autenticados.
  - `1280x720`: sem overflow horizontal e sem erros de console em Home/Profile autenticados.

### Guardrails
- Nenhum token, JWT, senha, header Authorization, service role, `DATABASE_URL`, secret ou email completo foi registrado.
- Nenhum Backend/Admin/deploy/schema/RLS/env privada foi alterado.
- Nenhum provider onboarding, endereco/geolocalizacao, booking, chat real, pagamentos ou upload foi implementado.
- Nenhum pet temporario ficou ativo ao final.

### Resultado
Pets 4D ficou mais seguro e QAavel no Web: sem dialogo nativo de browser, com confirmacao explicita inline antes do `DELETE` real.

---

## Checkpoint 039 - Plano 4E endereco/localizacao minima

- **Data/hora:** 2026-05-22 13:08 -03:00 (America/Sao_Paulo)
- **Tarefa atual:** Investigar contrato real de endereco/localizacao minima e planejar o proximo patch sem implementacao.
- **Escopo:** leitura de specs, progresso, Backend `src`, migrations Supabase, Mobile `src/api`, `app` e `src/i18n`, mais probes remotos sem token. Backend/Mobile/Admin/deploy/secrets/env privada/migrations/RLS/schema/Search/Booking/provider onboarding/geocoding nao foram alterados.

### Veredito
- Resultado: **CONTRATO PARCIAL**.
- Banco/schema ja possui `addresses`, `location_precision`, `location geography(point, 4326)`, `public_area_label`, FK `tutor_profiles.default_address_id`, FK `provider_profiles.base_address_id`, indice `addresses_location_gix`, RLS habilitado e policy de select owner/admin.
- Backend nao possui `AddressesModule`, controller, DTOs, routes, service/repository publico ou tipos completos de `addresses` em `database.types.ts`.
- Mobile nao possui tipos/client/UI/i18n de endereco. `Search` e `Book` continuam placeholders.

### Evidencias
- Backend registrado hoje: `HealthModule`, `AuthModule`, `UsersModule`, `PetsModule`; nao ha modulo `AddressesModule`.
- `rg` em `Pet_Marketplace_Back/src` encontrou apenas `default_address_id` e `base_address_id` em `database.types.ts`; nenhum controller/DTO de address.
- Diagnostico remoto sem token:
  - `GET /api/v1/me` -> HTTP 401.
  - `GET /api/v1/pets` -> HTTP 401.
  - `GET /api/v1/addresses` -> HTTP 404.
  - `POST /api/v1/addresses` -> HTTP 404.
  - `GET /api/v1/addresses/geocode` -> HTTP 404.
  - `PATCH /api/v1/addresses/:id` -> HTTP 404.
- Nenhum token, senha, JWT, email completo, Authorization header, service role ou secret foi impresso.

### Decisao proposta para o proximo patch
- Fazer **Backend 4E minimo primeiro**, sem geocoding real.
- Salvar somente endereco/regiao do proprio usuario, com coordenada aproximada fornecida explicitamente pelo cliente ou por fixture/controlado no smoke, sem chamar provider externo.
- Relacionar opcionalmente o endereco salvo ao `tutor_profiles.default_address_id` quando `setAsDefaultTutorAddress=true`.
- Deixar `provider_profiles.base_address_id` fora do 4E minimo para nao abrir provider onboarding.
- Deixar `POST /addresses/geocode`, Search, Booking e provider onboarding fora deste patch.

### Proximo passo recomendado
Implementar o contrato minimo de `POST/GET/PATCH /api/v1/addresses` no Backend, com resposta segura e testes e2e, depois fazer o menor consumo Mobile no Profile apenas quando o backend remoto estiver publicado e validado.

---

## Checkpoint 040 - Backend 4E endereco/localizacao minima

- **Data/hora:** 2026-05-22 13:31 -03:00 (America/Sao_Paulo)
- **Tarefa atual:** Implementar contrato Backend minimo de enderecos proprios.
- **Escopo:** `Pet_Marketplace_Back` e docs de progresso. Mobile/Admin/deploy/secrets/env privada/migrations/RLS/schema/geocoding/Search/Booking/provider onboarding nao foram tocados.

### Resumo
- Criado contrato autenticado de enderecos proprios:
  - `GET /api/v1/addresses`
  - `POST /api/v1/addresses`
  - `PATCH /api/v1/addresses/:id`
- O contrato salva endereco/regiao do proprio usuario usando a tabela `addresses` existente.
- Nenhum geocoding foi implementado.
- Nenhum Search, Booking ou provider onboarding foi aberto.
- Nenhuma migration/RLS/schema foi criada ou aplicada.

### Contrato seguro
- Payload permitido: `label`, `countryCode`, `city`, `postcode`, `publicAreaLabel`, `latitude`, `longitude`, `locationPrecision`, `setAsDefaultTutorAddress`.
- Campos fora da allowlist sao rejeitados com `VALIDATION_ERROR`.
- `locationPrecision` aceita somente `postcode` e `approximate`; `exact` e rejeitado.
- `countryCode` aceita somente `GB`.
- Coordenadas precisam ficar no range UK aproximado: latitude `49..61`, longitude `-9..2`.
- `POST` exige pelo menos `postcode`, `city` ou `publicAreaLabel` alem das coordenadas.
- `setAsDefaultTutorAddress=true` atualiza `tutor_profiles.default_address_id` somente quando o usuario autenticado tem tutor profile.
- `provider_profiles.base_address_id` nao e tocado.

### Resposta segura
- Retorna: `id`, `label`, `countryCode`, `city`, `postcode`, `publicAreaLabel`, `locationPrecision`, `isDefaultTutorAddress`, `createdAt`, `updatedAt`.
- Nao retorna: `user_id`, `line1`, `formatted_address`, `location`, coordenadas, `default_address_id`, `base_address_id`, dados de provider, telefone/e-mail, tokens/secrets ou metadata.

### Arquivos alterados
- `Pet_Marketplace_Back/src/app.module.ts`
- `Pet_Marketplace_Back/src/addresses/addresses.module.ts`
- `Pet_Marketplace_Back/src/addresses/addresses.controller.ts`
- `Pet_Marketplace_Back/src/addresses/dto/address-fields.ts`
- `Pet_Marketplace_Back/src/addresses/dto/address-response.dto.ts`
- `Pet_Marketplace_Back/src/addresses/dto/create-address-request.dto.ts`
- `Pet_Marketplace_Back/src/addresses/dto/update-address-request.dto.ts`
- `Pet_Marketplace_Back/src/common/supabase/database.types.ts`
- `Pet_Marketplace_Back/src/common/supabase/supabase-admin.service.ts`
- `Pet_Marketplace_Back/test/addresses.e2e-spec.ts`
- `Pet_Marketplace_Back/docs/PROGRESS.md`
- `docs/PROGRESS.md`

### Validacoes
- Backend `pnpm typecheck` - passou.
- Backend `pnpm lint` - passou.
- Backend `pnpm build` - passou.
- Backend `pnpm test:e2e` - passou (4 suites, 48 testes).
- Observacao: os comandos emitiram apenas o aviso de engine local `node v24.12.0` versus `node 22.x` declarado no Backend.

### Diagnostico remoto seguro
- Sem deploy neste ciclo.
- `GET /api/v1/addresses` sem token no Backend remoto atual ainda retorna HTTP 404, esperado antes da publicacao.
- Nenhum token, senha, JWT, email completo, Authorization header, service role, `DATABASE_URL` ou secret foi impresso.

### Proximo passo recomendado
Revisar e aprovar deploy do Backend 4E na DigitalOcean. Depois do deploy, validar que `/api/v1/addresses` sem token retorna 401 e fazer smoke autenticado controlado de list/create/patch sem expor dados sensiveis.

---

## Checkpoint 041 - Validacao pre-deploy Backend 4E

- **Data/hora:** 2026-05-22 13:42 -03:00 (America/Sao_Paulo)
- **Tarefa atual:** Validar impacto, seguranca, performance e plano de publicacao do Backend 4E antes de deploy.
- **Escopo:** leitura de diff/codigo/testes/docs, validacoes locais, probe remoto sem token e query read-only de PostGIS. Nenhum deploy, Mobile, Admin, secret/env privada, migration/RLS/schema, geocoding, Search, Booking ou provider onboarding foi alterado.

### Veredito
- Resultado: **APROVADO PARA DEPLOY**, com smoke remoto autenticado obrigatorio apos publicacao.
- Nenhum bloqueio pre-deploy foi encontrado.

### Resumo da validacao
- Contrato/API: aditivo e restrito a `/api/v1/addresses`; nao quebra `/me`, `/pets` ou `/me/tutor-profile`.
- Seguranca: auth obrigatoria, escopo por `CurrentUser.id`, campos proibidos rejeitados e resposta sem coordenadas/PII sensivel.
- Banco: usa schema existente; sem migration. Cast EWKT para `geography` validado por query read-only no PostGIS real.
- Performance: `addresses.user_id` ja indexado; sem paginacao aceito para baixo volume de enderecos proprios; Search continua fora.
- Observabilidade: logs sem payload/PII, apenas codigo de erro e mensagem generica.
- Mobile/Admin: intocados.

### Validacoes executadas
- Backend `pnpm typecheck` - passou.
- Backend `pnpm lint` - passou.
- Backend `pnpm build` - passou.
- Backend `pnpm test:e2e` - passou (4 suites, 48 testes).
- Read-only PostGIS: cast `SRID=4326;POINT(lng lat)` para `geography` retornou OK.
- Probe remoto sem token: `GET /api/v1/addresses` ainda retorna HTTP 404 antes do deploy, esperado.
- Observacao: comandos locais emitiram apenas o aviso conhecido de engine `node v24.12.0` versus `node 22.x`.

### Plano de deploy recomendado
1. Revisar diff final do Backend 4E.
2. Preparar arvore de publicacao usada nos ciclos anteriores.
3. Rodar na arvore de publicacao: `pnpm typecheck`, `pnpm lint`, `pnpm build`, `pnpm test:e2e`.
4. Publicar somente apos aprovacao explicita do usuario.
5. Validar remoto sem token: `GET /api/v1/addresses` deve passar de HTTP 404 para HTTP 401.
6. Fazer smoke autenticado controlado de `GET/POST/PATCH/GET /addresses`.
7. Limpar/remover dado temporario manualmente se necessario, ja que nao ha DELETE publico neste contrato.

### Rollback
- Reverter deploy do Backend para o commit anterior publicado.
- Nao ha rollback de banco porque nao houve migration/schema/RLS.
- Qualquer dado temporario criado no smoke deve ser removido por caminho administrativo seguro sem expor dados sensiveis.

---

## Checkpoint 042 - Backend 4E publicado na DigitalOcean

- **Data/hora:** 2026-05-22 13:53 -03:00 (America/Sao_Paulo)
- **Tarefa atual:** Publicar e validar remotamente o contrato minimo de endereco/localizacao propria.
- **Escopo:** arvore de publicacao do Backend, GitHub fonte do Backend, DigitalOcean App Platform e smokes HTTP remotos. Mobile/Admin/secrets/envs/migrations/RLS/schema/geocoding/Search/Booking/provider onboarding nao foram tocados.

### Publicacao
- Arvore de publicacao usada: `.publish/Pet_Marketplace_Back_DO_fix`.
- Repo fonte confirmado: `thepetlobbyapp-coder/Pet_Marketplace_Back`, branch `main`.
- Commit publicado: `fbb2cc0` (`feat: add own addresses API`).
- App DigitalOcean: `stingray-app`.
- Service: `pet-marketplace-back`.
- Dominio: `https://stingray-app-vyfrt.ondigitalocean.app`.
- Deploy ativo: `80f76f3e-be41-4672-9874-52354560f192`.
- Deploy anterior `1e0c8309-7f5c-4925-9308-48f97ce9c5a9` ficou `SUPERSEDED`.

### Validacoes pre-push na arvore de publicacao
- `pnpm typecheck` - passou.
- `pnpm lint` - passou.
- `pnpm build` - passou.
- `pnpm test:e2e` - passou (4 suites, 48 testes).
- Observacao: os comandos emitiram apenas o aviso conhecido de engine local `node v24.12.0` versus `node 22.x`.

### Validacoes remotas
- `GET /api/v1/health` - HTTP 200.
- `GET /api/v1/addresses` sem token - HTTP 401, confirmando que a rota existe e exige auth.
- `OPTIONS /api/v1/addresses` com `Origin: http://localhost:8082`, metodo `POST` e headers `authorization,content-type` - HTTP 204 com CORS ok.
- Smoke autenticado com usuario de teste aprovado, token somente em memoria:
  - `GET /api/v1/me` - HTTP 200.
  - `GET /api/v1/addresses` antes - HTTP 200, 0 enderecos.
  - `POST /api/v1/addresses` - HTTP 201, criou endereco temporario sintetico de area publica.
  - `PATCH /api/v1/addresses/:id` - HTTP 200, atualizou label/area publica/precisao.
  - `GET /api/v1/addresses` depois - HTTP 200, endereco temporario visivel.
  - `POST /api/v1/addresses` com `locationPrecision: exact` - HTTP 400 `VALIDATION_ERROR`.
  - `POST /api/v1/addresses` com campos proibidos - HTTP 400 `VALIDATION_ERROR`.
- Respostas autenticadas nao expuseram `user_id`, `line1`, `formatted_address`, `location`, coordenadas, `default_address_id`, `base_address_id`, provider data, telefone/e-mail, tokens ou metadata.
- Cleanup confirmado: endereco temporario removido por caminho administrativo seguro; `GET /api/v1/addresses` final voltou a HTTP 200 com 0 enderecos.

### Guardrails
- Nenhum token, senha, JWT, Authorization header, e-mail completo, service role, `DATABASE_URL` ou secret foi impresso.
- Nenhuma migration/RLS/schema/env privada foi alterada.
- Mobile/Admin nao foram tocados.
- Geocoding, Search, Booking e provider onboarding seguem fora.

### Proximo passo recomendado
Planejar o Bloco 4E Mobile minimo para consumir `GET/POST/PATCH /api/v1/addresses` no Profile/onboarding, ainda sem geocoding, Search, Booking ou provider onboarding.

---

## Checkpoint 043 - Demo de fidelidade visual, Login e alinhamento do design spec

- **Data/hora:** 2026-05-23 (America/Sao_Paulo)
- **Tarefa atual:** Consolidar tres ciclos de trabalho fora da sequencia de Blocos: fidelidade total das 5 abas + Provider Detail (demo para cliente), Login fiel a marca, e alinhamento do `09_SPEC_DESIGN_SYSTEM.md` a implementacao real.
- **Escopo:** apenas `Pet_Marketplace_Mobile` (app, src, app.json, eas.json, assets) e docs sincronizados a partir da raiz. Backend, banco, Admin, deploy, secrets nao foram tocados.
- **Agentes envolvidos:** D_Design, V_ImpactValidator, M_MobilePlaystore, C10_CAMISA10, X_ProcessGuardian, PR_PromptOps.

### Recovery note (regressao corrigida)
Os ciclos anteriores deste lote foram registrados como "Checkpoint 027" e "Checkpoint 028" em copias desatualizadas de `Pet_Marketplace_Mobile/docs/PROGRESS.md`. A raiz `docs/PROGRESS.md` ja estava em 042 quando isso aconteceu, entao essas entradas foram perdidas do working tree apos `pnpm sync`. O conteudo original permanece em git history (commits `7b53cc2`, `390a8a2`, `3248127`). Este Checkpoint 043 consolida os tres ciclos no canonico correto.

### Cycle A - Fidelidade total das 5 abas + Play Store readiness (commit `7b53cc2`)
- Tornar Home, Search, Book, Chat, Provider Detail e Profile fieis ao modelo `Pet_Marketplace_Mobile02.jpeg` para demo do cliente.
- Tokens (`radius`, `shadow`) e fixtures `DEMO SEED` (`src/data/demoFixtures.ts`) adicionados.
- 15+ componentes novos criados (`CategoryChip`, `CenterTabButton`, `CondoSelector`, `ConversationRow`, `DateStrip`, `FilterPill`, `HeroBanner`, `IconButton`, `InfoRow`, `MessageBubble`, `ProviderCard`, `RatingStars`, `SearchInput`, `SectionHeader`, `TimeChip`).
- `app.json` endurecido (name "The Pet Lobby", icon, splash, permissions `[]`); criado `eas.json`; criado `docs/30_PLAYSTORE_RELEASE_READINESS.md` com Data Safety e blockers.
- Profile teve apenas polimento visual (hero); logica de queries/mutations preservada integralmente.

### Cycle B - Login fiel a marca (commit `390a8a2`)
- Logo The Pet Lobby (cantos arredondados via `borderRadius` + `overflow:'hidden'`) centralizada no topo da Login via novo componente `Brandmark`.
- Copy pt-BR alinhada ao restante do marketplace (chaves `auth.*` em `i18n/en-GB.ts` preservadas).
- Botao "Entrar" mais curto (60%, `minWidth: 200`) e centralizado via wrapper local, sem alterar o componente `Button` compartilhado.
- Novo asset `Pet_Marketplace_Mobile/assets/pet-lobby-logo.png` (caminho canonico Expo).
- Comportamento de `signIn`, `isAuthConfigured`, validacoes, estados de loading/erro e redirect pos-login preservados integralmente.

### Cycle C - Alinhamento do `09_SPEC_DESIGN_SYSTEM.md` (esta sessao)
- Auditoria do X_ProcessGuardian identificou divergencia critica entre o spec v1.1 e a implementacao real: idioma declarado en-GB (realidade pt-BR inline nas telas de marketplace + Login), catalogo de componentes desatualizado (~15 ausentes, ~7 listados mas nao implementados), `radius.pill` e tokens de `shadow` nao documentados, paleta sem hex concreto.
- Gate dos 3 agentes (V_ImpactValidator, M_MobilePlaystore, C10_CAMISA10) aprovou com ressalva comum: editar o canonico (`docs/09_SPEC_DESIGN_SYSTEM.md` na raiz) e propagar via `pnpm sync`, respeitando D-004.
- Spec atualizado para v1.2: header com idioma como politica explicita, §4 expandida (`space.10`, `radius.pill`, paleta canonica com 17 hex, §4.5 shadow com ressalva do warning Web), §5 reescrita como catalogo real organizado em 7 subsecoes + lista historica de itens nao implementados, §6 nova "Politica de copy e idioma" formalizando a divida tecnica pt-BR inline + en-GB i18n, §8 com marcacao ✅/🚧 por tela, §10 atualizada com padroes recem-descobertos (Image+borderRadius exige overflow:hidden; CTA compacto via wrapper local).
- `pnpm sync` propagou para os 3 apps; diff pos-sync confirmou identidade Mobile/Back/Admin com a raiz.

### Validacoes
- `pnpm typecheck` em Cycles A e B - passou.
- `pnpm lint` em Cycles A e B - passou.
- Cycle C: nao aplicavel (so docs).
- `pnpm sync` - propagou canonico corretamente.
- Diff pos-sync: Mobile = Back = Admin = canonico raiz.

### Ressalvas
- Telas em `DEMO SEED` nao podem ir para producao apresentando dados ficticios como reais (regra agora explicita no spec §9).
- Aviso pre-existente `"shadow*" style props are deprecated` no Web continua aberto como follow-up cosmetico.
- Divida tecnica de localizacao (pt-BR inline vs i18n) documentada na §6 do spec, nao resolvida.
- Os blockers de release do `docs/30_PLAYSTORE_RELEASE_READINESS.md` (exclusao de conta in-app + link web, backends de marketplace) seguem abertos.
- Aprendizado de processo: docs/ raiz e canonico; editar copias dos apps e perigoso porque `pnpm sync` sobrescreve. Sempre editar a raiz.

### Proximo passo recomendado
Com o spec atualizado, qualquer nova tela ou componente deve obrigatoriamente: consultar §5 antes de criar componente, respeitar §6 para idioma, e atualizar §5/§8 deste spec no mesmo ciclo. Em paralelo, voltar a sequencia original do PROGRESS (Bloco 4E Mobile - enderecos) ou priorizar os backends de marketplace que destravam as telas em `DEMO SEED`.
