# Convenção de Commits — Conventional Commits

Formato: `<type>(<scope>): <subject>`

**Types:** `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `build`, `ci`, `perf`, `style`, `revert`.

**Scopes sugeridos:** `back`, `mobile`, `admin`, `docs`, `codex`, `infra`, `bloco0`..`bloco11`.

Exemplos:

```
chore(bloco0): scaffold da fundação do repositório
feat(back): health check do NestJS
docs(codex): sincroniza agentes para os 3 apps
```

Regras:
- Assunto em minúsculas, imperativo, sem ponto final, ≤ 72 chars.
- Idioma do commit: pt-BR (documentação interna).
- Um commit por mudança lógica; não misturar refactor com feature.
- Atualizar `docs/PROGRESS.md` ao fim de cada etapa/bloco.
- Nunca commitar segredos; usar `.env.example`.
