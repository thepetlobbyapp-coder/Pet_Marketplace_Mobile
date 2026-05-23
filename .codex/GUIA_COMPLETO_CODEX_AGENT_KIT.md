# Guia Completo do Codex Agent Kit

Atualizado em: 2026-05-23  
Base: `C:\Users\israe\Downloads\.codex`

Este guia e o manual humano do kit. Para a fonte operacional mais curta, use
`AGENTS.md`. Para execucao dentro de um projeto, copie ou adapte
`C10_Maestro/C10_Agent_ProjectRules.md` para `PROJECT_ROOT/AGENTS.md`.

## Visao Geral

O kit agora esta organizado como um ecossistema de agentes, gates e metodos.
Ele cobre orquestracao, selecao automatica de agentes, arquitetura, backend,
frontend, mobile, iOS, ambiente, seguranca, performance, testes, observabilidade,
pagamentos, moderacao, compliance, BI, localizacao, debug, prompt ops, fabrica de
agentes, GSD/TDD e auditoria CLI.

O kit tambem possui uma camada de compatibilidade para Claude Code:

- `CLAUDE.md`: instrucoes para Claude Code usar o arsenal.
- `.claude/agents/*.md`: wrappers de subagentes Claude.
- `T_Templates/T_Template_CLAUDE.md`: template para projetos reais.
- `C10_Maestro/C10_Agent_ClaudeProjectRules.md`: regras para gerar um
  `CLAUDE.md` de projeto.

Essa camada nao move nem substitui os agentes originais. Ela apenas permite que
Claude Code delegue tarefas usando a mesma inteligencia do kit.

## Resposta Direta: Existe Agente Que Ativa O Necessario?

Sim. O agente e:

- `SUP_Supervisor/SUP_PICK_AgentSelector.md`
- Alias: `@PICK`
- Funcao: analisar o pedido, escolher o time certo de agentes, definir a ordem
  de acionamento, remover excesso e detectar lacunas.

Quando nenhum agente existente cobre a tarefa, o `@PICK` deve acionar:

- `F_AgentForge/F_Agent_Foreman.md`
- Alias: `@F`
- Funcao: criar um agente sob demanda com contexto, blueprint, composicao e
  auditoria.

Regra pratica: comece por `@PICK` quando o pedido for grande, ambiguo, de risco
medio/alto ou envolver varias areas. Ele e o "roteador inteligente" do arsenal.

## Pipeline Recomendado

1. `@PICK` seleciona o time certo e detecta lacunas.
2. `@CRED` valida credenciais antes de qualquer acesso externo.
3. `@C10` entende fase, memoria, brief e status.
4. `@A` valida arquitetura, fronteiras e contratos.
5. `@C` revisa o plano contra codigo real.
6. `impact_validator` mapeia impacto cross-stack antes de codar.
7. `@GSD` transforma o plano em criterio de aceite, TDD proporcional e Harness.
8. Especialistas entram por dominio: `@B`, `@D`, `@M`, `@IOS`, `@E`, `@BI`,
   `@GEO`, `@I18N`, `@MOD`, `@PAY`, `@UK`, `@BUG`, etc.
9. `@GSD` volta apos a implementacao para auditar CLI, bug sweep e lacunas.
10. `@S`, `@P`, `@Q`, `@STD` e `@FLOW` validam seguranca, performance, testes,
    padroes e ordem quando aplicavel.
11. `final_validator` revisa o diff final antes de merge/deploy.
12. `@X` audita o processo em modo FOCUSED ou FULL.
13. `C10_DOCUMENTADOR` registra LOG, STATUS, DECISIONS e LEARNINGS.

## Catalogo Por Area

### Raiz

- `AGENTS.md`: catalogo mestre, prefixos, pipeline e regras globais.
- `AUDIT_AGENTES.md`: historico de auditorias e lapidacoes.
- `PLANO_LAPIDACAO_E_GUIA_AGENTES_2026-05-22.md`: plano e guia da lapidacao
  anterior.
