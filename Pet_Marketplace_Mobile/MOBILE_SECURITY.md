# MOBILE_SECURITY — Pet Marketplace (Mobile, UK, Fase 1)

> Gate de segurança/privacidade. Fonte de regra: `docs/11_SPEC_PRIVACY_DATA_SAFETY.md`,
> `docs/07_SPEC_MOBILE.md` §6. Arquivo na raiz do app (sobrevive ao sync).
>
> Legenda: ✅ feito · 🟡 parcial · ⚪ pendente · ⚠️ risco · **[GATE]** bloqueia release.

## 1. Política de dados locais no device

| Categoria | No device? | Storage permitido | Status |
|---|---|---|---|
| Token de sessão | sim, protegido | **SecureStore** (nunca AsyncStorage) | ✅ `src/session/token-store.ts` (Expo SecureStore, WHEN_UNLOCKED) |
| Perfil seguro do usuário (id, email, roles, status, locale) | sim | memória (Context); sem persistência sensível | ✅ `SessionProvider` mantém só `MeUser` seguro em memória |
| Resumo de perfis (tutor/provider safe) | sim | memória / store | ✅ allow-list em `src/api/me.ts` |
| Telefone, endereço completo, coordenadas | **nunca** | nenhum | ✅ não modelado / descartado no parse |
| Senhas / API keys privadas | **nunca** | nenhum | ✅ |
| Dados de pagamento | **nunca** (Fase 1 sem pagamento) | nenhum | ✅ |
| Mensagens de chat | só texto, dos participantes | conforme Bloco de chat | ⚪ |

## 2. Dados coletados na Fase 1 (espelha docs/11 §2)

E-mail (obrig.), token (obrig., gerido com segurança), nome de exibição (obrig.),
telefone (opcional), endereço/região (busca), coordenadas (só se geocoding —
**nunca expostas a terceiros**), dados do pet, serviços/preços, disponibilidade,
mensagens texto, avaliações, denúncias, logs técnicos.

**Não coletar (docs/11 §3):** cartão, banco, documentos, DBS, licenças,
biometria, fotos/vídeo/áudio no chat, contatos do device, localização background,
saúde completa do pet.

## 3. Permissões

| Permissão | Motivo | Obrigatória? | Fallback se negada |
|---|---|---|---|
| Internet | chamadas à API | sim | n/a |
| Localização | **NÃO usar na Fase 1** — busca por endereço digitado | não | endereço/região digitada (default) |
| Câmera / microfone / arquivos / contatos | não usados na Fase 1 | não | — |
| Notificações | só se push for ativado | não | app funciona sem push |

⚠️ **[GATE]** Auditar libs do Bloco 3: nenhuma deve declarar permissão sensível implícita no manifest.

## 4. Logs

- ✅ `src/api/http-client.ts` nunca loga `Authorization`/token.
- ✅ `src/api/errors.ts` guarda só `code` + mensagem genérica segura.
- **[GATE]** Nunca logar: token, senha, e-mail completo, documento, payload privado, chave.
- ⚠️ Bloco 3: se adicionar Sentry/analytics → mascarar PII, sem token/e-mail.

## 5. Transporte e backend

- **[GATE]** Produção: `EXPO_PUBLIC_API_BASE_URL` **HTTPS** obrigatório.
  ✅ Enforcement em código: `getApiBaseUrl()` lança se produção e não-HTTPS.
  ⚪ Falta apenas definir a URL de produção real (HTTPS) no ambiente.
- ✅ Token enviado só via header `Authorization: Bearer`, nunca em querystring/log.
- ✅ Erros do backend não vazam detalhe interno ao usuário (mensagens seguras locais).
- ✅ 401 → limpa sessão local; 403 → bloqueia sem expor motivo sensível.

## 6. UK GDPR (docs/11 §5)

- ✅ Minimização: só campos seguros modelados (`MeUser`).
- ⚪ Direitos de acesso/correção/exclusão → fluxos do Bloco 4 (exclusão de conta).
- ⚪ Política de privacidade pública cobrindo operador, dados, finalidade, retenção,
  exclusão, contato, direitos UK, limitações do marketplace.

## 7. Checklist de gate

- [x] **[GATE]** Secrets privados não estão no app nem no repo. ✅ verificado
- [x] **[GATE]** Token em SecureStore. ✅ `token-store.ts` (testado)
- [x] **[GATE]** `.env.example` sem valores reais. ✅
- [x] **[GATE]** Permissões mínimas e justificadas. ✅ `app.json` `permissions: []`
- [x] **[GATE]** Erros ao usuário não vazam detalhes internos. ✅ i18n + códigos seguros
- [x] **[GATE]** Endereço/coordenadas de terceiros nunca expostos. ✅ por design (allow-list)
- [x] HTTPS em produção. ✅ enforcement em código; ⚪ falta URL prod real
- [ ] Sentry/analytics (se houver) com mascaramento. ⚪ não adicionado (Fase 1)
