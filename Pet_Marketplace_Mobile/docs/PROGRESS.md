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

## Checkpoint 006 - Validacao atual do Mobile e reconciliacao de status

- **Data/hora:** 2026-05-19 (America/Sao_Paulo)
- **Tarefa atual:** Validacao do estado real do Mobile e alinhamento com status geral.
- **Agentes envolvidos:** C10_Maestro, V_Validation, M_MobilePlaystore

### Estado atual assertivo
- Mobile ainda nao tem Expo/app React Native inicializado.
- Existem docs, assets de design/imagem e configuracao TypeScript inicial.
- Nao ha evidencia de app mobile executavel ou validado em dispositivo/emulador.
- DigitalOcean App Platform env vars estao em andamento por outro agente e nao foram validadas por este ciclo.
- Regra local de status em cascata foi adicionada em `.codex/C10_Maestro/C10_Agent_ProjectRules.md` e `.codex/V_Validation/V_Agent_QualitySeal.md`.
- `.codex/C10_Maestro/C10_STATUS.md` foi atualizado de template para status vivo do Mobile.

### Comandos executados
- `pnpm typecheck`

### Resultado das validacoes
- `pnpm typecheck` - falhou antes de compilar: `tsc` nao foi reconhecido e o pnpm avisou que existe `package.json`, mas `node_modules` esta ausente.
- `pnpm lint` - nao foi executado nesta cadeia porque o typecheck falhou antes.

### Pendencias reais
- Instalar dependencias locais ou inicializar o projeto Expo no Bloco 3 antes de validar TypeScript.
- Adicionar `typescript`/tooling conforme decisao do Bloco 3 se o app continuar com typecheck antes do Expo.
- Rodar typecheck/lint/testes mobile somente depois de o ambiente mobile estar instalado.

### Riscos
- Mobile nao deve ser reportado como validado tecnicamente no estado atual.
- Assets e documentos existem, mas nao substituem validacao de app real.

### Proximo passo recomendado
Avancar para o Bloco 3/Mobile Expo ou preparar dependencias minimas antes de qualquer relatorio de typecheck mobile como aprovado.

---

## Checkpoint 007 - Regra operacional para comandos PowerShell

- **Data/hora:** 2026-05-20 (America/Sao_Paulo)
- **Tarefa atual:** Formalizar no Mobile que todo comando PowerShell precisa indicar a pasta de execucao.
- **Agentes envolvidos:** C10_Maestro, V_Validation

### Resumo
- Adicionada regra para sempre informar `Pasta de execucao: <caminho>` antes de orientar ou executar comandos PowerShell.
- A regra foi registrada em `Pet_Marketplace_Mobile/.codex/AGENTS.md`.
- A regra foi registrada em `Pet_Marketplace_Mobile/.codex/C10_Maestro/C10_Agent_ProjectRules.md`.
- O status geral da raiz tambem foi atualizado conforme regra de status em cascata.

### Comandos executados
- Pasta de execucao: `C:\Users\israe\Downloads\Pet_Marketplace`
- `rg -n "PowerShell|powershell|pasta|diretorio|working directory|cwd|comando" .codex Pet_Marketplace_Mobile/.codex docs Pet_Marketplace_Mobile/docs -S`
- `git status --short -- .codex Pet_Marketplace_Mobile/.codex docs Pet_Marketplace_Mobile/docs`
- `Get-Content` nos arquivos de regras e progresso relevantes.

### Resultado das validacoes
- Regra documentada no Mobile e na raiz.
- Validacao final limitada a diff/whitespace dos arquivos tocados neste ciclo.

### Pendencias reais
- Aplicar o formato `Pasta de execucao: <caminho>` nos proximos prompts e checklists de EAS.

### Proximo passo recomendado
Retomar o fluxo EAS com comandos sempre acompanhados da pasta exata de execucao.

---

## Checkpoint 008 - Bloco 3: Mobile Base inicializado

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

## Checkpoint 009 - Bloco 3: Auth guard mobile reforcado e validado sem credenciais locais

- **Data/hora:** 2026-05-21 (America/Sao_Paulo)
- **Tarefa atual:** Fechar os criterios verificaveis do Bloco 3 antes do teste real de login Supabase.
- **Agentes envolvidos:** C10_Maestro, M_MobilePlaystore, S_Seguranca, V_Validation

### Resumo
- Nao existe `.env` local em `Pet_Marketplace_Mobile/`; apenas `.env.example` esta presente.
- Por isso, login/logout real com Supabase Auth e persistencia real em Expo Go/emulador seguem bloqueados ate preencher `EXPO_PUBLIC_SUPABASE_URL` e `EXPO_PUBLIC_SUPABASE_ANON_KEY`.
- O fluxo protegido foi reforcado no codigo: o layout de `(tabs)` agora redireciona usuario sem sessao para `/(auth)/login`, mesmo em acesso direto a URL/rota autenticada.
- O refresh manual do perfil agora fica desabilitado sem `accessToken`, mantendo `/api/v1/me` restrito a sessao valida.
- Nenhum cadastro foi implementado neste ciclo.
- Nenhum segredo backend foi adicionado ao Mobile.

### Arquivos alterados
- `app/(tabs)/_layout.tsx`
- `app/(tabs)/profile.tsx`
- `docs/PROGRESS.md`

### Resultado das validacoes
- `.env` local: ausente; teste real de Supabase Auth nao executado.
- `pnpm typecheck` - passou.
- `pnpm lint` - passou.
- `pnpm exec expo install --check` - passou.
- `pnpm exec expo config --type public` - passou.
- Health remoto `GET https://pet-marketplace-back.example.ondigitalocean.app/api/v1/health` - passou com `status=ok`.
- Expo Metro nativo `http://localhost:8081` - HTTP 200.
- Expo Web `http://localhost:8082/login` - HTTP 200.
- Navegador interno: `/login` exibiu aviso de Supabase nao configurado, botao `Sign in` ficou desabilitado e nao houve erro de console.
- Navegador interno: acesso direto a `http://localhost:8082/home` redirecionou para `http://localhost:8082/login` sem erro de console.
- Varredura de secrets no Mobile - sem segredos reais; resultados encontrados foram apenas mencoes documentais proibitivas em `.env.example` e `docs/`.

### Evidencias
- Screenshot local ignorado pelo Git: `.expo/auth-guard-login.png`.
- Browser check: `loginHasConfigNotice=true`, `signInEnabled=false`, `guardedUrl=http://localhost:8082/login`, `consoleErrors=[]`.

### Pendencias reais
- Criar/preencher `.env` local do Mobile com `EXPO_PUBLIC_SUPABASE_URL` e `EXPO_PUBLIC_SUPABASE_ANON_KEY`.
- Testar login/logout real com usuario aprovado em Expo Go ou emulador.
- Confirmar persistencia de sessao via `expo-secure-store` apos reload/reabertura nativa.
- Confirmar `/api/v1/me` com token real em sessao valida.

### Proximo passo recomendado
Preencher as duas envs publicas do Supabase no `.env` local do Mobile e executar o teste real em Expo Go/emulador. So depois disso iniciar Bloco 4: cadastro e perfis.

---

## Checkpoint 010 - Bloco 3: Auth real validado no Expo Web com Supabase

- **Data/hora:** 2026-05-21 (America/Sao_Paulo)
- **Tarefa atual:** Fechar a pendencia real de Auth Mobile com envs publicas locais e usuario de teste aprovado.
- **Agentes envolvidos:** C10_Maestro, M_MobilePlaystore, S_Seguranca, V_Validation