- `GUIA_COMPLETO_CODEX_AGENT_KIT.md`: este guia.

### C10_Maestro - Orquestracao E Memoria

- `C10_CAMISA10.md`: maestro do projeto, fase, briefings e coordenacao.
- `C10_DOCUMENTADOR.md`: fecha ciclos com LOG, DECISIONS, LEARNINGS e STATUS.
- `C10_Agent_ProjectRules.md`: template de `AGENTS.md` para cada projeto.
- `C10_Agent_ClaudeProjectRules.md`: regras para adaptar o projeto ao Claude
  Code com `CLAUDE.md` e `.claude/agents/`.
- `C10_Method_SDD.md`: metodo SDD canonico do kit.
- `C10_Skill_Strategy.md`: estrategia para decidir quando criar skills.
- `C10_STATUS.md`, `C10_LOG.md`, `C10_DECISIONS.md`, `C10_LEARNINGS.md`:
  templates e exemplos de memoria.

Use `@C10` no inicio de projeto, retomada de contexto, ciclo grande ou decisao
que precisa coordenar varios agentes.

### SUP_Supervisor - Supervisao E Ativacao Inteligente

- `SUP_PICK_AgentSelector.md`: `@PICK`, escolhe o time certo e ativa o que for
  necessario.
- `SUP_CRED_AccessGatekeeper.md`: `@CRED`, valida credenciais e acesso externo.
- `SUP_X_ProcessGuardian.md`: `@X`, auditoria geral do processo e saude do
  projeto.
- `SUP_FLOW_DeliveryInspector.md`: `@FLOW`, ordem correta de entrega e cascata de
  etapas puladas.
- `SUP_STD_StandardsEnforcer.md`: `@STD`, padroes declarados, inferidos e
  universais.
- `SUP_ENV_StatusRadar.md`: `@ENV`, paridade entre local, dev, staging e prod.
- `SUP_RiskMarshal.md`: `@R`, matriz de riscos tecnicos, operacionais, legais e
  financeiros.
- `SUP_Method_Harness.md`: metodo Harness canonico.
- `SUP_INTEGRATION_GUIDE.md`: como os supervisores se conectam.

Use `@PICK` como entrada padrao para tarefas complexas. Use `@X` para auditoria
geral ou antes de marcos importantes.

### GSD_DeliveryDiscipline - GSD, TDD E CLI

- `GSD_Agent_TDDCLIAuditor.md`: `@GSD`, gate obrigatorio para implementacao,
  bugfix e refatoracao comportamental.

O `@GSD` nao substitui executor nem QA. Ele obriga a entrega a ter criterio de
aceite, TDD proporcional, Harness CLI, bug sweep e lacunas declaradas.

### A_Architecture - Arquitetura

- `A_Agent_CrossStackArchitect.md`: define fronteiras, contratos, camadas,
  idempotencia e riscos cross-stack.

Use antes de APIs, schemas, auth, jobs, webhooks, integracoes ou mudancas que
atravessam frontend/backend/banco.

### B_BackendDomain - Backend E Dominio

- `B_Agent_BackendDomain.md`: APIs, DTOs, permissoes, regras de negocio,
  services, repositories e dominio backend.
- `B_Template_API_SPEC.md`: especificacao de API.

Use quando a regra nao deve ficar no frontend/mobile/admin e precisa morar no
backend com contrato claro.

### BI_Dashboards - Metricas E Dashboards

- `BI_Agent_DashboardDesigner.md`: dashboards, KPIs, fonte da verdade, filtros,
  permissoes e performance de metricas.
- `BI_Template_DASHBOARD_SPEC.md`: especificacao de dashboard.
- `BI_Template_DASHBOARD_QA.md`: QA de dashboard.
- `BI_Template_METRIC_DICTIONARY.md`: dicionario de metricas.

