# Plano de Lapidacao e Guia de Uso dos Agentes

Data: 2026-05-22
Base auditada: `C:\Users\israe\Downloads\.codex`

## Status dos Ajustes

Plano aplicado em 2026-05-22. O documento foi mantido como registro da auditoria
e tambem como guia de uso. As falhas abaixo descrevem o estado encontrado antes
dos ajustes.

## Veredito

O portfolio esta forte no conteudo dos agentes, mas ainda nao esta totalmente
lapidado como sistema. A falha principal nao e de qualidade individual; e de
alinhamento operacional entre catalogo, nomes, aliases, pipeline e referencias.

Os validadores TOML foram carregados com sucesso:
- `P_Performance/P_Agent_PerformanceValidator.toml`
- `S_Seguranca/S_Agent_SecurityValidator.toml`
- `V_Validation/V_Agent_ImpactValidator.toml`
- `V_Validation/V_Agent_FinalValidator.toml`

## Falhas Encontradas

### 1. Catalogo raiz incompleto

O `AGENTS.md` ainda nao lista todos os grupos existentes. Pastas presentes, mas
ausentes no catalogo:

- `BUG_Debugger`
- `C_Cetico`
- `F_AgentForge`
- `GEO_Location`
- `I18N_LocalizationUX`
- `MOD_TrustSafety`
- `PAY_PaymentsMarketplace`
- `SUP_Supervisor`
- `UK_CompliancePetCare`

Impacto: o usuario pode ter agentes bons instalados, mas nao saber quando
aciona-los. O seletor de agentes tambem pode trabalhar com mapa incompleto.

### 2. Backend marcado como reservado mesmo existindo

No `AGENTS.md`, `B_` ainda aparece como `reservado`, mas existe
`B_BackendDomain/B_Agent_BackendDomain.md`.

Impacto: contradicao direta no catalogo. O usuario pode deixar de acionar o
agente de backend mesmo quando a tarefa pede API, dominio, DTOs, permissoes ou
contratos.

### 3. Caminho antigo do PromptRefiner

O catalogo aponta para:

`PR_PromptOps/PR_Agent_PromptRefiner.md`

Mas o arquivo real e:

`PR_PromptOps/PR_Agent_PromptRefiner_v2.md`

Impacto: referencia quebrada para um agente central de PromptOps.

### 4. Debugger fora do padrao

A pasta e `BUG_Debugger`, mas o agente declara:

- `name: DEB_Debugger`
- titulo `DEB_Debugger`
- arquivo `AGENT-1.md`

Tambem referencia arquivos em `references/...`, mas os arquivos reais estao na
propria pasta `BUG_Debugger/`.

Impacto: quebra o contrato de nomenclatura do kit e cria referencias internas
incorretas.

### 5. Supervisores criados, mas nao integrados ao catalogo raiz

`SUP_Supervisor/SUP_INTEGRATION_GUIDE.md` diz explicitamente para adicionar
prefixos e aliases ao `AGENTS.md`, mas essa integracao ainda nao foi aplicada.

Aliases definidos:
- `@PICK`
- `@X`
- `@R`
- `@FLOW`
- `@STD`
- `@ENV`
- `@CRED`

Impacto: a camada de supervisao e boa, mas fica parcialmente invisivel para o
fluxo principal.

### 6. Prefixos SUP internos divergem dos arquivos

Os arquivos seguem `SUP_`, por exemplo:

- `SUP_PICK_AgentSelector.md`
- `SUP_X_ProcessGuardian.md`
- `SUP_RiskMarshal.md`

Mas os agentes se identificam internamente como `PICK_AgentSelector`,
`X_ProcessGuardian`, `R_RiskMarshal`, etc.

Impacto: nao e necessariamente erro fatal, mas precisa virar regra explicita:
`SUP_` como familia de pasta/arquivo, aliases `@PICK`, `@X`, `@R`, etc. como
mencoes operacionais.

### 7. Documentos antigos ficaram defasados

`AUDIT_AGENTES.md` e `GUIA_COMPLETO_CODEX_AGENT_KIT.md` ainda refletem uma
lapidacao anterior. Eles citam agentes antigos ou deixam de fora os grupos novos.

Impacto: ha risco de o usuario seguir o guia antigo e ignorar o portfolio atual.

## Plano de Ajuste

### Fase 1 - Corrigir o contrato raiz

1. Atualizar `AGENTS.md` com todos os prefixos existentes:
   `BUG_`, `C_`, `F_`, `GEO_`, `I18N_`, `MOD_`, `PAY_`, `SUP_`, `UK_`.
