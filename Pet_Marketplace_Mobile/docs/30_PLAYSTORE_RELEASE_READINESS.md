# MOBILE_RELEASE — The Pet Lobby

**Status:** readiness documental para o primeiro track de teste interno da Play Store.
**Data:** 2026-05-26
**Escopo:** `Pet_Marketplace_Mobile` + URLs públicas legais publicadas no backend DigitalOcean.
**Fonte canônica de design:** `docs/design.md`.

> Fontes oficiais Google Play rechecadas em 2026-05-25 para orientar este
> documento. Rechecar novamente antes de preencher/submeter a Play Console,
> porque políticas mudam.
>
> Checkpoint 075 reconciliou a documentação após o Checkpoint 074 validar Chat
> real e Trust & Safety mínimo no Mobile autenticado. Checkpoint 076 preparou
> o pacote seguro de App Access para revisão autenticada. Checkpoint 077 expôs
> Settings/account deletion via Profile e adicionou proteção para arquivos
> locais de credenciais. Checkpoint 078 preparou o pacote Store Listing e
> roteiro seguro de screenshots `en-GB` em
> [docs/34](34_PLAYSTORE_LISTING_SCREENSHOT_PACKAGE.md). Checkpoint 079
> reconciliou a copy visível das telas Mobile críticas para screenshots em
> `en-GB`. Checkpoint 080 investigou o preflight visual local: o bundle Expo
> Web responde em `localhost:8082`, mas as rotas de documento nao completaram
> e a UI nao hidratou no Browser local. Checkpoint 081 destravou o preflight
> local usando Expo Web em `localhost:8083` com cache Metro limpo, permitindo
> verificar Login, Sign-up, Reset, Home, Search, Provider detail e Book em
> estados seguros `en-GB`. Checkpoint 083 confirmou a fixture reviewer
> reutilizável com `finalFixtureGo=true`. Checkpoint 084 consolidou o fechamento
> Legal/Data Safety em [docs/37](37_PLAYSTORE_LEGAL_DATA_SAFETY_CLOSURE.md):
> screenshots finais ficam GO COM RESSALVAS; EAS/build futuro fica GO COM
> RESSALVAS apenas como preparação técnica; Play Console/Data Safety final segue
> NO-GO até bases legais por finalidade e classes de retenção serem aprovadas.
> Checkpoint 087 recapturou o pacote final `en-GB` em
> [docs/38](38_PLAYSTORE_FINAL_SCREENSHOTS_READINESS.md). Checkpoint 088
> registrou o preflight técnico EAS em
> [docs/39](39_EAS_BUILD_PREFLIGHT_READINESS.md): GO COM RESSALVAS para build
> futuro, sem executar EAS, e ainda NO-GO para Play Console/internal track final.
> Checkpoint 089 resolveu a postura de avatar/permissões removendo/deferindo
> `expo-image-picker`, mas manteve EAS futuro em NO-GO Play-ready até existir
> asset icon/splash 1024x1024 validado.
> Checkpoint 090 acionou `impact-validator`; como nenhum caminho local de PNG
> 1024x1024 foi fornecido e nenhum candidato valido foi encontrado, asset
> integration e EAS futuro seguem NO-GO.
> Checkpoint 091 validou e integrou localmente `a pet-lobby-icon-1024.png`
> como PNG icon/splash 1024x1024 Play-ready. EAS real nao foi executado.
> Checkpoint 092 executou preflight final local para EAS Android production:
> asset, app.json/eas.json, postura avatar/permissoes, typecheck, lint e
> `git diff --check` passaram; EAS real nao foi executado porque a frase
> literal de autorizacao nao foi fornecida.
> Apos autorizacao literal, Checkpoint 092 executou `eas init --force` e
> submeteu `eas build --platform android --profile production`; o build Android
> production ficou em fila remota, sem EAS submit ou Play Console.
> Checkpoint 093 documentou o cold-start de conversa tutor-provider:
> `POST /api/v1/conversations`, CTA `Message provider`, deep-link seguro para
> Chat por `conversationId`, i18n en-GB e harness final verde. O recorte foi
> aprovado com ressalvas e nao adiciona anexos, midia, push, realtime, SDKs ou
> nova categoria de coleta para Data Safety.
> Checkpoint 094 fechou a ressalva MEDIUM de atomicidade do rate limit de
> cold-start via RPC SQL com advisory lock transacional, sem Mobile, deploy,
> EAS, Play Console, fixture ou escrita remota.

