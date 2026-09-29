// Símbolo "e•cn" redesenhado em SVG a partir do logo oficial (Logo colorida e preta.png):
// arcos de raio 293 e traço 76, barra do "e" com 51 de altura, ponto de raio 82 e
// anel de respiro de raio 118 recortando "e" e "c" em volta do ponto.
// Letras usam currentColor; o ponto é sempre o verde da marca.
export const LOGO_GEOMETRY = {
  viewBox: "70 395 1862 675",
  dot: { cx: 726, cy: 736, r: 82, gap: 118 },
};

export function Logo({ id, className, title = "ECN, Escola como Negócio" }: { id: string; className?: string; title?: string }) {
  const clip = `ecn-gap-${id}`;
  return (
    <svg viewBox={LOGO_GEOMETRY.viewBox} className={className} role="img" aria-label={title}>
      <defs>
        <clipPath id={clip}>
          <path clipRule="evenodd" d="M0 0H2000V1200H0Z M608 736a118 118 0 1 0 236 0a118 118 0 1 0-236 0Z" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clip})`} fill="none" stroke="currentColor" strokeWidth="76" strokeLinecap="round">
        <path d="M697 736A293 293 0 1 0 614.7 939.8" />
        <path d="M1269.2 528.8A293 293 0 1 0 1269.2 943.2" />
        <path d="M1390 1028V685A250 250 0 0 1 1890 685V1028" />
        <rect x="120" y="711" width="630" height="51" fill="currentColor" stroke="none" />
      </g>
      <circle cx="726" cy="736" r="82" fill="rgb(var(--mint))" />
    </svg>
  );
}