Use para relatorios, indicadores, graficos e qualquer decisao baseada em dados.

### BUG_Debugger - Debug Cirurgico

- `BUG_Agent_Debugger.md`: diagnostico, causa raiz, pre-validacao, correcao e
  pos-validacao.
- `patterns-bugs-comuns.md`, `checklist-ambiente.md`, `sql-diagnostico.md`,
  `erros-vercel.md`: referencias de investigacao.

Use quando ha bug, regressao, 4xx/5xx, comportamento inesperado, timeout,
ambiente divergente ou dados inconsistentes.

### C_Cetico - Revisao Critica

- `C_Agent_Cetico.md`: revisa planos contra codigo real, consumidores,
  contratos, riscos e lacunas.

Use antes de implementar. Se faltam arquivos ou evidencia, o veredito correto e
`QUESTIONAR`, nao aprovar no escuro.

### D_Design - Frontend Visual E Layout

- `D_Agent_Design.md`: UX/UI, componentes, responsividade, acessibilidade e
  preservacao de logica.
- `D_Agent_LayoutReplicator.md`: replica ou adapta layout de referencia com
  paridade visual.
- `D_Template_LAYOUT_REPLICATION_BRIEF.md`: briefing de replicacao.
- `D_Template_VISUAL_PARITY_REPORT.md`: relatorio de paridade visual.

Use para telas, polimento visual, design system, copia autorizada de layout ou
adaptacao inspirada.

### E_Environment - Ambiente, Secrets E Cloud

- `E_Agent_Environment.md`: Vercel, env vars, frontend/backend separados,
  secrets e CORS.
- `E_Agent_DigitalOceanEnvironment.md`: DigitalOcean, App Platform, planos,
  envs, banco gerenciado e custo.
- Referencias: Vercel API, nomenclatura, cross-validation, DigitalOcean API,
  App Platform e planos.

Use antes de deploy, ao configurar ambiente, trocar cloud, corrigir CORS/env ou
validar custo e paridade.

### F_AgentForge - Fabrica De Agentes

- `F_Agent_Foreman.md`: orquestra a criacao de agentes sob demanda.
- `F_Agent_ContextScanner.md`: le contexto antes de criar agente.
- `F_Agent_AgentArchitect.md`: desenha blueprint.
- `F_Agent_AgentComposer.md`: escreve o agente.
- `F_Agent_WorkAuditor.md`: audita o trabalho do agente criado.
- `F_Agent_Lifecycle.md`: promocao, memoria, evolucao e aposentadoria.
- `F_Promoted/*`: registro e memoria de agentes promovidos.

Use quando o `@PICK` detectar lacuna real e recorrente que nenhum agente cobre
bem.

### GEO_Location - Localizacao

- `GEO_Agent_Location.md`: enderecos, coordenadas, raio, proximidade, PostGIS,
  privacidade geografica e geocoding.
- `GEO_Template_LOCATION_MODEL.md`: modelo de dados de localizacao.

Use para busca por proximidade, mapas, postcode, GPS, raio, privacidade de
endereco e geospatial queries.

### I18N_LocalizationUX - Localizacao E UX Writing

- `I18N_Agent_LocalizationUX.md`: i18n, ingles de produto, UX writing, strings
  e textos de loja.
- Templates: glossary, string map, Play Store texts.

Use em textos de UI, erros, emails, notificacoes, loja, politica e ingles
britanico.

### IOS_AppleAppstore - iOS E App Store

- `IOS_Agent_AppleNativeAppstore.md`: iOS nativo, Swift/SwiftUI, TestFlight,
  signing, App Store Connect, privacy labels e review.
- Templates: native project, privacy, app store review.

Use para apps Apple nativos, entitlements, StoreKit, permissoes e aprovacao App
Store.

### M_MobilePlaystore - Mobile Expo/Android

