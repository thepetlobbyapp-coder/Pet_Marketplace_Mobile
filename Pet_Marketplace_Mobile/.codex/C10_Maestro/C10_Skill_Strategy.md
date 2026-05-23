# Estrategia De Skills Do Agent Kit

Este kit nao deve criar uma skill para cada pasta de agente por padrao.

Skills sao melhores quando carregam um workflow recorrente, enxuto e acionavel.
Agentes sao melhores quando representam papeis, criterios de decisao e
especialidades dentro do pipeline.

---

## Decisao

Nao criar skill por pasta.

Criar skills apenas quando houver:

- Gatilho recorrente claro.
- Workflow que Codex deve executar automaticamente.
- Recursos reutilizaveis que evitam reescrever scripts, referencias ou templates.
- Baixa duplicacao com documentos ja presentes na pasta `.codex/`.

---

## Skills Recomendadas

1. `codex-agent-kit`
   - Aciona quando o usuario pede para usar, auditar ou evoluir o kit.
   - Le `AGENTS.md`, `C10_Maestro`, `SUP_Supervisor` e catalogo de agentes.

2. `gsd-tdd-cli-harness`
   - Aciona em implementacao, bugfix e refatoracao.
   - Usa `GSD_DeliveryDiscipline/GSD_Agent_TDDCLIAuditor.md`,
     `C10_Method_SDD.md` e `SUP_Method_Harness.md`.

3. `agent-forge`
   - Aciona quando o usuario pede para criar, evoluir ou promover agentes.
   - Usa `F_AgentForge`.

---

## Quando Promover Uma Pasta Para Skill

Promova somente se a pasta:

- For usada em varios projetos.
- Tiver instrucoes estaveis.
- Tiver referencias ou scripts que devem ser carregados sob demanda.
- Nao depender de todo o contexto do kit para funcionar.

Se a pasta e apenas um agente especializado, mantenha como agente.

---

## Proximo Passo Para Criar Skills Reais

Quando o usuario pedir explicitamente, criar as skills em `$CODEX_HOME/skills`
ou no caminho escolhido pelo usuario, seguindo `skill-creator`:

1. Definir exemplos de uso.
2. Inicializar com `init_skill.py`.
3. Manter `SKILL.md` com menos de 500 linhas.
4. Referenciar arquivos do kit em vez de duplicar conteudo.
5. Validar com `quick_validate.py`.