### Resumo
- Criado `Pet_Marketplace_Mobile/.env` local, ignorado pelo Git, contendo somente:
  - `EXPO_PUBLIC_API_BASE_URL`
  - `EXPO_PUBLIC_SUPABASE_URL`
  - `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- As envs publicas do Supabase foram derivadas do `.env` do Backend sem copiar service role, `DATABASE_URL`, tokens, senhas ou segredos backend.
- Expo foi reiniciado e confirmou carregamento apenas das tres envs publicas esperadas.
- Login real com Supabase Auth foi validado no Expo Web com usuario de teste aprovado.
- Logout foi validado no Expo Web: limpou a sessao, voltou para `/login` e bloqueou acesso direto a rotas autenticadas.
- Persistencia de sessao foi validada no Expo Web via reload: usuario permaneceu autenticado apos recarregar `/profile`.
- Storage de sessao foi ajustado: nativo segue usando `expo-secure-store`; Web usa `localStorage` apenas para preview/dev.
- `AuthProvider` agora encerra inicializacao mesmo se o storage falhar, evitando tela presa em `Checking your session`.
- Nenhum cadastro foi implementado neste ciclo.

### Arquivos alterados
- `.env` local ignorado pelo Git
- `src/auth/secureSessionStorage.ts`
- `src/auth/AuthProvider.tsx`
- `app/(tabs)/settings.tsx`
- `docs/PROGRESS.md`

### Resultado das validacoes
- `Pet_Marketplace_Mobile/.env` - existe, ignorado pelo Git, sem chaves proibidas.
- `pnpm typecheck` - passou.
- `pnpm lint` - passou.
- `pnpm exec expo config --type public` - passou e carregou somente `EXPO_PUBLIC_*`.
- Expo Metro nativo `http://localhost:8081` - HTTP 200.
- Expo Web `http://localhost:8082/login` - HTTP 200.
- Login real: passou; app navegou para `http://localhost:8082/home`.
- Logout real no Web: passou; app navegou para `http://localhost:8082/login`.
- Sem sessao: acesso direto a `/home` e `/profile` redirecionou para `/login`.
- Persistencia Web: apos login, reload em `/profile` manteve usuario autenticado.
- Supabase Auth direto com usuario de teste: HTTP 200, token resolvido sem imprimir o token.
- Backend direto `GET /api/v1/me` com token real: HTTP 200, contrato com `roles` e `status` confirmado sem imprimir dados pessoais.

### Limitacoes encontradas
- `/api/v1/me` no navegador Web exibiu erro no app por CORS: preflight `OPTIONS /api/v1/me` retornou 204, mas sem `Access-Control-Allow-Origin` para `http://localhost:8082`.
- Por isso, a renderizacao de roles/status no app Web segue bloqueada ate configurar CORS no Backend/DigitalOcean para o origin local ou para o dominio web real.
- Validacao em Expo Go/emulador Android nao foi executada porque `adb` nao esta disponivel nesta maquina.
- Persistencia nativa via `expo-secure-store` ainda precisa ser confirmada em Expo Go/emulador.

### Pendencias reais
- Configurar `CORS_ALLOWED_ORIGINS` no Backend/DigitalOcean para `http://localhost:8082` durante desenvolvimento ou aguardar dominio web real.
- Validar Expo Go/emulador Android com usuario de teste aprovado.
- Confirmar persistencia nativa via SecureStore apos fechar/reabrir app.
- Confirmar renderizacao de `/api/v1/me` no app depois de CORS ou no ambiente nativo.

### Proximo passo recomendado
Fechar CORS de desenvolvimento ou validar em Expo Go/emulador. Depois disso, o Bloco 3 pode ser considerado fechado o suficiente para iniciar Bloco 4: cadastro e perfis.

---

## Checkpoint 011 - CORS local validado; Profile Web contra DigitalOcean ainda pendente

- **Data/hora:** 2026-05-21 (America/Sao_Paulo)
- **Tarefa atual:** Revalidar o Mobile Auth apos ajuste de CORS do Backend.
- **Agentes envolvidos:** C10_Maestro, M_MobilePlaystore, E_DigitalOceanEnvironment, V_Validation

### Resumo
- Backend local foi configurado para aceitar `http://localhost:8082` e `http://localhost:8081` via `CORS_ALLOWED_ORIGINS`.
- O preflight local para `/api/v1/me` passou com `Access-Control-Allow-Origin: http://localhost:8082`.
- O Mobile `.env` foi temporariamente apontado para `http://localhost:3000` durante a tentativa de revalidacao e depois restaurado para `https://pet-marketplace-back.example.ondigitalocean.app`.
- A revalidacao interativa do login no navegador interno nao foi concluida porque o mecanismo de preenchimento de campos passou a falhar por clipboard virtual do browser tool.
- O CORS remoto da DigitalOcean ainda nao foi aplicado, entao `/profile` contra DigitalOcean segue pendente.
- Nenhum segredo foi adicionado ao Mobile.

### Validacoes relacionadas
- Backend local `OPTIONS /api/v1/me` com `Origin: http://localhost:8082` - passou.
- Backend local `GET /api/v1/health` com `Origin: http://localhost:8082` - passou.
- DigitalOcean `OPTIONS /api/v1/me` ainda sem `Access-Control-Allow-Origin`.
- Mobile `.env` final restaurado para a API DigitalOcean.

### Pendencias reais
- Aplicar `CORS_ALLOWED_ORIGINS` no DigitalOcean apos novo `doctl auth init`.
- Retestar login real + `/profile` no Mobile Web contra DigitalOcean.
- Confirmar renderizacao de `status` e `roles` no app.
- Validar Expo Go/emulador quando houver ambiente nativo/adb disponivel.

### Proximo passo recomendado
Confirmar app/componente na DigitalOcean, aplicar CORS no servico Backend e retestar `/profile` no Mobile Web.

---

## Checkpoint 012 - Mobile docs alinhados para DigitalOcean

- **Data/hora:** 2026-05-21 (America/Sao_Paulo)
- **Tarefa atual:** Alinhar referencias Mobile ao Backend atual em DigitalOcean App Platform.
- **Agentes envolvidos:** M_MobilePlaystore, E_DigitalOceanEnvironment, C10_Maestro

### Resumo
- O Backend/API alvo do Mobile agora e DigitalOcean App Platform.
- `EXPO_PUBLIC_API_BASE_URL` deve apontar para o dominio real de DigitalOcean quando confirmado.
- Enquanto o dominio real nao for confirmado, a documentacao usa o placeholder `https://pet-marketplace-back.example.ondigitalocean.app`.
- Nenhum segredo backend deve entrar no Mobile; somente `EXPO_PUBLIC_API_BASE_URL`, `EXPO_PUBLIC_SUPABASE_URL` e `EXPO_PUBLIC_SUPABASE_ANON_KEY` sao permitidas.

### Pendencias reais
- Confirmar dominio publico real do Backend em DigitalOcean.
- Atualizar `.env` local do Mobile com o dominio real quando ele existir.
- Aplicar CORS no Backend DigitalOcean para `http://localhost:8082`, `http://localhost:8081` e dominios reais.
- Retestar `/profile` no Mobile Web renderizando `status` e `roles`.
- Validar Expo Go/emulador quando ambiente nativo estiver disponivel.

### Guardrails
- Nao adicionar `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL`, tokens de smoke, senhas ou JWT secrets no app Mobile.
- Nao iniciar Bloco 4 ate fechar ou aceitar formalmente a pendencia de CORS/deploy DigitalOcean do Bloco 3.

---

## Checkpoint 013 - Profile Web validado contra Backend DigitalOcean real

- **Data/hora:** 2026-05-21 (America/Sao_Paulo)
- **Tarefa atual:** Retestar Mobile Web autenticado apos CORS remoto no Backend DigitalOcean.
- **Agentes envolvidos:** M_MobilePlaystore, E_DigitalOceanEnvironment, C10_Maestro, V_Validation

### Resumo
- Dominio real do Backend confirmado: `https://stingray-app-vyfrt.ondigitalocean.app`.
- Expo Web foi reiniciado em `http://localhost:8082` com API base apontando para o dominio real.
- Login real com usuario de teste aprovado passou no Expo Web.
- `/profile` carregou dados reais de `GET /api/v1/me` via Backend DigitalOcean.
- Renderizacao confirmada no Profile:
  - `Status`: `active`
  - `Locale`: `en-GB`
  - `Roles`: `tutor`
