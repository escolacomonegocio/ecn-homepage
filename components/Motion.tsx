"use client";

import { useEffect } from "react";

// Diretor de movimento da página. As seções são Server Components com marcação estática
// (tudo legível sem JS); este componente carrega GSAP + ScrollTrigger + Lenis depois da
// hidratação e liga os efeitos por atributos data-*. Com prefers-reduced-motion, nada disso roda.

const fmt = (n: number) => n.toLocaleString("pt-BR");

export function Motion() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let dispose = () => {};
    let cancelled = false;

    (async () => {
      const [{ gsap }, { ScrollTrigger }, { default: Lenis }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
        import("lenis"),
      ]);
      await document.fonts?.ready; // medidas (pins, encaixe dos painéis) com a fonte final
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      ScrollTrigger.config({ ignoreMobileResize: true });

      const lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 0.95 });
      lenis.on("scroll", ScrollTrigger.update);
      const tick = (t: number) => lenis.raf(t * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      document.documentElement.classList.add("has-motion");

      const q = <T extends Element = HTMLElement>(s: string, root: ParentNode = document) =>
        Array.from(root.querySelectorAll<T & Element>(s)) as T[];

      // Âncoras internas passam pelo Lenis. Âncoras de painéis do ecossistema são
      // resolvidas pelo próprio bloco pinado (ver ecoJump abaixo).
      let ecoJump: ((id: string) => boolean) | null = null;
      const onClick = (e: MouseEvent) => {
        const a = (e.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
        if (!a) return;
        const id = a.getAttribute("href")!.slice(1);
        if (!id) return;
        if (ecoJump?.(id)) return e.preventDefault();
        const target = document.getElementById(id);
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target, { offset: id === "topo" ? 0 : -24, duration: 1.4 });
        history.replaceState(null, "", `#${id}`);
      };
      document.addEventListener("click", onClick);

      const mm = gsap.matchMedia();
      mm.add(
        // Pins só em tela larga E alta o bastante para caber o conteúdo fixado.
        { desktop: "(min-width: 1024px) and (min-height: 700px)", mobile: "(max-width: 1023px), (max-height: 699px)" },
        (ctx) => {
          const { desktop } = ctx.conditions as { desktop: boolean };
          // Limpezas ao trocar de breakpoint (ctx.add executaria na hora; aqui só registra).
          const undo: Array<() => void> = [];

          // Hero: conteúdo sobe e perde força conforme a página rola.
          gsap.to("[data-hero-content]", {
            yPercent: -12,
            opacity: 0.15,
            ease: "none",
            scrollTrigger: { trigger: "[data-hero]", start: "top top", end: "bottom top", scrub: true },
          });

          // Entradas simples (uma vez).
          q("[data-reveal]").forEach((el) => {
            gsap.from(el, {
              y: 36,
              opacity: 0,
              duration: 1.1,
              ease: "expo.out",
              scrollTrigger: { trigger: el, start: "top 88%", once: true },
            });
          });
          q("[data-stagger]").forEach((el) => {
            gsap.from(el.children, {
              y: 28,
              opacity: 0,
              duration: 1,
              ease: "expo.out",
              stagger: 0.07,
              scrollTrigger: { trigger: el, start: "top 85%", once: true },
            });
          });

          // Leitura guiada: palavras acendem com o scroll.
          q("[data-words]").forEach((el) => {
            gsap.fromTo(
              q(".w", el),
              { opacity: 0.4 }, // 0.4 mantém contraste 3:1 do texto grande ainda "apagado"
              {
                opacity: 1,
                ease: "none",
                stagger: 0.1,
                scrollTrigger: { trigger: el, start: "top 82%", end: "bottom 52%", scrub: true },
              },
            );
          });

          // Contadores.
          q("[data-count]").forEach((el) => {
            const to = Number(el.dataset.count);
            const obj = { v: 0 };
            el.textContent = "0";
            gsap.to(obj, {
              v: to,
              duration: 1.8,
              ease: "expo.out",
              onUpdate: () => (el.textContent = fmt(Math.round(obj.v))),
              scrollTrigger: { trigger: el, start: "top 88%", once: true },
            });
          });

          // Containers escuros "encaixados" na página clara: entram recortados e
          // arredondados e se abrem até a borda quando chegam ao topo.
          q("[data-slab]").forEach((el) => {
            const inset = parseFloat(getComputedStyle(el).getPropertyValue("--slab-inset")) || 24;
            const radius = parseFloat(getComputedStyle(el).getPropertyValue("--slab-radius")) || 32;
            gsap.fromTo(
              el,
              { clipPath: `inset(0px ${inset}px 0px ${inset}px round ${radius}px)` },
              {
                clipPath: "inset(0px 0px 0px 0px round 0px)",
                ease: "none",
                scrollTrigger: { trigger: el, start: "top bottom", end: "top 12%", scrub: true },
              },
            );
          });

          // Manifesto: a foto do evento cresce de cartão até tela cheia.
          const stage = document.querySelector<HTMLElement>("[data-manifesto-stage]");
          if (stage) {
            const tl = gsap.timeline({
              scrollTrigger: { trigger: stage, start: "top top", end: desktop ? "+=130%" : "+=90%", pin: true, scrub: 0.6 },
            });
            tl.fromTo(
              "[data-manifesto-media]",
              { clipPath: desktop ? "inset(17% 21% 17% 21% round 28px)" : "inset(24% 7% 24% 7% round 22px)" },
              { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "none" },
              0,
            )
              .fromTo("[data-manifesto-media] img", { scale: 1.3 }, { scale: 1.02, ease: "none" }, 0)
              .fromTo("[data-manifesto-title]", { scale: 0.84, y: 40 }, { scale: 1, y: 0, ease: "none" }, 0)
              .fromTo("[data-manifesto-shade]", { opacity: 0.35 }, { opacity: 0.7, ease: "none" }, 0.2);
          }

          // Ecossistema: no desktop o container fixa e os cinco painéis se alternam.
          const eco = document.querySelector<HTMLElement>("[data-eco]");
          if (eco && desktop) {
            eco.classList.add("is-pinned");
            // Só fixa se o painel mais alto couber na área disponível (notebooks de 768px
            // de altura, zoom do navegador etc.). Senão, fica o layout empilhado.
            const area = eco.querySelector<HTMLElement>(".eco-panels")!;
            const fits = q(".eco-text", eco).every((t) => t.scrollHeight <= area.clientHeight + 2);
            if (!fits) eco.classList.remove("is-pinned");
          }
          if (eco && desktop && eco.classList.contains("is-pinned")) {
            const panels = q("[data-eco-panel]", eco);
            const tabs = q("[data-eco-tab]", eco);
            const bars = q("[data-eco-bar]", eco);
            const n = panels.length;
            let current = -1;
            const setActive = (i: number) => {
              if (i === current) return;
              current = i;
              panels.forEach((p, k) => p.classList.toggle("is-active", k === i));
              tabs.forEach((t, k) => t.setAttribute("aria-current", String(k === i)));
            };
            setActive(0);
            const st = ScrollTrigger.create({
              trigger: eco,
              start: "top 16px",
              end: `+=${(n - 1) * 85}%`,
              pin: true,
              snap: { snapTo: 1 / (n - 1), duration: { min: 0.25, max: 0.6 }, delay: 0.08, ease: "power2.inOut" },
              onUpdate: (self) => {
                const pos = self.progress * (n - 1);
                setActive(Math.round(pos));
                bars.forEach((b, k) => gsap.set(b, { scaleX: Math.min(Math.max(pos - k + 0.5, 0), 1) }));
              },
            });
            const jump = (i: number) => lenis.scrollTo(st.start + ((st.end - st.start) * i) / (n - 1), { duration: 1.2 });
            tabs.forEach((t, i) => t.addEventListener("click", () => jump(i)));
            ecoJump = (id) => {
              const i = panels.findIndex((p) => p.id === id);
              if (i < 0) return false;
              jump(i);
              return true;
            };
            undo.push(() => {
              eco.classList.remove("is-pinned");
              panels.forEach((p) => p.classList.remove("is-active"));
              ecoJump = null;
            });
          }

          // Método: o ponto percorre as quatro etapas.
          const metodo = document.querySelector<HTMLElement>("[data-steps-stage]");
          if (metodo) {
            const steps = q("[data-step]", metodo);
            const verbs = q("[data-verb]", metodo);
            const set = (p: number) => {
              const idx = Math.min(Math.floor(p * steps.length + 0.02), steps.length - 1);
              steps.forEach((s, k) => s.classList.toggle("is-on", k <= idx));
              verbs.forEach((v, k) => v.classList.toggle("is-on", k <= idx));
            };
            if (desktop) {
              metodo.classList.add("is-pinned");
              undo.push(() => metodo.classList.remove("is-pinned"));
              const track = metodo.querySelector<HTMLElement>("[data-steps-track]")!;
              const tl = gsap.timeline({
                scrollTrigger: {
                  trigger: metodo,
                  start: "top top",
                  end: "+=160%",
                  pin: true,
                  scrub: 0.5,
                  invalidateOnRefresh: true,
                  onUpdate: (self) => set(self.progress),
                },
              });
              tl.fromTo("[data-steps-fill]", { scaleX: 0 }, { scaleX: 1, ease: "none" }, 0).fromTo(
                "[data-steps-dot]",
                { x: 0 },
                { x: () => track.clientWidth, ease: "none" },
                0,
              );
            } else {
              // trilho vertical no celular, horizontal em tela larga baixa
              const axis = window.innerWidth >= 1024 ? "scaleX" : "scaleY";
              gsap.fromTo(
                "[data-steps-fill]",
                { [axis]: 0 },
                {
                  [axis]: 1,
                  ease: "none",
                  scrollTrigger: {
                    trigger: metodo,
                    start: "top 60%",
                    end: "bottom 60%",
                    scrub: true,
                    onUpdate: (self) => set(self.progress),
                  },
                },
              );
            }
            set(0);
            undo.push(() => {
              steps.forEach((s) => s.classList.add("is-on"));
              verbs.forEach((v) => v.classList.add("is-on"));
            });
          }

          // Retratos: revelação por máscara, de baixo para cima.
          q("[data-portrait]").forEach((el) => {
            const img = el.querySelector("img");
            gsap.fromTo(
              el,
              { clipPath: "inset(100% 0% 0% 0%)" },
              { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 85%", once: true } },
            );
            if (img)
              gsap.fromTo(img, { scale: 1.25 }, { scale: 1, duration: 1.8, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 85%", once: true } });
          });

          // CTA final: o ponto verde cresce até tomar a tela.
          const cta = document.querySelector<HTMLElement>("[data-cta-stage]");
          if (cta) {
            const tl = gsap.timeline({
              scrollTrigger: { trigger: cta, start: "top top", end: desktop ? "+=90%" : "+=70%", pin: true, scrub: 0.5 },
            });
            tl.fromTo("[data-cta-circle]", { clipPath: "circle(1.2% at 50% 50%)" }, { clipPath: "circle(75% at 50% 50%)", ease: "power2.in" }, 0).fromTo(
              "[data-cta-content]",
              { opacity: 0, y: 40 },
              { opacity: 1, y: 0, ease: "power2.out", duration: 0.45 },
              0.55,
            );
          }

          return () => undo.forEach((f) => f());
        },
      );

      // Fontes e imagens mudam alturas: recalcula posições quando tudo carregou.
      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener("load", refresh);
      document.fonts?.ready.then(refresh);

      // Chegou com #âncora na URL: posiciona depois que os pins existem.
      if (location.hash.length > 1) {
        const id = decodeURIComponent(location.hash.slice(1));
        requestAnimationFrame(() => {
          if (!ecoJump?.(id)) {
            const el = document.getElementById(id);
            if (el) lenis.scrollTo(el, { immediate: true, offset: -24 });
          }
        });
      }

      dispose = () => {
        document.removeEventListener("click", onClick);
        window.removeEventListener("load", refresh);
        mm.revert();
        gsap.ticker.remove(tick);
        lenis.destroy();
        document.documentElement.classList.remove("has-motion");
      };
    })();

    return () => {
      cancelled = true;
      dispose();
    };
  }, []);

  return null;
}
