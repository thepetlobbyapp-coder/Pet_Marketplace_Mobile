# SPEC_PRIVACY_DATA_SAFETY — Privacidade, UK GDPR e Data Safety

**Versão:** 1.6
**Última revisão:** 2026-05-26
**País/mercado:** Inglaterra
**Fase:** Play Store readiness documental

---

## 1. Princípios

- Coletar apenas o necessário.
- Explicar finalidade de cada dado.
- Proteger dados em trânsito e em repouso conforme infraestrutura.
- Permitir solicitação de exclusão de conta pelo app e pela web.
- Não expor endereço exato, telefone ou coordenadas exatas de terceiros.
- Não coletar documentos de prestador na Fase 1.
- Não coletar dados veterinários sensíveis sem necessidade.
- Não processar pagamento na Fase 1.
- Não prometer exclusão destrutiva automática enquanto ela não existir.

---

## 2. URLs legais atuais

Publicadas no backend DigitalOcean em 2026-05-24:

- Privacy Policy: `https://stingray-app-vyfrt.ondigitalocean.app/privacy`
- Terms of Use: `https://stingray-app-vyfrt.ondigitalocean.app/terms`
- Account deletion: `https://stingray-app-vyfrt.ondigitalocean.app/account-deletion`

O texto publicado é conservador e compatível com a implementação atual. O
Checkpoint 062 aprovou controlador inicial, contatos oficiais, mercado,
idioma, público adulto, retenção em alto nível, política desejada de
exclusão/anonimização e chat real como decisão de produto. Bases legais por
finalidade continuam pendentes.

Checkpoint 074 validou o recorte mínimo de Chat real e Trust & Safety no Mobile
autenticado com fixture sintética: conversa/mensagem reais via API, report de
conversa, report de mensagem, block, erro seguro pós-block e HTTP 403 esperado.
Essa validação não fecha Terms/Data Safety finais nem autoriza inventar bases
legais, retenção detalhada, exclusão automática ou moderação automática.

Checkpoint 084 consolidou a matriz final de Legal/Data Safety em
`docs/37_PLAYSTORE_LEGAL_DATA_SAFETY_CLOSURE.md`. O estado operacional e:
screenshots finais GO COM RESSALVAS com a fixture reviewer aprovada no
Checkpoint 083; EAS/build futuro GO COM RESSALVAS apenas para preparacao
tecnica; Play Console/Data Safety final NO-GO ate aprovacao humana de bases
legais por finalidade e classes de retencao.

Checkpoint 089 definiu a postura Play-ready de avatar/permissoes: upload de
avatar por camera/galeria fica fora do build, `expo-image-picker` foi
removido/deferido do Mobile e a UI de Profile renderiza apenas avatar read-only
quando a API ja retorna `avatarUrl`. Portanto nao declarar coleta de fotos do
dispositivo/camera para este recorte ate a feature ser reintroduzida e
revisada.

Checkpoint 093 documentou o cold-start de conversa tutor-provider: tutor
autenticado pode abrir ou retomar conversa texto com provider via
`POST /api/v1/conversations`; Provider Detail navega para
`/chat?conversationId=<uuid>`; Chat abre a thread somente quando o id existe na
lista autenticada. O recorte nao adiciona novas categorias de dados: continua
texto de mensagem, metadados de conversa, reports/block existentes, sem anexos,
midia, push, realtime ou offline queue.

Decisões documentais vigentes:

- operador inicial: Vitor Dutra Melo, em desenvolvimento independente até a
  formalização oficial da empresa;
- privacidade: `mailto:petlobbyprivacy@gmail.com`;
- suporte: `mailto:petlobbysupport@gmail.com`;
- idioma: Inglês da Inglaterra (`en-GB`);
- público-alvo: adulto / `18+` / não child-directed.

As perguntas e campos de aprovação ficam consolidados em
`docs/31_PLAYSTORE_HUMAN_DECISION_PACKAGE.md`.

---

## 3. Dados tratados na Fase 1 atual