- Logout passou e redirecionou para `/login`.
- Sem sessao: acesso direto a `/profile` redirecionou para `/login`.
- Console do navegador interno ficou sem erros.

### Validacoes relacionadas
- DigitalOcean `OPTIONS /api/v1/me` com `Origin: http://localhost:8082` - passou com `Access-Control-Allow-Origin: http://localhost:8082`.
- Expo Web `http://localhost:8082/login` - HTTP 200.
- Navegador interno `/home` apos login: backend status `API is available: ok`.
- Screenshot local ignorado pelo Git: `.expo/block3-profile-digitalocean-cors.png`.

### Guardrails mantidos
- Nenhum segredo backend foi adicionado ao Mobile.
- O Mobile segue permitido apenas com `EXPO_PUBLIC_API_BASE_URL`, `EXPO_PUBLIC_SUPABASE_URL` e `EXPO_PUBLIC_SUPABASE_ANON_KEY`.
- Bloco 4 nao foi iniciado.

### Pendencias controladas
- Validar Expo Go/emulador Android quando houver ambiente nativo/adb disponivel.
- Confirmar persistencia nativa via `expo-secure-store` em dispositivo/emulador.

### Proximo passo recomendado
Bloco 3 Mobile Auth esta fechado para Expo Web contra DigitalOcean. A proxima evolucao funcional deve aguardar aprovacao explicita para iniciar Bloco 4.

---

## Checkpoint 014 - Bloco 4A Profile bootstrap no Mobile

- **Data/hora:** 2026-05-22 (America/Sao_Paulo)
- **Tarefa atual:** Tornar o Profile autenticado editavel no menor escopo seguro.
- **Agentes envolvidos:** M_MobilePlaystore, S_Seguranca, V_Validation

### Resumo
- Profile continua lendo `GET /api/v1/me` como fonte de verdade.
- Adicionado cliente `PATCH /api/v1/me` no Mobile para atualizar somente `locale`.
- Tela Profile agora mostra status/roles do backend e campo editavel de locale.
- Estados de loading, erro, sucesso, refresh e sessao ausente foram preservados.
- UI segue em ingles britanico.
- Nenhum segredo backend foi adicionado ao Mobile.
- Nenhum fluxo de cadastro completo, pets, endereco, provider onboarding, upload, booking, chat ou pagamento foi iniciado.

### Arquivos alterados
- `app/(tabs)/profile.tsx`
- `src/api/client.ts`
- `src/api/types.ts`
- `src/i18n/en-GB.ts`
- `docs/PROGRESS.md`

### Validacoes
- `pnpm typecheck` - passou.
- `pnpm lint` - passou.
- `pnpm exec expo config --type public` - passou.
- Expo Web local `http://localhost:8082/login` - HTTP 200.
- Login real com usuario de teste aprovado - passou.
- `/profile` carregou `status=active`, `roles=tutor`, `locale=en-GB`.
- Edicao temporaria para `locale=en-US` - salvou e exibiu `Profile saved`.
- Reload de `/profile` confirmou persistencia de `locale=en-US`.
- Locale da conta de teste foi restaurado para `en-GB` e confirmado por reload.
- Logout - passou.
- Sem sessao: acesso direto a `/profile` redirecionou para `/login`.
- Console do navegador interno: sem erros.

### Guardrails mantidos
- Mobile contem apenas envs publicas permitidas.
- `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL`, tokens, senhas e JWT secrets seguem fora do Mobile.
- O novo PATCH foi validado contra backend local porque o Backend DigitalOcean ainda nao foi redeployado com este codigo.

### Pendencias controladas
- Revalidar contra o Backend DigitalOcean apos deploy do Bloco 4A.
- Validar Expo Go/emulador Android e persistencia nativa via `expo-secure-store` quando houver ambiente nativo/adb.

### Proximo passo recomendado
Aguardar decisao de deploy remoto do Bloco 4A antes de expandir Profile para tutor/provider, pets ou endereco.

---

## Checkpoint 015 - Layout reconciliado com o brief canonico (design.md)

- **Data/hora:** 2026-05-21 (America/Sao_Paulo)
- **Tarefa atual:** Corrigir divergencias entre a UI do Mobile e o brief de design oficial.
- **Agentes envolvidos:** Validacao externa (sessao Claude Code), sem agentes .codex.

### Motivo
Validacao identificou que a implementacao do Bloco 3 divergia de `docs/design.md` (The Pet Lobby):
- `src/design/tokens.ts` usava accent teal `#0D766E` em vez do roxo de marca.
- Navegacao tinha 3 abas em vez das 5 planejadas no brief.
- Faltavam componentes obrigatorios do design system.

### O que foi feito
- `src/design/tokens.ts`: paleta alinhada a `design.md` secao 4. `accent` agora `#6F32F0`
  (purple.500), `accentPressed` `#4B16A8`, `accentSoft` `#EFE8FF`; neutros, `danger` e
  `successText` ajustados; adicionado `space.10 = 40`. Chaves de token mantidas identicas,
  entao nenhum consumidor precisou mudar.
- Navegacao de 5 abas: `Home / Search / Book / Chat / Profile`.
- Criadas telas placeholder reutilizando `ComingNextScreen`: `app/(tabs)/search.tsx`,
  `app/(tabs)/book.tsx`, `app/(tabs)/chat.tsx`.
- `app/(tabs)/_layout.tsx`: 5 abas declaradas; `settings` agora usa `href: null` (continua
  rota acessivel via Profile, mas fora da barra inferior).
- Componentes novos do design system em `src/components/`: `Badge.tsx`, `Avatar.tsx`,
  `EmptyState.tsx`, `ScreenHeader.tsx`.
- `src/i18n/en-GB.ts`: strings adicionadas para `tabs.search/book/chat` e os placeholders.

### Arquivos criados
- `src/components/Badge.tsx`
- `src/components/Avatar.tsx`
- `src/components/EmptyState.tsx`
- `src/components/ScreenHeader.tsx`
- `app/(tabs)/search.tsx`
- `app/(tabs)/book.tsx`
- `app/(tabs)/chat.tsx`

### Arquivos alterados
- `src/design/tokens.ts`
- `app/(tabs)/_layout.tsx`
- `src/i18n/en-GB.ts`
- `docs/PROGRESS.md`

### Validacoes
- `pnpm typecheck` - passou.
- `pnpm lint` - passou.
- Sem validacao de runtime/emulador nesta sessao.

### Fora do escopo mantido
- Backend, banco, Admin e producao nao foram tocados.
- Search/Book/Chat exibem apenas tela "Coming next"; funcoes reais sao do Bloco 4+.
- Sem icones nas abas (mantido o estilo so-texto atual) e sem FAB de acao central.

### Pendencias controladas
- Bloco 4+: implementar busca, bookings e chat reais nas abas placeholder.
- Adicionar `@expo/vector-icons` e o botao de acao central flutuante previstos no brief.
- Risco de merge: se o codex tiver trabalho paralelo em `tokens.ts` ou
  `app/(tabs)/_layout.tsx`, resolver mantendo a paleta roxa e a estrutura de 5 abas.

### Proximo passo recomendado
Codex segue o Bloco 4 usando os tokens roxos e as abas ja estruturadas; substituir as
telas placeholder de Search/Book/Chat pelas funcionalidades reais quando o bloco avancar.

---

## Checkpoint 016 - Backend remoto do Bloco 4A publicado

- **Data/hora:** 2026-05-21 23:04 -03:00 (America/Sao_Paulo)
- **Tarefa atual:** Registrar que o Backend DigitalOcean ja recebeu o `PATCH /api/v1/me` usado pelo Profile.
- **Agentes envolvidos:** E_DigitalOceanEnvironment, M_MobilePlaystore, V_Validation

### Resumo
- Backend remoto do Profile: `https://stingray-app-vyfrt.ondigitalocean.app`.
- Commit backend publicado: `d794ad5` (`feat: add safe profile locale update`).
- Deployment DigitalOcean ativo: `b750d8e8-f253-41c1-a39a-609e1da931ca`.
- O endpoint remoto `PATCH /api/v1/me` agora aceita somente `locale`, mantendo `GET /api/v1/me` como fonte de verdade.