Referências operacionais:
- User Data policy: https://support.google.com/googleplay/android-developer/answer/10144311
- Data Safety: https://support.google.com/googleplay/android-developer/answer/10787469
- User-generated content policy: https://support.google.com/googleplay/android-developer/answer/9876937
- UGC moderation requirements: https://support.google.com/googleplay/android-developer/answer/12923286
- Account deletion: https://support.google.com/googleplay/android-developer/answer/13327111
- Target audience/Families: https://support.google.com/googleplay/android-developer/answer/9893335
- Prepare your app for review / App access: https://support.google.com/googleplay/android-developer/answer/9859455
- Requirements for login credentials: https://support.google.com/googleplay/android-developer/answer/15748846
- Store listing setup: https://support.google.com/googleplay/android-developer/answer/9859152
- Preview assets and screenshots: https://support.google.com/googleplay/android-developer/answer/9866151

---

## 1. Identidade do App

| Campo | Valor |
|---|---|
| Nome | The Pet Lobby |
| Package Android | `app.thepetlobby.mobile` |
| Bundle ID iOS | `app.thepetlobby.mobile` |
| Version | `0.1.0` |
| versionCode | `2` |
| Canal inicial | internal testing |

> `package`/`bundleIdentifier` são imutáveis após a primeira publicação.
> Confirmar antes do primeiro build de produção.

---

## 2. Configuração nativa (`app.json`)

- [x] `name` = "The Pet Lobby".
- [x] `icon` e `splash` apontam para o logo da marca.
- [x] `userInterfaceStyle` = `light`.
- [x] `android.permissions` = `[]`.
- [x] `adaptiveIcon.backgroundColor` alinhado ao fundo (`#FAFAFC`).

Decisão Checkpoint 089:
- [x] `expo-image-picker` removido/deferido de `app.json`, `package.json` e
  lockfile; Profile renderiza avatar read-only e não oferece camera/galeria.
- [ ] Conferir o manifesto nativo gerado no build EAS exato: plugins/bibliotecas
  ainda podem adicionar permissões mesmo com `android.permissions = []`.

Pendência de asset não-código:
- [x] Substituir `icon`/`splash` por PNG dedicado **1024x1024**, sem
  transparência nas bordas no icon principal, validando safe area do
  adaptive icon. **Requisitos objetivos e checklist de aceite:**
  [docs/32_SPEC_ASSET_ICON_SPLASH.md](32_SPEC_ASSET_ICON_SPLASH.md).
- [ ] Checkpoint 089 confirmou que não há asset 1024x1024 local; o maior
  candidato relacionado é screenshot/foto, não icon/splash Play-ready. Não
  criar asset inventado.
- [ ] Checkpoint 090 tentou o gate de integracao local; `impact-validator`
  autorizou apenas documentar NO-GO porque nao houve caminho de asset local
  valido.
- [x] Checkpoint 091 aprovou `a pet-lobby-icon-1024.png`: PNG real
  `1024x1024`, RGB 8-bit, fundo `#FAFAFC`, sem texto/copy e safe area OK
  (`576x560`, 0 px fora do circulo central de raio 313 px).

---

## 3. EAS Build

- [x] `eas.json` existe com perfis `development`, `preview` e `production`.
- [x] `production` gera `app-bundle` (`.aab`).
- [x] Preflight técnico local registrado em
  [docs/39_EAS_BUILD_PREFLIGHT_READINESS.md](39_EAS_BUILD_PREFLIGHT_READINESS.md)
  sem executar build.
- [x] Checkpoint 092 confirmou preflight local para Android production sem
  executar comando remoto; `production.android.buildType` segue `app-bundle`.
- [ ] Rodar `eas login` e `eas build:configure` em conta Expo autorizada.
- [ ] Configurar variáveis `EXPO_PUBLIC_*` por perfil, sem commitar secrets.
- [ ] Confirmar keystore gerenciado pelo EAS ou política equivalente.
- [ ] Confirmar `owner`/projeto EAS ou `extra.eas.projectId` quando a conta Expo
  autorizada for definida.
