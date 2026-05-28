# SPEC_PLAYSTORE_RELEASE — Publicação Android

**Versão:** 1.6
**Prioridade:** Google Play Store
**Última revisão:** 2026-05-26
**Fase:** preparação para teste interno e produção futura

---

## 1. Objetivo

Garantir que o app seja desenvolvido e documentado com os requisitos necessários
para submissão à Google Play Store, evitando recusa por problemas previsíveis
de privacidade, dados, permissões, acesso, qualidade ou informações
inconsistentes.

Este documento é checklist de release. A matriz operacional mais atual fica em
`docs/30_PLAYSTORE_RELEASE_READINESS.md`.

O pacote de decisão humano/legal/produto para os campos ainda bloqueados fica em
`docs/31_PLAYSTORE_HUMAN_DECISION_PACKAGE.md`.

O pacote seguro de App Access para revisão autenticada fica em
`docs/33_PLAYSTORE_APP_ACCESS_REVIEWER_PACKAGE.md`.

O pacote preliminar de Store Listing e roteiro seguro de screenshots `en-GB`
fica em `docs/34_PLAYSTORE_LISTING_SCREENSHOT_PACKAGE.md`.

O pacote final preparatório de screenshots após Home com dado real sanitizado
fica em `docs/38_PLAYSTORE_FINAL_SCREENSHOTS_READINESS.md`.

O preflight técnico para EAS build futuro fica em
`docs/39_EAS_BUILD_PREFLIGHT_READINESS.md`.

---

## 2. Estado atual das URLs legais

URLs públicas publicadas no backend DigitalOcean:

- Privacy Policy: `https://stingray-app-vyfrt.ondigitalocean.app/privacy`
- Terms of Use: `https://stingray-app-vyfrt.ondigitalocean.app/terms`
- Account/data deletion: `https://stingray-app-vyfrt.ondigitalocean.app/account-deletion`

Uso previsto na Play Console:

- preencher o campo de Privacy Policy com `/privacy`;
- preencher o campo de data deletion/account deletion com `/account-deletion`;
- manter Terms linkado no app/site.

Limite importante: o fluxo atual permite solicitação de exclusão, mas não
executa exclusão destrutiva automática nem job de anonimização. O Checkpoint
062 aprovou uma política desejada de desativação imediata, anonimização quando
possível e retenção limitada, mas isso ainda não deve ser declarado como
automático enquanto backend/operação não sustentarem.

Decisões documentais aplicadas no Checkpoint 062:

- operador inicial: Vitor Dutra Melo, em desenvolvimento independente até a
  formalização oficial da empresa;
- privacidade: `mailto:petlobbyprivacy@gmail.com`;
- suporte: `mailto:petlobbysupport@gmail.com`;
- mercado inicial: Inglaterra;
- idioma do APK/listing: Inglês da Inglaterra (`en-GB`);
- público-alvo: adulto / `18+` / não child-directed;
- chat real/UGC: aprovado como decisão de produto; Chat texto, denúncia de
  conversa/mensagem, bloqueio e erro seguro pós-block foram validados no Mobile
  real com fixture sintética no Checkpoint 074. Terms/Data Safety finais,
  screenshots/listing, build e preenchimento real da Play Console continuam
  pendentes. O Checkpoint 076 preparou o pacote seguro de App Access; o
  Checkpoint 077 expôs Settings/account deletion via Profile e adicionou
  proteção para arquivos locais de credenciais, mas as credenciais reais devem
  ser preenchidas somente na Play Console.

---

## 3. Checklist técnico Android

- Package name definitivo.
- Nome do app aprovado.
- Ícone adaptativo final.
- Splash screen final.
- VersionCode incremental.
- VersionName semântico.
- Build AAB via EAS.
- Assinatura/keystore configurada.
- Sem logs sensíveis.
- Sem secrets no app.
- Variáveis `EXPO_PUBLIC_*` configuradas no ambiente EAS autorizado, sem
  commitar secrets.
