# PLAYSTORE_HUMAN_DECISION_PACKAGE - The Pet Lobby

**Data:** 2026-05-25
**Status:** pacote de decisao humano/legal/produto para Play Console.
**Ultima atualizacao:** Checkpoint 079 - copy visivel das telas Mobile criticas
para screenshots reconciliada para `en-GB`, sem gerar build e sem Play Console
real.
Campos sem valor real ou sem mapeamento suficiente continuam `PENDENTE`;
nenhuma resposta legal foi inferida.
**Escopo:** documentacao; sem backend, admin, migration, deploy, EAS build,
seed, Play Console real, escrita remota ou smoke autenticado remoto.

Este documento transforma os blockers remanescentes do Checkpoint 057 em uma
matriz objetiva para aprovacao. Ele nao substitui revisao juridica e nao deve
ser usado para inventar respostas legais, contatos oficiais ou decisoes de
produto ainda nao aprovadas.

Fontes internas revisadas neste recorte:
- `docs/30_PLAYSTORE_RELEASE_READINESS.md`
- `docs/10_SPEC_PLAYSTORE_RELEASE.md`
- `docs/11_SPEC_PRIVACY_DATA_SAFETY.md`
- `docs/33_PLAYSTORE_APP_ACCESS_REVIEWER_PACKAGE.md`
- `docs/34_PLAYSTORE_LISTING_SCREENSHOT_PACKAGE.md`
- `docs/PROGRESS.md`
- copias equivalentes em `Pet_Marketplace_Back/docs/`,
  `Pet_Marketplace_Mobile/docs/` e `Pet_Marketplace_Admin/docs/`

Fontes internas historicas relevantes:
- docs iniciais descrevem marketplace no Reino Unido e app final em `en-GB`;
- readiness anterior registrava pendencia porque havia mistura/pivot recente de
  idioma e mercado nas telas e rascunhos;
- no Checkpoint 062, mercado e idioma receberam decisao explicita: Inglaterra e
  Ingles da Inglaterra. Isso nao refatora o Mobile neste recorte.

---

## 0. Aplicacao de decisoes - Checkpoint 059

Entrada recebida neste recorte:
- todos os campos humano/legal/produto vieram como placeholders:
  `<PREENCHER OU DEIXAR PENDENTE>` ou `<SIM/NAO/PENDENTE>`;
- nenhum nome legal de controlador, contato oficial, base legal, jurisdicao,
  politica de retencao/exclusao/anonimizacao, faixa etaria, mercado, idioma ou
  decisao de chat/UGC foi fornecido como aprovacao concreta.

Resultado aplicado:

| Area | Status apos recorte | Motivo |
|---|---|---|
| Decisoes aplicadas | Nenhuma | Nao houve valor aprovado ou fonte explicita nova. |
| Campos mantidos como `PENDENTE` | Todos os campos da secao 3 | Placeholders nao sao aprovacao humano/legal/produto. |
| Reconciliacao mercado/idioma | Nao aplicada | UK/`en-GB` segue evidencia historica, mas a mistura pt-BR/en-GB ainda bloqueia decisao final. |
| Chat real/UGC | Nao aplicado naquele recorte | Entrada nao escolheu `SIM` nem `NAO`; estado historico superado pelos Checkpoints 063-075. |
| Data Safety de mensagens | Mantido conservador naquele recorte | Sem decisao tecnica naquele momento; estado historico superado pelos Checkpoints 063-075. |
| Recheck oficial Google Play | Nao executado | Este recorte nao transformou pendencias em instrucao final de preenchimento da Play Console. |

Resumo para Play Console apos este recorte:
- preparar URLs publicas e declaracoes tecnicas seguras da secao 1;
- nao submeter campos legais/produto bloqueados como se estivessem aprovados;
- naquele recorte, nao declarar chat/mensagens como coleta real sem suporte
  tecnico validado;
- nao declarar exclusao destrutiva automatica.

---

## 0.1 Aplicacao de decisoes - Checkpoint 060

Entrada recebida neste recorte (segunda tentativa apos Checkpoint 059):
- todos os campos humano/legal/produto vieram novamente como placeholders
  `<VALOR REAL OU PENDENTE>` e `<SIM/NAO/PENDENTE>`;
