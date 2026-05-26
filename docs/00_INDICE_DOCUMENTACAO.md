# Índice da Documentação — Pet Marketplace UK

**Versão:** 1.1  
**Projeto:** Marketplace de cuidadores de pets no Reino Unido  
**Idioma de trabalho:** pt-BR  
**Idioma final do app:** en-GB  
**Prioridade:** Android / Google Play Store primeiro

---

## Objetivo desta pasta

Esta pasta concentra a documentação necessária para alinhar cliente, desenvolvimento, agentes `.codex`, Play Store e evolução futura para Apple App Store.

A documentação deve ser mantida junto com o código. Qualquer mudança relevante no escopo, comportamento, dados coletados, permissões, fluxo de usuário, design ou publicação deve ser refletida aqui antes de virar implementação.

---

## Ordem recomendada de leitura

1. `01_ESCOPO_CLIENTE_LINGUAGEM_NATURAL.md`  
   Documento comercial/natural para alinhamento com cliente.

2. `02_DOCUMENTACAO_TECNICA_PROJETO.md`  
   Documento técnico geral com decisões travadas, stack e arquitetura.

3. `03_SPEC_PRODUCT.md`  
   Especificação de produto com personas, funcionalidades, regras e limites.

4. `04_SPEC_USER_FLOWS.md`  
   Fluxos passo a passo de tutor, prestador, admin, denúncias, avaliações e conta.

5. `05_SPEC_API.md`  
   Contrato inicial da API NestJS: módulos, rotas, payloads, status e erros.

6. `06_SPEC_DATABASE.md`  
   Modelo de dados, entidades, relacionamentos, PostGIS, índices e auditoria.

7. `07_SPEC_MOBILE.md`  
   Arquitetura mobile React Native + Expo, navegação, estados, permissões e build Android.

8. `08_SPEC_ADMIN.md`  
   Especificação do painel administrativo web.

9. `09_SPEC_DESIGN_SYSTEM.md`  
   Design system, acessibilidade, componentes, tokens e regras para Android/iOS.

10. `10_SPEC_PLAYSTORE_RELEASE.md`  
    Checklist de publicação, Play Console, Data Safety, app access e testes.

11. `11_SPEC_PRIVACY_DATA_SAFETY.md`  
    Dados coletados, finalidade, minimização, segurança, exclusão de conta e UK GDPR.

12. `12_SPEC_OPERATIONS_MODERATION.md`  
    Operação, denúncias, bloqueios, escalonamento e moderação.

13. `13_SPEC_NOTIFICATIONS.md`  
    Matriz de notificações push/in-app/e-mail, eventos e preferências.

14. `14_SPEC_TEST_PLAN.md`  
    Plano de testes, casos críticos, edge cases e critérios de aceite.

15. `15_SPEC_MIGRATIONS_ROLLBACK.md`  
    Migrations, rollback, backups, seeds e ambientes.

16. `16_RISK_REGISTER.md`  
    Riscos técnicos, produto, loja, compliance, operação e mitigação.

17. `17_DOCS_TRACEABILITY_MAP.md`  
    Mapa de dependências entre specs; quando mudar, quais docs atualizar.

18. `18_SPEC_DATABASE_SQL_DRAFT.md`  
    SQL draft das tabelas e enums para base de migrations.

19. `19_SPEC_API_EXAMPLES.md`  
    Exemplos de chamadas cURL, payloads e respostas de API.

20. `20_SPEC_KPIS_SLA.md`  
    KPIs de produto e operação; SLAs para denúncias e suporte.

21. `21_SPEC_TIMELINE_DEPENDENCIES.md`  
    Roadmap de 11 blocos de implementação Fase 1 com dependências.

22. `22_GLOSSARY.md`  
    Termos do projeto em pt-BR e en-GB; evitar confusão entre equipe.

23. `23_PLAYSTORE_DESIGN_POLICY_BRIDGE.md`  
    Ponte entre design visual e políticas Play Store; obrigações por tela.

