# PetShop — Style Reference
> Base: sistema visual do Revolut. Interface monocromática e editorial: tinta preta sobre branco, botões e campos em pílula, bordas finas no lugar de sombras, e a cor vindo só da fotografia (céu e pets).

**Tema:** claro (somente)
**Stack:** Angular 21 + Ionic (standalone) + Capacitor
**Fontes:** DM Sans (títulos) e Inter (interface), substitutas livres do Aeonik Pro

> Este documento adapta o style reference do Revolut para o app de petshop. As medidas, os papéis e as regras vêm do original. As seções "Adaptações" e "Componentes do PetShop" são decisões novas para o contexto do app (cliente e admin, mobile first).

---

## 1. Princípios

1. **Monocromia.** A paleta da interface é toda neutra. Cor só aparece em fotografias (céu, pets) e, opcionalmente, na faixa promocional.
2. **Pílula é a forma.** Todo botão, campo, tag e filtro usa raio 9999px. Cartões e listas usam raios maiores e fixos (22,5px e 20px).
3. **Borda, não sombra.** Separação por fio de 1px `#c9c9cd`, por troca de superfície (`#ffffff` → `#f7f7f7`) ou por faixa escura `#1f1f1f`. Sombras só existem em popovers e modais.
4. **Autoridade vem do tamanho, não do peso.** Títulos em DM Sans peso 500, com tracking negativo. Nunca 600 ou 700 nos títulos.
5. **Estado sem cor.** Erro, seleção, desativado e status se expressam por peso de borda, preenchimento, opacidade e texto, nunca por vermelho/verde/amarelo.
6. **Texto sempre diz o estado.** Como a cor não carrega significado, todo estado tem um rótulo em palavras (por exemplo "Confirmado", "Horário indisponível").

---

## 2. Tokens: cores

| Nome | Valor | Token | Papel |
|------|-------|-------|-------|
| Ink | `#1f1f1f` | `--color-ink` | Texto principal, botões escuros, bordas de foco, faixas escuras |
| Bone | `#ffffff` | `--color-bone` | Canvas da página, cartões, texto sobre fundo escuro |
| Ash Grey | `#c9c9cd` | `--color-ash-grey` | Fios de 1–2px, bordas de campos, divisores |
| Mist | `#f7f7f7` | `--color-mist` | Superfície rebaixada: listas, grupos, aviso de erro de formulário |
| Slate | `#717173` | `--color-slate` | Placeholder, dicas, legendas, itens inativos |
| Graphite | `#4c4c4c` | `--color-graphite` | Texto de apoio (parágrafos de aviso, descrições) |
| Pure Black | `#000000` | `--color-pure-black` | Só onde for preciso contraste máximo |
| Cobalt Wash | `linear-gradient(to right, #1227fd, #6fa0ff)` | `--gradient-cobalt-wash` | Faixa promocional do topo. Único uso cromático da interface |

**Contraste (sobre branco):** Ink 16:1, Graphite 8,6:1, Slate 4,8:1 (mínimo para texto pequeno, não usar mais claro que isso).

**Fora da paleta (não use):** vermelho de erro, verde de sucesso, amarelo de alerta, azul de link. Se o projeto algum dia exigir cores semânticas, trate como decisão de design explícita, não como padrão.

---

## 3. Tokens: tipografia

### DM Sans (substituta do Aeonik Pro): títulos e destaques
- **Pesos:** 400 e 500 (nunca mais pesado)
- **Tamanhos:** 18, 24, 32, 40, 52, 88
- **Tracking:** −0,024em em 88px → −0,012em em 52px → −0,010em de 40 a 24px
- **Uso:** títulos de tela, nome da marca, preços, subtítulos de 18px

### Inter: interface e corpo
- **Pesos:** 400, 600, 700
- **Tamanhos:** 12, 14, 16
- **Tracking:** −0,010em a −0,005em no corpo; **+0,015em** apenas em microrrótulos de 12px (tags de status)
- **Uso:** botões, formulários, navegação, badges, parágrafos de 16px

