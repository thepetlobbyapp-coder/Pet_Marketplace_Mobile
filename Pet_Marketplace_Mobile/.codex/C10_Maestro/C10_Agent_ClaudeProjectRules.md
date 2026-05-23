# Regras Claude Code - Codex Agent Kit

Use este arquivo para gerar `PROJECT_ROOT/CLAUDE.md` quando um projeto for usar
Claude Code junto com o Codex Agent Kit.

## Objetivo

Adaptar o kit para Claude Code sem duplicar nem desorganizar os agentes
originais. Claude deve usar `.claude/agents/*.md` como camada de delegacao, mas
as regras completas continuam nos arquivos da pasta `.codex/`.

## Setup Recomendado No Projeto

```text
PROJECT_ROOT/
  CLAUDE.md
  .claude/
    agents/
      pick-agent-selector.md
      gsd-tdd-cli-auditor.md
      ...
  .codex/
    AGENTS.md
    C10_Maestro/
    SUP_Supervisor/
    ...
```

## Regras

1. Para tarefa complexa, começar por `pick-agent-selector`.
2. Para qualquer implementacao, bugfix ou refatoracao comportamental, usar
   `gsd-tdd-cli-auditor`.
3. Para plano antes de codigo, usar `cetico` e `impact-validator` quando houver
   risco cross-stack.
4. Para superficie sensivel, usar os validadores especializados.
5. Antes de fechar, usar `final-validator`.
6. Para lacuna real sem agente, usar `agent-forge-foreman`.

## Fonte Da Verdade

Wrappers Claude apontam para a fonte original:

- `.codex/AGENTS.md`
- `.codex/C10_Maestro/C10_CAMISA10.md`
- `.codex/SUP_Supervisor/SUP_PICK_AgentSelector.md`
- `.codex/GSD_DeliveryDiscipline/GSD_Agent_TDDCLIAuditor.md`
- demais agentes de dominio conforme necessario.

Se wrapper e fonte original divergirem, atualizar a fonte original primeiro e o
wrapper depois.
