# SPEC_ASSET_ICON_SPLASH — The Pet Lobby

**Versão:** 1.0
**Data:** 2026-05-24
**Status:** spec de requisitos para o PNG de icon/splash do app Mobile.
**Escopo:** documentação apenas; sem alteração de código, build ou submissão.
**Origem:** Checkpoint 061 (PICK selecionou time `@M_MobilePlaystore` líder, com
`@D_Design`, `@UK_CompliancePetCare`, `@A_Architecture`, `@C_Cetico`,
`@V_FinalValidator`).

Este documento existe para destravar o blocker #10 da seção 13 de
[docs/30_PLAYSTORE_RELEASE_READINESS.md](30_PLAYSTORE_RELEASE_READINESS.md):
"PNG dedicado icon/splash 1024x1024". A spec NÃO entrega o asset; ela define
os requisitos objetivos para o designer/cliente produzir o PNG, e o checklist
de aceite antes de substituir no app.

Fontes internas consumidas (somente leitura):
- [Pet_Marketplace_Mobile/app.json](../Pet_Marketplace_Mobile/app.json)
- [docs/design.md](design.md)
- [docs/09_SPEC_DESIGN_SYSTEM.md](09_SPEC_DESIGN_SYSTEM.md)
- [docs/10_SPEC_PLAYSTORE_RELEASE.md](10_SPEC_PLAYSTORE_RELEASE.md) §3
- [docs/23_PLAYSTORE_DESIGN_POLICY_BRIDGE.md](23_PLAYSTORE_DESIGN_POLICY_BRIDGE.md)
- [docs/30_PLAYSTORE_RELEASE_READINESS.md](30_PLAYSTORE_RELEASE_READINESS.md) §2 e §13

---

## 0. O que esta spec NÃO decide

A spec é deliberadamente limitada para não invadir decisões do ciclo
humano/legal/produto que segue bloqueado em
[docs/31_PLAYSTORE_HUMAN_DECISION_PACKAGE.md](31_PLAYSTORE_HUMAN_DECISION_PACKAGE.md):

| Fora deste recorte | Por quê |
|---|---|
| Idioma final do APK/listing | Decisão #10 do ciclo anterior. O asset NÃO pode conter texto/copy. |
| Mercado/países de distribuição | Decisão #9 do ciclo anterior. Não altera requisitos visuais do icon. |
| Faixa etária/público-alvo | Decisão #8 do ciclo anterior. Spec não decide se asset precisa de visual "Families". |
| Nome legal do controlador | Decisão #1 do ciclo anterior. Não aparece no asset. |
| Nova palette ou rebrand | Não é escopo. Spec usa SOMENTE a palette já canônica em [docs/09_SPEC_DESIGN_SYSTEM.md](09_SPEC_DESIGN_SYSTEM.md) §4.4 e [docs/design.md](design.md) §4. |

---

## 1. Estado atual (fonte de verdade)

### 1.1 Configuração já travada em `Pet_Marketplace_Mobile/app.json`

```json
{
  "expo": {
    "name": "The Pet Lobby",
    "icon": "./docs/assets/pet-lobby-paw-marker-logo.png",
    "splash": {
      "image": "./docs/assets/pet-lobby-paw-marker-logo.png",
      "resizeMode": "contain",
      "backgroundColor": "#FFFFFF"
    },
    "userInterfaceStyle": "light",
    "android": {
      "package": "app.thepetlobby.mobile",
      "permissions": [],
      "adaptiveIcon": {
        "foregroundImage": "./docs/assets/pet-lobby-paw-marker-logo.png",
        "backgroundColor": "#FAFAFC"
      }
    }
  }
}
```

**Três usos consomem o mesmo PNG hoje:**
1. `expo.icon` — icon principal (iOS + fallback Android).
2. `expo.splash.image` — splash screen.
3. `expo.android.adaptiveIcon.foregroundImage` — camada de frente do adaptive
   icon Android (renderizada sobre `backgroundColor: #FAFAFC`).