- Manifesto nativo do build exato revisado para permissões efetivas.
- Sem chaves privadas no repositório.
- App não deve crashar em fluxo principal.
- App deve funcionar em dispositivos/telas comuns.

---

## 4. Checklist de conteúdo

- Short description final.
- Full description final.
- Screenshots reais.
- Feature graphic.
- Categoria correta.
- E-mail de suporte.
- Política de privacidade pública.
- Países de distribuição definidos.
- Público-alvo/faixa etária definido.
- Classificação indicativa respondida.
- Data Safety preenchido com base no build real.
- Account deletion preenchido.
- App access configurado se houver login.
- Store Listing e screenshots reconciliados com `en-GB` e com o build real.

---

## 5. App Access para revisão

Como o app possui login, preparar instruções de acesso para revisores. O
template seguro fica em `docs/33_PLAYSTORE_APP_ACCESS_REVIEWER_PACKAGE.md`.

- conta de teste tutor;
- conta de teste prestador somente se provider flow estiver no build;
- conta admin somente se necessária para validar painel ou moderação;
- instruções em inglês;
- ambiente remoto estável;
- dados seedados;
- nenhum OTP impossível para revisor;
- nenhum e-mail real completo, senha, token ou secret em docs.
- credenciais reais preenchidas apenas na Play Console.

Resumo seguro do fluxo real para App Access:

```txt
Reviewer tutor account:
Email: <PLAY_CONSOLE_TEST_TUTOR_EMAIL>
Password: <PLAY_CONSOLE_TEST_TUTOR_PASSWORD>

Test notes:
No real payment is processed in this app. Use providers returned by Home/Search,
then review Provider, Book, Chat and Profile. From Profile, tap Open Settings to
review legal links, sign out and account deletion request/status. Chat and Trust
& Safety review must use only synthetic reviewer data.
```

Estado Checkpoints 076-077:
- pacote App Access preparado como template seguro;
- nenhum e-mail real, senha, token, ID completo ou texto privado foi registrado;
- Mobile usa login e-mail/senha via Supabase Auth;
- não foi encontrado fluxo in-app de OTP/MFA; a conta de review deve estar
  previamente confirmada se o projeto Supabase exigir confirmação por e-mail;
- `android.permissions` está vazio no `app.json`;
- não há pagamento real, checkout, SDK de pagamento ou compra in-app;
- Settings/account deletion está acessível por UI autenticada em Profile >
  Open Settings;
- `.gitignore` ignora `Credenciais.txt` e padrões locais equivalentes de
  credenciais sem registrar conteúdo desses arquivos.

---

## 6. Store Listing e screenshots

O pacote preliminar fica em
`docs/34_PLAYSTORE_LISTING_SCREENSHOT_PACKAGE.md`.

Estado Checkpoints 078-079:
- app name, short description e full description foram preparados como
  **copy proposta**, sem valor legal final;
- claims permitidos/proibidos foram explicitados para evitar promessas de
  garantia, verificação, pagamento protegido, seguro, moderação automática ou
  exclusão automática;
- roteiro de screenshots cobre Login, Home/Search, Provider detail por provider
  real da API, Book sem pagamento real, Chat com dados sintéticos, Profile e
  Profile > Open Settings > Settings/account deletion/legal links;
- screenshots finais ainda dependem do build/ambiente submetido e de fixture
  sintética reutilizável;
- Checkpoint 079 reconciliou a copy visível das telas Mobile críticas para
  screenshots (`Login`, `Sign-up`, `Reset`, `Home`, `Search`,
  `Provider Detail` e `Book`) para `en-GB`; antes de enviar screenshots finais,
  reconfirmar o mesmo estado no build submetido.
- Checkpoint 087 recapturou o pacote preparatório final em
  `Pet_Marketplace_Mobile/docs/playstore-screenshots/checkpoint-087/` após a
  Home passar a usar `/me.profiles.tutor.displayName` com sanitização.