- `M_Agent_MobilePlaystore.md`: React Native + Expo, EAS, Android, offline,
  permissoes, seguranca e Play Store.
- Templates: project, release, security, test plan, offline.

Use para apps mobile, Data Safety, release Android, sync offline e experiencia em
device real.

### MOD_TrustSafety - Trust & Safety

- `MOD_Agent_TrustSafety.md`: denuncias, moderacao, bloqueio, abuso, UGC,
  retencao e admin flow.
- `MOD_Template_TRUST_SAFETY.md`: especificacao de trust & safety.

Use para chat, reviews, conteudo de usuario, denuncias, suporte e protecao contra
abuso.

### O_Observability - Observabilidade E Operacao

- `O_Agent_DeployObservability.md`: logs, metricas, traces, alertas, healthcheck,
  smoke test, rollback e operacao critica.

Use antes de producao, em incidentes, webhooks, filas, jobs, deploy e fluxos que
precisam ser monitorados.

### PAY_PaymentsMarketplace - Pagamentos

- `PAY_Agent_PaymentsMarketplace.md`: pagamentos, marketplace, comissao, ledger,
  webhooks, refunds, disputes, risco regulatorio e app stores.
- `PAY_Template_PAYMENT_STRATEGY.md`: estrategia de pagamentos.

Use para Stripe, split, payout, refund, fee, wallet, escrow prometido, booking
financeiro e monetizacao.

### PR_PromptOps - Prompt Engineering

- `PR_Agent_PromptRefiner_v2.md`: transforma pedidos em prompts cirurgicos,
  validaveis e seguros.
- `PR_Template_PROMPT_BRIEF.md`: briefing de prompt.

Use para refinar ideias vagas antes de pedir implementacao, investigacao, plano,
hotfix ou validacao.

### P_Performance - Performance

- `P_Agent_PerformanceValidator.toml`: valida hot paths, queries, cache,
  payloads, concorrencia, custos e baseline.

Use quando houver lista grande, dashboard pesado, query critica, imagem, fila,
cache, mobile lento ou custo operacional.

### Q_Quality - QA E Testes

- `Q_Agent_TestEngineer.md`: matriz de testes, criterios de aceite, regressao,
  unit, integracao, contrato, e2e e smoke.

Use antes de fechar feature, release, bugfix critico ou quando o `@GSD` apontar
lacunas de Harness.

### S_Seguranca - Seguranca

- `S_Agent_SecurityValidator.toml`: auth, PII, secrets, permissoes, uploads,
  headers, pagamentos, input externo e superficie de ataque.

Use quando tocar dados sensiveis, autenticacao, autorizacao, token, storage,
upload, logs, CORS, CSP ou dinheiro.

### T_Templates - Templates Reutilizaveis

- `T_Template_PROJECT.md`: visao e estrutura inicial do projeto.
- `T_Template_STATUS.md`: status atual.
- `T_Template_LOG.md`: log cronologico.
- `T_Template_DECISIONS.md`: ADRs.
- `T_Template_LEARNINGS.md`: aprendizados.
- `T_Template_SPEC.md`: especificacao SDD.
- `T_Template_CLI_AUDIT.md`: auditoria Harness CLI.
- `T_Template_CLAUDE.md`: template de `CLAUDE.md` para Claude Code.

Use no onboarding e em entregas que precisam virar memoria confiavel.

### UK_CompliancePetCare - Compliance UK E Pet Care

- `UK_Agent_CompliancePetCare.md`: UK GDPR, Play Store, privacidade, termos,
  dados pessoais, localizacao e pet care.
- `UK_Template_PLAYSTORE_COMPLIANCE.md`: checklist de compliance para loja.

Use para produtos UK, pet care, dados pessoais, Play Store, politicas e
permissoes.

### V_Validation - Validadores

- `V_Agent_ImpactValidator.toml`: impacto cross-stack antes de implementar.
- `V_Agent_FinalValidator.toml`: selo final pos-implementacao, diffs, escopo,
  bugs, regressao, seguranca, performance e testes.
