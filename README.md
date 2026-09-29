# ECN | Escola como Negócio: homepage

Nova home da ECN, construída a partir do documento de copy "Copy site ECN.docx" (texto transcrito sem alterações em `lib/content.ts`).

## Stack

- Next.js 16 (App Router), React 19, TypeScript, Tailwind 3.4 + CSS próprio (`app/globals.css`)
- GSAP + ScrollTrigger e Lenis para os efeitos de rolagem, carregados só depois da hidratação
- Página 100% estática (sem backend). Fonte Satoshi auto-hospedada (woff2)

## Onde mexer

| Quero mudar | Arquivo |
|---|---|
| Qualquer texto da página | `lib/content.ts` |
| WhatsApp do time, Instagram, URL do site | `lib/site.ts` |
| Depoimentos e logos de clientes (prova social) | `lib/content.ts` → `prova.testimonials` / `prova.logos` |
| Cores, tipografia, espaçamentos | `app/globals.css` (tokens no topo) |
| Efeitos de rolagem | `components/Motion.tsx` (liga efeitos por atributos `data-*`) |
| Visual de partículas do hero | `components/HeroVisual.tsx` |
| Formulário de contato | `components/ContactForm.tsx` |

## Como os efeitos funcionam

As seções são Server Components com marcação completa e legível sem JavaScript. `Motion.tsx` carrega GSAP/Lenis depois da hidratação e procura atributos:

- `data-reveal`, `data-stagger`: entrada suave ao aparecer
- `data-words`: leitura guiada (palavras acendem com a rolagem)
- `data-count`: contadores numéricos
- `data-slab`: container escuro que entra arredondado e abre até a borda
- `data-manifesto-stage`: foto que cresce de cartão até tela cheia (fixada)
- `data-eco`: container do ecossistema fixado, alternando os 5 painéis. Só fixa se o painel mais alto couber na tela; senão usa o layout empilhado
- `data-steps-stage`: o ponto verde percorre as 4 etapas do método
- `data-cta-stage`: o ponto verde cresce até tomar a tela

Com "reduzir movimento" ativado no sistema, nada disso roda e a página fica estática.

## Formulário

O envio abre o WhatsApp do time (`lib/site.ts`) com a mensagem já preenchida. Não há gravação em banco. Para plugar um CRM, o ponto de entrada é a função `submit` em `components/ContactForm.tsx`.

## Indexação

Enquanto a página estiver num domínio temporário (`*.vercel.app`), ela vai com `noindex` para não competir com o site atual no Google. Ao apontar o domínio oficial, defina na Vercel `NEXT_PUBLIC_INDEXAR=true` e `NEXT_PUBLIC_SITE_URL=https://www.escolacomonegocio.com.br`, e faça um novo deploy.

## Scripts

```bash
npm run dev          # desenvolvimento
npm run build        # build de produção
npm run typecheck    # checagem de tipos
node scripts/prepare-assets.mjs "<pasta HOMEPAGE do cliente>"   # regenera fotos, fontes, ícones e imagem de compartilhamento
node scripts/shoot.mjs <url> <pasta> [largura] [altura]         # capturas de tela ao longo da rolagem (REDUCED=1 simula movimento reduzido)
node scripts/test-form.mjs <url>                                # teste ponta a ponta do formulário
node scripts/check-pins.mjs <url>                               # confere os blocos fixados em vários tamanhos de tela
node scripts/lcp-probe.mjs <url>                                # LCP real com 4G lenta e CPU 4x
node scripts/lh-summary.mjs <relatorio.json>                    # resumo de relatórios do Lighthouse
```

Os scripts de teste usam o Chrome instalado em `C:/Program Files/Google/Chrome/Application/chrome.exe`.