Esta spec aceita manter o **mesmo PNG nos três usos** como configuração
inicial, desde que o asset atenda a TODOS os requisitos da seção 3
simultaneamente. Otimizações por uso (splash com mais respiro, etc.) ficam
como melhoria futura registrada na seção 7.

### 1.2 Asset existente — diagnóstico

Arquivo: [docs/assets/pet-lobby-paw-marker-logo.png](assets/pet-lobby-paw-marker-logo.png)

| Atributo | Valor atual | Necessário | Veredicto |
|---|---|---|---|
| Dimensões | 288 × 288 | 1024 × 1024 | **REPROVA** — abaixo do mínimo Expo/Play Store |
| Profundidade | 8-bit/color RGB | 8-bit RGB ou RGBA | OK |
| Canal alpha | Ausente | Veja §3.4 (depende do uso) | Aceitável para `splash.image` e `adaptiveIcon.foregroundImage`; NÃO aceitável se o icon principal precisar de cantos transparentes |
| Espaço de cor | sRGB (não-interlaced) | sRGB | OK |
| Conteúdo | Paw + location marker em roxo | Conforme [docs/design.md](design.md) §2.3 | OK conceitualmente |

**Conclusão:** o asset atual serve como **referência conceitual de marca**, mas
**não pode ir para Play Store** por dimensão insuficiente. É placeholder.

---

## 2. Identidade visual fixada (não inventar)

O asset DEVE preservar:

- **Símbolo:** paw + location marker (mesmo conceito do PNG atual).
  Referência: [docs/design.md](design.md) §2.3 "Logo".
- **Cor primária do símbolo:** roxo da paleta canônica. Faixa permitida:
  - `brand.purple.500` = `#6F32F0` (recomendado padrão)
  - `brand.purple.700` = `#4B16A8` (variante pressed)
  - `brand.purple.900` = `#3B0D78` (variante hero/profunda)
- **Acabamento:** sem distorção, sem inclinação, sem efeitos de brilho/glow,
  sem outline duro tipo screenshot, sem sombra projetada chamativa.
