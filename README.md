# Pet Marketplace UK

Marketplace hiperlocal para cuidadores de pets no Reino Unido (en-GB).
**Fase 1 sem pagamento.** Documentação oficial: pasta `docs/`. Agentes: pasta `.codex/`.

## Arquitetura — 3 aplicações independentes

| Pasta | App | Stack | Fase |
|---|---|---|---|
| `Pet_Marketplace_Back/` | Backend (cérebro) | NestJS + TypeScript + Supabase/PostGIS | Bloco 1+ |
| `Pet_Marketplace_Mobile/` | App mobile | React Native + Expo + TypeScript | Bloco 3+ |
| `Pet_Marketplace_Admin/` | Painel admin web | Next.js + TypeScript | Bloco 9+ |

Cada pasta é **autocontida** e contém sua própria cópia de `docs/` e `.codex/`.
A cópia **canônica** (fonte da verdade) fica na raiz: `docs/` e `.codex/`.
Sincronize as cópias com `pnpm sync` (ver `scripts/`).

## Regras travadas (Fase 1)

- Sem pagamento / Stripe / Wise / Pix / escrow / split.
- Sem foto/vídeo/áudio no chat (somente texto).
- Sem documentos obrigatórios de prestadores; sem home boarding comercial.
- Não prometer "verified", "licensed", "insured", "background/DBS checked".
- Nunca expor endereço completo ou coordenadas exatas entre usuários.
- Textos finais do app em inglês britânico (`en-GB`), via i18n, sem hardcode.
- Documentação técnica interna em pt-BR.
- Android / Play Store primeiro; iOS preparado na arquitetura, publicação futura.
- Não usar Flutter.

## Ordem de implementação (ver `docs/21`)

Bloco 0 (fundação) → 1 Backend → 2 Banco/PostGIS → 3 Mobile → 4 Perfis →
5 Localização → 6 Agendamento → 7 Chat → 8 Avaliações/Denúncias →
9 Admin → 10 Notificações → 11 QA/Play Store.

## Setup

```bash
pnpm install            # na raiz e/ou por app
pnpm sync               # propaga docs/ e .codex/ para os 3 apps
```

Pré-requisitos: Node 20 LTS, pnpm 9+, git. Veja `.env.example` e `COMMITS.md`.

## Progresso

Checkpoints em [`docs/PROGRESS.md`](docs/PROGRESS.md), atualizados ao fim de cada etapa.
