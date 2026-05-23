# MOBILE_RELEASE — The Pet Lobby

**Status:** Readiness checklist for the first Play Store internal-testing track.
**Date:** 2026-05-22
**Scope:** `Pet_Marketplace_Mobile` (Expo managed + Expo Router).
**Canonical design source:** `docs/design.md`.

> Recheck the official Google Play sources before submission — policies change.
> Links are listed in `docs/design.md` §10.

---

## 1. Identidade do App

| Campo | Valor |
|---|---|
| Nome | The Pet Lobby |
| Package (Android) | `app.thepetlobby.mobile` |
| Bundle ID (iOS) | `app.thepetlobby.mobile` |
| Version | 0.1.0 |
| versionCode | 1 |
| Canal inicial | internal testing |

> `package`/`bundleIdentifier` são imutáveis após a primeira publicação. Confirmar antes do primeiro build de produção.

---

## 2. Configuração nativa (`app.json`) — feito

- [x] `name` = "The Pet Lobby".
- [x] `icon` e `splash` apontando para o logo da marca.
- [x] `userInterfaceStyle` = `light` (o design é light-only; evita superfícies escuras).
- [x] `android.permissions` = `[]` (o app não usa permissões sensíveis hoje).
- [x] `adaptiveIcon.backgroundColor` alinhado ao token de fundo (`#FAFAFC`).

**Pendência de asset (não-código):**
- [ ] Substituir `icon`/`splash` por um PNG dedicado **1024×1024** sem transparência nas bordas (o logo atual serve de referência, mas valide resolução e safe-area do adaptive icon).

---

## 3. EAS Build (`eas.json`) — feito

- [x] `eas.json` criado com perfis `development`, `preview` e `production`.
- [x] `production` gera `app-bundle` (.aab exigido pela Play Store).
- [ ] Rodar `eas login` e `eas build:configure` (precisa de conta Expo — fora deste ambiente).
- [ ] Variáveis `EXPO_PUBLIC_*` configuradas por perfil (EAS Secrets / `.env`).
- [ ] Keystore gerenciado pelo EAS (não commitar keystore no repositório).

---

## 4. Listing da Play Store (rascunho — mercado-alvo: Brasil, pt-BR)

**Nome:** The Pet Lobby

**Descrição curta (≤ 80 caracteres):**
> Encontre prestadores de cuidado para pets dentro do seu condomínio.

**Descrição completa (rascunho):**
> O The Pet Lobby conecta tutores e prestadores de serviços para pets dentro
> do mesmo condomínio. Busque prestadores próximos, veja avaliações, agende
> passeios, pet sitting, transporte e hospedagem, e converse pelo chat do app.
>
> • Busca hiperlocal de prestadores no seu condomínio
> • Perfis com avaliações reais e distância aproximada
> • Agendamento de serviços com confirmação pelo chat
> • Comunidade e canais de suporte/denúncia
>
> Este app conecta pessoas; nenhum pagamento é processado no aplicativo
> nesta fase.

**Regras de copy (design.md §8):** não prometer "cuidado garantido", "prestadores
100% verificados" nem "localização exata".

---

## 5. Data Safety — mapeamento

Declarar no Play Console exatamente o que o app coleta. Estado atual:

| Dado | Coletado? | Finalidade | Compartilhado? | Observação |
|---|---|---|---|---|
| E-mail | Sim | Conta / autenticação | Não | Via Supabase Auth |
| ID de usuário | Sim | Conta / funcionamento | Não | — |
| Nome de exibição (tutor) | Sim | Conta | Não | Opcional |
| Dados de pets (nome, espécie) | Sim | Funcionalidade do app | Não | — |
| Mensagens de chat | Sim (ao lançar o chat) | Funcionalidade do app | Não | Backend de chat ainda não existe |
| Avaliações / conteúdo do usuário | Sim (ao lançar) | Funcionalidade do app | Não | UGC — exige moderação |
| Localização precisa (GPS) | **Não** | — | — | App não pede permissão de localização; distância é aproximada e calculada no backend |
| Pagamentos | **Não** | — | — | Sem pagamento nesta fase |
| Logs de falha / diagnóstico | **Não** hoje | — | — | Revisar se um SDK de analytics/crash for adicionado |

- Criptografia em trânsito: sim (HTTPS).
- O usuário pode solicitar a exclusão dos dados — ver §7.
- Manter privacy policy, termos e a declaração do Play Console **consistentes** com a implementação real.

---

## 6. Permissões