- [x] `eas init --non-interactive --force` criou/linkou o projeto EAS
  autorizado e adicionou `owner`/`extra.eas.projectId` ao `app.json`.
- [x] Primeiro `eas build --platform android --profile production` foi
  submetido; status inicial remoto: `IN_QUEUE`, `appBuildVersion` remoto `3`.
- [ ] Aguardar conclusao do build remoto e executar smoke no artefato assinado
  exato.
- [ ] Repetir smoke no artefato assinado exato antes de qualquer Play Console
  ou internal track.

---

## 4. URLs legais publicadas

Fechado para campos de URL pública mínima:

| Uso | URL | Estado |
|---|---|---|
| Privacy Policy | `https://stingray-app-vyfrt.ondigitalocean.app/privacy` | HTTP 200 público no recorte 056 |
| Terms of Use | `https://stingray-app-vyfrt.ondigitalocean.app/terms` | HTTP 200 público no recorte 056 |
| Account/data deletion web link | `https://stingray-app-vyfrt.ondigitalocean.app/account-deletion` | HTTP 200 público e linka Privacy/Terms |

Uso previsto na Play Console:
- campo de Privacy Policy: usar `/privacy`;
- campo de data deletion/account deletion: usar `/account-deletion`;
- Terms ficam disponíveis publicamente e devem continuar linkados no app/site.

Não declarar que há exclusão destrutiva automática: o fluxo atual registra
solicitação operacional e exige verificação/regras de retenção antes de ação
destrutiva. A politica aprovada no Checkpoint 062 fala em desativação imediata,
anonimização quando possível e retenção temporária, mas o backend atual ainda
não executa essas ações.

---

## 5. Listing da Play Store

O pacote operacional de copy proposta e roteiro de screenshots fica em
[docs/34_PLAYSTORE_LISTING_SCREENSHOT_PACKAGE.md](34_PLAYSTORE_LISTING_SCREENSHOT_PACKAGE.md).

O texto abaixo continua como rascunho, não como copy final. O Checkpoint 062
aprovou mercado inicial como Inglaterra e idioma final como Inglês da Inglaterra
(`en-GB`). O Checkpoint 078 preparou copy proposta e regras de screenshots. O
Checkpoint 079 reconciliou a copy visível de Login, Sign-up, Reset, Home,
Search, Provider Detail e Book para `en-GB`. Checkpoint 080 reconfirmou a copy
por varredura estatica, mas o Browser local nao hidratou a UI porque as rotas
de documento do Expo Web em `localhost:8082` nao completaram. Checkpoint 081
destravou o preflight visual em `localhost:8083` com cache Metro limpo e
confirmou estados seguros `en-GB`. Screenshots finais ainda dependem do build
submetido e da fixture sintética aprovada.

**Nome:** The Pet Lobby

**Descrição curta candidata:**
> Find local pet care providers and manage bookings.

**Descrição completa candidata:**
> The Pet Lobby helps pet owners in England find local pet care providers,
> review provider profiles, request bookings and manage service conversations
> when Chat is included in the submitted build.
>
> No in-app payment is processed in this phase.

Regras de copy e screenshots:
- não prometer "cuidado garantido";
- não prometer "prestadores 100% verificados";
- não prometer seguro, proteção financeira ou pagamento protegido;
- não prometer exposição de localização exata;
- não anunciar chat, reviews, provider onboarding ou pagamento além do que
  estiver implementado no build submetido.
- não mostrar e-mail real completo, senha, token, JWT/header, ID completo,
  texto privado de mensagem/denúncia, dado real de usuário/provider,
  `Credenciais.txt`, `.env`, logs ou ferramentas internas;
- usar somente fixture sintética aprovada e providers reais retornados pela API,
  nunca rotas demo/non-UUID para screenshots finais.

---

## 6. Data Safety — inventário atual

Base verificada em 2026-05-25:
- Mobile usa Supabase Auth, SecureStore e API própria.
- `android.permissions` está vazio; não há permissão nativa de localização,
  câmera, contatos, microfone, arquivos ou notificações.
- `package.json` Mobile não contém SDK de analytics, crash reporting,
  ads, pagamentos ou mapas/localização.
