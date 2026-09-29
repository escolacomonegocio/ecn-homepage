export const site = {
  name: "ECN | Escola como Negócio",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.escolacomonegocio.com.br",
  description:
    "Formação, mentoria, consultoria e implementação para gestores e instituições de ensino, criadas a partir da experiência de quem construiu e participa da gestão de uma operação educacional real.",
  // Número do time comercial usado hoje no site atual (atendimento por WhatsApp).
  whatsapp: "5521986761083",
  instagram: "https://www.instagram.com/escolacomonegocio",
};

export function whatsappLink(text = "Olá! Quero conversar sobre a minha escola com o time da ECN.") {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;
}