### Validacoes remotas
- DigitalOcean `GET /api/v1/health` - HTTP 200.
- DigitalOcean preflight `OPTIONS /api/v1/me` para `PATCH` com `Origin: http://localhost:8082` - HTTP 204 e CORS correto.
- Smoke autenticado remoto: leitura inicial `locale=en-GB`.
- Smoke autenticado remoto: `PATCH locale=en-US`, GET confirmou persistencia, restauracao para `locale=en-GB` e GET final confirmou restauracao.
- Teste negativo remoto com `roles/status` no payload - HTTP 400 com `VALIDATION_ERROR`.

### Guardrails mantidos
- Mobile nao recebeu secrets ou envs privadas.
- Nao houve deploy Mobile/Admin neste ciclo.
- Validacao completa do fluxo visual no navegador nao foi repetida apos o deploy; o contrato remoto consumido pelo Profile foi validado via API.

### Proximo passo recomendado
Antes de expandir Profile para tutor/provider, pets ou endereco, definir o recorte do Bloco 4B e repetir o fluxo visual Mobile Web se ele for afetar UI.

---

## Checkpoint 017 - Layout fidelity pass parcial

- **Data/hora:** 2026-05-21 (America/Sao_Paulo)
- **Tarefa atual:** Ajustar o Mobile para cumprir as regras atuais de layout antes de novas funcionalidades.
- **Escopo:** apenas Mobile e docs. Backend/Admin, secrets, deploy, banco, pets, provider, booking e chat real nao foram tocados.

### O que foi feito
- Tabs corrigidas para remover o placeholder quebrado `v v`/setas visuais no Expo Web.
- Adicionada dependencia `@expo/vector-icons`.
- Tabs `Home`, `Search`, `Book`, `Chat` e `Profile` agora usam icones reais.
- `Card`, `Button`, `TextField` e aviso de Login usam `borderRadius <= 8`.
- Copy visivel de debug/roadmap foi removida ou reescrita: sem referencias a blocos futuros, bootstrap tecnico ou status de backend.
- Paleta roxa do `design.md` foi mantida.

### Validacoes
- `pnpm typecheck` - passou.
- `pnpm lint` - passou.
- `pnpm exec expo config --type public` - passou.
- Expo Web autenticado abriu em `http://localhost:8082/home`; Home, Search, Book, Chat e Profile revisados no navegador interno em viewport desktop.
- Console do navegador interno: sem erros nas telas revisadas.
- Screenshots capturados:
  - `.expo/layout-fidelity-home-2026-05-21.png`
  - `.expo/layout-fidelity-profile-2026-05-21.png`
- Busca textual em `app/` e `src/` confirmou que nao restaram radius antigo, referencias internas de bloco/bootstrap/status tecnico ou placeholder quebrado nas telas/copy alteradas.

### Pendencia de QA visual
- Viewport desktop autenticado passou para Home/Profile/Search/Book/Chat.
- A simulacao mobile no navegador interno com viewport `390x844` renderizou tela preta/DOM vazio, sem erros de console. Ainda precisa ser repetida em browser/mobile confiavel antes de chamar o layout de 100% fiel em mobile.

### Proximo passo recomendado
Resolver a pendencia de QA mobile/responsivo e, so depois, iniciar novo bloco funcional.

---

## Checkpoint 018 - QA responsivo Mobile fechado

- **Data/hora:** 2026-05-22 09:15 -03:00 (America/Sao_Paulo)
- **Tarefa atual:** Fechar a pendencia de tela preta/blank no viewport mobile antes de novas features.
- **Escopo:** apenas `Pet_Marketplace_Mobile` e docs de progresso. Backend/Admin, secrets, deploy, pets, provider, booking, chat real, endereco, pagamentos e upload nao foram tocados.

### Resultado
- A tela preta/DOM vazio **nao reproduziu** no novo ciclo de QA.
- O viewport mobile `390x844` renderizou Login, Home, Profile, Search, Book e Chat com DOM preenchido.
- O viewport desktop `1280x720` renderizou Login, Home, Profile, Search, Book e Chat com DOM preenchido.
- Nao houve overflow horizontal nos dois viewports (`scrollWidth` igual ao viewport e lista de elementos fora da largura vazia).
- Console do navegador interno: sem erros nas rotas revisadas.
- Chrome headless via DevTools Protocol tambem validou Login em `390x844`: `innerWidth=390`, `scrollWidth=390`, controles entre `x=20` e `x=370`, sem overflow.
- Conclusao: a falha anterior de tela preta/DOM vazio foi tratada como instabilidade/limitacao da ferramenta/sessao anterior, nao como bug responsivo reproduzivel do app.

### Validacoes visuais
- Login mobile `390x844`: sem blank, campos e botoes dentro da largura.
- Home mobile `390x844`: sem blank, tabs com icones reais e labels legiveis, sem sobreposicao.
- Profile mobile `390x844`: sem blank, tabs com icones reais e labels legiveis, sem sobreposicao.
- Search, Book e Chat mobile `390x844`: sem blank, copy operacional e sem textos de roadmap/debug.
- Login/Home/Profile/Search/Book/Chat desktop `1280x720`: sem blank e sem overflow.
- Busca textual em `app/` e `src/`: sem `next block`, `bootstrap block`, `Backend status`, `v v` ou placeholder de seta quebrado.
- Radius visivel de Login/Card/Button/TextField segue `<= 8`. `Avatar`/`Badge` existem como componentes ainda nao usados nas telas revisadas.

### Evidencias
- Screenshot final Home mobile: `.expo/qa-home-mobile-2026-05-22.png`
- Screenshot final Profile mobile: `.expo/qa-profile-mobile-2026-05-22.png`
- Evidencia adicional Chrome/CDP Login mobile: `.expo/qa-login-mobile-chrome-cdp-2026-05-22.png`
- Screenshots desktop novos nao foram necessarios porque nao houve alteracao visual de codigo neste ciclo; o desktop foi revalidado por DOM/viewport.

### Ressalva nao-layout
- No ambiente atual, Home e Profile renderizaram os estados de erro de servico/perfil, mas sem quebrar layout e sem erro de console.
- A checagem direta do endpoint publico de health configurado no `.env` local respondeu `status=ok`; a falha visual ficou registrada como pendencia de ambiente/API/sessao, fora do escopo deste QA responsivo Mobile.

### Validacoes estaticas
- `pnpm typecheck` - passou.
- `pnpm lint` - passou.
- `pnpm exec expo config --type public` - passou e exportou somente `EXPO_PUBLIC_*`.

### Proximo passo recomendado
Layout responsivo Mobile aprovado para seguir. Antes de expandir features, alinhar separadamente o ambiente/API/sessao se a proxima etapa depender de dados reais no Home/Profile.

---

## Checkpoint 019 - Ambiente/API/sessao Mobile alinhados

- **Data/hora:** 2026-05-22 10:54 -03:00 (America/Sao_Paulo)
- **Tarefa atual:** Resolver a pendencia de Home/Profile em estado de erro apos o QA responsivo.
- **Escopo:** `Pet_Marketplace_Mobile` e docs de progresso. Backend/Admin, deploy, banco, pets, provider, booking, chat real, endereco, pagamentos e upload nao foram tocados.

### Diagnostico
- `.env` local do Mobile contem somente as tres envs publicas permitidas:
  - `EXPO_PUBLIC_API_BASE_URL`
  - `EXPO_PUBLIC_SUPABASE_URL`
  - `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- A API base local estava apontando para o host legado Railway.
- `GET /api/v1/health` no Railway respondia HTTP 200 em chamada direta, mas o preflight de `/api/v1/me` com `Origin: http://localhost:8082` nao retornava `Access-Control-Allow-Origin`.
- Os checkpoints locais confirmam o Backend atual como DigitalOcean: `stingray-app-vyfrt.ondigitalocean.app`.
- No DigitalOcean, `GET /api/v1/health` respondeu HTTP 200 e preflights `GET/PATCH /api/v1/me` responderam HTTP 204 com `Access-Control-Allow-Origin: http://localhost:8082`.