- Checkpoint 089 removeu/deferiu `expo-image-picker` e a flag pública de
  avatar upload do Mobile Play-ready. Avatar existente pode ser exibido a
  partir de `avatarUrl` retornado pela API, mas camera/galeria/upload não são
  fluxo do build atual.
- Backend atual expõe perfis, pets, endereços, providers/search, bookings,
  conversations/messages, reports/block/admin reports, solicitação de exclusão
  e páginas legais.
- Mobile atual consome perfis, pets, endereços, providers/search, bookings,
  solicitação de exclusão e, desde o Checkpoint 063, conversations/messages
  reais via REST.
- Checkpoint 093 adicionou no Mobile o fluxo Provider Detail -> `Message
  provider` -> `/chat?conversationId=<uuid>`, consumindo somente conversa
  retornada pela lista autenticada.
- Checkpoint 094 moveu o rate limit de cold-start para RPC SQL atomica no
  backend, mantendo `403`, `404` e `429` seguros.
- Checkpoints 073-074 validaram no Mobile report de conversa, report de
  mensagem, block de conversa e erro seguro pós-block com HTTP 403 esperado.
- O recorte não adiciona anexos, mídia, realtime, push, offline queue ou
  moderação automática.

Preenchimento preliminar para Play Console, condicionado ao build real:

| Dado / categoria | Coletado no build atual? | Finalidade | Compartilhamento / observação |
|---|---|---|---|
| E-mail | Sim | Conta, login, suporte e exclusão de conta | Supabase Auth/processador de infraestrutura; não vender para ads |
| Senha/token de sessão | Sim, via Auth | Autenticação | Senha não deve ser armazenada em texto puro pelo app; tokens não entram em docs/logs |
| ID de usuário/Auth ID | Sim | Conta, autorização, auditoria e segurança | Não expor a outros usuários |
| Perfil tutor/provider, role, status, locale | Sim quando usado | Conta e marketplace | Provider onboarding ainda não deve ser prometido como fluxo completo |
| Pets | Sim | Funcionalidade do app e booking | Minimizar notas sensíveis |
| Endereço, postcode, área pública e coordenadas informadas | Sim | Proximidade, busca, booking e endereço padrão | Declarar endereço/localização; se a resolução final for menor que 3 km, revisar se entra como localização precisa no Data Safety |
| Providers/search e distância aproximada | Sim | Descoberta de prestadores | Não expor endereço completo, telefone ou coordenadas exatas |
| Bookings | Sim | Solicitação e acompanhamento de serviço | Sem dados de pagamento |
| Chat/mensagens texto | Sim, se o build incluir o recorte de Chat real validado nos Checkpoints 063-074 e o cold-start tutor-provider do Checkpoint 093 | Comunicação do serviço | Texto apenas; sem anexos, mídia, realtime, push ou offline queue; declaração final depende de Terms/Data Safety humano/legal |
| Denúncias/reports de Chat e block | Sim, se o build incluir o recorte Trust & Safety validado nos Checkpoints 073-074 | Confiança, suporte, segurança e controle de interação direta | Report de conversa, report de mensagem e block validados; admin review existe via API/backend; sem Admin UI final e sem moderação automática |
| Avaliações/reviews/UGC público | Não no build atual, salvo se habilitado depois | Confiança futura | Exige recorte próprio de moderação, Terms e Data Safety quando entrar no produto |
| Pagamentos/transações | Não | — | Sem pagamento in-app nesta fase |
| Crash logs, diagnostics, analytics | Não por SDK dedicado hoje | — | Reavaliar se Sentry/Firebase/analytics forem adicionados |
| Device ID, Advertising ID, contatos, fotos do dispositivo, áudio, arquivos | Não | — | Não há SDK/permissão/feature atual; avatar upload foi deferido no Checkpoint 089 |

Declarações seguras:
- criptografia em trânsito: sim, via HTTPS;
- exclusão de dados: sim para solicitação in-app e web;
- exclusão/anonimização automática: **não implementada**;
- retenção pós-exclusão: aprovada em alto nível como até 12 meses para fins
  legais, segurança, prevenção de fraude e resolução de disputas; classes
  exatas de dados ainda não detalhadas.

---

## 7. Permissões