**Regra de fronteira:** DM Sans cuida de 18px para cima; Inter cuida de 16px para baixo. Não misture as duas no mesmo tamanho.

### Escala

| Papel | Família | Peso | Tamanho | Line-height | Tracking | Token |
|-------|---------|------|---------|-------------|----------|-------|
| caption | Inter | 400 | 12px | 18px | 0,18px | `--text-caption` |
| body-sm | Inter | 400/600 | 14px | 22px | −0,07px | `--text-body-sm` |
| body | Inter | 400 | 16px | 24px (19,2 no original) | — | `--text-body` |
| subheading | DM Sans | 400 | 18px | 24px | — | `--text-subheading` |
| heading-sm | DM Sans | 500 | 24px | 28px | −0,24px | `--text-heading-sm` |
| heading | DM Sans | 500 | 32px | 38px | −0,32px | `--text-heading` |
| heading-lg | DM Sans | 500 | 40px | 48px | −0,4px | `--text-heading-lg` |
| display | DM Sans | 500 | 52px | 52px | −0,624px | `--text-display` |
| display-xl | DM Sans | 500 | 88px | 88px | −2,112px | `--text-display-xl` (só web/desktop) |

**No app mobile:** título de tela em `clamp(40px, 11vw, 52px)`, line-height 1, tracking −0,012em. O `display-xl` não é usado em telas de celular.

### Instalação das fontes (offline, funciona no Capacitor)

```bash
npm i @fontsource-variable/inter @fontsource-variable/dm-sans
```

`angular.json` → `build.options.styles` (no começo da lista):

```json
"node_modules/@fontsource-variable/inter/index.css",
"node_modules/@fontsource-variable/dm-sans/index.css"
```

Nomes das famílias: `'Inter Variable'` e `'DM Sans Variable'`.

---

## 4. Tokens: espaçamento e formas

**Unidade base:** 8px. **Densidade:** compacta.

| Nome | Valor | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 16 | 16px | `--spacing-16` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 56 | 56px | `--spacing-56` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |

### Raios

| Elemento | Valor |
|----------|-------|
| Botões, campos, tags, filtros, avatar de pet | 9999px |
| Cartões | 22,5px |
| Listas / grupos | 20px |
| Controles pequenos (avisos, chips quadrados) | 12px |

### Layout

- **Largura máxima do conteúdo de formulário/telas de app:** 480px, centralizado em telas largas
- **Largura máxima de páginas desktop (painel admin):** 1200px
- **Padding lateral de tela no celular:** 24px
- **Padding de cartão:** 24px
- **Espaço entre elementos relacionados:** 8px
- **Entre campos de formulário:** 20px
- **Entre seções (celular):** 32px · **(desktop/admin):** 80px
- **Safe areas:** respeitar `env(safe-area-inset-top)` e `env(safe-area-inset-bottom)` em todo elemento colado nas bordas da tela

---

## 5. Superfícies

| Nível | Nome | Valor | Uso |
|-------|------|-------|-----|
| 0 | Canvas | `#ffffff` | Fundo de todas as telas |
| 1 | Recessed | `#f7f7f7` | Grupos de listas, avisos, área de resumo |
| 2 | Edge | `#c9c9cd` | Fio/borda (não é fundo) |
| 3 | Card | `#ffffff` | Cartões: definidos por raio e borda, não por sombra |
| 4 | Inverted | `#1f1f1f` | Faixas escuras (resumo do agendamento, rodapé), botões escuros |

**Elevação:** nenhuma sombra em cartões e botões. Exceção: modais e popovers (`ion-modal`, `ion-popover`), onde a sombra é aceitável. O anel de foco dos campos usa `box-shadow: inset` apenas para simular borda de 2px sem alterar o layout.

---

## 6. Componentes base

Estes já existem em `src/styles.scss` como classes globais (usadas nas telas de autenticação) e devem ser reaproveitados nas demais telas.