- Checkpoint 088 validou o preflight EAS sem build: o pacote 087 é baseline,
  mas o AAB assinado exato ainda precisa de smoke nativo antes de Play Console.
- Checkpoint 089 resolveu a postura anterior de avatar/permissões, mas o Mobile
  voltou a incluir `expo-image-picker`/`AvatarUploader` para upload de foto de
  perfil. Antes de Play Console, revisar manifesto nativo, Data Safety e Privacy
  contra o AAB exato submetido. O asset 1024x1024 segue bloqueante por não
  existir localmente.

Regras de segurança:
- nenhum e-mail real completo, senha, token, JWT, header, secret, ID completo,
  texto privado de mensagem ou denúncia, dado real de usuário/provider, `.env`,
  `Credenciais.txt`, logs ou ferramenta interna deve aparecer em screenshots;
- App Access continua separado e credenciais reais ficam somente na Play
  Console.

---

## 7. Data Safety

Mapear antes da publicação exatamente o que o build coleta, transmite,
compartilha e protege. O estado preliminar de 2026-05-25 está em
`docs/30_PLAYSTORE_RELEASE_READINESS.md`.

Categorias prováveis no estado atual:

- e-mail;
- ID de usuário/Auth ID;
- nome/perfil quando informado;
- dados de pets;
- endereço/postcode/área pública/coordenadas informadas;
- localização aproximada e, se a resolução efetiva for menor que 3 km, revisar
  possível localização precisa;
- provider/search;
- bookings;
- mensagens texto se o build incluir o recorte de Chat real validado nos
  Checkpoints 063-074;
- reports/denúncias de conversa e mensagem, além de block de conversa, se esse
  recorte Trust & Safety estiver incluído;
- logs técnicos apenas se houver coleta relevante pelo app/SDK.

Categorias que não existem hoje no build/listing aprovado:

- pagamento/transação;
- localização nativa via permissão Android;
- SDK dedicado de analytics/crash/ads/pagamentos.

Decisão atual: avatar upload foi reintroduzido no Mobile via
`expo-image-picker`/`AvatarUploader`. Quando esse fluxo estiver no build
submetido, declarar camera/galeria/fotos como coleta opcional de foto de perfil,
confirmar permissões no manifesto gerado e revisar Data Safety/Privacy antes de
submissão.

Para cada dado, registrar:

- finalidade;
- coleta obrigatória/opcional;
- compartilhamento, incluindo processadores quando aplicável;
- criptografia em trânsito;
- possibilidade de solicitação de exclusão;
- retenção.

---

## 8. Permissões

Na Fase 1, evitar ao máximo:

- câmera;
- microfone;
- arquivos;
- contatos;
- localização em background;
- localização nativa sem necessidade clara.

Se não for necessário, usar endereço digitado/geocodificado e não pedir
permissão de localização. Se uma permissão ou SDK novo for adicionado, atualizar
Data Safety, privacy, store listing e testes antes de release.

---

## 9. Política de privacidade

Obrigatória porque o app coleta dados de conta, perfil, pets, endereço/
localização informada, marketplace e bookings.

Deve explicar:

- quem opera/controla o app;
- quais dados são coletados;
- por que são coletados;
- como são usados;
- com quem podem ser compartilhados;
- retenção;
- exclusão de conta;
- contato;
- direitos do usuário na jurisdição aplicável;
- segurança;
- limitações do marketplace.

Bloqueios ainda abertos após Checkpoint 062:

- bases legais por finalidade;
- detalhamento de classes exatas de dados retidos, se exigido no texto final;
- implementação/runbook de desativação, anonimização e exclusão definitiva;
- reconfirmação das telas e screenshots em `en-GB` no build submetido;
- pacote 34 preparado como roteiro, mas screenshots finais ainda dependem do
  build real e da fixture sintética aprovada;
- Terms/Data Safety finais para Chat texto, UGC e Trust & Safety;
- inserir na Play Console as credenciais reais para o pacote App Access,
  mantendo-as fora do repo/docs;
