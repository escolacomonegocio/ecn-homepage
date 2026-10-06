// Worker do Cloudflare na rota www.escolacomonegocio.com.br/*
// A home nova (Next.js na Vercel) responde por "/" e pelos próprios arquivos;
// todo o resto (páginas de curso, captação, obrigado, bio, wp-admin, wp-json...) segue para o WordPress.
// Para voltar à home antiga: desativar a rota do Worker no painel do Cloudflare.

const HOME = "https://ecn-homepage.vercel.app";

const ARQUIVOS_DA_HOME = [/^\/_next\//, /^\/video\//, /^\/(icon|apple-icon)\.png$/, /^\/opengraph-image\.jpg$/];

// Parâmetros que, em "/", são do WordPress (busca, prévia de post, Elementor, feed).
const PARAMS_WORDPRESS = ["p", "page_id", "s", "preview", "elementor-preview", "feed", "post_type"];

export function vaiParaHome(url) {
  if (url.pathname === "/") return !PARAMS_WORDPRESS.some((p) => url.searchParams.has(p));
  return ARQUIVOS_DA_HOME.some((r) => r.test(url.pathname));
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (!vaiParaHome(url)) return fetch(request);

    const resposta = await fetch(new Request(HOME + url.pathname + url.search, request));
    const saida = new Response(resposta.body, resposta);
    // a Vercel marca *.vercel.app como noindex; no domínio oficial a home é indexável
    saida.headers.delete("X-Robots-Tag");
    return saida;
  },
};