### Correcao aplicada
- Atualizado somente o valor publico local `EXPO_PUBLIC_API_BASE_URL` no `.env` ignorado pelo Git para apontar para o Backend DigitalOcean atual.
- Nenhum token, service role, database URL, senha ou JWT foi impresso.
- Nenhuma env privada foi alterada.

### Validacao no Expo Web
- Expo Web reiniciado em `http://localhost:8082` carregando somente `EXPO_PUBLIC_*`.
- Login renderizou sem erro.
- Home autenticada carregou contra DigitalOcean e exibiu `Connected: ok`.
- Profile autenticado carregou dados reais de `/api/v1/me`:
  - `status=active`
  - `roles=tutor`
  - `locale=en-GB` no campo de locale
- Console do navegador interno: sem erros.
- Viewport usado na revalidacao visual: `390x844`.

### Validacoes estaticas
- `pnpm typecheck` - passou.
- `pnpm lint` - passou.
- `pnpm exec expo config --type public` - passou e exportou somente `EXPO_PUBLIC_*`.

### Resultado
- Pendencia de ambiente/API/sessao fechada para Expo Web local autenticado.
- A causa do erro visual anterior era API base local desatualizada apontando para host legado sem CORS adequado para o app Web.

### Proximo passo recomendado
Mobile esta pronto para escolher o proximo recorte funcional, mantendo um bloco pequeno e explicito antes de tocar pets/provider/endereco/booking/chat real.

---

## Checkpoint 020 - Bloco 4B Mobile Profile minimo

- **Data/hora:** 2026-05-22 11:05 -03:00 (America/Sao_Paulo)
- **Tarefa atual:** Melhorar a experiencia do Profile autenticado usando apenas dados existentes de `/api/v1/me`.
- **Escopo:** `Pet_Marketplace_Mobile` e docs de progresso. Backend/Admin, deploy, banco, pets, provider onboarding, booking, chat real, endereco, pagamentos e upload nao foram tocados.

### Recorte implementado
- Profile reorganizado em tres secoes operacionais:
  - `Account`
  - `Profile details`
  - `Preferences`
- A tela agora exibe somente dados ja existentes no contrato Mobile de `/api/v1/me`: email, status, roles, datas de criacao/atualizacao, resumos tutor/provider quando existirem e locale.
- A unica escrita permanece `PATCH /api/v1/me` com `locale`.
- Adicionado feedback de alteracao local em `locale`: mensagem de unsaved changes e acao `Cancel` para descartar o rascunho.

### Arquivos alterados
- `app/(tabs)/profile.tsx`
- `src/i18n/en-GB.ts`
- `docs/PROGRESS.md`

### Validacao visual
- Expo Web local reiniciado em `http://localhost:8082`.
- Viewport `390x844`: Login, Home e Profile renderizaram sem blank, sem overflow horizontal e sem erros.
- Viewport `1280x720`: Login, Home e Profile renderizaram sem blank, sem overflow horizontal e sem erros.
- Home autenticada exibiu `Connected: ok`.
- Profile autenticado exibiu as secoes `Account`, `Profile details` e `Preferences`.
- Profile autenticado confirmou `status=active`, `roles=tutor` e `locale=en-GB`.
- Console do navegador interno: sem erros.
- Screenshot de Profile foi descartado porque continha email da conta de teste.

### Validacoes estaticas
- `pnpm typecheck` - passou.
- `pnpm lint` - passou.
- `pnpm exec expo config --type public` - passou e exportou somente `EXPO_PUBLIC_*`.

### Guardrails mantidos
- Nenhum contrato novo foi criado.
- Nenhuma nova dependencia foi adicionada.
- Nenhum token, senha, service role, database URL ou JWT foi impresso.
- Paleta roxa preservada e `Card`/`Button`/`TextField` continuam com `borderRadius: 8`.
- Sem copy visivel de roadmap/debug/implementacao.

### Proximo passo recomendado
Escolher explicitamente o proximo recorte. Se for continuar no Profile, o menor passo tecnico agora exige contrato backend novo; caso contrario, iniciar um planejamento separado para Search/Book/Chat sem implementar funcionalidade real ampla de uma vez.

---

## Checkpoint 021 - Decisao Profile 4C Tutor profile minimo

- **Data/hora:** 2026-05-22 11:14 -03:00 (America/Sao_Paulo)
- **Tarefa atual:** Validar se existe contrato real para o Mobile criar/editar Tutor profile minimo.
- **Escopo:** leitura de `src/api/types.ts`, `src/api/client.ts`, `app/(tabs)/profile.tsx`, leitura cirurgica do Backend e diagnostico remoto sem token. Nenhuma UI nova foi implementada.

### Decisao
- Resultado: **Mobile nao deve avancar em Tutor profile ainda**.
- Motivo: nao ha endpoint backend publico para criar ou editar `tutor_profiles`.
- O Profile atual segue correto: ele mostra `Tutor profile: Not set` porque `/api/v1/me` ainda retorna apenas resumo quando o perfil ja existe.

### Evidencias
- `src/api/client.ts` tem contrato estrito apenas para `GET /health`, `GET /me` e `PATCH /me`.
- `src/api/types.ts` representa `profiles.tutor` apenas como resumo de leitura.
- `app/(tabs)/profile.tsx` atualmente escreve somente `locale` via `PATCH /api/v1/me`.
- Backend tem leitura interna de `tutor_profiles` para montar `/me`, mas nao tem controller/metodo publico para create/update.
- Diagnostico remoto sem token confirmou rotas existentes de `/me` e `/pets` como 401, e candidatos de tutor profile como 404:
  - `/tutor-profile`
  - `/tutor-profiles`
  - `/profiles/tutor`
  - `/me/tutor-profile`

### Contrato Backend minimo necessario antes de UI
- Endpoints propostos:
  - `POST /api/v1/me/tutor-profile`
  - `PATCH /api/v1/me/tutor-profile`
- Payload permitido:
  - `displayName`.
- Campos proibidos:
  - ids, `userId`, endereco/default address, telefone, email, roles, status, provider, pets, timestamps, metadata e qualquer campo fora da allowlist.
- Validacoes esperadas:
  - Auth obrigatoria.
  - Usuario ativo e nao deletado.
  - Body JSON objeto.
  - `displayName` string, trim, nao vazio, limite sugerido 80.
  - `POST` com perfil existente deve retornar conflito seguro.
  - `PATCH` sem perfil deve retornar 404 seguro.
  - Resposta segura sem `user_id`, dados sensiveis, endereco ou tokens.

### Checkpoint Mobile
- Nao criar formulario, botao ou fluxo "funcional" de Tutor profile ate o Backend 4C existir.
- Depois do contrato aprovado/deployado, o menor recorte Mobile deve ser apenas editar `displayName` real e atualizar o cache de `/me`.
- Nenhuma validacao estatica foi rodada porque nao houve alteracao de codigo Mobile.

---

## Checkpoint 022 - Mobile Profile 4C Tutor profile minimo

- **Data/hora:** 2026-05-22 11:55 -03:00 (America/Sao_Paulo)
- **Tarefa atual:** Implementar o menor recorte Mobile real para criar/editar `profiles.tutor.displayName` via Backend remoto ja publicado.
- **Escopo:** `Pet_Marketplace_Mobile` e docs de progresso. Backend/Admin/deploy/secrets/env privada/migrations/RLS/schema/pets Mobile/provider/endereco/booking/chat/upload/pagamentos nao foram tocados.

### Implementacao
- Adicionados tipos Mobile `TutorProfileResponse` e `UpsertTutorProfileRequest`.
- Adicionados client methods:
  - `createTutorProfile(accessToken, body)` -> `POST /api/v1/me/tutor-profile`
  - `updateTutorProfile(accessToken, body)` -> `PATCH /api/v1/me/tutor-profile`
