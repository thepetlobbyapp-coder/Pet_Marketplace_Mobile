# Codex Agent Kit - Catalogo Mestre

Este arquivo e o ponto de entrada da pasta `.codex/`. Use-o como catalogo e como contrato minimo de qualidade para qualquer projeto que receba este kit.

Importante: para o Codex carregar instrucoes automaticamente ao trabalhar na raiz do projeto, copie ou adapte `C10_Maestro/C10_Agent_ProjectRules.md` para `PROJECT_ROOT/AGENTS.md`. A pasta `.codex/` funciona como biblioteca de agentes, templates e validadores para mencionar no chat.

## Padrao de Nomenclatura

Todo agente deve usar o prefixo semantico no nome da pasta e do arquivo:

| Prefixo | Area | Exemplo |
|---|---|---|
| `C10_` | Maestro, orquestracao e memoria do projeto | `C10_Maestro/C10_CAMISA10.md` |
| `A_` | Arquitetura cross-stack | `A_Architecture/A_Agent_CrossStackArchitect.md` |
| `B_` | Backend, API e dominio | `B_BackendDomain/B_Agent_BackendDomain.md` |
| `BI_` | Business Intelligence, metricas e dashboards | `BI_Dashboards/BI_Agent_DashboardDesigner.md` |
| `BUG_` | Debug cirurgico full-stack | `BUG_Debugger/BUG_Agent_Debugger.md` |
| `C_` | Cetico cirurgico e revisao de planos | `C_Cetico/C_Agent_Cetico.md` |
| `D_` | Design, UX e frontend visual | `D_Design/D_Agent_Design.md` |
| `E_` | Environment, secrets e deploy vars | `E_Environment/E_Agent_Environment.md`, `E_Environment/E_Agent_DigitalOceanEnvironment.md` |
| `F_` | Fabrica de agentes sob demanda | `F_AgentForge/F_Agent_Foreman.md` |
| `GEO_` | Localizacao, enderecos, raio e proximidade | `GEO_Location/GEO_Agent_Location.md` |
| `I18N_` | Localizacao, ingles de produto e UX writing | `I18N_LocalizationUX/I18N_Agent_LocalizationUX.md` |
| `M_` | Mobile React Native + Expo | `M_MobilePlaystore/M_Agent_MobilePlaystore.md` |
| `MOD_` | Trust & Safety, denuncias e moderacao | `MOD_TrustSafety/MOD_Agent_TrustSafety.md` |
| `O_` | Observabilidade, deploy e operacao | `O_Observability/O_Agent_DeployObservability.md` |
| `P_` | Performance e escalabilidade | `P_Performance/P_Agent_PerformanceValidator.toml` |
| `PAY_` | Pagamentos, marketplace e monetizacao | `PAY_PaymentsMarketplace/PAY_Agent_PaymentsMarketplace.md` |
| `PR_` | Prompt engineering, briefing e refinamento de pedidos | `PR_PromptOps/PR_Agent_PromptRefiner_v2.md` |
| `Q_` | QA, testes e confiabilidade | `Q_Quality/Q_Agent_TestEngineer.md` |
| `S_` | Seguranca | `S_Seguranca/S_Agent_SecurityValidator.toml` |
| `SUP_` | Supervisao, selecao de agentes, riscos, padroes e ambientes | `SUP_Supervisor/SUP_INTEGRATION_GUIDE.md` |
| `T_` | Templates reutilizaveis | `T_Templates/T_Template_PROJECT.md` |
| `UK_` | Compliance UK, Play Store e pet care | `UK_CompliancePetCare/UK_Agent_CompliancePetCare.md` |
| `V_` | Validacao de impacto e selo final | `V_Validation/V_Agent_ImpactValidator.toml` |

Regra: nomes de pasta e arquivo devem evitar acentos e espacos para funcionar bem em Windows, Linux, CI/CD, scripts e automacoes.

## Pipeline Recomendado

1. `SUP_Supervisor/SUP_PICK_AgentSelector.md`: seleciona o time certo de agentes e detecta lacunas.
2. `SUP_Supervisor/SUP_CRED_AccessGatekeeper.md`: entra antes de qualquer acesso externo, API, banco, navegador, deploy ou producao.
3. `C10_Maestro`: entende o projeto, define fase, monta brief e coordena.
4. `A_Architecture`: valida desenho desacoplado, contratos, fronteiras e riscos antes de codar.
5. `C_Cetico`: revisa plano contra codigo real antes da implementacao.
6. `V_Validation/impact_validator`: revisa plano e impacto cross-stack.
7. `S_Seguranca/security_validator`: entra quando tocar auth, PII, secrets, upload, headers, permissoes ou pagamentos.
8. `P_Performance/performance_validator`: entra quando tocar hot path, cache, queries, listas grandes, imagens, filas, concorrencia ou custo.
9. Agente executor especializado: `B_BackendDomain`, `D_Design`, `E_Environment`, `GEO_Location`, `I18N_LocalizationUX`, `M_MobilePlaystore`, `MOD_TrustSafety`, `PAY_PaymentsMarketplace`, `BI_Dashboards`, `BUG_Debugger`, etc.
10. `Q_Quality`: cria/ajusta plano de testes e cenarios de regressao.
11. `SUP_Supervisor/SUP_STD_StandardsEnforcer.md` e `SUP_Supervisor/SUP_FLOW_DeliveryInspector.md`: verificam padrao e ordem quando necessario.
12. `V_Validation/final_validator`: revisa diff final antes de merge/deploy.
13. `SUP_Supervisor/SUP_X_ProcessGuardian.md`: entra em modo FOCUSED para entregas relevantes ou FULL em auditorias.
14. `C10_DOCUMENTADOR`: registra LOG, STATUS, ADRs e aprendizados.

