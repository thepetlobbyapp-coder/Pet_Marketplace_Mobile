# SPEC_DESIGN_SYSTEM — Design, UX e Acessibilidade

**Versão:** 1.2
**Produto:** Pet Care Marketplace UK (The Pet Lobby)
**Prioridade:** Android primeiro, preparado para iOS depois
**Última revisão:** 2026-05-23 — alinhamento com a implementação real do Mobile pós-Checkpoint 028.

---

## 1. Objetivo do design

Criar uma interface simples, confiável, acessível e adequada para marketplace de cuidado de pets.

O design deve transmitir:

- confiança;
- proximidade;
- clareza;
- cuidado;
- segurança sem prometer garantias absolutas;
- profissionalismo suficiente para aprovação em lojas.

---

## 2. Princípios

1. Clareza acima de estética complexa.
2. Fluxos curtos e previsíveis.
3. Sem dark patterns.
4. Permissões explicadas no momento certo.
5. Dados pessoais sempre minimizados.
6. Endereços exatos não aparecem para terceiros.
7. Ações perigosas exigem confirmação.
8. Todo estado deve ter feedback: carregando, vazio, erro e sucesso.

---

## 3. Plataforma

### Android

Seguir boas práticas de:

- Material Design;
- touch targets confortáveis;
- navegação previsível;
- botão voltar do Android;
- contraste adequado;
- performance;
- compatibilidade com tamanhos de tela.

### iOS futuro

Evitar design excessivamente Android-only que prejudique adaptação futura.

Preparar:

- espaçamentos consistentes;
- componentes abstratos;
- navegação adaptável;
- linguagem neutra.

---

## 4. Tokens de design (canônico)

> Fonte de verdade implementada: `Pet_Marketplace_Mobile/src/design/tokens.ts`.
> O brief operacional `Pet_Marketplace_Mobile/docs/design.md` (The Pet Lobby) traz as mesmas escalas em outro recorte.

### 4.1 Espaçamento

```txt
space.1  = 4
space.2  = 8
space.3  = 12
space.4  = 16
space.5  = 20
space.6  = 24
space.8  = 32
space.10 = 40
```

### 4.2 Raio

```txt
radius.sm   = 8
radius.md   = 12
radius.lg   = 16
radius.xl   = 24
radius.pill = 999
```

### 4.3 Tipografia

Escala canônica (em px), conforme `tokens.ts`:

```txt
caption = 12
small   = 14
body    = 16
section = 20
display = 28
```

Regras:

- nunca usar texto funcional menor que 12;
- corpo com `line-height` ≥ 1.4;
- títulos com `line-height` ≥ 1.2;
- respeitar aumento de fonte do sistema quando possível.

### 4.4 Cores (paleta canônica)

```txt
background      #FAFAFC
surface         #FFFFFF
surfaceMuted    #F4F4F8
text            #111122
muted           #5C5C70
border          #E8E8EF
accent          #6F32F0   (brand purple 500)
accentPressed   #4B16A8   (brand purple 700)
accentSoft      #EFE8FF   (brand purple 100)
accentDark      #3B0D78   (brand purple 900 — hero/gradient)
danger          #D92D20
dangerSurface   #FEE4E2
successText     #1FA66A
warningSurface  #FFF8DB
warningBorder   #F0D26A
star            #F6B93B
onAccent        #FFFFFF
```

Regras:

- contraste mínimo WCAG AA;
- nunca depender apenas de cor para comunicar status (sempre rótulo/ícone associado);
- estados de erro/sucesso/aviso usam o par superfície + texto da paleta acima.

### 4.5 Sombras

```txt
shadow.sm   elevação sutil — cards padrão
shadow.md   elevação média — banners, CTA flutuante (tab central, hero)
shadow.lg   elevação alta — modais/overlays
```

Implementação em RN nativo via `shadowColor / shadowOffset / shadowOpacity / shadowRadius` + `elevation` (Android).

> **Ressalva web (dívida técnica):** React Native Web 0.21+ exige `boxShadow`. Os tokens atuais geram um *warning* no console web; nativo continua correto. Tratar em ciclo dedicado quando houver hospedagem web do app.

---

## 5. Catálogo de componentes (estado real — 2026-05-23)

> Implementação em `Pet_Marketplace_Mobile/src/components/`. **Antes de criar componente novo, conferir este catálogo — duplicação proibida.**

