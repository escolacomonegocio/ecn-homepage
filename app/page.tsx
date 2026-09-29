import { Header } from "@/components/Header";
import { Motion } from "@/components/Motion";
import { ContactModal } from "@/components/ContactModal";
import { Hero } from "@/components/sections/Hero";
import { Experiencia } from "@/components/sections/Experiencia";
import { Manifesto } from "@/components/sections/Manifesto";
import { Ecossistema } from "@/components/sections/Ecossistema";
import { Metodo } from "@/components/sections/Metodo";
import { Comecar } from "@/components/sections/Comecar";
import { Equipe } from "@/components/sections/Equipe";
import { Prova } from "@/components/sections/Prova";
import { CtaFinal } from "@/components/sections/CtaFinal";
import { Contato } from "@/components/sections/Contato";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main id="conteudo">
        <Hero />
        <Experiencia />
        <Manifesto />
        <Ecossistema />
        <Metodo />
        <Comecar />
        <Equipe />
        <Prova />
        <CtaFinal />
        <Contato />
      </main>
      <Footer />
      <ContactModal />
      <Motion />
    </>
  );
}