| Dado | Status atual | Finalidade | Observação |
|---|---|---|---|
| E-mail | Coletado | Conta, login, suporte e exclusão | Via Supabase Auth |
| Senha/token | Coletado/processado via Auth | Autenticação | Não armazenar senha em texto puro; não registrar tokens em docs/logs |
| ID de usuário/Auth ID | Coletado | Conta, autorização, auditoria e segurança | Não expor a outros usuários |
| Nome/perfil tutor | Coletado quando preenchido | Conta e marketplace | Evitar nome legal obrigatório |
| Perfil provider | Backend suporta; onboarding final pendente | Marketplace | Não prometer provider onboarding completo antes de estar pronto |
| Telefone | Não coletado no build atual | — | Só coletar se houver necessidade e atualização de docs |
| Endereço/postcode/área pública | Coletado quando usado | Proximidade, endereço padrão e booking | Não expor endereço completo |
| Coordenadas informadas | Coletadas quando endereço é salvo | Busca por distância | Declarar localização; revisar precisão efetiva no Data Safety |
| Dados do pet | Coletados | Serviço solicitado e booking | Minimizar notas sensíveis |
| Providers/search | Processado | Descoberta de prestadores | Respostas seguras com distância aproximada |
| Bookings | Coletado/processado | Solicitação e acompanhamento | Sem pagamento |
| Mensagens texto | Mobile consome Chat real via REST quando o build inclui o recorte dos Checkpoints 063-074 e o cold-start tutor-provider do Checkpoint 093 | Comunicação do serviço | Texto apenas; sem anexos, mídia, realtime, push ou offline queue |
| Denúncias/reports de Chat | Implementadas para conversa e mensagem no recorte Trust & Safety validado no Checkpoint 074 | Confiança, suporte e segurança | Exigem Terms/UGC e revisão humano/legal antes da declaração final |
| Bloqueios de conversa | Implementados para Chat 1:1 no recorte Trust & Safety validado no Checkpoint 074 | Segurança e controle de interação direta | Envio pós-block retorna 403 e erro seguro no Mobile |
| Avaliações/reviews | Não implementadas como fluxo real atual | Confiança futura | Não declarar como coleta/UGC real até existir no build |
| Logs técnicos | Limitados ao necessário | Segurança/diagnóstico | Evitar payload/PII; crash/analytics SDK não existe hoje |

---

## 4. Dados não coletados hoje

- Dados de cartão.
- Dados bancários.
- Documentos de identidade.
- DBS check.
- Licenças profissionais.
- Dados biométricos.
- Fotos/vídeos no chat.
- Fotos do dispositivo, camera ou galeria para avatar upload no build
  Play-ready atual.
- Áudio.
- Anexos ou mídia em mensagens.
- Realtime/push/offline queue de Chat.
- Contatos do dispositivo.
- Localização em background.
- Localização nativa via permissão Android.
- Advertising ID.
- SDK dedicado de analytics/crash/ads/pagamentos.

---

## 5. Finalidades permitidas

- criar e manter conta;
- autenticar e autorizar acesso;
- conectar tutores e prestadores;
- permitir busca por proximidade;
- permitir agendamento/booking;
- permitir comunicacao por Chat texto, incluindo abrir/retomar conversa com
  provider, quando o build incluir o recorte real;
- receber solicitações de exclusão;
- receber denúncias/reports de conversa e mensagem quando o build incluir o
  recorte Trust & Safety validado;
- registrar bloqueio de conversa para controle de interação direta quando o
  build incluir esse recorte;
- proteger a plataforma;
- armazenar dados necessários para funcionamento da plataforma, segurança,
  agendamentos, pagamentos quando existirem, prevenção de fraudes e suporte,
  mediante aceite dos termos e política de privacidade;
- cumprir exigências legais, operacionais e de loja.

Não usar dados para:

- venda de dados pessoais;
- rastreamento oculto;
- publicidade comportamental sem consentimento e documentação;
- finalidades não declaradas;
- claims de segurança, verificação, seguro ou pagamento que não existam.

---

## 6. UK GDPR / privacidade

A política final deve refletir:

- transparência;
- finalidade específica;
- minimização de dados;
- segurança;
- direito de acesso;
- direito de correção;
- direito de exclusão, quando aplicável;
- retenção proporcional;
- contato para solicitações;
- controlador/empresa responsável.

Decisões e bloqueios atuais:

- controlador legal inicial definido no Checkpoint 062;
- contatos oficiais definidos no Checkpoint 062;
- mercado inicial definido como Inglaterra;
- bases legais por finalidade ainda não definidas;
- retenção aprovada em alto nível como até 12 meses após exclusão para fins
  legais, segurança, prevenção de fraude e resolução de disputas;
- exclusão/anonimização aprovada como política desejada, mas backend/operação
  ainda não implementam desativação imediata, job destrutivo ou anonimização.

---

## 7. Segurança

Obrigatório:

- HTTPS;
- senhas nunca armazenadas em texto puro;
- tokens seguros;
- secrets fora do app e do repositório;
- logs sem senha/token/Authorization header;
- permissões mínimas;
- rate limit;
- controle de acesso por papel;
- isolamento entre usuários.

Desejável antes de produção:

- observabilidade com mascaramento de dados;
- auditoria para ações admin;
- backups;
- alertas de erro;
- runbook operacional de exclusão/anonimização.

