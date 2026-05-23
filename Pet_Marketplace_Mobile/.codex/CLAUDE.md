# Claude Code Adapter - Codex Agent Kit

Este arquivo adapta o Codex Agent Kit para uso no Claude Code sem alterar a
estrutura original do arsenal.

Fonte-mestra do kit:

- `AGENTS.md`
- `C10_Maestro/C10_CAMISA10.md`
- `SUP_Supervisor/SUP_PICK_AgentSelector.md`
- `GSD_DeliveryDiscipline/GSD_Agent_TDDCLIAuditor.md`

Camada Claude:

- `.claude/agents/*.md`

Os arquivos em `.claude/agents/` sao wrappers. Eles existem para o Claude Code
delegar tarefas automaticamente, mas nao substituem os agentes originais. Quando
houver conflito, siga o documento original do agente em `.codex/` ou, quando
rodando dentro desta pasta, no caminho local correspondente.

## Regra De Entrada

Para tarefas complexas, ambiguas, multi-area, de implementacao, refatoracao,
bugfix, auditoria, release ou risco medio/alto:

1. Use primeiro o subagente `pick-agent-selector`.
2. Ele deve selecionar o time certo e a ordem de acionamento.
3. Se houver implementacao, bugfix ou refatoracao comportamental, inclua
   `gsd-tdd-cli-auditor`.
4. Se nenhum agente existente cobrir uma lacuna real, use
   `agent-forge-foreman`.

## Gates Obrigatorios

- Antes de implementar: `cetico` e, se relevante, `impact-validator`.
- Durante implementacao: `gsd-tdd-cli-auditor`.
- Superficies sensiveis: `security-validator`, `performance-validator`,
  `payments-marketplace`, `trust-safety`, `uk-compliance-petcare`, conforme o caso.
- Antes de fechar: `gsd-tdd-cli-auditor`, `test-engineer` quando houver lacunas
  de teste, e `final-validator`.
- Auditoria de processo: `process-guardian`.

## Metodo SDD

Use o metodo SDD do kit:

`State -> Spec -> Design -> Doubt -> Develop -> Demonstrate -> Document`

Arquivo canonico:

- `C10_Maestro/C10_Method_SDD.md`

## Metodo Harness

Toda implementacao relevante precisa de prova executavel:

- comando;
- cwd;
- objetivo;
- exit code;
- resultado;
- falhas/warnings relevantes;
- lacunas.

Arquivo canonico:

- `SUP_Supervisor/SUP_Method_Harness.md`

Template:

- `T_Templates/T_Template_CLI_AUDIT.md`

## Politica De Organizacao

- Nao mova, renomeie ou reescreva os agentes originais para adequar ao Claude.
- Atualize wrappers em `.claude/agents/` apenas quando mudar o roteamento ou a
  descricao de acionamento.
- Atualize os agentes originais quando mudar regra, metodo, protocolo ou
  conteudo de dominio.
- Preserve a pasta `.codex/` como biblioteca principal.

## Comandos De Uso

Exemplos de pedidos ao Claude Code:

```text
Use the pick-agent-selector subagent to select the right team for this task.
```

```text
Use the gsd-tdd-cli-auditor subagent before and after this implementation.
```

```text
Use the final-validator subagent to review this diff before merge.
```

## Observacao Para Projetos

Em um projeto real, este arquivo deve ficar na raiz do projeto como `CLAUDE.md`,
ao lado de `.claude/agents/` e da pasta `.codex/`.