- `V_Agent_ImpactGuard.md`: guia humano do impact validator.
- `V_Agent_QualitySeal.md`: guia humano do selo final.

Use como portoes de qualidade antes de codar e antes de merge/deploy.

## Cobertura Atual Do Arsenal

### Coberto Como Nucleo

- Selecao inteligente de agentes: `@PICK`.
- Criacao sob demanda: `@F`.
- Orquestracao e memoria: `@C10`.
- Evidencia e anti-alucinacao: `@C`, `impact_validator`, `final_validator`.
- GSD/TDD/Harness: `@GSD`.
- Frontend, backend, mobile, iOS, ambiente, observabilidade, seguranca,
  performance, QA, pagamentos, trust & safety, BI, localizacao e i18n.

### Especializacoes Que Podem Virar Agentes Sob Demanda

Estas lacunas nao bloqueiam o kit hoje porque agentes existentes cobrem parte do
dominio. Crie via `@F` apenas se virarem recorrentes:

| Candidato | Quando criar | Cobertura atual |
|---|---|---|
| `DB_Agent_MigrationReliability` | Muitas migrations, dados legados, rollback e zero-downtime | `@B`, `@A`, `@BUG`, `@ENV` |
| `A11Y_Agent_AccessibilityAuditor` | Produto web/mobile precisa WCAG formal | `@D`, `@Q`, `@M`, `@IOS` |
| `AI_Agent_AIIntegrationArchitect` | Produto usa LLMs, RAG, evals, prompts em producao | `@A`, `@B`, `@S`, `@P`, `@PR` |
| `REL_Agent_ReleaseManager` | Releases multiambiente, changelog, rollback e coordenacao de deploy | `@O`, `@ENV`, `@X`, `@GSD` |
| `SEO_Agent_GrowthWeb` | Site publico depende de SEO tecnico, schema.org e conteudo indexavel | `@D`, `@I18N`, `@BI` |
| `GOV_Agent_DataPrivacyGeneral` | Compliance fora de UK/pet care, LGPD/GDPR amplo, data retention | `@S`, `@UK`, `@MOD`, `@PAY` |

Decisao atual: nao criar todos agora. O arsenal fica mais forte quando cria
agente sob demanda a partir de uso real, nao quando acumula papeis raramente
acionados.

## Estrategia De Skills

Nao crie uma skill para cada pasta de agente. Skills devem ser enxutas, com
gatilho claro, workflow recorrente e recursos reutilizaveis.

Skills recomendadas para instalar/criar quando voce quiser transformar o kit em
capacidade automatica do Codex:

1. `codex-agent-kit`: usa `AGENTS.md`, `C10_Maestro` e `SUP_Supervisor` para
   operar o portfolio.
2. `gsd-tdd-cli-harness`: aciona `@GSD`, SDD e Harness em implementacoes.
3. `agent-forge`: usa `F_AgentForge` para criar e evoluir agentes sob demanda.

A regra esta documentada em `C10_Maestro/C10_Skill_Strategy.md`.

## Compatibilidade Com Claude Code

O arsenal esta adaptado para Claude Code por uma camada separada:

```text
CLAUDE.md
.claude/
  agents/
    pick-agent-selector.md
    gsd-tdd-cli-auditor.md
    final-validator.md
    security-validator.md
    ...
```

Os arquivos em `.claude/agents/` sao wrappers. Eles tem frontmatter YAML no
formato esperado por Claude Code e apontam para os agentes originais como fonte
da verdade. Isso preserva a organizacao do kit: `.codex/` continua sendo a
biblioteca principal; `.claude/` e apenas adaptador.

Wrappers principais:

- `pick-agent-selector`: ativa o time certo; deve ser usado primeiro em pedidos
  complexos.