- O app **não** declara permissões sensíveis (`android.permissions: []`).
- Sem câmera, sem localização, sem notificações, sem contatos.
- Se upload de foto, mapa GPS ou push forem adicionados no futuro, atualizar
  permissões + Data Safety + disclosure ao usuário antes do release.

---

## 7. Exclusão de conta — BLOCKER **ATIVO** de release

A Play Store exige, para apps com criação de conta:
1. Caminho **in-app** para solicitar/realizar exclusão de conta e dados.
2. Link **web funcional** para solicitar exclusão após desinstalar o app.

**Estado atual: ATIVO.** O commit `4bbcb4b` (Checkpoint 044) habilitou
`signUp` real via Supabase em `app/(auth)/sign-up.tsx`. O app **passou a
criar contas** — portanto a exigência de exclusão de conta deixou de ser
teórica. Hoje `app/(tabs)/settings.tsx` ainda mostra apenas um card
informativo estático.

**Ação necessária (depende de backend):** ver o prompt de backend ao final
deste documento. Sem isso, o release de produção fica bloqueado. A demo
ao cliente segue liberada.

---

## 8. UGC e moderação

- Chat, avaliações e denúncias exigem Termos de Uso acessíveis (já há
  `app/legal/terms.tsx` e `privacy.tsx` linkados em Settings).
- Prover ação de denunciar conteúdo/usuário onde houver UGC.
- Prover bloqueio de usuário onde houver interação direta.
- Não prometer moderação automática que não existe.

---

## 9. Screenshots (candidatos — design.md §10)

Capturar em telefone (mín. 1080 px no lado maior), 2–8 imagens:

1. Home com busca e prestadores próximos.
2. Busca / lista de prestadores.
3. Detalhes do prestador.
4. Agendamento de serviço.
5. Chat.
6. Perfil.

Sem lorem ipsum, sem botão morto, sem claim não suportado.

---

## 10. Smoke Test (antes de cada build de teste)

- [ ] Abrir o app instalado (build de preview).
- [ ] Login e logout.
- [ ] Fluxo principal: Home → Detalhe do prestador → Agendar → confirmação → Chat.
- [ ] Busca com filtro de categoria e estado vazio.
- [ ] Perfil: carregar, editar pet, salvar.
- [ ] Telas legais (Termos/Privacidade) acessíveis.
- [ ] Sem crash ao alternar todas as abas.

---

## 11. Blockers e pendências

| # | Item | Tipo | Bloqueia produção? | Estado |
|---|---|---|---|---|
| 1 | Exclusão de conta in-app + link web | Backend + Mobile | **Sim** | **ATIVO desde `4bbcb4b`** (sign-up real habilitado) |
| 2 | Backends de prestadores/reservas/chat (telas usam `DEMO SEED`) | Backend | Sim — não publicar com dados fake como reais | Aberto |
| 3 | PNG dedicado de icon/splash 1024×1024 | Asset/design | Sim | Aberto |
| 4 | `eas build` com conta Expo + keystore | Infra | Sim | Aberto |
| 5 | Privacy policy publicada em URL pública | Conteúdo/infra | Sim | Aberto |
| 6 | Definir faixa etária e público-alvo | Decisão de produto | Sim | Aberto |

> Itens 1 e 2 dependem do trabalho de backend no Codex. Itens 3–6 são
> operacionais/de conteúdo e não são código mobile.

---

## 12. Prompt de backend — Exclusão de conta (Codex / `Pet_Marketplace_Back`)

```
Criar o fluxo de exclusão de conta no Pet_Marketplace_Back (NestJS + Supabase),
seguindo o padrão dos módulos users/pets/addresses.

Endpoints (autenticados via Bearer, /api/v1):
- POST /me/deletion-request → registra o pedido de exclusão da conta do
  usuário logado; retorna status "pending" e um prazo de processamento.
- GET  /me/deletion-request → status do pedido (pending|processing|done).

Regras:
- Excluir/anonimizar dados pessoais do usuário (perfil, pets, mensagens),
  respeitando retenção legal quando aplicável — documentar a retenção em
  privacy/terms.
- Idempotente: pedir duas vezes não duplica.
- Criar também uma página web pública e funcional de solicitação de
  exclusão (exigência da Play Store para uso pós-desinstalação).
- Migration das tabelas necessárias, DTOs, validação class-validator e
  teste e2e. Erros genéricos onde o payload tiver dado sensível.

Depois disso, o mobile adiciona em settings.tsx um botão "Excluir minha
conta" com ConfirmationDialog chamando POST /me/deletion-request.
```