- O app não declara permissões sensíveis (`android.permissions: []`).
- Sem câmera, localização nativa, notificações, contatos, microfone ou arquivos.
- Sem `expo-image-picker` no build Play-ready após o Checkpoint 089.
- Se localização do dispositivo, upload, push, mídia, contatos ou qualquer SDK
  de coleta for adicionado, atualizar app disclosure, Data Safety, privacy e
  testes antes de qualquer submissão.

---

## 8. Exclusão de conta

Fechado para a exigência de **solicitação**:
- caminho in-app em Settings chama `POST /api/v1/me/deletion-request`;
- status in-app usa `GET /api/v1/me/deletion-request`;
- link web pós-desinstalação: `GET /account-deletion`;
- endpoint público: `POST /api/v1/account-deletion/request`;
- resposta pública não revela se e-mail/conta existe;
- `/account-deletion` linka `/privacy` e `/terms`.

Limite explícito:
- não há exclusão destrutiva automática;
- não há job de anonimização;
- há política produto/legal aprovada em alto nível no Checkpoint 062, mas ela
  ainda não está implementada: desativação imediata, anonimização quando
  possível e exclusão definitiva seguem bloqueadas tecnicamente;
- qualquer exclusão real futura precisa de verificação de propriedade, regra
  operacional/legal e responsável de execução definidos.

---

## 9. Público-alvo e Families

**Decisão Checkpoint 062:** público adulto, documentado como `18+` e não
child-directed.

Aplicação:
- preparar Target audience and content como adulto;
- evitar copy, screenshots, onboarding, ilustrações e store listing que façam o
  app parecer direcionado a crianças;
- se qualquer faixa infantil entrar no target audience em recorte futuro,
  aplicar requisitos de Google Play Families e reavaliar dados, SDKs, login e
  UGC.

---

## 10. App Access para revisão

Checkpoint 076 criou o template seguro em
`docs/33_PLAYSTORE_APP_ACCESS_REVIEWER_PACKAGE.md`. Checkpoint 077 expôs
Settings/account deletion a partir de Profile > Open Settings e protegeu
arquivos locais de credenciais no `.gitignore`.

Estado para submissão:
- pacote documental preparado em `en-GB`;
- credenciais reais ainda pendentes e devem ser inseridas somente na Play
  Console;
- conta de teste tutor deve ser ativa, reutilizável, pré-confirmada e válida
  independentemente da localização do revisor;
- conta provider somente se provider flow estiver no build submetido;
- ambiente remoto deve estar estável;
- dados sintéticos devem cobrir Home/Search/Provider/Booking/Chat/Profile e o
  caminho Settings/account deletion;
- Chat precisa de conversa sintética visível para a conta de review;
- Settings/account deletion tem caminho visível por UI autenticada em Profile >
  Open Settings;
- nenhum OTP/MFA in-app foi encontrado no código Mobile; se Supabase exigir
  confirmação por e-mail para cadastro, a conta de review deve estar previamente
  confirmada;
- não registrar e-mails reais completos, senhas, tokens, IDs completos ou texto
  privado em docs.

Lacunas observadas:
- Provider/Book ainda possuem fallback demo em caminhos não UUID; as instruções
  de review devem orientar o uso de providers reais retornados por Home/Search.

---

## 11. UGC e moderação

- Checkpoint 062 aprovou chat real/UGC como decisão de produto. O Checkpoint
  063 ligou a aba Chat do Mobile aos endpoints reais de conversations/messages
  via REST, sem backend novo.
- Checkpoints 073-074 validaram o recorte mínimo de Trust & Safety no Mobile:
  report de conversa, report de mensagem, block e erro seguro pós-block.
- Checkpoint 093 adicionou abertura/retomada de conversa tutor-provider por
  `POST /conversations` e deep-link seguro no Chat; ids arbitrarios em
  `conversationId` nao abrem thread se nao estiverem na lista autenticada.
- Checkpoint 094 fechou a ressalva de rate limit nao atomico com RPC SQL
  atomica no backend, preservando idempotencia do tutor/provider.
- Chat real, reviews, denúncias ou qualquer UGC exigem Terms acessíveis e fluxo
  operacional de denúncia/moderação.
- Onde houver interação direta entre usuários, bloqueio de usuário/conversa deve
  continuar acessível e testável.