### Botão pílula (escuro): `.btn .btn--dark`
Fundo `#1f1f1f`, texto branco, borda 2px `#1f1f1f`, raio 9999px, altura 52px, padding horizontal 24px, Inter 600 16px. Ação principal de cada tela (um por tela).

### Botão pílula (claro): `.btn .btn--light`
Fundo branco, texto `#1f1f1f`, borda 2px `#1f1f1f`. Ação secundária ("Criar conta", "Cancelar").

### Botão pílula (fantasma sobre foto)
Fundo `rgba(255,255,255,0.1)` (ou 0,6 sobre céu claro), texto/borda de 1px `#1f1f1f` (ou branca sobre foto escura). Usado no botão "Voltar" sobre o céu.

### Link de texto: `.link`
Texto `#1f1f1f` a 80% de opacidade, sublinhado, Inter 500 14px. Sobe para 100% no hover.

### Estados de interação (todos os botões)
- **Hover:** opacidade 0,8
- **Desativado:** opacidade 0,4, cursor `not-allowed`
- **Foco por teclado:** `outline: 2px solid #1f1f1f; outline-offset: 3px`
- **Carregando:** o rótulo muda para o gerúndio ("Entrando…", "Salvando…"); sem spinner colorido

### Campo de formulário: `.field` + `.input`
- Rótulo **acima** do campo: Inter 600 14px
- Campo: altura 52px, padding horizontal 20px, borda 1px `#c9c9cd`, raio 9999px, Inter 400 16px, placeholder em Slate
- **Foco** e **inválido** (`aria-invalid="true"`): borda `#1f1f1f` de 2px
- **Dica** (`.field__hint`): Inter 12px Slate, abaixo do campo
- **Erro de campo** (`.field__error`): texto Inter 500 14px em Ink, abaixo do campo. A mensagem diz o que corrigir ("Informe um e-mail válido.")
- Tamanho mínimo da fonte: 16px (evita zoom automático no iOS)

### Aviso de formulário: `.form-error`
Fundo `#f7f7f7`, borda 1px `#c9c9cd`, raio 12px, padding 12px 16px, Inter 500 14px, `role="alert"`. Para erros que vêm da API ("E-mail ou senha inválidos").

### Aviso informativo: `.notice`
Inter 16px, line-height 24px, cor Graphite. Mensagens de confirmação e instruções.

### Divisor: `.divider`
Fio de 1px `#c9c9cd`, margem vertical 24px.

### Cartão
Fundo branco, raio 22,5px, borda 1px `#c9c9cd`, padding 24px, sem sombra.

### Lista agrupada
Fundo `#f7f7f7`, raio 20px, padding 16–24px. Itens separados por fio de 1px `#c9c9cd`.

### Tag / chip de filtro
Raio 9999px, altura 36px, padding horizontal 16px, Inter 600 14px. **Inativo:** fundo branco, borda 1px `#c9c9cd`. **Ativo:** fundo `#1f1f1f`, texto branco.

### Faixa promocional (opcional)
`linear-gradient(to right, #1227fd, #6fa0ff)`, texto branco Inter 400 16px, centralizado, 32–40px de altura, link branco sublinhado. **Máximo uma por tela** e só para ofertas (por exemplo, campanha de vacinação). Nunca em botões, cartões ou fundos de seção.

---

## 7. Padrões de tela

### 7.1 Telas de autenticação (já implementadas)
Estrutura: **céu no topo + cartão branco sobreposto**.

```text
┌──────────────────────────┐
│ PetShop          [Voltar]│  ← marca (DM Sans 500 20px) + pílula fantasma
│                          │
│ Entrar                   │  ← título 40–52px, peso 500
│ Agende serviços e ...    │  ← subtítulo 18px
│ ░░░░ céu ░░░░░░░░░░░░░░░ │
├──────────────────────────┤  ← cartão branco, raio 22,5px no topo, sobe 24px
│  E-mail                  │
│  (  voce@email.com    )  │
│  Senha                   │
│  (  ••••••••          )  │
│  [        Entrar       ] │
│      Esqueci minha senha │
│  ──────────────────────  │
│  [     Criar conta     ] │
└──────────────────────────┘
```

