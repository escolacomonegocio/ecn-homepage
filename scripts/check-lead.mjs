// Confere as defesas da rota /api/lead sem gravar nada no CRM.
// Uso: node scripts/check-lead.mjs <url-base>
// Sem as variáveis do CRM no servidor, o caso válido responde 503; com elas, os casos inválidos
// continuam barrados antes de qualquer chamada ao CRM.
import assert from "node:assert/strict";

const base = process.argv[2] ?? "http://localhost:3211";
const valido = { interesse: "diamante", nome: "[TESTE] Ana", cargo: "Diretora", escola: "Colégio X", cidade: "Niterói/RJ", whatsapp: "(21) 98765-4321", email: "ana@x.com.br", utm: {} };
const post = (body, origin = new URL(base).origin) =>
  fetch(base + "/api/lead", { method: "POST", headers: { "Content-Type": "application/json", ...(origin ? { Origin: origin } : {}) }, body: JSON.stringify(body) }).then((r) => r.status);

assert.equal(await post(valido, "https://site-qualquer.com"), 403, "origem de fora deveria ser barrada");
assert.equal(await post(valido, null), 403, "sem Origin deveria ser barrado");
const semEnv = (await post({})) === 503;
if (!semEnv) {
  assert.equal(await post({ ...valido, email: "ana@" }), 400, "e-mail inválido");
  assert.equal(await post({ ...valido, interesse: "xyz" }), 400, "interesse fora da lista");
  assert.equal(await post({ ...valido, whatsapp: "123" }), 400, "telefone curto");
  assert.equal(await post({ ...valido, site: "spam" }), 200, "honeypot responde ok sem gravar");
}
console.log(semEnv ? "lead OK (servidor sem variáveis do CRM: 503)" : "lead OK (validações)");