- Não prometer moderação automática; hoje ela não existe.
- Não declarar mensagens/UGC no Data Safety final nem vender Chat como feature
  pronta para publicação sem Terms/Data Safety revisados, App Access preenchido
  com credenciais reais somente na Play Console e evidência de que o build
  submetido inclui exatamente esse recorte.
- Checkpoint 064 implementou localmente o MVP de Trust & Safety para Chat 1:1:
  `POST /reports`, `POST /conversations/:id/block`, `GET /admin/reports` e
  `PATCH /admin/reports/:id`, com migration local para `reports` e
  `user_blocks`. Esse recorte ainda **não foi aplicado remotamente** e não
  fecha Terms/Data Safety finais.
- Checkpoint 065 executou preflight local de rollout da migration Trust &
  Safety. Veredito: pronta com ressalvas para aplicacao controlada; segue sem
  SQL remoto, sem deploy e sem fechamento de Terms/Data Safety finais.
- Checkpoint 066 aplicou hardening local na migration Trust & Safety: grants
  explicitos de usage nos enums de report e FK de `message_id` restritiva para
  nao quebrar o check de reports de mensagem em delecoes futuras. Segue sem SQL
  remoto, sem deploy e sem fechamento de Terms/Data Safety finais.
- Checkpoint 067 iniciou o rollout controlado da migration Trust & Safety:
  alvo Supabase confirmado localmente por project ref, migration 007 validada,
  testes locais OK e SQL remoto bloqueado ate confirmacao humana literal.
  Nenhum backup remoto, SQL remoto ou deploy foi executado neste estado.
- Checkpoint 068 validou a migration Trust & Safety aplicada manualmente no
  Supabase por smoke remoto read-only. `reports`, `user_blocks`, enums, RLS,
  policies, grants, indices e FK `reports.message_id` com `ON DELETE RESTRICT`
  foram confirmados no project ref configurado. Nenhum deploy foi executado.
- Checkpoint 069 publicou somente o backend Trust & Safety na DigitalOcean
  (`pet-marketplace-back`) e validou smoke remoto publico/sem token: health 200,
  Swagger publico ausente por `SWAGGER_ENABLED=false`, e rotas de report/block/
  admin reports retornando 401 sem token. Smoke autenticado ficou inconclusivo
  para report/block/admin porque a conta de teste nao tinha conversa real nem
  role admin. Nenhum SQL remoto, seed, Mobile ou Admin deploy foi executado.
- Checkpoint 070 executou smoke remoto seguro e leituras autenticadas com o
  tutor de teste: health 200, rotas sem token 401, `/me` 200 e
  `/conversations` 200 com lista vazia. O fluxo end-to-end de report/block/
  envio bloqueado/admin reports segue bloqueado por falta de conversa/mensagem
  real de teste e admin de teste. Nenhum SQL remoto, seed, deploy ou escrita
  Trust & Safety foi executado.
- Checkpoint 071 revalidou o bloqueio com token tutor renovado e leituras
  remotas seguras: health 200, rotas Trust & Safety sem token 401,
  `/me` 200 com role apenas `tutor`, `/conversations` 200 vazio,
  pets/bookings/providers de teste ainda visiveis e `/admin/reports` com tutor
  403. Nenhum SQL remoto, service role, deploy, seed generico, escrita Trust &
  Safety ou fixture foi executado. A criacao da fixture minima controlada segue
  bloqueada ate confirmacao literal.
- Checkpoint 072 recebeu a confirmacao literal, criou fixture sintetica minima
  via service role controlado e validou o smoke autenticado end-to-end:
  conversa sintetica, mensagem sintetica via API publica, report de conversa,
  report de mensagem, block, envio pos-block retornando 403, listagem admin e
  patch dos reports para `closed`. O block criado e a role admin temporaria
  foram removidos; a conversa/mensagem sinteticas e os 2 reports fechados
  ficaram como fixture/evidencia controlada. Sem deploy, migration, seed
  generico, raw SQL ou dados reais.
- Checkpoint 073 implementou no Mobile o minimo operacional de Trust & Safety
  no Chat real: report de conversa, report de mensagem, confirmacao de block,
  tratamento seguro de 403 pos-block e textos en-GB na area de Chat. A fixture
  foi reconfirmada por leituras remotas seguras e a UI foi validada localmente
  no Expo Web sem acionar POST de report/block. O smoke visual com escrita
  remota segue bloqueado ate a confirmacao literal especifica.