- nenhum nome legal de controlador, contato oficial de privacidade, contato
  oficial de suporte, jurisdicao, base legal por finalidade, politica de
  retencao, politica de exclusao/anonimizacao, faixa etaria, mercado/paises,
  idioma final ou decisao de chat/UGC foi fornecido como aprovacao concreta.

Resultado aplicado:

| Area | Status apos recorte | Motivo |
|---|---|---|
| Decisoes aplicadas | Nenhuma | A entrada repetiu placeholders; nao houve valor real aprovado nem fonte explicita nova. |
| Campos mantidos como `PENDENTE` | Todos os campos da secao 3 | Placeholders nao constituem aprovacao humano/legal/produto. |
| Reconciliacao mercado/idioma | Nao aplicada | Mercado e idioma final do APK/listing continuam sem decisao; UK/`en-GB` segue apenas como evidencia historica. |
| Chat real/UGC no primeiro build | Nao aplicado naquele recorte | A entrada nao escolheu `SIM` nem `NAO`; estado historico superado pelos Checkpoints 063-075. |
| Data Safety de mensagens | Mantido conservador naquele recorte | Sem decisao de habilitar chat real naquele momento; estado historico superado pelos Checkpoints 063-075. |
| Account deletion | Mantido como solicitacao | Sem politica final de retencao/exclusao/anonimizacao, manter apenas declaracao de solicitacao in-app + web. |
| Impacto na Play Console | Inalterado | Continuam preenchiveis apenas os campos seguros listados na secao 1; demais campos bloqueados. |
| Impacto em Privacy/Terms/Data Safety | Inalterado | Sem decisao humana, conteudo dos documentos publicos nao deve ser ampliado para prometer alem do build atual. |
| Recheck oficial Google Play | Nao executado | Este recorte nao transformou pendencias em instrucao final de preenchimento da Play Console. |

Risco residual antes de submissao apos o Checkpoint 060:
- submeter Privacy/Terms/Data Safety sem controlador, contato e bases legais
  reais publica documentos legalmente incompletos;
- preencher Play Console com chute de mercado/idioma/publico-alvo cria
  inconsistencia com APK/listing e pode causar rejeicao;
- prometer exclusao/anonimizacao automatica sem politica e sem runbook gera
  declaracao falsa;
- publicar chat real/UGC sem decisao formal exige Mobile integrado, moderacao,
  denuncia, bloqueio e Terms atualizados antes da submissao.

---

## 0.2 Aplicacao de decisoes - Checkpoint 062

Entrada real recebida neste recorte:
- controlador/operador inicial: Vitor Dutra Melo, em desenvolvimento
  independente ate a formalizacao oficial da empresa;
- contato oficial de privacidade: `mailto:petlobbyprivacy@gmail.com`;
- contato oficial de suporte: `mailto:petlobbysupport@gmail.com`;
- jurisdicao/mercado inicial: somente Inglaterra;
- idioma final: Ingles da Inglaterra (`en-GB`);
- publico-alvo: adulto, ajustado documentalmente como `18+` e nao
  child-directed;
- armazenamento de dados necessario para funcionamento da plataforma,
  seguranca, agendamentos, pagamentos quando existirem, prevencao de fraudes e
  suporte, mediante aceite dos termos e politica de privacidade;
- retencao apos exclusao: alguns dados poderao ser mantidos por ate 12 meses
  para fins legais, seguranca, prevencao de fraude e resolucao de disputas;
- fluxo de exclusao: conta desativada imediatamente, dados pessoais
  anonimizados quando possivel, e algumas informacoes retidas temporariamente
  por questoes legais, financeiras e de seguranca antes da exclusao definitiva;
- chat real/UGC no primeiro build: `SIM`.

Registro de aprovacao:
- data de aplicacao documental: `2026-05-25`;
- aprovador formal/nome de responsavel pela aprovacao nao foi fornecido; a
  matriz usa `Solicitante Checkpoint 062 (nome formal nao informado)` para nao
  inventar uma identidade de aprovador.

Resultado aplicado:

