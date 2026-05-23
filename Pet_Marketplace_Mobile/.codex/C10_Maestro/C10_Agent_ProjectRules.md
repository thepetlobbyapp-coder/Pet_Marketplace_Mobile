# Regras do Agente — [NOME DO PROJETO]

> Este arquivo configura o comportamento do agente Claude/Codex neste projeto.
> Lido automaticamente pelo Codex em cada sessão.
> Gerado pelo Camisa10 no onboarding. Atualizado conforme o projeto evolui.

---

## Identidade e Contexto

Você está trabalhando no projeto **[NOME DO PROJETO]**.
Leia `PROJECT.md` para entender o sistema completo antes de qualquer ação.
Leia `STATUS.md` para saber o estado atual e o que está em andamento.
Consulte `LOG.md` (últimas entradas) para contexto recente.

O agente maestro deste projeto é o **Camisa10** (`.codex/C10_Maestro/C10_CAMISA10.md`).
Siga o fluxo de trabalho definido por ele.

---

## Stack do Projeto

- **Frontend:** [ex: Next.js 14 — App Router + TailwindCSS]
- **Backend:** [ex: Express — Vercel Serverless Functions]
- **Banco:** [ex: PostgreSQL via Supabase + Prisma ORM]
- **Hospedagem:** [ex: Vercel (ambos os projetos)]
- **Autenticação:** [ex: Clerk | NextAuth | JWT próprio]

---

## Estrutura de Pastas

```
[Descrever a estrutura de pastas do projeto aqui]

Ex:
/
├── frontend/
│   ├── app/           → App Router (Next.js)
│   ├── components/    → componentes reutilizáveis
│   ├── lib/           → utilitários e configurações
│   └── ...
├── backend/
│   ├── api/           → rotas Express
│   ├── services/      → lógica de negócio
│   ├── prisma/        → schema e migrations
│   └── ...
└── .codex/            → agentes do projeto
```

---

## Convenções do Projeto

### Nomenclatura
- Componentes React: PascalCase (`UserCard.tsx`)
- Funções e variáveis: camelCase (`getUserById`)
- Arquivos de rota: kebab-case (`user-profile/page.tsx`)
- Constantes: UPPER_SNAKE_CASE (`MAX_RETRY_COUNT`)
- Variáveis de ambiente: UPPER_SNAKE_CASE (`DATABASE_URL`)

### Commits
```
feat: [descrição]      → nova funcionalidade
fix: [descrição]       → correção de bug
refactor: [descrição]  → refatoração sem mudança de comportamento
docs: [descrição]      → documentação
chore: [descrição]     → configuração, dependências
test: [descrição]      → testes
```

### Idioma
- Código: inglês (variáveis, funções, comentários técnicos)
- Documentação (.md): português
- Mensagens de erro para o usuário: português

---

## Regras de Comportamento

### O que você DEVE fazer

1. **Ler os arquivos de contexto antes de responder.**
   Sempre verificar PROJECT.md e STATUS.md no início da sessão.

2. **Seguir o fluxo Camisa10.**
   Nenhum plano vai para execução sem passar pelo Cético.
   Nenhuma entrega é fechada sem o Validador confirmar.
   Toda implementação deve passar por GSD/TDD e Harness CLI.

3. **Perguntar quando não tiver certeza.**
   Nunca assumir contexto que não foi lido ou informado.

4. **Sinalizar riscos antes de implementar.**
   Se identificar algo que pode quebrar, duplicar ou causar regressão,
   apontar antes de sugerir qualquer implementação.

5. **Trabalhar com evidência.**
   Toda validação deve citar arquivos, símbolos, fluxos ou comandos que sustentam
   a conclusão. Se faltar contexto, declarar a lacuna em vez de assumir.

6. **Aplicar SDD e Harness.**
   Use `.codex/C10_Maestro/C10_Method_SDD.md` para guiar o ciclo.
   Use `.codex/SUP_Supervisor/SUP_Method_Harness.md` para provar a entrega
   com comandos reais, exit code, resultado e lacunas.

7. **Escrever código defensivo.**
   Tratar erros explicitamente. Nunca deixar `catch` vazio.
   Validar entradas antes de processar.

8. **Manter a separação frontend/backend.**
   Secrets e lógica de negócio: somente no backend.
   `NEXT_PUBLIC_` apenas para valores realmente públicos.

### O que você NUNCA deve fazer

1. **Nunca implementar sem plano revisado pelo Cético.**

2. **Nunca fechar implementação sem Harness CLI.**
   Se comandos reais nao puderem ser rodados, registrar lacuna e prova substituta.

3. **Nunca criar arquivos fora da estrutura de pastas definida**
   sem justificativa explícita e aprovação.

4. **Nunca sobrescrever um arquivo existente sem confirmar.**
   Sempre mostrar o diff antes de aplicar mudanças em arquivos existentes.

5. **Nunca deixar `console.log` de debug em código de produção.**

6. **Nunca colocar valores sensíveis hardcoded no código.**
   Todo secret vai para variável de ambiente.

7. **Nunca assumir que uma tarefa está concluída.**
   Concluída = Validador confirmou.

---

## Sub-agentes Disponíveis

Consultar a pasta `.codex/` para a lista completa e atualizada.

| Agente | Arquivo | Quando acionar |
|---|---|---|
| Camisa10 | `.codex/C10_Maestro/C10_CAMISA10.md` | Sempre — orquestra tudo |
| Cético | `.codex/C_Cetico/C_Agent_Cetico.md` | Antes de implementar |
| Impact Validator | `.codex/V_Validation/V_Agent_ImpactValidator.toml` | Antes de implementar mudanças relevantes |
| GSD/TDD CLI Auditor | `.codex/GSD_DeliveryDiscipline/GSD_Agent_TDDCLIAuditor.md` | Toda implementação, bugfix ou refatoração comportamental |
| Security Validator | `.codex/S_Seguranca/S_Agent_SecurityValidator.toml` | Auth, PII, secrets, permissões, uploads, pagamentos |
| Performance Validator | `.codex/P_Performance/P_Agent_PerformanceValidator.toml` | Cache, queries, hot paths, listas, concorrência |
| Final Validator | `.codex/V_Validation/V_Agent_FinalValidator.toml` | Após implementar, antes de merge/deploy |
| Documentador | `.codex/C10_Maestro/C10_DOCUMENTADOR.md` | Após validar |
| Mobile Playstore | `.codex/M_MobilePlaystore/M_Agent_MobilePlaystore.md` | App React Native + Expo |

---

## Variáveis de Ambiente

Consultar `.codex/E_Environment/E_Agent_Environment.md` para gestão completa.

Regra rápida:
- `NEXT_PUBLIC_` → frontend, valor público
- Sem prefixo → backend, valor privado
- `DATABASE_URL` e secrets → somente no backend, nunca no frontend

---

## Atualizações Deste Arquivo

Este arquivo é atualizado pelo Camisa10 quando:
- O stack muda
- Novas convenções são adotadas
- Novos sub-agentes são adicionados à `.codex/`
- Regras emergem dos LEARNINGS.md e devem ser formalizadas

Versão atual: 1.0
Última atualização: [data do onboarding]
