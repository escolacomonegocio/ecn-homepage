import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Script from "next/script";
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
  // Indexável no domínio oficial; o endereço *.vercel.app recebe X-Robots-Tag noindex (next.config).
  robots: { index: true, follow: true },
  // Verificação do domínio na Meta (as mesmas do site atual).
  other: { "facebook-domain-verification": ["ood9hom56gfrlwq7br3usnmfzwdwqw", "edrv5862g7px9x5g5yfjnwjh0g4vjc"] },
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
        {/* Rastreamento herdado do site atual: UTMify e Pixel da Meta. */}
        <Script id="utmify" strategy="afterInteractive">
          {`window.pixelId = "679d045ebf70adf4b38d9753";
var a = document.createElement("script");
a.async = true;
a.defer = true;
a.src = "https://cdn.utmify.com.br/scripts/pixel/pixel.js";
document.head.appendChild(a);`}
        </Script>
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version="2.0";n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,"script","https://connect.facebook.net/en_US/fbevents.js");
fbq("init", "2439585536395879");
fbq("track", "PageView");`}
        </Script>
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img height="1" width="1" style={{ display: "none" }} alt="" src="https://www.facebook.com/tr?id=2439585536395879&ev=PageView&noscript=1" />
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </body>
    </html>
  );
}