- `gsd-tdd-cli-auditor`: gate obrigatorio de implementacao, TDD e Harness CLI.
- `camisa10-maestro`: orquestracao e memoria.
- `cetico`, `impact-validator`, `final-validator`: gates de plano, impacto e
  diff final.
- `security-validator`, `performance-validator`, `test-engineer`: validadores
  especializados.
- wrappers de dominio: backend, design, mobile, iOS, payments, BI, location,
  trust safety, i18n, environment, observability e UK compliance.

Para aplicar em um projeto real:

1. Coloque a pasta `.codex/` na raiz do projeto.
2. Coloque `CLAUDE.md` na raiz do projeto.
3. Coloque `.claude/agents/` na raiz do projeto.
4. Em pedidos complexos ao Claude, comece por:

```text
Use the pick-agent-selector subagent to select the right team for this task.
```

Quando houver implementacao:

```text
Use the gsd-tdd-cli-auditor subagent before and after this implementation.
```

## Metodologias Do Kit

### SDD - Spec-Driven Delivery

SDD e o metodo oficial do kit para transformar pedido em entrega confiavel:

`State -> Spec -> Design -> Doubt -> Develop -> Demonstrate -> Document`

- `State`: entender o estado real por arquivos, status, logs e codigo.
- `Spec`: escrever comportamento esperado e criterio de aceite.
- `Design`: planejar o menor diff, contratos, consumidores e rollback.
- `Doubt`: passar pelo Cético/ImpactValidator e declarar lacunas.
- `Develop`: implementar com escopo pequeno e TDD proporcional.
- `Demonstrate`: provar com Harness CLI, testes, smoke e bug sweep.
- `Document`: registrar status, decisoes e aprendizados.

Arquivo canonico: `C10_Maestro/C10_Method_SDD.md`.

### Harness CLI

Harness e o contrato de prova executavel. Ele transforma "rodei testes" em
evidencia auditavel:

- comando executado;
- diretorio (`cwd`);
- objetivo;
- exit code;
- resultado;
- warnings/falhas relevantes;
- lacunas;
- veredito.

Uma entrega sem Harness pode estar correta, mas ainda nao foi demonstrada.
Arquivo canonico: `SUP_Supervisor/SUP_Method_Harness.md`.

### GSD + TDD

GSD aqui significa Get Stuff Done com prova. O `@GSD` impede que velocidade vire
pressa cega:

- define criterio de aceite;
- pede teste falhando primeiro quando possivel;
- aceita excecao TDD apenas com justificativa;
- roda comandos reais;
- faz bug sweep;
- bloqueia bug conhecido, comando falhando ou lacuna critica.

### Anti-Alucinacao

Todo veredito tecnico deve separar fato observado, inferencia e lacuna. Se um
agente nao leu o arquivo, contrato, comando ou consumidor necessario, ele deve
responder `QUESTIONAR`.

### Gates De Qualidade

O kit nao depende de um unico "revisor magico". Ele empilha gates:

- `@C` revisa plano antes de implementar.
- `impact_validator` mapeia consequencia cross-stack.
- `@GSD` exige prova executavel.
- `@S` e `@P` entram em superficies sensiveis.
- `@Q` transforma risco em teste.
- `final_validator` revisa diff final.
- `@X` audita o processo.

### Memoria Operacional

O Documentador fecha o ciclo. Tudo que vira decisao, erro, padrao ou aprendizado
vai para LOG, STATUS, DECISIONS e LEARNINGS. Essa memoria alimenta o proximo
projeto e reduz repeticao de falhas.

## Regra Final

O arsenal absoluto nao e o que tem mais agentes. E o que ativa o agente certo,
na ordem certa, com evidencia suficiente, e cria novos agentes apenas quando a
lacuna e real.

Para qualquer pedido complexo, comece assim:

```text
@PICK, selecione o time certo para esta tarefa, inclua @GSD se houver
implementacao e acione @F apenas se existir lacuna real.
```