## Regras Globais Extraidas do Guia Vibe Coding

Todo agente desta pasta deve proteger a base oculta do iceberg, nao apenas a ponta visual do MVP.

- Projetar para sistemas desacoplados: frontend, backend e banco com contratos claros.
- Nunca dar acesso de escrita/exclusao em banco de producao para agente autonomo.
- Separar ambientes local, homologacao/staging e producao.
- Tratar entrada externa como nao confiavel: validar, sanitizar e autorizar.
- Usar idempotencia em acoes criticas, especialmente pagamentos, webhooks, filas e retries.
- Aplicar deduplicacao contra duplo clique, reenvio de formulario e eventos repetidos.
- Usar operacoes atomicas/transacoes quando uma mudanca depende de varias etapas.
- Implementar retry com exponential backoff, limite de tentativas e timeout.
- Prevenir race conditions com locks, constraints, transacoes ou filas quando houver concorrencia.
- Paginar listas e logs; nunca carregar tudo por padrao.
- Medir antes de otimizar quando possivel; otimizar hot paths, nao preferencias esteticas.
- Incluir observabilidade: logs estruturados, metricas, traces e alertas para fluxos criticos.
- Rodar validacoes possiveis antes de fechar: build, lint, typecheck, testes e smoke test.

## Politica de Execucao no Codex

- Antes de editar: ler arquivos completos relevantes, mapear dependencias e proteger mudancas do usuario.
- Antes de dar veredito: separar fato observado, inferencia e lacuna. Vereditos tecnicos precisam citar arquivos, simbolos, linhas ou comandos que sustentam a conclusao.
- Nenhum agente deve aprovar plano, diff, arquitetura, seguranca, performance ou release apenas por padrao generico. Se faltam arquivos ou contexto, o veredito correto e `QUESTIONAR`.
- Durante a implementacao: escopo pequeno, sem refatoracao lateral e sem dependencias pesadas sem justificativa.
- Depois de editar: validar com comandos reais do projeto quando existirem.
- Ao encontrar erro preexistente: documentar claramente, sem mascarar como sucesso.
- Ao tocar secrets: nunca imprimir valores, nunca criar `NEXT_PUBLIC_` com segredo, nunca hardcodar credencial.

## Padrao Anti-Alucinacao

Todo agente cirurgico deve trabalhar com esta cadeia:

1. Ler contexto do projeto.
2. Localizar arquivos e fluxos afetados.
3. Ler codigo real antes de opinar.
4. Rastrear consumidores e contratos.
5. Confrontar proposta contra evidencia.
6. Declarar lacunas explicitamente.
7. Emitir veredito proporcional ao que foi comprovado.

## Como Mencionar

Use o prefixo para marcar rapido no chat:

- `@C10` para orquestrar.
- `@A` para arquitetura.
- `@B` para backend, API e dominio.
- `@BI` para dashboards, metricas e business intelligence.
- `@BUG` para debug cirurgico full-stack.
- `@C` para revisao cetica de planos.
- `@D` para design/frontend visual.
- `@E` para environment/Vercel/DigitalOcean/secrets.
- `@F` para criar agente sob demanda com AgentForge.
- `@GEO` para localizacao, enderecos, raio e proximidade.
- `@I18N` para i18n, ingles de produto e UX writing.
- `@M` para mobile Expo/Play Store.
- `@MOD` para trust & safety, denuncias e moderacao.
- `@P` para performance.
- `@PAY` para pagamentos, marketplace e monetizacao.
- `@PR` para transformar ideias em prompts cirurgicos.
- `@Q` para testes.
- `@S` para seguranca.
- `@UK` para compliance UK, Play Store e pet care.
- `@V` para validacao de impacto/final.

Aliases internos da camada `SUP_`:

- `@PICK` para selecao de agentes.
- `@X` para auditoria geral de processo.
- `@R` para analise de riscos.
- `@FLOW` para inspecao de fluxo de entrega.
- `@STD` para fiscalizacao de padroes.
- `@ENV` para radar de ambientes.
- `@CRED` para validacao de credenciais e acesso.
