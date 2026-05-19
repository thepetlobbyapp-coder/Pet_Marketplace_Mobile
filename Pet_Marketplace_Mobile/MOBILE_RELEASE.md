# MOBILE_RELEASE — Pet Marketplace (Mobile, UK, Fase 1)

> Gate de publicação Play Store. Fonte de regra: `docs/10_SPEC_PLAYSTORE_RELEASE.md`
> e `docs/07_SPEC_MOBILE.md`. Este arquivo vive na raiz do app (NÃO em `docs/`,
> que é sobrescrito por `scripts/sync-shared.sh`). Editar aqui.
>
> Legenda: ✅ feito · 🟡 parcial · ⚪ pendente · ⚠️ risco/bloqueador
> **Regra de ouro:** nenhuma submissão à Play Store enquanto houver ⚪/⚠️ em
> item marcado **[GATE]**.

## Identidade do App

| Campo | Valor | Status |
|---|---|---|
| Package name | `a definir` (ex.: `app.thepetlobby.petmarketplace`) — definitivo, imutável | ⚪ Bloco 3 |
| App name (en-GB) | `a definir` | ⚪ Bloco 3 |
| VersionName | semântico, ex. `0.1.0` | ⚪ Bloco 3 |
| VersionCode | inteiro incremental | ⚪ Bloco 3 |
| Canal inicial | Internal Testing → Closed → Production | ⚪ release |

## Estado atual (Bloco 1)

- ✅ Camada base de sessão consumindo `GET /api/v1/me` (sem Expo).
- ✅ Sem secrets/keystore no repo; `.env.example` só com vars públicas.
- ✅ Sem log de token/PII; erros ao usuário são genéricos.
- ⚪ App, UI, navegação, EAS, ícone/splash — Bloco 3.
- ⚪ Exclusão de conta — depende do backend Bloco 4.

## Checklist técnico Android (docs/10 §2)

- [ ] **[GATE]** Package name definitivo e nome do app em en-GB. ⚪ Bloco 3
- [ ] Ícone adaptativo + splash. ⚪ Bloco 3
- [ ] VersionCode incremental / VersionName semântico. ⚪ Bloco 3
- [ ] Build **AAB** via EAS, assinatura gerenciada. ⚪ release
- [ ] **[GATE]** Sem logs sensíveis. ✅ base ok — revalidar com UI
- [ ] **[GATE]** Sem secrets / chave privada no repo. ✅ verificado
- [ ] **[GATE]** Sem crash em login/cadastro/fluxo principal. ⚪ Bloco 3
- [ ] Funciona em telas/densidades comuns. ⚪ Bloco 3
- [ ] **[GATE]** `EXPO_PUBLIC_API_BASE_URL` de produção é **HTTPS** (hoje dev = `http://localhost`). ⚠️ fixar no Bloco 3

## Checklist de conteúdo Play Console (docs/10 §3)

- [ ] Short + full description (en-GB). ⚪
- [ ] Screenshots reais + feature graphic. ⚪
- [ ] Categoria correta + e-mail de suporte. ⚪
- [ ] **[GATE]** Política de privacidade pública (URL) coerente com docs/11. ⚪
- [ ] Países de distribuição (UK) + público-alvo + classificação. ⚪
- [ ] **[GATE]** Data Safety preenchido e **coerente com o app real**. ⚪
- [ ] **[GATE]** Account deletion declarado (in-app + canal externo). ⚪ Bloco 4
- [ ] **[GATE]** App access: contas de teste tutor/provider + instruções en-GB. ⚪

## App Access para revisão (docs/10 §4)

- [ ] Conta tutor de teste + senha estável.
- [ ] Conta provider de teste + senha estável.
- [ ] Ambiente estável e seedado; sem OTP impossível para revisor.
- [ ] Nota ao revisor: "No real payment is processed in this app."
- ⚠️ Não usar Supabase/contas reais; criar contas dedicadas de revisão.

## Permissões (docs/10 §6, docs/07 §6)

- [ ] **[GATE]** Fase 1 **sem** câmera, microfone, arquivos, contatos, localização background.
- [ ] Busca por endereço digitado/geocodificado — **sem** permissão de localização.
- [ ] Notificações só quando push for ativado (não na Fase 1 se não usado).
- [ ] Toda permissão pedida no momento de uso, justificada em en-GB, com fallback.

## Qualidade mínima — não enviar se houver (docs/10 §9)

- [ ] crash em login/cadastro · [ ] tela vazia sem explicação · [ ] botão principal sem ação
- [ ] permissão sem justificativa · [ ] política de privacidade ausente
- [ ] Data Safety inconsistente · [ ] conta de teste inválida · [ ] conteúdo placeholder
- [ ] **texto em português no app final** · [ ] promessa de pagamento/seguro/verificação

## Etapas de release (docs/10 §10)

1. Build local → 2. Emulador → 3. Device Android real → 4. EAS development →
5. EAS preview/internal → 6. Internal Testing fechado → 7. Corrigir crashes →
8. Preencher Play Console → 9. Submeter Internal → 10. Validar review →
11. Closed Testing → 12. Produção.

## Smoke antes de cada build de loja

- [ ] Abrir app instalado · [ ] Login/logout · [ ] Restauração de sessão (token válido/expirado)
- [ ] 401 limpa sessão · [ ] 403 bloqueia sem detalhe · [ ] Sem internet (estado claro)
- [ ] Fluxo principal tutor · [ ] Fluxo principal provider · [ ] Exclusão de conta

## Referências

- User Data: https://support.google.com/googleplay/android-developer/answer/10144311
- Data Safety: https://support.google.com/googleplay/android-developer/answer/10787469
- Account deletion: https://support.google.com/googleplay/android-developer/answer/13327111
- Core App Quality: https://developer.android.com/docs/quality-guidelines/core-app-quality