| Area | Status apos recorte | Motivo |
|---|---|---|
| Controlador/operador | `APROVADO` | Valor real fornecido: Vitor Dutra Melo, desenvolvimento independente ate formalizacao oficial da empresa. |
| Contatos oficiais | `APROVADO` | Canais publicos monitorados informados para privacidade e suporte. |
| Jurisdicao/mercado | `APROVADO` | Entrada final: somente Inglaterra. |
| Idioma APK/listing | `APROVADO` | Entrada final: Ingles da Inglaterra (`en-GB`). |
| Faixa etaria | `APROVADO` | Entrada final: adulto; documentado como `18+` e nao child-directed. |
| Retencao | `APROVADO COM LIMITE` | Prazo maximo de ate 12 meses informado, mas as classes exatas de dados retidos nao foram detalhadas. |
| Exclusao/anonimizacao | `APROVADO COM BLOQUEIO TECNICO` | Politica produto/legal foi informada, mas backend atual so registra solicitacao; nao ha desativacao imediata, job destrutivo ou job de anonimizacao. |
| Bases legais por finalidade | `PENDENTE` | O texto recebido define finalidades/necessidade e aceite, mas nao mapeia base legal por finalidade. |
| Chat real/UGC | `APROVADO / TECNICAMENTE VALIDADO PARA CHAT TEXTO MINIMO` | Decisao de produto e `SIM`; Mobile consome Chat real e Checkpoint 074 validou report de conversa, report de mensagem, block e erro seguro pos-block com fixture sintetica. Checkpoint 076 preparou o pacote App Access; Checkpoint 077 expos Settings/account deletion via Profile e protegeu arquivos locais de credenciais; Checkpoint 078 preparou o roteiro de screenshots com Chat sintetico. Terms/Data Safety finais e credenciais reais na Play Console seguem pendentes. |
| Data Safety de mensagens | Preliminar reconciliado | Mensagens texto, reports e block podem ser inventariados se o build incluir o recorte validado; declaracao final ainda depende de Terms/Data Safety humano/legal. |
| Reconciliacao Mobile/i18n | Aplicada no recorte critico de screenshots | Mercado/idioma foram aprovados; Checkpoint 078 preparou copy proposta e roteiro, e Checkpoint 079 reconciliou a copy visivel de Login, Sign-up, Reset, Home, Search, Provider Detail e Book para `en-GB`. Screenshots finais ainda dependem do build submetido e fixture sintetica aprovada. |

Impacto direto na Play Console:
- ja pode preparar Privacy Policy URL, account deletion URL, Terms URL,
  contatos oficiais, idioma de listing `en-GB`, publico-alvo adulto/`18+` e
  decisao documental de mercado como Inglaterra;
- nao ampliar a distribuicao para outro mercado por inferencia;
- se a Play Console nao oferecer Inglaterra como unidade isolada de pais/regiao,
  registrar bloqueio operacional antes de escolher uma alternativa mais ampla;
- declarar chat/mensagens/reports/block somente se o build submetido incluir o
  recorte real validado nos Checkpoints 063-074, mantiver o caminho Profile >
  Open Settings para account deletion e tiver App Access preenchido com
  credenciais reais somente na Play Console;
- nao declarar exclusao automatica/desativacao imediata/anonimizacao automatica
  enquanto backend/operacao nao sustentarem esse comportamento.

Impacto em Privacy/Terms/Data Safety:
- Privacy/Terms devem identificar Vitor Dutra Melo como operador inicial e
  explicar que a empresa ainda nao esta formalizada;
- Privacy/Terms/account deletion devem trocar os contatos placeholder pelos
  canais oficiais aprovados;
- Privacy/Terms devem refletir Inglaterra/`en-GB` e nao tratar LGPD/Brasil como
  regime inicial;
- Privacy/Terms podem registrar o prazo de ate 12 meses para retencao limitada
  apos exclusao, sem inventar quais dados entram em cada classe;
- Data Safety preliminar deve reconhecer mensagens texto e reports/block quando
  o build incluir o recorte real validado;
- Terms/Data Safety finais ainda precisam de revisao humano/legal antes de
  publicar Chat real/UGC, sem prometer moderacao automatica.

Risco residual antes de submissao apos o Checkpoint 062:
- bases legais por finalidade seguem pendentes e podem bloquear a versao final
  de Privacy/Terms;
- retencao aprovada em alto nivel ainda nao especifica classes exatas de dados;
- account deletion aprovado como politica desejada nao existe tecnicamente alem
  da solicitacao in-app + web;
