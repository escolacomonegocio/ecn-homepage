import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { site } from "@/lib/site";
import "./globals.css";

const satoshi = localFont({
  src: [
    { path: "./fonts/Satoshi-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/Satoshi-Medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/Satoshi-Bold.woff2", weight: "700", style: "normal" },
    { path: "./fonts/Satoshi-Black.woff2", weight: "900", style: "normal" },
  ],
  variable: "--font-satoshi",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: "ECN | Escola como Negócio: gestão, marketing e crescimento para escolas",
  description: site.description,
  alternates: { canonical: "/" },
  // Enquanto a página vive num domínio temporário (*.vercel.app), fica fora do Google para
  // não competir com o site atual. Ao apontar o domínio oficial: NEXT_PUBLIC_INDEXAR=true.
  robots: process.env.NEXT_PUBLIC_INDEXAR === "true" ? { index: true, follow: true } : { index: false, follow: false },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "ECN | Escola como Negócio",
    title: "Soluções para escolas que querem crescer com gestão, e não com sorte.",
    description: site.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#1b1f22",
  width: "device-width",
  initialScale: 1,
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "ECN | Escola como Negócio",
  url: site.url,
  description: site.description,
  founder: { "@type": "Person", name: "Leonardo Chucrute" },
  parentOrganization: { "@type": "Organization", name: "Grupo Transforma Educação" },
  sameAs: [site.instagram],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={satoshi.variable}>
      <body>
        <a href="#conteudo" className="skip-link">
          Pular para o conteúdo
        </a>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </body>
    </html>
  );
}
