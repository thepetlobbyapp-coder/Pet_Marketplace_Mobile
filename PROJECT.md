# Pet Marketplace

## Project

Monorepo for The Pet Lobby / Pet Marketplace development across Backend,
Mobile and Admin surfaces.

## Current Source Of Truth

- Backend dev source repo: `thepetlobbyapp-coder/Pet_Marketplace_Back`
- Backend branch published: `main`
- Backend commit published: `bd73aea feat: publish admin user operations`
- Backend dev URL: `https://stingray-app-vyfrt.ondigitalocean.app`
- Mobile app path: `Pet_Marketplace_Mobile`

## Secret Handling

- Do not print, commit or copy local `.env` files.
- Do not read or print `Credenciais.txt`.
- Use only public `EXPO_PUBLIC_*` values in Mobile runtime config.
- Never add service role keys, database URLs, passwords, bearer tokens,
  keystores or Play Console credentials to tracked files.

## Release Gates

- Mobile implementation: `AUTORIZO IMPLEMENTAR AJUSTES MOBILE DO PLANO APROVADO`
- EAS build: `AUTORIZO EAS BUILD MOBILE`
- Play Store submission: `AUTORIZO PLAY STORE SUBMISSION`
- Backend outside P2-B/P2-C: `AUTORIZO ALTERAR BACKEND FORA DO RECORTE P2-B/P2-C`