2. Trocar `B_ = reservado` por `B_BackendDomain/B_Agent_BackendDomain.md`.
3. Corrigir o caminho de `PR_Agent_PromptRefiner_v2.md`.
4. Adicionar a secao de aliases:
   `@BUG`, `@C`, `@F`, `@GEO`, `@I18N`, `@MOD`, `@PAY`, `@SUP`, `@UK`,
   alem dos aliases internos de supervisao.

### Fase 2 - Normalizar o Debugger

1. Escolher um prefixo oficial: recomendado `BUG_`.
2. Renomear `BUG_Debugger/AGENT-1.md` para `BUG_Debugger/BUG_Agent_Debugger.md`.
3. Alterar identidade interna de `DEB_Debugger` para `BUG_Agent_Debugger`, ou
   documentar `DEB` como alias legado.
4. Corrigir referencias `references/...` para:
   - `BUG_Debugger/patterns-bugs-comuns.md`
   - `BUG_Debugger/checklist-ambiente.md`
   - `BUG_Debugger/sql-diagnostico.md`
   - `BUG_Debugger/erros-vercel.md`

### Fase 3 - Integrar os Supervisores

1. Manter `SUP_` como familia oficial.
2. Documentar aliases operacionais:
   - `@PICK` -> `SUP_PICK_AgentSelector.md`
   - `@X` -> `SUP_X_ProcessGuardian.md`
   - `@R` -> `SUP_RiskMarshal.md`
   - `@FLOW` -> `SUP_FLOW_DeliveryInspector.md`
   - `@STD` -> `SUP_STD_StandardsEnforcer.md`
   - `@ENV` -> `SUP_ENV_StatusRadar.md`
   - `@CRED` -> `SUP_CRED_AccessGatekeeper.md`
3. Atualizar `SUP_PICK_AgentSelector.md` para deixar de marcar `B_` como
   reservado.
4. Atualizar `C10_CAMISA10.md` para reconhecer os novos agentes de dominio e a
   camada SUP.

### Fase 4 - Atualizar documentacao legada

1. Atualizar ou marcar como legado:
   - `AUDIT_AGENTES.md`
   - `GUIA_COMPLETO_CODEX_AGENT_KIT.md`
2. Registrar data da nova auditoria.
3. Criar uma tabela unica de agentes, aliases, quando acionar e validadores
   recomendados.

### Fase 5 - Validar mecanicamente

Rodar estes checks apos os ajustes:

```powershell
rg --files
rg -n "PR_Agent_PromptRefiner.md|references/|DEB_Debugger|reservado" .
python - <<'PY'
import pathlib, tomllib
for p in pathlib.Path('.').rglob('*.toml'):
    tomllib.loads(p.read_text(encoding='utf-8'))
    print('OK', p)
PY
```

Criterio de aceite:
- Todo prefixo de pasta aparece no `AGENTS.md`.
- Todo alias mencionado aponta para arquivo real.
- Nenhum agente essencial aponta para arquivo inexistente.
- Validadores TOML continuam validos.
- O pipeline raiz inclui selecao, planejamento, validacao, execucao, QA,
  selo final e documentacao.

## Guia de Uso dos Agentes

### Orquestracao, memoria e governanca

| Agente | O que faz | Boas praticas de uso |
|---|---|---|
| `C10_Maestro/C10_CAMISA10.md` | Orquestra o projeto, fase, memoria, briefings e escolha de agentes. | Use no inicio de ciclos, features grandes e retomadas de projeto. Entregue contexto, objetivo e estado atual. |
| `C10_Maestro/C10_DOCUMENTADOR.md` | Fecha ciclos registrando LOG, STATUS, DECISIONS e LEARNINGS. | Use apos entrega validada, bug relevante, decisao arquitetural ou aprendizado reutilizavel. |
| `C_Cetico/C_Agent_Cetico.md` | Revisa planos antes de implementar e exige evidencia do codigo real. | Use antes de feature, refatoracao, auth, schema, pagamento, deploy ou mudanca cross-stack. |

### Supervisao de processo