- Checkpoint 074 recebeu a confirmacao literal e executou o smoke Mobile
  autenticado com escrita controlada na fixture sintetica: report de conversa,
  report de mensagem, block pelo Mobile, erro seguro no envio pos-block e
  confirmacao bruta de HTTP 403 `FORBIDDEN`. Os 2 reports novos foram fechados,
  os blocks criados foram removidos, a role final permaneceu apenas `tutor`, a
  conversa/mensagem fixture foram retidas e nenhum deploy, SQL remoto,
  migration, seed generico ou role admin temporaria foi executado.

---

## 12. Smoke Test antes de cada build de teste

- [ ] Abrir o app instalado (build preview/internal).
- [ ] Login e logout.
- [ ] Home com providers reais: loading/empty/error/cards reais sem `DEMO SEED`.
- [ ] Search real com filtro de categoria, busca textual, loading e empty state.
- [ ] Provider Detail real por UUID.
- [ ] Provider Detail real com CTA `Message provider` abrindo/retomando conversa
  e deep-linkando para Chat autenticado.
- [ ] Book/booking real com pet existente e slot disponível.
- [ ] Aba Book listando reservas reais.
- [ ] Chat real listando conversations/messages, com envio REST e sem `DEMO SEED`.
- [ ] Profile carregando e editando tutor profile, pets e endereços.
- [ ] Settings solicitando exclusão de conta e exibindo status.
- [ ] Telas legais acessíveis.
- [ ] Sem crash ao alternar abas.
- [ ] Nenhum dado fake aparece como se fosse real.

---

## 13. Blockers e pendências

