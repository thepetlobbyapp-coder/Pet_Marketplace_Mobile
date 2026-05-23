# CLAUDE.md - [NOME DO PROJETO]

Este projeto usa o Codex Agent Kit com compatibilidade para Claude Code.

Fonte-mestra:

- `.codex/AGENTS.md`
- `.codex/C10_Maestro/C10_CAMISA10.md`
- `.codex/SUP_Supervisor/SUP_PICK_AgentSelector.md`
- `.codex/GSD_DeliveryDiscipline/GSD_Agent_TDDCLIAuditor.md`

Subagentes Claude:

- `.claude/agents/*.md`

## Regra De Entrada

Para tarefas complexas, ambiguas, multi-area, de implementacao, refatoracao,
bugfix, auditoria, release ou risco medio/alto, use primeiro:

```text
pick-agent-selector
```

Ele seleciona o time certo, ordem de agentes, gates necessarios e lacunas.

## Gates Obrigatorios

- Plano antes de codigo: `cetico` e, quando relevante, `impact-validator`.
- Toda implementacao, bugfix ou refatoracao comportamental: `gsd-tdd-cli-auditor`.
- Seguranca: `security-validator`.
- Performance: `performance-validator`.
- Testes: `test-engineer`.
- Selo final: `final-validator`.
- Processo: `process-guardian`.

## SDD

Siga:

`State -> Spec -> Design -> Doubt -> Develop -> Demonstrate -> Document`

## Harness CLI

Toda entrega relevante deve registrar:

- comando;
- cwd;
- objetivo;
- exit code;
- resultado;
- falhas/warnings relevantes;
- lacunas.

## Organizacao

- `.codex/` contem os agentes originais e metodos.
- `.claude/agents/` contem wrappers para Claude Code.
- Nao mova ou duplique a logica dos agentes originais nos wrappers.
