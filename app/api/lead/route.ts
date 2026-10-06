import { randomUUID } from "node:crypto";
import { contato } from "@/lib/content";

// Recebe o formulário da home e cria o lead no Techlithy CRM (empresa Escola Como Negócio,
// fonte "Site ECN", pipeline ECN 2026, unidade ECN, canal Site).
// Contrato do webhook: POST /webhook/lead-intake/<uuid-da-fonte>, Bearer lsk_..., utm_source na
// query, external_id único por envio. O CRM confere o Origin contra a whitelist da fonte.
// nome/e-mail/telefone/interesse são campos padrão; cargo, escola, cidade e alunos estão
// mapeados para Observações na fonte; chaves fora do mapa (utm_*) também caem nas Observações.
// O 202 do CRM só quer dizer "na fila": a gravação é assíncrona.

const TL_BASE = "https://crm.techlithy.com/webhook/lead-intake/";
const TL_ORIGEM = "https://www.escolacomonegocio.com.br";
const ORIGENS_OK = [/^https:\/\/(www\.)?escolacomonegocio\.com\.br$/, /^https:\/\/ecn-homepage(-[a-z0-9-]+)?\.vercel\.app$/, /^http:\/\/localhost(:\d+)?$/];
const UTMS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;

const texto = (v: unknown, max = 160) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(req: Request) {
  const origem = req.headers.get("origin") ?? "";
  if (!ORIGENS_OK.some((r) => r.test(origem))) return Response.json({ ok: false }, { status: 403 });

  const conta = process.env.TECHLITHY_ACCOUNT_ID;
  const token = process.env.TECHLITHY_API_TOKEN;
  if (!conta || !token) {
    console.error("[lead] TECHLITHY_ACCOUNT_ID ou TECHLITHY_API_TOKEN ausente");
    return Response.json({ ok: false }, { status: 503 });
  }

  const corpo = await req.json().catch(() => null);
  if (!corpo || typeof corpo !== "object") return Response.json({ ok: false }, { status: 400 });
  const b = corpo as Record<string, unknown>;
  if (texto(b.site)) return Response.json({ ok: true }); // honeypot: robô recebe "ok" e nada é gravado

  const d = {
    nome: texto(b.nome),
    email: texto(b.email),
    whatsapp: texto(b.whatsapp, 30).replace(/\D/g, ""),
    cargo: texto(b.cargo),
    escola: texto(b.escola),
    cidade: texto(b.cidade),
    alunos: texto(b.alunos, 20),
  };
  const interesse = contato.interests.find((i) => i.id === b.interesse)?.label;
  if (!d.nome || !interesse || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email) || d.whatsapp.length < 10 || d.whatsapp.length > 13)
    return Response.json({ ok: false }, { status: 400 });

  const utm = (b.utm && typeof b.utm === "object" ? b.utm : {}) as Record<string, unknown>;
  const url = new URL(TL_BASE + encodeURIComponent(conta));
  const fonte = texto(utm.utm_source, 200);
  if (fonte) url.searchParams.set("utm_source", fonte);

  const telefone = d.whatsapp.startsWith("55") && d.whatsapp.length > 11 ? d.whatsapp : "55" + d.whatsapp;
  const payload: Record<string, string> = {
    name: d.nome,
    email: d.email,
    phone: "+" + telefone,
    interest: interesse,
    cargo: d.cargo,
    escola: d.escola,
    cidade: d.cidade,
    external_id: "site-ecn-" + randomUUID(),
  };
  if (d.alunos) payload.alunos = d.alunos;
  for (const k of UTMS.slice(1)) {
    const v = texto(utm[k], 200);
    if (v) payload[k] = v;
  }

  try {
    const r = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", Accept: "application/json", Origin: TL_ORIGEM },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8000),
    });
    if (!r.ok) {
      console.error("[lead] CRM recusou", r.status, (await r.text().catch(() => "")).slice(0, 300));
      return Response.json({ ok: false }, { status: 502 });
    }
    console.log("[lead] ok", { external_id: payload.external_id, interesse });
    return Response.json({ ok: true });
  } catch (e) {
    console.error("[lead] erro", e instanceof Error ? e.name : e);
    return Response.json({ ok: false }, { status: 502 });
  }
}