### 5.1 Primitivos e estados

- `Screen` — wrapper com `SafeAreaView` + `ScrollView`. Variantes: `centered` (default, para placeholders curtos) e `top` (para telas roláveis com hierarquia top-down).
- `ScreenHeader` — kicker + título + subtítulo (uso histórico; em telas novas preferir composição manual com `SectionHeader`).
- `SectionHeader` — título + ação opcional ("Ver todos").
- `Button` — variantes `primary | secondary`; altura mínima 48 px. **Não alterar o componente para reduzir largura**; usar wrapper local com `alignSelf:'center' + width:% + minWidth:px` quando o CTA precisar ser compacto (padrão estabelecido em Login).
- `TextField` — input com label obrigatório.
- `IconButton` — controle só com ícone; `accessibilityLabel` obrigatório.
- `Badge` — pílula com tom (`neutral | success | warning | danger | info`).
- `LoadingState`, `EmptyState`, `ErrorState` — estados padrão (uso obrigatório no lugar de mensagens cruas).
- `Card` — superfície branca, borda sutil, `radius.lg`, `shadow.sm`.

### 5.2 Marca e identidade

- `Brandmark` — logo The Pet Lobby (cantos arredondados via `borderRadius` + `overflow:'hidden'` no wrapper da `Image`) + wordmark + tagline opcional. Usar no Login e onde a marca aparecer.
- `Avatar` — circular, com fallback de iniciais a partir do nome.

### 5.3 Marketplace (Home / Search / Provider Detail)

- `SearchInput` — campo de busca; modo editável **ou** `onPress` para navegar até Search (uso na Home).
- `CategoryChip` — categoria com ícone + label.
- `FilterPill` — pílula selecionável para filtros (Search).
- `CondoSelector` — seletor de condomínio (Home).
- `HeroBanner` — banner roxo com título, body, CTA e imagem opcional.
- `ProviderCard` — card de prestador (avatar, nome, serviço, rating, distância, status).
- `RatingStars` — 5 estrelas com meia-estrela + contagem.
- `InfoRow` — linha ícone + label + valor (Provider Detail).

### 5.4 Agendamento (Book)

- `DateStrip` — strip horizontal de datas selecionáveis; helper `buildUpcomingDates(n)`.
- `TimeChip` — chip de horário (selected / disabled).

### 5.5 Chat

- `ConversationRow` — linha de conversa (avatar, nome, preview, hora, badge de não-lidas).
- `MessageBubble` — bolha de mensagem (esquerda = prestador, direita = tutor).

### 5.6 Navegação

- `CenterTabButton` — botão "+" elevado no slot central da tab bar (consumido por `Tabs.Screen name="book"`).

### 5.7 Componentes ainda não implementados (referência histórica)

Itens que existiam na v1.1 deste spec e **não estão no código**. Antes de criar qualquer um, abrir PROMPT_BRIEF e validar com `@V_ImpactValidator`:

- `ConfirmationDialog` — hoje usamos `Alert.alert` nativo; criar componente próprio quando houver fluxo destrutivo recorrente.
- `Select` — sem use case atual; criar sob demanda.
- `DateTime picker wrapper` — `DateStrip` cobre o caso atual (Book); criar wrapper completo quando houver agendamento avançado.
- `ReportButton`, `RatingInput`, `DistanceBadge`, `ServiceTypeBadge` — escopo futuro (UGC, reviews, denúncia, badges de serviço).
- `Card de pet` — escopo futuro (perfil tutor com múltiplos pets).
- `Booking status badge` — usar `Badge` com tom apropriado até existir um padrão dedicado.

---

## 6. Política de copy e idioma

> **Estado atual (dívida técnica documentada — Checkpoint 028):**

- **Telas de marketplace e Login** (`home`, `search`, `book`, `chat`, `provider/[id]`, `(auth)/login`) → **pt-BR inline**, alinhadas ao modelo visual `Pet_Marketplace_Mobile02.jpeg` e ao público-alvo Brasil.
- **Infraestrutura** (`settings`, `sign-up`, `reset-password`, `legal/*`) → **en-GB via `src/i18n/en-GB.ts`**.

**Regra para o próximo agente/dev:**