| Agente | O que faz | Boas praticas de uso |
|---|---|---|
| `SUP_PICK_AgentSelector.md` (`@PICK`) | Escolhe o time certo de agentes para cada tarefa. | Use antes de qualquer tarefa ambigua ou de risco medio/alto. Deve reduzir excesso e detectar lacunas. |
| `SUP_X_ProcessGuardian.md` (`@X`) | Audita progresso, risco, ambientes, qualidade e continuidade. | Use em auditorias gerais, antes de deploy ou apos entregas relevantes. |
| `SUP_RiskMarshal.md` (`@R`) | Lista riscos com score, impacto, probabilidade e mitigacao. | Use quando houver risco tecnico, financeiro, legal, operacional ou de seguranca. |
| `SUP_FLOW_DeliveryInspector.md` (`@FLOW`) | Verifica ordem correta de entrega e dependencia entre etapas. | Use quando o projeto parecer avancar fora de ordem ou acumulando divida. |
| `SUP_STD_StandardsEnforcer.md` (`@STD`) | Cobra padroes declarados, inferidos e universais. | Use depois de implementacao ou em refatoracoes. Nao deve impor gosto pessoal. |
| `SUP_ENV_StatusRadar.md` (`@ENV`) | Mapeia local, dev, staging e prod, incluindo drift entre ambientes. | Use antes de deploy, migracao, troca de env ou incidente de ambiente. |
| `SUP_CRED_AccessGatekeeper.md` (`@CRED`) | Valida credenciais e acesso antes de usar servicos externos. | Use antes de API, banco remoto, painel, deploy, navegador autenticado ou producao. Nunca expor valores. |

### Arquitetura, backend e dominio

| Agente | O que faz | Boas praticas de uso |
|---|---|---|
| `A_Architecture/A_Agent_CrossStackArchitect.md` | Define fronteiras, contratos, camadas, idempotencia e riscos cross-stack. | Use antes de criar API, schema, auth, jobs, webhooks ou integracoes. |
| `B_BackendDomain/B_Agent_BackendDomain.md` | Cuida de API, regras de negocio, DTOs, permissoes e dominio backend. | Use para endpoints, services, modules, repositories e regras que nao devem ficar no mobile/admin. |
| `GEO_Location/GEO_Agent_Location.md` | Modela endereco, coordenadas, raio, PostGIS e privacidade geografica. | Use para busca por proximidade, maps, autocomplete, GPS, postcode e protecao de endereco. |
| `PAY_PaymentsMarketplace/PAY_Agent_PaymentsMarketplace.md` | Prepara pagamentos, Stripe Connect, comissao, ledger, webhooks e riscos regulados. | Use quando aparecer pagamento, split, payout, refund, disputa, escrow ou taxa. |
| `MOD_TrustSafety/MOD_Agent_TrustSafety.md` | Desenha denuncias, moderacao, bloqueio, avaliacoes e abuso. | Use para chat, conteudo de usuario, mural, reviews, reports e admin moderation. |
| `UK_CompliancePetCare/UK_Agent_CompliancePetCare.md` | Traduz riscos UK, Play Store, privacidade e pet care em requisitos. | Use para dados pessoais, localizacao, Play Store, termos, UK GDPR e escopo regulado. |

### Produto, frontend, mobile e BI

| Agente | O que faz | Boas praticas de uso |
|---|---|---|
| `D_Design/D_Agent_Design.md` | Melhora UI/UX preservando logica, contratos, acessibilidade e performance. | Use para telas, componentes, responsividade e refinamento visual. Sempre ler handlers e estados antes de editar. |
| `M_MobilePlaystore/M_Agent_MobilePlaystore.md` | Cuida de React Native, Expo, Android, Play Store, release e mobile offline. | Use para app mobile, EAS, permissoes, Data Safety, release e fluxos Android. |
| `BI_Dashboards/BI_Agent_DashboardDesigner.md` | Cria metricas, dashboards, filtros, fonte da verdade e QA de BI. | Use para relatorios, indicadores, graficos, dashboards e dicionario de metricas. |
| `I18N_LocalizationUX/I18N_Agent_LocalizationUX.md` | Estrutura i18n, ingles britanico, UX writing e textos Play Store. | Use quando houver texto de UI, erro, email, notificacao, politicas ou copy em ingles. |

### Ambiente, deploy e observabilidade

| Agente | O que faz | Boas praticas de uso |
|---|---|---|
| `E_Environment/E_Agent_Environment.md` | Gerencia variaveis e secrets na Vercel. | Use para Vercel, env vars, frontend/backend separados e cross-check de secrets. |
| `E_Environment/E_Agent_DigitalOceanEnvironment.md` | Gerencia DigitalOcean, App Platform, plans, envs e custo. | Use para DigitalOcean, droplets, managed DBs, app spec e escolha de plano. |
| `O_Observability/O_Agent_DeployObservability.md` | Define logs, metricas, traces, alertas, rollback e smoke test. | Use antes de deploy, em incidentes, jobs, webhooks, filas e operacao critica. |

### Validadores e qualidade

