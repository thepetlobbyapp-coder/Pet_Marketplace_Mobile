# Status do MVP - Pet Marketplace UK

**Data:** 19/05/2026  
**Formato:** estimativa executiva em 2 paginas  
**Base consultada:** checkpoints do projeto, status de Backend/DigitalOcean, Banco/Supabase, Admin, Mobile e validacoes recentes.

## Pagina 1 - Percentual por ambiente

**MVP geral estimado: 43% concluido.**

Este percentual mede proximidade de um MVP funcional, nao apenas volume de codigo. Por isso o Mobile, os fluxos de marketplace e os gates de loja pesam bastante.

| Ambiente | Conclusao | O que ja temos pronto |
|---|---:|---|
| Backend/API | 60% | NestJS estruturado, health check publico em DigitalOcean, validacao de ambiente, Supabase integrado, auth/RBAC base, endpoint `/me`, logging/erros, testes e smokes principais passando. |
| Banco/Supabase | 65% | PostGIS e pgcrypto ativos, tabelas base de usuarios/perfis/pets/enderecos/auditoria, RLS ligado, smoke read-only validado e sincronizacao de usuario autenticado testada. |
| Mobile Android | 30% | Base Expo criada em branch mobile, testes/typecheck/lint passando, hardening S1/S2 de permissoes e cleartext validado por manifest/prebuild, SDK/emulador preparado e primeiro build/install iniciado. |
| Admin Web | 25% | Base TypeScript de auth/session, contratos, dashboard/listas/tabelas e testes locais. Ainda nao e painel Next.js real. |
| Infra/Deploy | 60% | Backend online na DigitalOcean com health publico 200, variaveis principais aplicadas e hotfix persistido no repositorio correto do Backend. |
| Play Store/Compliance | 30% | Regras Android iniciais documentadas, permissoes endurecidas, cleartext bloqueado fora de loopback/emulador, docs de seguranca/release atualizados no Mobile. |
| Docs/Governanca | 85% | Documentacao tecnica e checkpoints fortes, regras de cascata definidas, status e logs de progresso mantidos. |

## Leitura rapida

O projeto ja tem uma fundacao tecnica real: Backend e Banco estao acima da metade do caminho para o MVP, e o deploy do Backend ja responde publicamente. O maior gargalo agora e transformar essa fundacao em experiencia de usuario completa no Mobile e em operacao minima no Admin.

O MVP ainda nao deve ser apresentado como pronto para cliente final ou loja. Ele esta em fase de construcao funcional: a arquitetura existe, partes criticas foram validadas, mas os fluxos centrais do marketplace ainda precisam ser implementados e provados de ponta a ponta.

<div style="page-break-after: always;"></div>

# Pagina 2 - O que falta para o MVP

## Falta para considerar MVP funcional

| Frente | O que falta |
|---|---|
| Mobile | Login real conectado ao Backend, logout, limpeza segura de token, estados 401/403/offline, navegacao principal, telas reais de tutor/prestador, pets, busca, agendamentos e chat texto. |
| Backend/API | Endpoints de marketplace alem de `/me`: perfis completos, pets, servicos, busca por localizacao, disponibilidade, bookings, chat texto, avaliacoes, denuncias e regras de autorizacao por fluxo. |
| Banco/Supabase | Refinar schema/policies conforme fluxos reais, seeds controladas, disponibilidade/agendamentos/chat/reviews/reports e validacoes de privacidade por caso de uso. |
| Admin | Inicializar painel web real, login admin, dashboard operacional, listagens, detalhe de usuario/prestador, moderacao de reports e ferramentas minimas de suporte. |
| Infra | Definir `CORS_ALLOWED_ORIGINS`, ajustar remotes locais, criar pipeline confiavel por app e provar deploys sem depender de workarounds manuais. |
| Android/Play Store | Smoke real visual completo no emulador/device, build EAS/AAB, targetSdk provado no artefato final, politica de privacidade publica, exclusao de conta, Data Safety e App Access para revisao. |

## Ordem natural recomendada

1. Fechar smoke real do Mobile instalado no emulador/device: app abre, nao crasha, tela inicial carrega e logs nao mostram erro fatal.
2. Provar build Android de release via EAS quando houver conta/configuracao pronta.
3. Iniciar Bloco 4 Mobile Auth real: login, logout, token seguro, estados de erro e App Access.
4. Implementar fluxos centrais do marketplace: perfil, pets, busca, disponibilidade, agendamento e chat texto.
5. Transformar Admin em painel real depois que Backend/Mobile tiverem contratos estaveis.

## Veredito executivo

**Status atual:** em progresso consistente, com base tecnica forte.  
**Risco principal:** ainda falta produto navegavel de ponta a ponta no Mobile.  
**Proximo marco de valor:** Mobile autenticando no Backend e exibindo estado real do usuario.  
**Condicao para chamar de MVP:** app instalado, usuario consegue entrar, criar/consultar dados essenciais, interagir com fluxos de marketplace e existir suporte admin minimo.