- A union interna de paths do client agora inclui `/me/tutor-profile`.
- Profile ganhou edicao real de `Tutor display name` dentro de `Profile details`.
- O save de Tutor profile fica separado do save de `locale`, com draft, loading, cancel, sucesso e erro independentes.
- Validacoes client-side:
  - `trim`
  - nao vazio
  - limite visual de 80 caracteres
  - Save bloqueado sem mudanca
  - Save bloqueado se invalido
- Apos salvar, o cache/query de `/me` e invalidado para refetch e refletir `profiles.tutor.displayName`.

### Arquivos alterados
- `src/api/types.ts`
- `src/api/client.ts`
- `app/(tabs)/profile.tsx`
- `src/i18n/en-GB.ts`
- `docs/PROGRESS.md`

### Validacoes estaticas
- `pnpm typecheck` - passou.
- `pnpm lint` - passou.
- `pnpm exec expo config --type public` - passou e exportou somente `EXPO_PUBLIC_*`.

### Validacao Expo Web
- Expo Web local subiu em `http://127.0.0.1:8081` e `http://localhost:8082`.
- Navegador interno e Chrome do usuario nao tinham sessao autenticada local disponivel; ambos redirecionaram `/profile` para `/login`.
- Por falta de sessao autenticada, nao foi executado nesta sessao:
  - Home autenticada `Connected: ok`
  - Profile autenticado carregando `/me`
  - save real de `displayName`
  - restauracao do displayName original/teste
  - locale autenticado salvavel
- Checagem responsiva parcial sem sessao em Chrome headless:
  - `390x844`: `/profile` redirecionou para `/login`, sem overflow horizontal e sem eventos de erro.
  - `1280x720`: `/profile` redirecionou para `/login`, sem overflow horizontal e sem eventos de erro.

### Guardrails mantidos
- Nenhum token, JWT, senha, email, service role ou `DATABASE_URL` foi impresso.
- Nenhum Backend/Admin/deploy/schema/RLS/env privada foi alterado.
- Pets Mobile, provider onboarding, endereco/geolocalizacao, booking, chat real, pagamentos e upload continuam fora do escopo.
- Nao foi criada UI falsa ou placeholder funcional.

### Proximo passo recomendado
Reabrir Expo Web com a conta de teste aprovada ja autenticada ou fornecer uma sessao de QA disponivel no navegador, entao executar o smoke visual autenticado de Profile 4C: confirmar `/me`, editar temporariamente `displayName`, salvar, confirmar refetch/reload e restaurar o valor aprovado.

---

## Checkpoint 023 - QA autenticado Mobile Profile 4C

- **Data/hora:** 2026-05-22 12:11 -03:00 (America/Sao_Paulo)
- **Tarefa atual:** Executar QA autenticado real do Mobile Profile 4C no Expo Web local.
- **Escopo:** Expo Web local, login de teste aprovado, valida��o Home/Profile e docs de progresso. Backend/Admin/deploy/secrets/env privada/migrations/RLS/schema/pets Mobile/provider/endereco/booking/chat/upload/pagamentos nao foram tocados.

### Credenciais e sessao
- Login real no Supabase foi validado com a segunda senha candidata fornecida pelo usuario.
- A primeira senha candidata nao autenticou.
- Nenhuma senha, token, JWT, header Authorization, secret ou email completo foi registrado nos docs.
- Observacao de ambiente: em `http://127.0.0.1:8082`, login funcionou, mas Home ficou em erro de API por origem/CORS; o QA autenticado aprovado foi executado em `http://localhost:8082`, origem ja validada para o Backend.

### Validacao funcional
- Home autenticada exibiu `Connected: ok`.
- Profile autenticado carregou `/me`.
- Profile confirmou `status=active`.
- Profile confirmou que `roles` inclui `tutor` (a conta tambem possui role administrativa).
- Locale apareceu como `en-GB`.
- Tutor profile inicialmente estava ausente.
- Criacao de Tutor profile via `POST /api/v1/me/tutor-profile` passou:
  - Valor base criado/restaurado: `Tutor Teste QA`.
  - Mensagem `Tutor profile saved` apareceu.
  - `/me` refletiu `profiles.tutor.displayName`.
- Atualizacao temporaria via `PATCH /api/v1/me/tutor-profile` passou:
  - Valor temporario: `Tutor Teste QA Temp`.
  - Profile refletiu a alteracao.
- Restauracao via `PATCH /api/v1/me/tutor-profile` passou:
  - Valor final restaurado: `Tutor Teste QA`.
  - Reload de `/profile` confirmou persistencia e ausencia do valor temporario.
- Locale continuou salvavel via `PATCH /api/v1/me`:
  - Alterado temporariamente para `en-US`.
  - Restaurado para `en-GB`.
  - Reload confirmou `locale=en-GB`.

### Validacao visual/responsiva
- Chrome headless autenticado em `390x844`:
  - Home `Connected: ok`.
  - Profile carregou status, role tutor, locale `en-GB` e tutor displayName `Tutor Teste QA`.
  - Sem overflow horizontal.
  - Sem eventos de erro.
- Chrome headless autenticado em `1280x720`:
  - Home `Connected: ok`.
  - Profile carregou status, role tutor, locale `en-GB` e tutor displayName `Tutor Teste QA`.
  - Sem overflow horizontal.
  - Sem eventos de erro.

### Validacoes estaticas
- `pnpm typecheck` - passou.
- `pnpm lint` - passou.
- `pnpm exec expo config --type public` - passou e exportou somente `EXPO_PUBLIC_*`.

### Guardrails mantidos
- Nenhum Backend/Admin/deploy/schema/RLS/env privada foi alterado.
- Nenhum token, JWT, senha, header Authorization, service role, `DATABASE_URL` ou email completo foi impresso nos registros finais.
- Pets Mobile, provider onboarding, endereco/geolocalizacao, booking, chat real, pagamentos e upload continuam fora do escopo.

### Resultado
Mobile Profile 4C validado de ponta a ponta no Expo Web local autenticado contra o Backend remoto DigitalOcean.

---

## Checkpoint 024 - Mobile Pets 4D minimo

- **Data/hora:** 2026-05-22 12:34 -03:00 (America/Sao_Paulo)
- **Tarefa atual:** Implementar o menor recorte Mobile real de Pets do tutor usando o Backend remoto ja validado.
- **Escopo:** `Pet_Marketplace_Mobile` e docs de progresso. Backend/Admin/deploy/secrets/env privada/migrations/RLS/schema/provider/endereco/booking/chat/upload/pagamentos nao foram tocados.

### Implementacao
- Adicionados tipos Mobile `PetResponse`, `PetSpecies`, `PetSize`, `CreatePetRequest` e `UpdatePetRequest`.
- Adicionados client methods:
  - `getPets(accessToken)` -> `GET /api/v1/pets`
  - `createPet(accessToken, body)` -> `POST /api/v1/pets`
  - `updatePet(accessToken, petId, body)` -> `PATCH /api/v1/pets/:id`
  - `deletePet(accessToken, petId)` -> `DELETE /api/v1/pets/:id`
- O path de pet por id usa `encodeURIComponent` para montar `/pets/:id`.
- Profile ganhou secao `Pets` com lista real, empty state, criacao minima, edicao apenas de `name` e delete com confirmacao.
- Como o contrato remoto exige `species` no `POST`, a criacao inclui selecao simples `Dog/Cat/Other`; edicao continua restrita ao nome.
- Validacoes client-side:
  - `name.trim()`
  - nome nao vazio
  - limite de 120 caracteres alinhado ao Backend
  - create/save bloqueados quando invalido
  - save de edicao bloqueado sem mudanca
- Fluxos de Pets ficaram separados dos saves de `locale` e `Tutor display name`.

### Arquivos alterados
- `src/api/types.ts`
- `src/api/client.ts`
- `app/(tabs)/profile.tsx`
- `src/i18n/en-GB.ts`
- `docs/PROGRESS.md`