- **Céu:** foto real em `public/sky.jpg` via `:root { --auth-sky-photo: url('/sky.jpg'); }`. Sem foto, usa o gradiente de nuvens em CSS (azul claro `#9fc2f4 → #d6e5fb` com manchas brancas)
- **Texto sobre o céu:** Ink (a foto é clara e com espaço livre no topo)
- **Cartão:** largura máxima 480px, padding 32px 24px
- Componente: `AuthShellComponent` (`shared/components/auth-shell`), com `title`, `subtitle` e `back`

### 7.2 Área do cliente (`/client`)

**Navegação:** barra de abas inferior (`ion-tab-bar`) com três itens: **Início**, **Meus pets**, **Agendar**.
- Fundo branco, borda superior 1px `#c9c9cd`, sem sombra
- Ícone de linha (traço 1,5–2px) + rótulo Inter 500 12px
- **Ativo:** Ink 100%. **Inativo:** Slate

**Cabeçalho de tela:** toolbar transparente; título em DM Sans 500 24–32px alinhado à esquerda; ação do usuário (sair) como pílula fantasma à direita.

**Home:**
1. Saudação em DM Sans 500 32px ("Olá, Maria")
2. **Ação em destaque:** botão pílula escuro largo "Agendar serviço" (a ação mais importante da tela)
3. Seção "Próximos agendamentos" (cabeçalho de seção em Slate, DM Sans 500 24px), com cartões de agendamento
4. Seção "Seus pets": carrossel horizontal de cartões de pet
5. **Estado vazio:** texto direto + botão ("Você ainda não tem pets. Cadastre o primeiro.")

### 7.3 Novo agendamento (wizard de 4 passos)

**Indicador:** texto "Passo 2 de 4" (Inter 500 14px, Slate) + barra de 4 segmentos de 4px de altura com raio 9999px (concluídos e atual em `#1f1f1f`, futuros em `#c9c9cd`). Sem números decorativos em círculos.

| Passo | Conteúdo | Controle |
|-------|----------|----------|
| 1. Pet | Lista dos pets do cliente | Cartões selecionáveis (selecionado: borda 2px Ink) |
| 2. Serviço | Banho, Tosa, Consulta, Vacinação | Cartões com nome, duração e preço |
| 3. Horário | Calendário de data + grade de horários livres | Pílulas de horário |
| 4. Confirmação | Resumo + observações | Faixa escura com cartão branco |

**Rodapé fixo do wizard:** botão escuro "Continuar" (e "Voltar" claro quando houver passo anterior), com `padding-bottom: env(safe-area-inset-bottom)`. No passo 4, o botão vira "Confirmar agendamento".

**Seletor de horários (pílulas):**
- Grade de 3 colunas, gap 8px, altura 44px, raio 9999px
- **Livre:** borda 1px `#c9c9cd`, fundo branco
- **Selecionado:** fundo `#1f1f1f`, texto branco
- **Indisponível:** opacidade 0,4, texto riscado, `aria-disabled="true"`, sem foco
- Se o dia não tiver horários: "Sem horários livres neste dia. Escolha outra data."

**Passo de confirmação (o "flip" claro/escuro do Revolut):** seção com fundo `#1f1f1f` e, sobre ela, um cartão branco de 22,5px com o resumo (pet, serviço, data e hora, preço em DM Sans 500 32px). O botão de confirmar fica abaixo, em pílula branca sobre o fundo escuro.

### 7.4 Painel admin (`/admin`)

Pensado para o **balcão (tela larga)**, mas funcional no celular.

- **Cabeçalho:** faixa `#1f1f1f` com marca em branco, navegação central (Agenda, Clientes) em Inter 500 16px e pílula "Sair" à direita
- **Conteúdo:** largura máxima 1200px, padding 24px