- chat real aprovado como decisao de produto existe no Mobile e foi validado
  com fixture sintetica; o template de App Access existe e Settings/account
  deletion tem caminho visivel por Profile, mas Terms/Data Safety finais,
  credenciais reais na Play Console e operacao de review ainda bloqueiam
  submissao final;
- idioma/mercado aprovados exigem recorte separado para reconciliar telas,
  screenshots e listing em `en-GB`.

---

## 1. Itens ja seguros para preenchimento preliminar

Estes campos podem ser preparados com base na implementacao/documentacao atual,
desde que o APK submetido continue equivalente ao estado validado ate o
Checkpoint 077:

| Area Play Console | Valor operacional seguro | Condicao |
|---|---|---|
| Privacy Policy URL | `https://stingray-app-vyfrt.ondigitalocean.app/privacy` | URL publica mantida ativa e coerente com o build |
| Account/data deletion URL | `https://stingray-app-vyfrt.ondigitalocean.app/account-deletion` | Declarar solicitacao de exclusao, nao exclusao automatica imediata |
| Data deletion availability | Sim, usuario pode solicitar pelo app e pela web | Sem prometer delecao destrutiva automatica, desativacao imediata ou anonimizacao ate existir suporte tecnico/operacional |
| Terms publicos | `https://stingray-app-vyfrt.ondigitalocean.app/terms` | Manter linkado no app/site; revisar conteudo final apos decisoes legais |
| Controlador/operador inicial | Vitor Dutra Melo; desenvolvimento independente ate formalizacao oficial da empresa | Usar essa formulacao ate haver empresa formalmente constituida |
| Contato de privacidade | `mailto:petlobbyprivacy@gmail.com` | Canal publico monitorado informado neste checkpoint |
| Contato de suporte | `mailto:petlobbysupport@gmail.com` | Canal publico monitorado informado neste checkpoint |
| Mercado inicial documentado | Inglaterra | Nao expandir para outro mercado por inferencia; validar seletor real da Play Console |
| Idioma final do APK/listing | Ingles da Inglaterra (`en-GB`) | Checkpoint 079 reconciliou a copy visivel das telas criticas para screenshots; reconfirmar no build submetido antes da captura final |
| Publico-alvo | Adulto / `18+` / nao child-directed | Evitar Families/child-directed se copy, screenshots e produto continuarem adultos |
| Retencao pos-exclusao | Ate 12 meses para fins legais, seguranca, prevencao de fraude e resolucao de disputas | Nao inventar classes exatas de dados; detalhar antes de texto legal final se necessario |
| Payments | Nao ha pagamento in-app no build atual | Reavaliar se Stripe/checkout/transacao entrar |
| Android permissions | `[]` | Reavaliar se localizacao nativa, camera, arquivos, push etc. forem adicionados |
| Analytics/crash/ads SDK dedicado | Ausente no Mobile atual | Reavaliar se Sentry/Firebase/Ads/analytics forem adicionados |
| Chat/mensagens | Decisao de produto: `SIM`; Mobile consome endpoints reais e Checkpoint 074 validou Chat texto + report/block com fixture sintetica | Inventariar mensagens texto e reports/block apenas se o build submetido incluir esse recorte; declaracao final depende de Terms/Data Safety humano/legal |
| App Access autenticado | Template seguro preparado em `docs/33_PLAYSTORE_APP_ACCESS_REVIEWER_PACKAGE.md`; Settings/account deletion acessivel por Profile > Open Settings | Inserir credenciais reais somente na Play Console; nao registrar e-mail completo, senha, token, ID completo ou texto privado no repo/docs |
| Store Listing e screenshots `en-GB` | Copy proposta e roteiro seguro preparados em `docs/34_PLAYSTORE_LISTING_SCREENSHOT_PACKAGE.md` | Nao usar como copy legal final; gerar screenshots finais somente do build submetido com fixture sintetica aprovada e UI reconciliada em `en-GB` |

---

## 2. Matriz de decisoes e impactos apos Checkpoint 062