| Agente | O que faz | Boas praticas de uso |
|---|---|---|
| `V_Validation/V_Agent_ImpactValidator.toml` | Valida plano antes de implementar, mapeando impacto cross-stack. | Use antes de mudancas relevantes. Delegar para `@S` ou `@P` quando detectar superficie especifica. |
| `V_Validation/V_Agent_FinalValidator.toml` | Revisa diff final contra plano, escopo, regressao, seguranca, performance e testes. | Use antes de merge/deploy. Forneca plano original, diff, arquivos alterados e comandos rodados. |
| `S_Seguranca/S_Agent_SecurityValidator.toml` | Valida seguranca, auth, PII, secrets, permissoes, uploads e pagamentos. | Use em qualquer superficie sensivel. Nao aceitar veredito sem evidencia. |
| `P_Performance/P_Agent_PerformanceValidator.toml` | Valida hot paths, cache, queries, concorrencia, custos e escalabilidade. | Use quando tocar lista grande, query, cache, imagem, fila, payload ou custo. |
| `Q_Quality/Q_Agent_TestEngineer.md` | Converte risco em matriz de testes e criterios de aceite. | Use antes de fechar feature, release, bugfix critico ou quando o validador final apontar falta de cobertura. |

### PromptOps, debug e fabrica

| Agente | O que faz | Boas praticas de uso |
|---|---|---|
| `PR_PromptOps/PR_Agent_PromptRefiner_v2.md` | Transforma pedido confuso em prompt cirurgico, validavel e seguro. | Use para gerar briefing, prompt de investigacao, plano, implementacao, hotfix ou validacao. |
| `BUG_Debugger/BUG_Agent_Debugger.md` | Diagnostica bugs full-stack com triagem, causa raiz, pre-validacao, fix e pos-validacao. | Usar para erros, regressao, 4xx/5xx, UI quebrada, auth, ambiente e dados inconsistentes. |
| `F_AgentForge/F_Agent_Foreman.md` | Orquestra criacao de agente sob demanda. | Use quando nenhum agente existente cobre a tarefa. Nao usar para tarefas triviais. |
| `F_AgentForge/F_Agent_ContextScanner.md` | Le contexto, status, stack e regras antes de criar agente. | Deve ser o primeiro passo da fabrica. |
| `F_AgentForge/F_Agent_AgentArchitect.md` | Projeta blueprint do agente novo. | Use depois do ContextScanner, antes de escrever o agente. |
| `F_AgentForge/F_Agent_AgentComposer.md` | Escreve o arquivo do agente novo. | Use com blueprint e contexto completos. |
| `F_AgentForge/F_Agent_WorkAuditor.md` | Audita o trabalho feito pelo agente criado. | Use apos execucao do agente criado, antes de promover ou reutilizar. |
| `F_AgentForge/F_Agent_Lifecycle.md` | Define ciclo de vida, promocao, memoria e diario de agentes. | Use quando agente sob demanda virar recorrente. |

## Pipeline Recomendado Apos Ajustes

1. `@PICK` seleciona agentes e detecta lacunas.
2. `@CRED` entra se houver acesso externo, ambiente, API, banco, navegador ou producao.
3. `@C10` organiza fase, brief e memoria.
4. `@A` valida arquitetura quando houver fronteira, contrato ou sistema desacoplado.
5. `@C` revisa plano contra codigo real.
6. `@V` ImpactValidator mapeia impacto antes da implementacao.
7. `@S`, `@P`, `@UK`, `@GEO`, `@PAY`, `@MOD` entram por superficie especifica.
8. Executor especializado implementa ou orienta: `@B`, `@D`, `@M`, `@E`, `@BI`,
   `@I18N`, `@O`, `@BUG`, etc.
9. `@Q` define e valida testes.
10. `@STD` e `@FLOW` verificam padrao e ordem quando necessario.
11. `@V` FinalValidator revisa o diff final.
12. `@X` entra em modo FOCUSED para entregas relevantes ou FULL em auditorias.
13. `C10_DOCUMENTADOR` fecha LOG, STATUS, DECISIONS e LEARNINGS.

## Boas Praticas Gerais

- Sempre ler codigo real antes de aprovar plano, diff ou arquitetura.
- Separar fato observado, inferencia e lacuna.
- Acionar apenas agentes que agregam para a tarefa; excesso tambem gera ruido.
- Usar `@F` apenas quando a lacuna for real e recorrente.
- Nunca acessar producao sem `@CRED` e confirmacao explicita.
- Nunca tratar guias de preco, leis, politicas de loja ou APIs externas como
  eternos; confirmar fonte atual quando a decisao depender disso.
- Encerrar entregas relevantes com teste, validacao final e documentacao.