- reconciliação final de screenshots/listing em `en-GB`;
- moderação operacional/admin review fora da API, sem prometer moderação
  automática.

---

## 10. Exclusão de conta

Estado atual: fechado para solicitação in-app e web.

Fluxos:

- botão em Settings;
- confirmação clara;
- `POST /api/v1/me/deletion-request`;
- `GET /api/v1/me/deletion-request`;
- link público `/account-deletion` para uso após desinstalação;
- resposta pública genérica que não revela existência de conta.

Ainda pendente para produção madura:

- definir operação de verificação de propriedade;
- definir exclusão/anonimização real quando aplicável;
- não prometer exclusão imediata automática enquanto isso não existir.

Política aprovada em alto nível no Checkpoint 062:

- após exclusão da conta, alguns dados poderão ser mantidos por até 12 meses
  para fins legais, segurança, prevenção de fraude e resolução de disputas;
- a conta deve ser desativada imediatamente e dados pessoais anonimizados quando
  possível, mas o build atual ainda não implementa esse comportamento.

---

## 11. Público-alvo

Checkpoint 062 definiu público adulto, documentado como `18+` e não
child-directed.

- não tratar o app como child-directed;
- evitar copy, imagens e onboarding que pareçam direcionados a crianças;
- se crianças entrarem no target audience, aplicar requisitos de Families e
  reavaliar dados, login, SDKs, UGC e ads.

---

## 12. Qualidade mínima antes de enviar

Não enviar se houver:

- crash em login/cadastro;
- tela vazia sem explicação;
- botão principal sem ação;
- permissão sem justificativa;
- política de privacidade ausente ou inconsistente;
- Data Safety inconsistente com app;
- conta de teste inválida;
- conteúdo placeholder tratado como real;
- idioma aprovado como `en-GB`, mas ainda misturado no APK/listing;
- promessa de pagamento/seguro/verificação não implementada.

---

## 13. Etapas recomendadas de release

1. Fechar pendências de asset 1024x1024 e postura de permissões/avatar.
2. Configurar projeto/conta EAS, keystore e variáveis `EXPO_PUBLIC_*`.
3. Rodar EAS build somente após autorização explícita.
4. Testar o artefato assinado em dispositivo Android real.
5. Repetir smoke Login, Home, Search, Provider Detail, Book, Chat, Profile e
   Settings/account deletion no build exato.
6. Corrigir crashes e inconsistências.
7. Fechar aprovação humano/legal de Data Safety, bases legais e retenção.
8. Preencher Play Console apenas depois do smoke e da aprovação legal.
9. Submeter para Internal Testing.
10. Validar review.
11. Preparar Closed Testing, se necessário.
12. Preparar produção.

---

## 14. Referências oficiais

Rechecadas em 2026-05-25 para esta revisão documental:

- Google Play User Data policy: https://support.google.com/googleplay/android-developer/answer/10144311
- Google Play Data Safety: https://support.google.com/googleplay/android-developer/answer/10787469
- Google Play User-generated content policy: https://support.google.com/googleplay/android-developer/answer/9876937
- Google Play UGC moderation requirements: https://support.google.com/googleplay/android-developer/answer/12923286
- Google Play account deletion: https://support.google.com/googleplay/android-developer/answer/13327111
- Google Play Families policies: https://support.google.com/googleplay/android-developer/answer/9893335
- Android Core App Quality: https://developer.android.com/docs/quality-guidelines/core-app-quality
- Google Play Prepare your app for review / App access: https://support.google.com/googleplay/android-developer/answer/9859455
- Google Play requirements for login credentials: https://support.google.com/googleplay/android-developer/answer/15748846
- Google Play store listing setup: https://support.google.com/googleplay/android-developer/answer/9859152
- Google Play preview assets and screenshots: https://support.google.com/googleplay/android-developer/answer/9866151
- Google Play icon design specifications: https://developer.android.com/google-play/resources/icon-design-specifications