### Validacoes estaticas
- `pnpm typecheck` - passou.
- `pnpm lint` - passou.
- `pnpm exec expo config --type public` - passou e exportou somente `EXPO_PUBLIC_*`.

### Validacao Expo Web autenticada
- Expo Web local usado em `http://localhost:8082`.
- Home autenticada exibiu `Connected: ok`.
- Profile autenticado carregou `/me`.
- `locale=en-GB` permaneceu visivel e salvavel:
  - alteracao temporaria para `en-US` passou.
  - restauracao para `en-GB` passou.
- `Tutor display name` permaneceu visivel.
- Pets list carregou e exibiu empty state quando sem pets.
- Criacao de pet temporario via UI passou:
  - nome temporario: `QA Pet Temp 4D`.
  - especie: `Other`.
- Edicao de nome via UI passou:
  - nome temporario atualizado para `QA Pet Temp 4D Edited`.
- Delete:
  - o botao de delete abriu a confirmacao no Expo Web.
  - a automacao do navegador interno nao conseguiu aceitar o dialogo nativo do browser.
  - o pet temporario foi removido em seguida pelo mesmo contrato publico autenticado `DELETE /api/v1/pets/:id`, sem imprimir token/senha/JWT.
  - `GET /api/v1/pets` final confirmou `finalTempCount=0`.
- Viewport `390x844`: Home/Profile autenticados sem overflow horizontal e sem erros de console.
- Viewport `1280x720`: Home/Profile autenticados sem overflow horizontal e sem erros de console.

### Guardrails
- Nenhum token, JWT, senha, header Authorization, service role, `DATABASE_URL`, secret ou email completo foi registrado neste checkpoint.
- Nenhum Backend/Admin/deploy/schema/RLS/env privada foi alterado.
- Nenhum provider onboarding, endereco/geolocalizacao, booking, chat real, pagamentos ou upload foi implementado.
- Nenhum pet temporario ficou ativo ao final.

### Resultado
Mobile agora lista pets reais do tutor, cria pet real, edita somente o nome e remove pet real contra o Backend remoto DigitalOcean, mantendo Profile 4C sem regressao.

---

## Checkpoint 025 - Mobile Pets 4D hardening de delete inline

- **Data/hora:** 2026-05-22 12:57 -03:00 (America/Sao_Paulo)
- **Tarefa atual:** Trocar a confirmacao nativa de delete de Pets por confirmacao visual inline e testavel no Profile.
- **Escopo:** `Pet_Marketplace_Mobile/app/(tabs)/profile.tsx`, `Pet_Marketplace_Mobile/src/i18n/en-GB.ts` e docs de progresso. Backend/Admin/deploy/secrets/env privada/migrations/RLS/schema/provider/endereco/booking/chat/upload/pagamentos nao foram tocados.

### Implementacao
- Removido o uso de `window.confirm` no Expo Web e de `Alert.alert` no fluxo de delete de pet.
- Adicionado estado local `pendingDeletePetId` para mostrar confirmacao inline somente no pet selecionado.
- Primeiro clique em `Delete` agora apenas mostra `Delete this pet?` com botoes `Cancel` e `Delete`.
- `Cancel` fecha a confirmacao sem chamar `DELETE`.
- O `DELETE /api/v1/pets/:id` real so dispara no segundo clique confirmado.
- Ao editar outro pet ou concluir o delete, o estado de confirmacao e limpo.
- Criacao, edicao de nome, locale e Tutor displayName permanecem em estados separados.

### Validacoes estaticas
- `pnpm typecheck` - passou.
- `pnpm lint` - passou.
- `pnpm exec expo config --type public` - passou e exportou somente `EXPO_PUBLIC_*`.

### Validacao Expo Web autenticada
- Expo Web local usado em `http://localhost:8082`.
- Home autenticada exibiu `Connected: ok`.
- Profile autenticado carregou `/me`.
- Pets list carregou.
- Criacao de pet temporario via UI passou:
  - nome temporario: `QA Pet Temp 4D Inline`.
  - especie: `Other`.
- Edicao de nome via UI passou:
  - nome temporario atualizado para `QA Pet Temp 4D Inline Edited`.
- Delete:
  - primeiro clique em `Delete` exibiu confirmacao inline `Delete this pet?`.
  - o pet continuou visivel apos o primeiro clique.
  - `Cancel` fechou a confirmacao e o pet continuou visivel.
  - segundo fluxo de `Delete` + confirmacao inline removeu o pet.
  - lista final voltou para `No pets yet.`, sem pet temporario ativo.
- Viewport `390x844`: Home/Profile autenticados sem overflow horizontal (`scrollWidth=390`) e sem erros de console.
- Viewport `1280x720`: Home/Profile autenticados sem overflow horizontal (`scrollWidth=1280`) e sem erros de console.

### Guardrails
- Nenhum token, JWT, senha, header Authorization, service role, `DATABASE_URL`, secret ou email completo foi registrado.
- Nenhum Backend/Admin/deploy/schema/RLS/env privada foi alterado.
- Nenhum provider onboarding, endereco/geolocalizacao, booking, chat real, pagamentos ou upload foi implementado.
- Nenhum pet temporario ficou ativo ao final.

### Resultado
Pets 4D manteve criacao, edicao e remocao reais contra o Backend remoto, agora com delete inline testavel no Expo Web e sem dialogo nativo assustador.

---

## Checkpoint 026 - Plano 4E endereco/localizacao minima

- **Data/hora:** 2026-05-22 13:08 -03:00 (America/Sao_Paulo)
- **Tarefa atual:** Investigar contrato real de endereco/localizacao minima antes de qualquer UI Mobile.
- **Escopo:** leitura de specs, progresso, Backend `src`, migrations Supabase, Mobile `src/api`, `app` e `src/i18n`, mais probes remotos sem token. Nenhum Backend/Mobile/Admin/deploy/secret/env privada/migration/RLS/schema/Search/Booking/provider onboarding/geocoding foi alterado.

### Veredito
- Resultado: **CONTRATO PARCIAL**.
- O banco ja tem `addresses` com PostGIS, `public_area_label`, `location_precision`, FKs para tutor/provider profile e indice GiST.
- O Backend publicado nao expoe `/api/v1/addresses` nem `/api/v1/addresses/geocode`.
- O Mobile nao tem tipos, client methods, textos ou UI de endereco; `Search` e `Book` continuam placeholders.

### Evidencias
- `src/api/client.ts` tem paths apenas para `/health`, `/me`, `/me/tutor-profile`, `/pets` e `/pets/:id`.
- `src/api/types.ts` nao define `AddressResponse` ou payload de endereco.
- `app/(tabs)/profile.tsx` consome apenas `/me`, tutor profile e pets.
- Probes remotos sem token:
  - `/api/v1/me` e `/api/v1/pets` retornam HTTP 401.
  - `/api/v1/addresses`, `/api/v1/addresses/geocode` e `/api/v1/addresses/:id` retornam HTTP 404.

### Decisao Mobile
- Nao criar formulario ou UI funcional de endereco ate o contrato Backend 4E existir e estar validado remotamente.
- Quando existir, o Mobile 4E minimo deve ficar no Profile, com endereco/regiao do proprio usuario, sem busca, booking, provider onboarding, permissao de localizacao atual ou geocoding no app.

### Proximo passo recomendado
Aprovar e implementar primeiro o Backend 4E minimo; depois adicionar ao Mobile somente tipos/client e uma secao pequena de Profile para salvar/listar o endereco proprio.

---

## Checkpoint 027 - Fidelidade visual das 5 abas + prontidao Play Store

- **Data/hora:** 2026-05-22 (America/Sao_Paulo)
- **Tarefa atual:** Tornar o Mobile fiel ao modelo canonico (Pet_Marketplace_Mobile02.jpeg / design.md) para demonstracao ao cliente.
- **Escopo:** apenas `Pet_Marketplace_Mobile` (app, src, app.json, eas.json, docs). Backend, banco, Admin, deploy, secrets e migrations nao foram tocados.
- **Agentes envolvidos:** D_Design, V_ImpactValidator, M_MobilePlaystore, X_ProcessGuardian (pos-validacao).