| # | Item | Tipo | Bloqueia produção? | Estado |
|---|---|---|---|---|
| 1 | Privacy Policy, Terms e Account Deletion URLs | Conteúdo/infra | Sim | **Fechado para URL pública mínima** |
| 2 | Solicitação de exclusão in-app + web | Backend + Mobile | Sim | **Fechado para solicitação**; sem exclusão destrutiva automática |
| 3 | Data Safety preliminar contra implementação real | Produto/docs | Sim | **Fechado como inventário**; submissão final depende de humano/legal |
| 4 | Controlador/empresa responsável | Legal/produto | Sim | **Aprovado documentalmente no Checkpoint 062**: Vitor Dutra Melo, desenvolvimento independente até formalização da empresa |
| 5 | Contato legal/oficial e e-mail de suporte | Legal/produto | Sim | **Aprovado documentalmente no Checkpoint 062**: privacidade e suporte com canais oficiais informados |
| 6 | Bases legais aplicáveis | Legal | Sim | **Aberto** |
| 7 | Política final de retenção/anonimização | Legal/produto/backend futuro | Sim | **Aprovado em alto nível / bloqueado tecnicamente**: até 12 meses; sem job destrutivo/anonimização |
| 8 | Faixa etária e público-alvo Play Console | Produto/legal | Sim | **Aprovado documentalmente**: adulto / `18+` / não child-directed |
| 9 | Idioma/mercado final do listing e APK | Produto | Sim | **Aprovado documentalmente / UI crítica reconciliada**: Inglaterra + `en-GB`; Checkpoint 078 preparou pacote de listing/screenshots em [docs/34](34_PLAYSTORE_LISTING_SCREENSHOT_PACKAGE.md) e Checkpoint 079 reconciliou a copy visível das telas críticas. Reconfirmar no build submetido antes dos screenshots finais |
| 10 | PNG dedicado icon/splash 1024x1024 | Asset/design | Sim | **Fechado localmente no Checkpoint 091** ([docs/40](40_EAS_ASSET_AVATAR_PERMISSION_READINESS.md)); `a pet-lobby-icon-1024.png` foi validado contra [docs/32](32_SPEC_ASSET_ICON_SPLASH.md), substituiu o asset canonico mantendo o mesmo nome e foi propagado para Back/Mobile/Admin |
| 11 | EAS build, keystore e track interno | Infra | Sim | **Preflight técnico preparado no Checkpoint 088** em [docs/39](39_EAS_BUILD_PREFLIGHT_READINESS.md); Checkpoint 089 resolveu avatar/permissões e Checkpoint 091 resolveu asset icon/splash localmente, mas EAS real ainda depende de conta Expo/projeto, keystore, envs por perfil, smoke do artefato assinado e autorizacao explicita |
| 12 | Chat real/UGC/moderação se publicado | Produto/backend/mobile | Sim | **Backend Trust & Safety publicado / smoke end-to-end OK com fixture controlada / Mobile minimo implementado / smoke Mobile autenticado OK com fixture sintetica / cold-start tutor-provider aprovado com rate limit atomico local**: Chat consome endpoints reais desde o Checkpoint 063; Checkpoint 064 adicionou report/bloqueio/admin reports localmente; Checkpoint 068 validou o schema remoto; Checkpoint 069 deployou somente o backend Trust & Safety; Checkpoints 070 e 071 bloquearam por falta de fixture/admin; Checkpoint 072 criou conversa/mensagem sinteticas, validou report de conversa, report de mensagem, block, envio pos-block 403, admin reports e patch para `closed`; Checkpoint 073 implementou report/block no Mobile Chat real e validou UI local sem escrita remota; Checkpoint 074, apos confirmacao literal, validou pelo Mobile report de conversa, report de mensagem, block, erro seguro no envio pos-block e HTTP 403, com cleanup de block e reports novos fechados; Checkpoint 093 adicionou `POST /conversations`, CTA `Message provider`, deep-link seguro para Chat e i18n en-GB; Checkpoint 094 fechou o rate limit atomico de cold-start via RPC SQL e teste e2e focado. Terms e Data Safety finais seguem bloqueados para revisao humano/legal |
| 13 | App Access para review autenticado | Play Console/docs | Sim | **Pacote seguro preparado no Checkpoint 076 / reviewability endurecida no Checkpoint 077 / fixture GO no Checkpoint 083** em [docs/33](33_PLAYSTORE_APP_ACCESS_REVIEWER_PACKAGE.md) e [docs/36](36_PLAYSTORE_REVIEW_FIXTURE_CONFIRMATION.md); Profile expõe Open Settings para legal links, logout e account deletion; credenciais reais continuam fora do repo e devem ser inseridas somente na Play Console; final legal/Data Safety segue bloqueado até aprovação humana |
| 14 | Store Listing e screenshots `en-GB` | Play Console/docs | Sim | **Pacote final preparatório recapturado no Checkpoint 087** em [docs/38](38_PLAYSTORE_FINAL_SCREENSHOTS_READINESS.md), usando fixture GO e Home com greeting real sanitizado; ainda exige smoke do build EAS exato antes de Play Console/internal track |

---

## 14. Decisões que não devem ser inventadas

Antes de produção, ainda não inventar nem preencher por inferência:
- bases legais por finalidade;
- classes exatas de dados retidos até 12 meses, se o texto final exigir esse
  detalhamento;
- declaração de exclusão automática, anonimização automática ou desativação
  imediata enquanto backend/operação não sustentarem;
- declaração final de mensagens/UGC coletados enquanto Terms/Data Safety,
  credenciais reais de App Access na Play Console e revisão humano/legal não
  estiverem fechados para o build com Chat/Trust & Safety validado;
- expansão de Inglaterra para outro mercado sem aprovação;
- screenshots finais em `en-GB` antes de reconfirmar o build submetido e a
  fixture sintética aprovada;
- claims de câmera/foto/avatar upload antes de reintroduzir picker nativo,
  reavaliar permissões, Data Safety e build submetido.

Pacote operacional para aprovação:
- `docs/31_PLAYSTORE_HUMAN_DECISION_PACKAGE.md` consolida os campos pendentes,
  impacto na Play Console, impacto em Privacy/Terms/Data Safety e riscos de
  prometer comportamento não aprovado ou não implementado.
- `docs/33_PLAYSTORE_APP_ACCESS_REVIEWER_PACKAGE.md` consolida o template
  seguro para App Access sem registrar credenciais reais.
- `docs/34_PLAYSTORE_LISTING_SCREENSHOT_PACKAGE.md` consolida copy proposta,
  claims permitidos/proibidos e roteiro seguro de screenshots `en-GB`.