| Item | Decisao existente? | Pergunta/acao restante | Impacto na Play Console | Impacto em Privacy/Terms/Data Safety | Risco se prometer sem implementar/aprovar |
|---|---|---|---|---|---|
| Controlador/empresa responsavel | Sim: Vitor Dutra Melo, desenvolvimento independente ate formalizacao oficial da empresa. | Atualizar se/ quando houver empresa formal, endereco ou registro oficial. | Pode preencher declaracoes de contato/confianca e suportar textos legais. | Privacy/Terms devem identificar este operador inicial. | Usar empresa nao formalizada ou omitir operador gera politica incompleta/enganosa. |
| Contato oficial de privacidade/suporte | Sim: `petlobbyprivacy@gmail.com` e `petlobbysupport@gmail.com`. | Garantir monitoramento operacional dos canais. | Campo de suporte/listing e contato de privacidade podem ser preparados. | Privacy/Terms/account deletion devem apontar os canais reais. | Canal nao monitorado falha suporte, direitos do usuario e possivel review. |
| Bases legais por finalidade | Nao. Texto recebido fala em necessidade, aceite e finalidades, mas nao escolhe base legal por finalidade. | Definir base legal para conta, marketplace, busca, booking, suporte, seguranca, fraude e eventuais pagamentos. | Bloqueia preenchimento legal final e textos definitivos. | Privacy precisa mapear direitos, bases legais e linguagem juridica. | Transformar "aceite" em base legal por chute cria risco juridico. |
| Retencao | Sim, em alto nivel: ate 12 meses apos exclusao para fins legais, seguranca, fraude e disputas. | Detalhar quais dados entram em retencao, quando aplicavel. | Account deletion pode explicar retencao limitada sem prometer delecao imediata universal. | Privacy/Terms devem refletir prazo de ate 12 meses e excecoes. | Dizer que tudo apaga imediatamente contradiz a decisao aprovada. |
| Exclusao e anonimizacao | Sim como politica desejada; backend atual so registra solicitacao. | Implementar ou documentar runbook de desativacao, anonimizacao, exclusao definitiva, verificacao de propriedade e responsavel operacional. | Account deletion deve continuar declarando solicitacao enquanto o build nao sustentar acao automatica. | Privacy/Terms podem falar da politica pretendida apenas se tambem explicitarem limites operacionais atuais. | Prometer desativacao imediata/anonimizacao/exclusao definitiva sem suporte tecnico gera declaracao falsa. |
| Faixa etaria/publico-alvo Play Console | Sim: adulto / `18+` / nao child-directed. | Garantir que app, copy e screenshots nao parecam direcionados a criancas. | Target audience and content pode ser preparado como adulto. | Privacy/Terms/Data Safety nao precisam assumir publico infantil neste recorte. | Conteudo visual ou copy infantil pode conflitar com a decisao e acionar Families. |
| Idioma/mercado final do APK e listing | Sim: Inglaterra e Ingles da Inglaterra (`en-GB`). | Usar `docs/34` como pacote preliminar e reconfirmar a UI `en-GB` no build submetido antes de screenshots finais. | Store listing/language podem ser preparados em `en-GB`; distribuicao deve refletir Inglaterra sem ampliar por inferencia. | Privacy/Terms devem ficar coerentes com usuarios na Inglaterra. | APK/listing/screenshots com idioma misturado pode parecer placeholder e prejudicar review. |
| Chat real/UGC no primeiro build | Sim como decisao de produto; Chat texto e Trust & Safety minimo validados no Mobile ate o Checkpoint 074. | Fechar Terms/Data Safety humano/legal, preencher App Access real somente na Play Console e confirmar operacao de review antes da submissao. | Pode inventariar mensagens texto e reports/block se o build incluir esse recorte; nao preencher declaracao final sem revisao. | Terms/Privacy precisam cobrir mensagens, conteudo de usuario, moderacao humana/API, denuncia, block e acesso admin antes da publicacao. | Publicar UGC sem Terms/review operacional/App Access real ou declarar automacao que nao existe cria risco de review e seguranca. |

---

## 3. Pacote de perguntas para humano/legal/produto

Responder estes campos sem incluir senhas, tokens, Authorization headers,
conteudo de `.env` ou qualquer secret:

| Campo para aprovacao | Resposta aprovada | Aprovador | Data | Observacao |
|---|---|---|---|---|
| Nome legal do controlador/operador | `Vitor Dutra Melo; desenvolvimento independente ate a formalizacao oficial da empresa` | `Solicitante Checkpoint 062 (nome formal nao informado)` | `2026-05-25` | `APROVADO`; atualizar quando houver empresa formalizada. |
| Canal oficial de suporte | `mailto:petlobbysupport@gmail.com` | `Solicitante Checkpoint 062 (nome formal nao informado)` | `2026-05-25` | `APROVADO`; usar canal monitorado. |
| Canal oficial de privacidade | `mailto:petlobbyprivacy@gmail.com` | `Solicitante Checkpoint 062 (nome formal nao informado)` | `2026-05-25` | `APROVADO`; usar canal monitorado. |
| Mercado inicial de distribuicao | `Inglaterra` | `Solicitante Checkpoint 062 (nome formal nao informado)` | `2026-05-25` | `APROVADO`; nao ampliar por inferencia. |
| Idioma do APK submetido | `Ingles da Inglaterra (en-GB)` | `Solicitante Checkpoint 062 (nome formal nao informado)` | `2026-05-25` | `APROVADO`; Checkpoint 079 reconciliou a copy visivel das telas criticas para screenshots. |
| Idioma da store listing | `Ingles da Inglaterra (en-GB)` | `Solicitante Checkpoint 062 (nome formal nao informado)` | `2026-05-25` | `APROVADO`; deve bater com screenshots/copy. |
| Jurisdicao/regime de privacidade | `Somente Inglaterra; ajustar Privacy/Terms para o regime aplicavel na Inglaterra (UK GDPR/Data Protection Act 2018), sem LGPD no primeiro launch` | `Solicitante Checkpoint 062 (nome formal nao informado)` | `2026-05-25` | `APROVADO`; revisao juridica final ainda recomendada. |
| Bases legais por finalidade | `PENDENTE` | `PENDENTE` | `PENDENTE` | Texto recebido define finalidades/necessidade e aceite, mas nao mapeia base legal por finalidade. |
| Politica de retencao | `Apos exclusao da conta, alguns dados poderao ser mantidos por ate 12 meses para fins legais, seguranca, prevencao de fraude e resolucao de disputas` | `Solicitante Checkpoint 062 (nome formal nao informado)` | `2026-05-25` | `APROVADO COM LIMITE`; classes exatas de dados nao foram detalhadas. |
| Politica de exclusao/anonimizacao | `Conta desativada imediatamente; dados pessoais anonimizados quando possivel; algumas informacoes poderao ser mantidas temporariamente por questoes legais, financeiras e de seguranca antes da exclusao definitiva` | `Solicitante Checkpoint 062 (nome formal nao informado)` | `2026-05-25` | `APROVADO COM BLOQUEIO TECNICO`; backend atual so registra solicitacao, sem job destrutivo/anonimizacao. |
| Faixa etaria Play Console | `Adulto / 18+ / nao child-directed` | `Solicitante Checkpoint 062 (nome formal nao informado)` | `2026-05-25` | `APROVADO`; manter UX/copy sem direcionamento infantil. |
| Chat real no primeiro build | `SIM` | `Solicitante Checkpoint 062 (nome formal nao informado)` | `2026-05-25` | `APROVADO / TECNICAMENTE VALIDADO PARA CHAT TEXTO MINIMO`; Checkpoint 074 validou Mobile real com fixture sintetica; final legal/Data Safety ainda pendente. |
| Reviews/denuncias/UGC no primeiro build | `PARCIAL` | `Checkpoint 074 tecnico; humano/legal final pendente` | `2026-05-25` | Denuncias/report e block para Chat 1:1 foram validados; reviews, UGC publico, Terms/Data Safety final e operacao de review seguem pendentes. |

---

## 4. Decisao aplicada para chat/UGC

A decisao de produto recebida no Checkpoint 062 e `SIM` para chat real/UGC no
primeiro build. Apos os Checkpoints 063-074, o APK/Mobile consome Chat real e
suporta o recorte minimo de Trust & Safety para Chat 1:1.

| Condicao minima antes da Play Console | Consequencia documental |
|---|---|
| Mobile integrado aos endpoints reais de conversations/messages. | Cumprido para o recorte Chat texto dos Checkpoints 063-074. |
| Fluxos de report de conversa, report de mensagem e block testaveis. | Cumprido no Checkpoint 074 com fixture sintetica; manter evidencia e App Access. |
| Terms/Data Safety humano/legal revisados para UGC/Chat. | Ainda pendente antes de declaracao final/submissao. |
| App access com conta de teste e dados sinteticos para review. | Template seguro criado em `docs/33_PLAYSTORE_APP_ACCESS_REVIEWER_PACKAGE.md`; caminho Settings/account deletion exposto via Profile; credenciais reais devem ser preenchidas somente na Play Console. |
| Store Listing e screenshots `en-GB`. | Copy proposta e roteiro seguro criados em `docs/34_PLAYSTORE_LISTING_SCREENSHOT_PACKAGE.md`; screenshots finais ainda dependem do build real, fixture sintetica reutilizavel e UI `en-GB`. |