**Agenda:**
- Seletor de data (pílulas ‹ Hoje ›) e filtros por status em chips
- Lista agrupada (`#f7f7f7`, raio 20px) por horário; cada linha: hora (DM Sans 500 18px), pet e tutor, serviço, badge de status
- Troca de status por menu de pílulas, nunca por cor

**Cadastro de cliente:** mesmo padrão de formulário das telas de auth, dentro de um cartão de 480px; abaixo, lista de clientes com busca (campo em pílula com ícone de lupa).

**Tabelas (desktop):** sem zebra e sem sombra; cabeçalho em Slate Inter 600 12px, linhas separadas por fio de 1px `#c9c9cd`, hover com fundo `#f7f7f7`.

---

## 8. Componentes do PetShop

### Cartão de pet
- Cartão padrão (branco, 22,5px, borda 1px)
- **Avatar:** círculo de 56px (9999px) com a foto; sem foto, círculo `#f7f7f7` com a inicial em DM Sans 500
- Nome em DM Sans 500 24px; raça e idade em Inter 14px Slate
- Observações de saúde/comportamento: Inter 14px Graphite, no máximo 2 linhas

### Item de agendamento
- Linha dentro de lista agrupada ou cartão
- Esquerda: data e hora em DM Sans 500 18px; abaixo, "Pet · Serviço" em Inter 14px Graphite
- Direita: badge de status

### Badge de status
Pílula de 28px de altura, padding horizontal 12px, Inter 600 12px, tracking +0,015em, sempre com texto:

| Status (API) | Rótulo | Aparência |
|--------------|--------|-----------|
| `CONFIRMED` | Confirmado | Fundo branco, borda 1px `#1f1f1f`, texto Ink |
| `IN_PROGRESS` | Em andamento | Fundo `#1f1f1f`, texto branco |
| `COMPLETED` | Concluído | Fundo `#f7f7f7`, borda 1px `#c9c9cd`, texto Slate |
| `CANCELLED` | Cancelado | Fundo branco, borda 1px `#c9c9cd`, texto Slate com `text-decoration: line-through` |

### Cartão de serviço (passo 2 do wizard)
- Cartão selecionável; **selecionado:** borda 2px `#1f1f1f`
- Nome em DM Sans 500 24px, duração em Inter 14px Slate ("60 min"), preço em DM Sans 500 32px alinhado à direita

### Modal de cadastro de pet
- `ion-modal` em folha inferior (sheet) com raio 22,5px no topo, sem sombra extra além da do modal
- Mesmos campos `.field` + `.input`; espécie escolhida em chips (Cachorro, Gato, Outro)
- Botão "Salvar pet" escuro no rodapé

---

## 9. Fotografia e ícones

**Céu (telas de entrada e destaques):** fotografia de página inteira, clara e superexposta, com cúmulos suaves, nunca escura. Deixe espaço livre no topo do enquadramento para o título.

**Pets (cartões e estados vazios):** fotos em close editorial, olhando para fora da câmera, luz natural quente e difusa, aspecto espontâneo, não posado. Em avatares, recorte circular centrado no rosto.

**Proibido:** ilustrações decorativas, renders 3D, mascotes desenhados, stickers, emojis como ícones de interface.

**Ícones:** monocromáticos, de linha (ionicons `-outline`), traço de 1,5–2px, cor Ink ou Slate, nunca preenchidos com cor de marca. Tamanho 24px.

**Capturas do produto:** quando precisar mostrar o app (apresentação), use moldura de iPhone/Android com raio 22,5px no topo, nunca captura solta.

---

## 10. Movimento

- **Sem animação de entrada** automática em seções ou cartões
- Permitido: transição de 150ms em opacidade e cor de borda nos estados de hover/foco; transição de página padrão do Ionic; abertura de modais e sheets
- Respeitar `prefers-reduced-motion`