### Motivo
Demanda explicita do usuario: o layout nao estava fiel ao modelo padrao e era preciso
mostrar o app ao cliente. Tarefa assumida como fora do escopo sequencial (PROGRESS estava
no Bloco 4E backend); autorizada pelo usuario.

### O que foi feito
- **Fundacao:** `tokens.ts` ganhou `radius` e `shadow`; criado `src/data/demoFixtures.ts`
  (prestadores, categorias, horarios, conversas) marcado como `DEMO SEED`.
- **Componentes novos:** SearchInput, CategoryChip, ProviderCard, RatingStars, SectionHeader,
  CondoSelector, HeroBanner, MessageBubble, ConversationRow, TimeChip, DateStrip, FilterPill,
  IconButton, InfoRow, CenterTabButton.
- **Home:** reescrita fiel ao Mobile02 (saudacao, condominio, busca, chips, banner roxo,
  prestadores proximos).
- **Search:** placeholder substituido por busca + filtros de categoria + lista de prestadores.
- **Book:** placeholder substituido por agendamento (prestador, calendario, horarios, resumo,
  confirmacao local). Le `providerId` por rota, com fallback.
- **Chat:** placeholder substituido por lista de conversas + thread com bolhas e envio local;
  badge de nao-lidas zera ao abrir.
- **Profile:** apenas polimento visual (hero com avatar/nome/badge). Logica de queries/mutations
  de pets e tutor preservada integralmente.
- **Provider Detail:** nova rota `app/provider/[id].tsx`; ProviderCard navega para o detalhe.
- **Play Store:** `app.json` endurecido (name, icon, splash, userInterfaceStyle light,
  permissions vazio); criado `eas.json` (development/preview/production); criado
  `docs/30_PLAYSTORE_RELEASE_READINESS.md` com Data Safety, listing e blockers.

### Validacoes
- `pnpm typecheck` (tsc --noEmit) - passou.
- `pnpm lint` (eslint .) - passou.
- `app.json` e `eas.json` - JSON valido.
- Smoke em emulador/dispositivo - NAO executado nesta sessao (sem ambiente nativo).
- Sem testes automatizados de UI (o projeto Mobile nao possui suite de testes).

### Riscos e ressalvas (visao X_ProcessGuardian)
- **DEMO SEED:** Search/Book/Chat/Provider Detail/Home renderizam dados de fixtures locais.
  Telas parecem funcionais sem backend. Aceitavel para demo, **proibido publicar em producao**
  como dados reais. Os backends de prestadores/reservas/chat nao existem.
- **Divergencia de fluxo:** este checkpoint adianta UI das abas que o Checkpoint 015 havia
  adiado para "Bloco 4+"; foi decisao explicita do usuario para a demo.
- **Blocker de release:** exclusao de conta in-app + link web ainda nao implementados
  (ver doc 30 secao 7 e 11).
- **i18n:** as telas novas de marketplace usam strings pt-BR inline; o restante do app segue
  `en-GB` via `src/i18n`. Divida tecnica de localizacao a consolidar.

### Prompts de backend gerados (parados - Codex nao executara agora)
- API de Prestadores (Home/Search), API de Reservas (Book), API de Chat (Chat),
  fluxo de Exclusao de Conta (doc 30 secao 12).

### Proximo passo recomendado
Commitar o trabalho Mobile seguindo `COMMITS.md` (escopo `mobile`), pois `app/` e `src/`
do Mobile estao integralmente fora de controle de versao. Depois, decidir entre seguir o
Bloco 4E backend (sequencia original) ou priorizar os backends de marketplace que destravam
as telas em DEMO SEED.

---

## Checkpoint 028 - Login fiel a marca com logo e CTA compacto

- **Data/hora:** 2026-05-23 (America/Sao_Paulo)
- **Tarefa atual:** Polir a tela de Login (logo da marca no topo, copy pt-BR, CTA compacto e centralizado, cantos arredondados na logo).
- **Escopo:** apenas `Pet_Marketplace_Mobile/app/(auth)/login.tsx`, novo componente `Brandmark` e novo asset de logo. Backend, banco, Admin, deploy, secrets e demais telas nao foram tocados.
- **Agentes envolvidos:** D_Design, V_ImpactValidator, PR_PromptOps (geracao do PROMPT_BRIEF), X_ProcessGuardian (pos-validacao).

### O que foi feito
- **Asset:** logo copiada de `docs/assets/pet-lobby-paw-marker-logo.png` para `Pet_Marketplace_Mobile/assets/pet-lobby-logo.png` (caminho canonico de assets Expo). O arquivo em `docs/assets/` foi preservado.
- **Componente novo:** `src/components/Brandmark.tsx` exibe a logo centralizada com `accessibilityLabel="The Pet Lobby"`, `resizeMode="contain"`, wordmark opcional e tagline opcional. Logo com `borderRadius: radius.md` (12px) e `overflow: 'hidden'` para recorte correto em iOS/Web.
- **Login (`app/(auth)/login.tsx`):** UI reescrita com hierarquia `Brandmark > titulo > subtitulo > formulario > CTA > links`. Copy em pt-BR inline (coerente com Home/Search/Book/Chat/Detalhe). Botao "Entrar" envolto em wrapper `submitWrap` com `alignSelf: 'center'`, `width: '60%'` e `minWidth: 200` (CTA mais curto e centralizado, sem alterar o componente `Button` compartilhado).
- **Chaves `auth.*` em `src/i18n/en-GB.ts`:** preservadas para uso futuro (apenas deixaram de ser consumidas pela tela de Login).

### Comportamento preservado
- `useAuth()` (`isAuthConfigured`, `signIn`) - intacto.
- `handleSubmit` com `setIsSubmitting`, `signIn`, `Alert.alert` em erro e `router.replace('/(tabs)/home')` em sucesso - intacto.
- Estado desabilitado: `!isAuthConfigured || !email || !password || isSubmitting` - intacto.
- Props dos `TextField` (autoCapitalize, autoComplete, keyboardType, textContentType, secureTextEntry) - intactos.
- Aviso quando `!isAuthConfigured` - preservado com copy pt-BR.
- `Button.tsx`, `Screen.tsx`, `TextField.tsx`, tokens, AuthProvider, supabaseClient - nao tocados.

### Arquivos
- Criados:
  - `Pet_Marketplace_Mobile/assets/pet-lobby-logo.png`
  - `Pet_Marketplace_Mobile/src/components/Brandmark.tsx`
- Alterados:
  - `Pet_Marketplace_Mobile/app/(auth)/login.tsx`
  - `Pet_Marketplace_Mobile/docs/PROGRESS.md` (este checkpoint)

### Validacoes
- `pnpm typecheck` (tsc --noEmit) - passou.
- `pnpm lint` (eslint) - passou.
- Smoke: Metro dev server em `http://localhost:8081` saudavel; bundle web compilando sem erro; Expo Go conectado em `exp://192.168.1.69:8081` recebeu hot reload das mudancas. Sem erros de console.

### Ressalvas
- Aviso pre-existente `"shadow*" style props are deprecated. Use "boxShadow"` continua aparecendo no Web (tokens `shadow.sm/md/lg`). Nao foi introduzido novo `shadow*` nesta etapa. Follow-up cosmetico, nao bloqueante.
- Login passa a ter copy pt-BR inline; o restante da infra (settings, sign-up, reset-password, legal) segue `en-GB` via `src/i18n`. Divida tecnica de localizacao a consolidar.
- Sign-up e Reset-password continuam com o layout antigo (fora do escopo desta tarefa).

### Proximo passo recomendado
Se a fidelidade da Login estiver aprovada visualmente pelo cliente, replicar o mesmo padrao em `sign-up.tsx` e `reset-password.tsx`. Em paralelo, resolver os blockers de release do `docs/30_PLAYSTORE_RELEASE_READINESS.md` (exclusao de conta, backends de marketplace) antes de qualquer build de producao.