Enquanto Terms/Data Safety finais e credenciais reais de App Access nao forem
preenchidas na Play Console, o preenchimento conservador continua: inventariar
mensagens texto/reports/block somente como preliminar condicionado ao build
real, sem usar copy que venda Chat como feature pronta para publicacao.

---

## 4.1. Atualizacao Checkpoint 084

Checkpoint 083 confirmou a fixture reviewer reutilizavel com
`finalFixtureGo=true`. Checkpoint 084 consolidou o fechamento Legal/Data Safety
em `docs/37_PLAYSTORE_LEGAL_DATA_SAFETY_CLOSURE.md`.

Decisao aplicada:

| Frente | Estado |
|---|---|
| Screenshots finais `en-GB` | GO COM RESSALVAS, usando somente a fixture aprovada, providers reais retornados pela API e sem dados sensiveis. |
| EAS/build futuro | GO COM RESSALVAS apenas como preparacao tecnica futura; este checkpoint nao executou EAS. |
| Play Console/Data Safety final | NO-GO ate bases legais por finalidade e classes de retencao serem aprovadas por humano/legal. |

As perguntas humanas pendentes continuam: base legal por finalidade, classes de
retencao, texto final de Terms/Privacy para UGC/chat/report/block e
responsavel operacional por account deletion, report review e canais de
suporte/privacidade.

---

## 5. Campos bloqueados apos Checkpoint 078

- Bases legais por finalidade: conta, marketplace, busca, booking, suporte,
  seguranca, fraude e eventuais pagamentos.
- Detalhamento de quais dados ficam retidos ate 12 meses, se o texto publico
  precisar listar classes especificas.
- Implementacao/runbook de desativacao imediata, anonimizacao, exclusao
  definitiva, verificacao de propriedade e responsavel operacional.
- Declaracao de exclusao automatica ou anonimizacao automatica na Play Console.
- Declaracao final de chat/mensagens/reports/block no Data Safety sem
  Terms/Data Safety humano/legal revisados para o build submetido.
- Publicacao de chat real/UGC sem credenciais reais de App Access preenchidas
  somente na Play Console, fixture sintetica reutilizavel, operacao de review e
  Terms/Data Safety atualizados.
- Reconfirmacao da UI `en-GB` no build submetido antes dos screenshots finais
  de Store Listing.
- Geracao de screenshots finais a partir do build/ambiente submetido e fixture
  sintetica aprovada.
- Uso de avatar upload/camera/biblioteca de fotos em screenshots ou claims sem
  reavaliar permissões, Data Safety e build submetido.
- Escolha operacional do seletor de pais/regiao na Play Console se Inglaterra
  nao estiver disponivel como opcao isolada.

---

## 6. Guardrails para a proxima submissao

- Nao preencher decisoes legais por inferencia.
- Nao transformar aceite dos termos em base legal por finalidade sem decisao
  juridica explicita.
- Nao expandir Inglaterra para outro mercado por conveniencia sem aprovacao.
- Nao prometer exclusao automatica, anonimizacao automatica, pagamento,
  verificacao formal de providers, seguro, garantia, moderacao automatica ou
  chat real se o build submetido nao sustentar isso.
- Nao declarar mensagens/reports/block como coletadas no Data Safety final se o
  build submetido nao incluir o recorte real validado e revisado.
- Rechecar fontes oficiais Google Play antes do preenchimento final da Play
  Console, especialmente se houver mudanca de SDK, permissao, UGC,
  publico-alvo, mercado ou politica de dados.
- Nao registrar credenciais reais de App Access no repo/docs; usar somente
  placeholders em documentacao e preencher valores reais dentro da Play Console.
- Nao usar `docs/34` como texto legal final; ele e pacote preliminar de copy e
  roteiro operacional para screenshots.