---

## 11. Texto da interface (copy)

- **Idioma:** português do Brasil, frases em caixa de sentença, sem exclamações
- **Botões:** verbo no infinitivo que diz exatamente o que acontece ("Agendar serviço", "Salvar pet", "Confirmar agendamento"). Evite "Enviar" e "OK"
- **Consistência:** a ação mantém o mesmo nome no fluxo inteiro. Se o botão diz "Confirmar agendamento", o aviso seguinte diz "Agendamento confirmado"
- **Carregando:** gerúndio com reticências ("Entrando…")
- **Erros:** dizem o que houve e como resolver, sem pedir desculpas e sem culpar o usuário. "Informe um e-mail válido." "Horário acabou de ser ocupado. Escolha outro."
- **Vazio:** convida a agir. "Você ainda não tem pets. Cadastre o primeiro."
- **Sem rótulos em CAIXA ALTA.** A única exceção do original (microrrótulos de 12px com tracking aberto) foi substituída por sentença com tracking +0,015em

---

## 12. Do's e Don'ts

### Faça
- Use raio 9999px em todo botão, campo, tag e filtro
- Mantenha títulos em DM Sans 500, nunca mais pesados
- Separe cartões e listas com fio de `#c9c9cd` ou troca de superfície
- Deixe a fotografia carregar a cor e o clima
- Aplique tracking negativo em todos os tamanhos de título
- Use a inversão claro/escuro (faixa `#1f1f1f` com cartão branco) para o resumo de agendamento
- Sinalize estados com borda 2px, preenchimento, opacidade e **texto**
- Garanta foco visível por teclado e área de toque de pelo menos 44px

### Não faça
- Não introduza cores novas: são 7 neutros e um gradiente azul
- Não use sombras em cartões e botões
- Não use peso acima de 500 em DM Sans
- Não coloque o gradiente azul em hero, botão ou cartão
- Não use cantos retos ou pouco arredondados em ações principais
- Não misture DM Sans e Inter no mesmo tamanho
- Não indique estado só por cor
- Não use emojis, ilustrações ou mascotes como elementos de interface
- Não habilite o tema escuro do Ionic (`dark.system.css`): o design é somente claro

---

## 13. Implementação no Angular + Ionic

### Arquivos

```text
src/
├── styles.scss                       # tokens + classes globais (.field .input .btn .link .divider .form-error .notice)
├── theme/variables.css               # variáveis do Ionic (gerado pelo ng add)
└── app/
    └── shared/
        ├── components/auth-shell/    # shell das telas de entrada
        └── utils/form-errors.ts      # showInvalid()
```

### Variáveis do Ionic alinhadas ao design

```scss
html:root {
  --ion-background-color: #ffffff;
  --ion-text-color: #1f1f1f;
  --ion-font-family: var(--font-ui);

  --ion-color-primary: #1f1f1f;
  --ion-color-primary-contrast: #ffffff;

  --ion-toolbar-background: #ffffff;
  --ion-toolbar-color: #1f1f1f;
  --ion-tab-bar-background: #ffffff;
  --ion-tab-bar-color: #717173;
  --ion-tab-bar-color-selected: #1f1f1f;
  --ion-border-color: #c9c9cd;
}
```

`html:root` tem mais especificidade que o `:root` do Ionic, então estas variáveis vencem sem depender da ordem dos arquivos de estilo.

### Regras práticas
- Prefira **elementos nativos** (`<input>`, `<button>`, `<a>`) com as classes globais em vez de `ion-input`/`ion-button`: o resultado é mais previsível e fiel à pílula do Revolut. Use Ionic para o que ele faz melhor: `ion-content`, `ion-tab-bar`, `ion-modal`, `ion-datetime`, `ion-refresher`
- Para o seletor de data do passo 3, use `ion-datetime` com `presentation="date"` e ajuste as variáveis (`--background`, `--ion-color-primary`) para Ink e branco
- Sem foto, o céu cai para o gradiente em CSS; com foto, defina `--auth-sky-photo`