1. Tela nova de marketplace/UX → seguir o padrão pt-BR inline da Home.
2. Tela nova de infra (auth, settings, legal) → adicionar chaves em `src/i18n/en-GB.ts` e consumir via `t(...)`.
3. **Não remover** chaves existentes em `en-GB.ts` (várias caíram em desuso após o pivot pt-BR; ficam preservadas para o futuro plano de localização real).
4. Consolidação completa (pt-BR + i18n estruturado) fica como item explícito de roadmap, não ad-hoc.

Tom (independente do idioma):

- claro, calmo, direto, amigável, sem exagero;
- nunca prometer segurança absoluta nem garantia.

Evitar:

- "guaranteed", "fully verified", "safe provider", "licensed by us", "we guarantee the service".

Preferir:

- "Send booking request" / "Solicitar reserva";
- "Report a concern" / "Reportar um problema";
- "Approximate distance" / "Distância aproximada";
- "Provider description" / "Descrição do prestador";
- "This information is provided by the provider" / "Informação fornecida pelo prestador".

---

## 7. Acessibilidade

Obrigatório:

- contraste suficiente (WCAG AA);
- labels em inputs (`TextField` já força);
- botões com área mínima confortável (44×44, preferencial 48);
- suporte a leitores de tela: `accessibilityLabel` em todo `IconButton` / `Pressable` sem texto visível;
- mensagens de erro próximas ao campo;
- não usar apenas placeholder como label;
- não usar apenas cor para status;
- feedback claro para loading (`LoadingState`, `isLoading` em `Button`).

---

## 8. Telas prioritárias para design

> Marcação atualizada (✅ = fiel ao modelo Mobile02; 🚧 = pendente / placeholder).

1. ✅ Login (com `Brandmark`).
2. 🚧 Splash / loading inicial.
3. ✅ Cadastro e Reset (mesmo padrão Login, com auth real via Supabase).
4. 🚧 Escolha de perfil.
5. ✅ Home tutor / busca.
6. ✅ Search com filtros.
7. ✅ Perfil do prestador (Provider Detail).
8. ✅ Solicitação de booking.
9. 🚧 Lista de bookings.
10. 🚧 Detalhe do booking.
11. ✅ Chat texto.
12. 🚧 Cadastro/edição de pet (existe no Profile, sem fidelidade Mobile02).
13. 🚧 Perfil do prestador editor (provider onboarding).
14. 🚧 Disponibilidade.
15. 🚧 Avaliação.
16. 🚧 Denúncia.
17. 🚧 Configurações (visual ainda no padrão antigo).
18. 🚧 Exclusão de conta (blocker Play Store — ver `docs/30_PLAYSTORE_RELEASE_READINESS.md`).

---

## 9. Regras para Play Store/App Store

O app deve:

- parecer completo, não protótipo vazio;
- não conter textos temporários;
- não ter botões sem função;
- não quebrar sem login;
- fornecer conta de teste para revisão, se necessário;
- ter política de privacidade acessível;
- explicar permissões;
- não coletar dados sem necessidade;
- não prometer funcionalidades não implementadas;
- não induzir o usuário a erro.

Telas em estado de demonstração com `DEMO SEED` (`Pet_Marketplace_Mobile/src/data/demoFixtures.ts`) **não podem ir para produção** apresentando dados fictícios como reais — ver `docs/30_PLAYSTORE_RELEASE_READINESS.md` §11 (blockers).

---

## 10. Critérios de aceite visual

- Todas as telas principais têm estados completos (loading, empty, error, success).
- Componentes são reutilizáveis e vêm do **catálogo da §5** — não duplicar.
- Tokens da §4 são consumidos via `src/design/tokens.ts`; nada de hex/valores soltos.
- Idioma respeita a **política da §6** (pt-BR inline marketplace + en-GB i18n infra).
- Formulários têm validação visível e mensagens próximas ao campo.
- Navegação é clara; **uma** ação primária por tela.
- Botões críticos têm confirmação (`Alert.alert` ou futuro `ConfirmationDialog`).
- `Image` com `borderRadius` exige `overflow:'hidden'` no wrapper (regressão observada em iOS/Web — ver `Brandmark`).
- CTA primário compacto: wrapper local com `alignSelf:'center'`, `width:%`, `minWidth:px` — **não** alterar o componente `Button` compartilhado.
- O design pode ser apresentado ao cliente sem precisar explicar "isso ainda está quebrado".