- **Composição:** símbolo centralizado, sem texto, sem wordmark, sem tagline.
  Texto no icon viola regras Play Store e introduz dependência da decisão de
  idioma (#10 do ciclo bloqueado).

O asset NÃO DEVE:

- introduzir paleta nova fora de [docs/09_SPEC_DESIGN_SYSTEM.md](09_SPEC_DESIGN_SYSTEM.md) §4.4;
- usar verde, amarelo ou vermelho como cor primária do símbolo;
- usar gradiente que destoe da identidade roxa+branca;
- conter mascote/animal foto-realista;
- imitar marca terceira (Google, Apple, Uber-like, etc.).

---

## 3. Requisitos do PNG principal (1024 × 1024)

### 3.1 Especificação técnica obrigatória

| Item | Valor exigido |
|---|---|
| Formato | PNG (não JPG, não WebP, não SVG) |
| Dimensões | exatamente **1024 × 1024 pixels** |
| Proporção | 1:1 quadrado |
| Profundidade | 8 bits por canal |
| Modo de cor | RGB ou RGBA (RGB se sem alpha) |
| Espaço de cor | **sRGB** sem perfil ICC customizado embutido |
| Compressão | PNG padrão (sem otimização lossy que cause artefatos) |
| Tamanho de arquivo | sem mínimo; manter abaixo de ~1 MB se possível |

### 3.2 Cor de fundo coerente com `adaptiveIcon.backgroundColor`

O `adaptiveIcon.backgroundColor` está fixado em `#FAFAFC` (neutral.50 da
paleta). O PNG principal pode ter:

- **fundo sólido** `#FAFAFC` (recomendado se o asset for único para os três
  usos) — eliminando o risco de "halo" visual em devices Android, e
  - **funciona para iOS** (Apple recomenda fundo opaco no icon — sem cantos
    transparentes);
  - **funciona para Android adaptive icon** porque coincide com o
    `backgroundColor`;
  - **funciona para splash** porque o `splash.backgroundColor` é `#FFFFFF`,
    mas com `resizeMode: contain` o PNG aparece com seu próprio fundo
    `#FAFAFC` em uma "caixa" sobre o branco — a diferença é mínima e dentro
    da paleta neutra; aceitável.

OU, alternativamente:

- **fundo transparente** (RGBA com alpha 0 nas margens), aceito SOMENTE para
  `adaptiveIcon.foregroundImage` e `splash.image`. Neste caso é OBRIGATÓRIO
  produzir um segundo PNG separado com fundo `#FAFAFC` opaco para uso em
  `expo.icon` (Apple/iOS rejeita transparência). Esta variante adiciona
  complexidade — preferir fundo sólido se houver dúvida.

### 3.3 Safe area do adaptive icon Android

O canvas Android adaptive icon é 108dp × 108dp, mas devices renderizam com
máscaras variáveis (círculo, squircle, square arredondado, teardrop). A área
visualmente garantida é o **círculo central de ~66dp de diâmetro**, com
margem de 18dp em cada lado.

Em 1024 × 1024 pixels, isso vira:

- **Canvas total:** 1024 × 1024.
- **Safe area circular central:** círculo de **diâmetro ~626 px** centrado em
  (512, 512). Equivalente a raio ~313 px.
- **Margem segura:** **~199 px** em cada borda livres de conteúdo crítico.

**Regra dura:** todo o símbolo (paw + marker) DEVE caber dentro desse círculo
central. Qualquer pixel do símbolo fora dele pode ser cortado por máscaras
de devices Android reais.

### 3.4 Transparência

| Uso | Pode ter cantos transparentes? |
|---|---|
| `expo.icon` (iOS principal) | **NÃO**. Apple exige fundo opaco. Borda transparente vira preto/branco indesejado. |
| `expo.android.adaptiveIcon.foregroundImage` | **SIM, recomendado.** Camada de frente sobre o `backgroundColor` `#FAFAFC`. |
| `expo.splash.image` | **SIM, aceito.** Aparece sobre `splash.backgroundColor` `#FFFFFF`. |

Solução simples e segura: **fundo opaco `#FAFAFC` em todos os três** (ver
§3.2 alternativa recomendada).

### 3.5 Contraste

- Contraste do símbolo (roxo) sobre o fundo (`#FAFAFC` ou `#FFFFFF`):
  WCAG **AAA preferível**, **AA mínimo** (≥ 4.5:1).
- As variantes `#6F32F0`, `#4B16A8` e `#3B0D78` da palette canônica
  passam folgadamente em AAA contra `#FAFAFC` / `#FFFFFF` (contraste
  aproximado ≥ 7:1 para `#6F32F0`, ≥ 10:1 para as variantes mais escuras).
  Validar com ferramenta de contraste (ex.: WebAIM) antes do aceite.
- NÃO usar variantes claras (`brand.purple.100`, `brand.purple.50`) como
  cor primária do símbolo — falham contraste contra fundo claro.

---

## 4. Erros comuns a evitar

| # | Erro | Sintoma | Como evitar |
|---|---|---|---|
| 1 | PNG menor que 1024 × 1024 escalado | Borrão em devices de alta densidade; Play Console rejeita ícone Play Store derivado | Exportar em 1024 × 1024 nativo, sem upscale |
| 2 | Cantos transparentes no `expo.icon` | iOS mostra borda preta/branca; visual amador | Usar fundo opaco no PNG do icon principal |
| 3 | Símbolo fora da safe area | Paw cortada em devices com máscara redonda | Caber dentro do círculo central de 626 px |
| 4 | Texto/wordmark no icon | Ilegível em tamanho pequeno; viola dependência de idioma | Sem texto. Sem exceção. |
| 5 | Fundo branco `#FFFFFF` no PNG enquanto adaptive backgroundColor é `#FAFAFC` | Anel/halo perceptível em Android quando o foreground vaza para o background | Alinhar o fundo do PNG ao `#FAFAFC` OU deixar transparente nas bordas do foreground |
| 6 | Exportar como JPG e renomear `.png` | Artefatos de compressão; alpha ausente | Exportar PNG real |
| 7 | Perfil ICC customizado embutido | Cor renderiza diferente em devices | Exportar em sRGB, sem ICC custom |
| 8 | Reaproveitar o icon como feature graphic 1024×500 | Proporção errada; logo achatado | Feature graphic é asset separado (ver §6) |
| 9 | Brilho/glow/sombra projetada chamativa | Visual de protótipo, não de produto | Acabamento limpo, plano |
| 10 | Cor fora da palette canônica | Quebra identidade visual; falha aceite @D | Usar SOMENTE roxo da palette §4.4 do design system |
| 11 | Símbolo deslocado do centro | Aparenta erro de export em máscaras redondas | Centralizar geometricamente em (512, 512) |
| 12 | Imitação de marca terceira (Google Maps pin) | Play Store rejeita | Conceito original de paw + marker próprio |

---

## 5. Checklist de aceite (obrigatório antes de substituir no app)

O asset entregue só pode substituir
[docs/assets/pet-lobby-paw-marker-logo.png](assets/pet-lobby-paw-marker-logo.png)
se TODOS os itens abaixo forem marcados:

### 5.1 Técnico
- [ ] Arquivo `.png` real (verificado com `file`).
- [ ] Dimensões exatamente **1024 × 1024 px**.
- [ ] Modo de cor RGB ou RGBA.
- [ ] Espaço de cor **sRGB** sem ICC profile customizado.
- [ ] Tamanho de arquivo razoável (idealmente < 1 MB).

### 5.2 Composição
- [ ] Símbolo centralizado em (512, 512) com tolerância ≤ 10 px.
- [ ] Símbolo inteiramente dentro do círculo de raio 313 px central (safe
      area do adaptive icon).
- [ ] **Sem texto, wordmark, tagline ou copy.**
- [ ] Sem mascote foto-realista.

### 5.3 Cor
- [ ] Cor primária do símbolo dentro da família roxa da palette canônica
      (`#6F32F0`, `#4B16A8` ou `#3B0D78`).
- [ ] Fundo do PNG: `#FAFAFC` opaco OU transparente (não `#FFFFFF` opaco —
      causa halo contra `adaptiveIcon.backgroundColor`).
- [ ] Contraste símbolo↔fundo ≥ WCAG AA (≥ 4.5:1); preferir AAA.

### 5.4 Validação visual em máscaras Android
Verificar em ferramenta de preview do adaptive icon (Android Studio ou
Expo) que o símbolo aparece inteiro nas quatro máscaras principais:
- [ ] Círculo (round).
- [ ] Squircle.
- [ ] Quadrado arredondado (square).
- [ ] Teardrop.

### 5.5 Validação cruzada
- [ ] Visualmente reconhecível como The Pet Lobby (alinhado a
      [docs/design.md](design.md) §2).
- [ ] Não imita marca terceira.
- [ ] Sem dependência de decisão pendente do ciclo bloqueado (sem texto,
      sem palette nova, sem público-alvo específico).

Quando os 5 blocos estiverem ✅, o asset pode substituir o PNG referenciado em
[Pet_Marketplace_Mobile/app.json](../Pet_Marketplace_Mobile/app.json) e o
blocker #10 da seção 13 de
[docs/30_PLAYSTORE_RELEASE_READINESS.md](30_PLAYSTORE_RELEASE_READINESS.md)
pode ser marcado como fechado.

---

## 6. Itens à parte (pendência separada, não cobertos por esta spec)

Os artefatos abaixo NÃO são derivados automáticos do icon 1024 × 1024. Cada
um exige composição própria e fica como pendência distinta:

| # | Artefato | Dimensão | Para onde vai | Estado |
|---|---|---|---|---|
| 1 | Play Store icon | 512 × 512 PNG | Campo "App icon" da Play Console | Pendente; pode ser derivado do mesmo design, exportado em 512 × 512 |
| 2 | Feature graphic | 1024 × 500 PNG ou JPG | Campo "Feature graphic" da Play Console | Pendente; composição horizontal, NÃO é o icon esticado |
| 3 | Screenshots de telas reais | mínimo 320 px, máximo 3840 px, lado menor ≥ 320, proporção entre 16:9 e 9:16 | Campo "Phone screenshots" da Play Console | Pendente; depende de build real (smoke da seção 12 de [docs/30_PLAYSTORE_RELEASE_READINESS.md](30_PLAYSTORE_RELEASE_READINESS.md)) |
| 4 | Splash com mais respiro central | 1024 × 1024 PNG | `expo.splash.image` dedicado | Opcional; só vale a pena se o icon principal ficar visualmente "grande demais" no splash |

Estes ficam fora do checklist da §5. Se forem entregues junto, ótimo — mas o
fechamento do blocker #10 exige apenas o PNG principal 1024 × 1024.

---

## 7. Como substituir no projeto quando o asset estiver pronto

> **Esta seção é runbook operacional para o humano executar quando o asset
> estiver aprovado pelo checklist da §5. Não há automação.**

Passos:

1. Validar o asset contra o checklist completo da §5.
2. Substituir o arquivo binário **no canônico da raiz**:
   ```
   docs/assets/pet-lobby-paw-marker-logo.png
   ```
   mantendo o mesmo nome — `Pet_Marketplace_Mobile/app.json` aponta para
   `./docs/assets/pet-lobby-paw-marker-logo.png` (que após o sync resolve
   para `Pet_Marketplace_Mobile/docs/assets/...`); renomear quebra três
   entradas (`icon`, `splash.image`, `adaptiveIcon.foregroundImage`).
   **Não editar diretamente a cópia em `Pet_Marketplace_Mobile/docs/`** —
   o script `scripts/sync-shared.{sh,ps1}` faz `rm -rf` da pasta `docs/`
   do app antes de copiar a raiz, destruindo qualquer edição local.
3. Rodar o sync para propagar a cópia do asset para os três apps. O script
   copia `docs/` inteiro de forma recursiva, então `docs/assets/` é
   incluído automaticamente:
   - Linux/macOS/Git Bash: `pnpm sync` (executa `bash scripts/sync-shared.sh`).
   - Windows PowerShell: `pnpm sync:win` (executa o `.ps1` equivalente).
4. Rodar um preview no Mobile (Expo Go ou build interno) e verificar:
   - icon do app na tela inicial do device (Android e iOS quando disponível);
   - splash na abertura do app;
   - adaptive icon em ferramenta de preview Android Studio.
5. Em [docs/30_PLAYSTORE_RELEASE_READINESS.md](30_PLAYSTORE_RELEASE_READINESS.md)
   §13, mover o blocker #10 de "Aberto" para "Fechado" registrando data e
   commit.
6. Atualizar [docs/PROGRESS.md](PROGRESS.md) com um Checkpoint dedicado de
   substituição de asset.

NÃO incluído neste runbook (pertence a recortes separados):
- gerar `feature graphic` 1024 × 500;
- gerar Play Store icon 512 × 512 dedicado;
- capturar screenshots de tela real;
- rodar `eas build` (depende do blocker #11 e de credenciais humanas autorizadas);
- submeter à Play Console.

---

## 8. Dependências para fechamento total do blocker #10

| Dependência | Quem fornece | Bloqueia este spec? | Bloqueia o fechamento? |
|---|---|---|---|
| Decisão de palette/branding nova | — | Não — spec usa SOMENTE palette canônica existente | Não |
| Decisão de idioma (#10 ciclo anterior) | Humano/cliente | Não — spec proíbe texto no asset | Não |
| Decisão de mercado (#9 ciclo anterior) | Humano/cliente | Não | Não |
| Asset PNG 1024 × 1024 conforme §3 e §5 | Designer/cliente | **SIM** — sem o PNG não há o que substituir | **SIM** |
| `pnpm sync` ou cópia manual para Mobile | Humano executor | Não — runbook §7 cobre | Sim, no momento da substituição |
| Preview em device real | Humano executor com ambiente Expo | Não | Sim, para validar visualmente |

**Resumo:** este spec destrava a entrega documental. O fechamento do blocker
#10 depende exclusivamente da entrega do asset humano conforme §5.

---

## 9. Checkpoint 089 - validação local de disponibilidade

Data: 2026-05-26.

Resultado local:

| Caminho | Dimensão | Veredito |
|---|---:|---|
| `docs/assets/pet-lobby-paw-marker-logo.png` | 288x288 | NO-GO |
| `Pet_Marketplace_Mobile/docs/assets/pet-lobby-paw-marker-logo.png` | 288x288 | NO-GO |
| `Pet_Marketplace_Mobile/assets/pet-lobby-logo.png` | 288x288 | NO-GO |
| `Pet_Marketplace_Back/docs/assets/pet-lobby-paw-marker-logo.png` | 288x288 | NO-GO |
| `Pet_Marketplace_Admin/docs/assets/pet-lobby-paw-marker-logo.png` | 288x288 | NO-GO |

Arquivos `Pet_Marketplace_Mobile/Pet_Marketplace_Mobile01.jpeg` e
`Pet_Marketplace_Mobile/Pet_Marketplace_Mobile02.jpeg` têm dimensões
1024x1536 e 1536x1024, mas são fotos/screenshots retangulares, não PNG
quadrado de icon/splash, e não atendem ao checklist da seção 5.

Decisão: nenhum asset local foi substituído. O bloqueio de asset Play-ready
permanece aberto até designer/cliente entregar um PNG 1024x1024 conforme esta
spec. Não criar asset inventado para autorizar EAS.

---

## 10. Checkpoint 090 - tentativa de integracao local

Data: 2026-05-26.

O gate obrigatorio `impact-validator` rejeitou a substituicao/propagacao de
asset neste checkpoint porque o prompt nao trouxe caminho local de PNG
1024x1024 e a varredura local nao encontrou candidato valido.

Resultado:

- Nenhum arquivo em `docs/assets/` foi substituido.
- Nenhum screenshot/JPEG foi reaproveitado como icon/splash.
- O asset canonico permanece `288x288` e continua NO-GO para Play-ready.
- O unico caminho autorizado foi registrar o NO-GO documental e manter EAS real
  bloqueado ate existir PNG 1024x1024 entregue por designer/cliente.

---

## 11. Checkpoint 091 - integracao local aprovada

Data: 2026-05-26.

Entrada validada:

`Pet_Marketplace_Mobile/docs/logo/a pet-lobby-icon-1024.png`

Resultado tecnico:

| Item | Resultado | Veredito |
|---|---:|---|
| Formato | PNG real | GO |
| Dimensoes | 1024x1024 | GO |
| Bit depth / cor | 8-bit RGB | GO |
| Fundo | `#FAFAFC` | GO |
| Texto/copy | Ausente por inspecao visual | GO |
| Safe area | bbox `576x560`, 0 px fora do circulo central r=313 | GO |
| SHA256 | `BAB5E79217F7947BA1A04924A401E5F9DFDD349A3D7EC795DFB56D36A9E6442E` | Registro |

Decisao:

- `impact-validator` autorizou somente a integracao local do asset validado.
- `docs/assets/pet-lobby-paw-marker-logo.png` foi substituido mantendo o mesmo
  nome referenciado por `Pet_Marketplace_Mobile/app.json`.
- Copias equivalentes foram propagadas para `Pet_Marketplace_Back/docs/assets`,
  `Pet_Marketplace_Mobile/docs/assets` e `Pet_Marketplace_Admin/docs/assets`.
- Nenhum EAS build, EAS submit, Play Console, deploy, fixture ou credencial foi
  usado neste checkpoint.