---

## 8. Localização e endereço

Regras:

- usar coordenadas para busca, não para exposição pública;
- retornar distância aproximada;
- esconder endereço completo de outros usuários;
- permitir usuário editar endereço;
- não solicitar localização em background;
- não solicitar permissão nativa de localização enquanto endereço digitado for
  suficiente;
- se coordenadas puderem identificar localização com precisão menor que 3 km,
  revisar a classificação de localização precisa/aproximada no Play Console.

---

## 9. Mensagens, UGC e moderação

Na Fase 1 planejada:

- chat somente texto;
- sem anexos;
- acesso apenas aos participantes do booking e admin quando necessário para
  denúncia/moderação;
- conteúdo pode ser usado para investigar denúncia, se informado na política.

Estado atual:

- Checkpoint 062 aprovou chat real/UGC como decisão de produto.
- Backend possui endpoints de conversations/messages, reports, block e admin
  review/status via API.
- Mobile consome conversations/messages reais via REST desde o Checkpoint 063.
- Checkpoint 073 implementou no Mobile report de conversa, report de mensagem,
  confirmação de block e tratamento seguro de 403 pós-block.
- Checkpoint 074 validou esse fluxo no Mobile autenticado com fixture sintética
  e cleanup seguro.
- Checkpoint 093 adicionou abertura/retomada de conversa tutor-provider pelo
  Provider Detail com deep-link seguro para Chat: o id recebido pela URL so abre
  se existir na lista autenticada do usuario.
- Não há anexos, mídia, realtime, push, offline queue ou moderação automática.
- Admin review existe via backend/API; Admin UI final não é parte deste recorte.
- Antes de submissão, Terms/Data Safety finais ainda precisam de revisão
  humano/legal, sem inventar bases legais, classes exatas de retenção ou
  automação de exclusão/moderação.

---

## 10. Exclusão de conta

Implementado para solicitação:

- opção dentro do app;
- confirmação;
- registro da solicitação;
- link web público pós-desinstalação;
- resposta pública que não revela existência de conta.

Ainda não implementado:

- exclusão destrutiva automática;
- job automático de anonimização;
- desativação imediata da conta;
- runbook operacional final de verificação e execução.

Requisito documental:

- explicar que alguns dados podem ser retidos por até 12 meses quando
  necessário para obrigações legais, segurança, prevenção de fraude, disputas,
  auditoria ou integridade do serviço;
- explicar que a política desejada combina desativação imediata, anonimização
  quando possível e retenção temporária antes da exclusão definitiva, sem
  declarar automação enquanto ela não existir;
- não prometer prazo/comportamento que backend/operação ainda não sustentam.

---

## 11. Data Safety — orientação atual

Este documento não substitui o preenchimento final da Play Console. O
preenchimento deve ser feito contra o APK e backend efetivamente submetidos.

Provável declaração preliminar:

- dados pessoais: e-mail, ID de usuário, perfil quando preenchido;
- localização/endereço: endereço/postcode/área pública e coordenadas
  informadas para busca; revisar precisão efetiva;
- conteúdo do usuário: pets, bookings e mensagens texto quando o build incluir
  o Chat real validado, incluindo abertura/retomada de conversa com provider;
  reports de conversa/mensagem e block quando o build incluir o recorte Trust &
  Safety validado; reviews somente quando implementadas;
- app activity/logs técnicos: apenas o que existir de fato no build/SDKs;
- camera/galeria/fotos do dispositivo: não declarar no build Play-ready do
  Checkpoint 089; avatar upload foi deferido e não há `expo-image-picker`;
- pagamentos: não;
- analytics/crash SDK: não hoje;
- criptografia em trânsito: sim;
- exclusão de dados: solicitação via app e web;
- compartilhamento/venda: não vender dados; processadores de infraestrutura
  precisam estar refletidos na Privacy Policy.

---

## 12. Referências oficiais

Rechecadas em 2026-05-25:

- UK GDPR / Data Protection Act 2018: https://www.gov.uk/data-protection
- ICO Data minimisation: https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/data-protection-principles/a-guide-to-the-data-protection-principles/data-minimisation/
- Google Play User Data policy: https://support.google.com/googleplay/android-developer/answer/10144311
- Google Play Data Safety: https://support.google.com/googleplay/android-developer/answer/10787469
- Google Play User-generated content policy: https://support.google.com/googleplay/android-developer/answer/9876937
- Google Play UGC moderation requirements: https://support.google.com/googleplay/android-developer/answer/12923286
- Google Play account deletion: https://support.google.com/googleplay/android-developer/answer/13327111
- Google Play Families policies: https://support.google.com/googleplay/android-developer/answer/9893335