**← COMEÇAR AQUI PARA FASE 1 COM AGENTES:**

24. `24_CODEX_AGENTS_PHASE1_PROMPTS.md` ⭐  
    Validação da pasta `.codex/` (24 agentes); 10 prompts estruturados e sequenciados para toda Fase 1.

25. `25_MATRIZ_AGENTES_RAPIDA.md` ⭐  
    Referência rápida: situação → qual agente chamar; matriz por bloco de implementação.

26. `26_TEMPLATES_PROMPTS_PRONTOS.md` ⭐  
    13 templates de prompts prontos para copiar e colar, apenas adaptar variáveis.

27. `27_SUMARIO_COMPLETO.md` ⭐  
    Resumo visual de tudo; como começar em 3 passos; roadmap de uso.

## Play Store / Release Readiness

30. `30_PLAYSTORE_RELEASE_READINESS.md`
    Matriz viva de readiness Mobile/Play Store, blockers, smokes e estado por
    checkpoint.

31. `31_PLAYSTORE_HUMAN_DECISION_PACKAGE.md`
    Pacote de decisões humano/legal/produto ainda pendentes para Play Console.

32. `32_SPEC_ASSET_ICON_SPLASH.md`
    Requisitos objetivos para icon/splash 1024x1024 e assets correlatos.

33. `33_PLAYSTORE_APP_ACCESS_REVIEWER_PACKAGE.md`
    Template seguro de App Access para revisão autenticada.

34. `34_PLAYSTORE_LISTING_SCREENSHOT_PACKAGE.md`
    Copy proposta, claims permitidos/proibidos e roteiro seguro de screenshots.

35. `35_PLAYSTORE_REVIEW_FIXTURE_READINESS.md`
    Readiness preliminar da fixture reviewer.

36. `36_PLAYSTORE_REVIEW_FIXTURE_CONFIRMATION.md`
    Confirmação sanitizada da fixture reviewer reutilizável.

37. `37_PLAYSTORE_LEGAL_DATA_SAFETY_CLOSURE.md`
    Fechamento Legal/Data Safety com ressalvas e bloqueios humano/legais.

38. `38_PLAYSTORE_FINAL_SCREENSHOTS_READINESS.md`
    Pacote final preparatório de screenshots `en-GB` após Home real sanitizada.

39. `39_EAS_BUILD_PREFLIGHT_READINESS.md`
    Preflight técnico para EAS build futuro, sem executar build/submissão.

40. `40_EAS_ASSET_AVATAR_PERMISSION_READINESS.md`
    Checkpoint 089: decisão de asset 1024 e postura avatar/permissões antes
    de qualquer EAS real.

---

## Decisões principais já travadas

- O app será para cuidadores de pets no Reino Unido.
- O app nasce em inglês britânico (`en-GB`).
- A documentação interna permanece em português.
- Android / Google Play Store é a primeira prioridade.
- Apple App Store será considerada em etapa posterior.
- Não usar Flutter.
- Mobile: React Native + Expo + TypeScript.
- Backend: NestJS + TypeScript.
- Banco: Supabase PostgreSQL com PostGIS.
- Admin: Next.js + TypeScript.
- Chat Fase 1: somente texto.
- Fase 1: sem pagamento.
- Fase 1: sem upload obrigatório de documentos de prestador.
- Fase 1: sem home boarding comercial.
- Testes iniciais: localmente.
- O backend é a autoridade de regra de negócio.

---

## Como os agentes devem usar estes documentos

Os agentes `.codex` devem:

1. Ler este índice.
2. Ler o escopo natural e a documentação técnica.
3. Gerar specs detalhadas a partir dos arquivos existentes.
4. Não implementar funcionalidade que esteja marcada como fora da Fase 1.
5. Não criar pagamento, Stripe, Wise, Pix, escrow ou split na Fase 1.
6. Não criar promessas de verificação, licença, seguro ou garantia.
7. Manter textos finais do app em inglês britânico.
8. Manter documentação técnica em português.
9. Priorizar conformidade com Play Store desde o primeiro commit.