---

## 14. Tokens em CSS (copiar para `styles.scss`)

```css
:root {
  color-scheme: light;

  /* Cores */
  --color-ink: #1f1f1f;
  --color-pure-black: #000000;
  --color-bone: #ffffff;
  --color-ash-grey: #c9c9cd;
  --color-mist: #f7f7f7;
  --color-slate: #717173;
  --color-graphite: #4c4c4c;
  --gradient-cobalt-wash: linear-gradient(to right, #1227fd, #6fa0ff);

  /* Fontes */
  --font-display: 'DM Sans Variable', 'Inter Variable', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  --font-ui: 'Inter Variable', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;

  /* Escala tipográfica */
  --text-caption: 12px;
  --text-body-sm: 14px;
  --text-body: 16px;
  --text-subheading: 18px;
  --text-heading-sm: 24px;
  --text-heading: 32px;
  --text-heading-lg: 40px;
  --text-display: 52px;

  /* Espaçamento */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-80: 80px;

  /* Raios */
  --radius-pill: 9999px;
  --radius-card: 22.5px;
  --radius-list: 20px;
  --radius-control: 12px;

  /* Layout */
  --page-max-width: 1200px;
  --form-max-width: 480px;
  --card-padding: 24px;

  /* Superfícies */
  --surface-canvas: #ffffff;
  --surface-recessed: #f7f7f7;
  --surface-edge: #c9c9cd;
  --surface-card: #ffffff;
  --surface-inverted: #1f1f1f;
}
```

---

## 15. Guia rápido para gerar novas telas (prompts)

**Referência de cores:** texto `#1f1f1f` · fundo `#ffffff` · borda `#c9c9cd` · texto apagado `#717173` · superfície rebaixada `#f7f7f7` · superfície escura `#1f1f1f` · ação principal: pílula `#1f1f1f`.

1. **Home do cliente:** "Tela Ionic standalone em Angular 21. Fundo branco. Saudação 'Olá, {nome}' em DM Sans 500 32px. Botão `.btn.btn--dark` 'Agendar serviço'. Seção 'Próximos agendamentos' com cartões brancos (raio 22,5px, borda 1px #c9c9cd, sem sombra), cada um com data em DM Sans 500 18px, 'Pet · Serviço' em Inter 14px e badge de status em pílula. Seção 'Seus pets' com carrossel horizontal de cartões de pet. Barra de abas inferior com borda superior de 1px, ícones de linha. Sem cores além dos neutros."
2. **Cartão de pet:** "Cartão branco, raio 22,5px, borda 1px #c9c9cd, padding 24px. Avatar circular 56px, nome em DM Sans 500 24px, raça e idade em Inter 14px #717173."
3. **Seletor de horários:** "Grade de 3 colunas, gap 8px, pílulas de 44px de altura. Livre: borda 1px #c9c9cd. Selecionado: fundo #1f1f1f e texto branco. Indisponível: opacidade 0,4 e texto riscado."
4. **Resumo de agendamento (passo 4):** "Seção com fundo #1f1f1f e cartão branco de 22,5px de raio com pet, serviço, data/hora e preço em DM Sans 500 32px. Abaixo, botão pílula branco 'Confirmar agendamento'."
5. **Agenda do admin:** "Faixa de navegação #1f1f1f com marca branca. Conteúdo com largura máxima 1200px. Chips de filtro por status. Lista agrupada em #f7f7f7 com raio 20px, linhas separadas por fio de 1px #c9c9cd, hora em DM Sans 500 18px e badge de status em pílula."

---

## 16. Marcas parecidas (referências)

- **Revolut:** origem deste sistema: monocromia editorial, pílulas e fotografia de céu
- **Wise:** fintech monocromática com um acento e botões em pílula
- **N26:** paleta acromática e geometria de pílula, com contraste mais denso
- **Apple:** fotografia de página inteira com títulos leves e sóbrios
