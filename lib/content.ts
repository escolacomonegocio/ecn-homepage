// Copy da home, transcrita do documento "Copy site ECN.docx" (verbatim).
// Mudou o documento? Mude aqui. Os componentes só leem daqui.

export const hero = {
  eyebrow: "ECN — Escola como Negócio",
  title: "Soluções para escolas que querem crescer com gestão, e não com sorte.",
  lead:
    "Formação, mentoria, consultoria e implementação para gestores e instituições de ensino, criadas a partir da experiência de quem construiu e participa da gestão de uma operação educacional real.",
  ctaPrimary: "Conheça nossas soluções",
  ctaSecondary: "Fale com um especialista",
  note:
    "Fundada por Leonardo Chucrute, fundador do Grupo Transforma Educação, ao lado de sócios que fizeram parte dessa trajetória, a ECN transforma experiência prática em conhecimento e soluções para outras instituições de ensino.",
  // Rótulos do visual animado: as quatro frentes citadas no parágrafo do hero.
  labels: ["Formação", "Mentoria", "Consultoria", "Implementação"],
};

export const experiencia = {
  kicker: "A experiência por trás da ECN",
  title: "Conhecimento construído dentro de uma operação educacional real.",
  paragraphs: [
    "A ECN nasceu da experiência de seus fundadores na construção e gestão do Grupo Transforma Educação.",
    "Foi dentro dessa trajetória que surgiram os aprendizados sobre gestão, liderança, marketing, comercial, finanças, tecnologia e desenvolvimento de pessoas que hoje dão origem às soluções da ECN.",
  ],
  // Regra do documento: números do Grupo Transforma aparecem como CONTEXTO da origem,
  // nunca como indicadores operacionais da ECN. Por isso ficam agrupados sob o rótulo abaixo
  // e separados do único número que é da própria ECN.
  originLabel: "A experiência do Grupo Transforma está na origem da ECN.",
  origin: [
    { value: 25, prefix: "", suffix: "", unit: "escolas", label: "Grupo Transforma Educação" },
    { value: 10, prefix: "+", suffix: " mil", unit: "alunos", label: "nas unidades do Grupo Transforma" },
    { value: 1000, prefix: "+", suffix: "", unit: "colaboradores", label: "na operação do Grupo Transforma" },
  ],
  ecn: { value: 1250, prefix: "+", suffix: "", unit: "educadores", label: "formados pela ECN" },
};

export const manifesto = {
  kicker: "Manifesto",
  title: "Excelência pedagógica e saúde financeira não são escolhas opostas.",
  paragraphs: [
    "A ECN nasceu da experiência de quem construiu e participa da gestão de uma operação educacional real.",
    "Fundada por Leonardo Chucrute, fundador do Grupo Transforma Educação, em parceria com sócios que fizeram parte dessa trajetória, a ECN transforma essa experiência em conhecimento, métodos e soluções para gestores e instituições de ensino.",
    "O que ensinamos não nasceu apenas em uma sala de aula. Foi construído a partir dos desafios reais de administrar escolas, liderar equipes, atrair alunos, organizar processos, tomar decisões e buscar sustentabilidade para o negócio.",
  ],
  turn: "Por isso, nosso trabalho não é levar teoria para a sua escola.",
  turnBody:
    "É compartilhar experiências, métodos e ferramentas que nasceram da prática — e ajudar cada instituição a encontrar o caminho mais adequado para o seu próprio momento.",
  closing:
    "Não ensinamos apenas o que funciona na teoria. Compartilhamos o que aprendemos construindo escolas na prática.",
  // Os mesmos parágrafos acima, divididos em capítulos para leitura em partes.
  // Texto verbatim; { strong } só marca as frases-chave (branco sobre o cinza).
  chapters: [
    {
      id: "origem",
      label: "A origem",
      text: [
        "A ECN nasceu da experiência de ",
        { strong: "quem construiu e participa da gestão de uma operação educacional real." },
      ],
    },
    {
      id: "fundacao",
      label: "A fundação",
      text: [
        "Fundada por ",
        { strong: "Leonardo Chucrute" },
        ", fundador do Grupo Transforma Educação, em parceria com sócios que fizeram parte dessa trajetória, a ECN transforma essa experiência em ",
        { strong: "conhecimento, métodos e soluções para gestores e instituições de ensino." },
      ],
    },
    {
      id: "desafios",
      label: "Os desafios reais",
      text: [
        { strong: "O que ensinamos não nasceu apenas em uma sala de aula." },
        " Foi construído a partir dos desafios reais de administrar escolas, liderar equipes, atrair alunos, organizar processos, tomar decisões e buscar sustentabilidade para o negócio.",
      ],
      // os seis desafios citados no próprio parágrafo
      items: ["Administrar escolas", "Liderar equipes", "Atrair alunos", "Organizar processos", "Tomar decisões", "Buscar sustentabilidade"],
    },
    {
      id: "virada",
      label: "A virada",
      text: [
        { strong: "Por isso, nosso trabalho não é levar teoria para a sua escola." },
        " É compartilhar experiências, métodos e ferramentas que nasceram da prática — e ajudar cada instituição a encontrar o caminho mais adequado para o seu próprio momento.",
      ],
    },
  ] as Array<{ id: string; label: string; text: Array<string | { strong: string }>; items?: string[] }>,
};

export type SolucaoId = "diamante" | "mentoria" | "implementacao" | "cursos" | "palestras";

export type Solucao = {
  id: SolucaoId;
  name: string;
  title: string;
  // Trechos em negrito no documento viram { strong }.
  body: Array<string | Array<string | { strong: string }>>;
  forWhom?: string;
  cta: string;
  /** Quando existe, o CTA vira rótulo e cada link leva a uma página própria. */
  links?: Array<{ label: string; href: string }>;
};

export const ecossistema = {
  kicker: "Ecossistema ECN",
  title: "Uma solução para cada momento da sua escola.",
  lead:
    "Cada instituição vive um momento diferente. Por isso, a ECN reúne diferentes formas de ajudar gestores a desenvolver, estruturar e transformar suas escolas.",
  items: [
    {
      id: "diamante",
      name: "Consultoria Diamante",
      title: "Profissionalize a gestão da sua escola com orientação e implementação acompanhada.",
      body: [
        "Um programa de 12 meses para escolas que querem estruturar melhor sua gestão, organizar processos e preparar a operação para novos ciclos de crescimento.",
        [
          "A ECN reúne ",
          { strong: "7 tutores especializados" },
          " para diagnosticar os principais desafios da instituição, orientar as mudanças necessárias e acompanhar a implementação junto à equipe da escola.",
        ],
      ],
      forWhom: "escolas já estruturadas que querem profissionalizar sua gestão de forma ampla.",
      cta: "Conhecer a Consultoria Diamante",
    },
    {
      id: "mentoria",
      name: "Mentoria 1:1",
      title: "Conte com a experiência de Leonardo Chucrute para orientar os movimentos da sua escola.",
      body: [
        "Um acompanhamento individual para gestores que estão diante de decisões importantes e querem contar com a experiência de quem construiu e lidera uma operação educacional.",
        "Expansão, novos projetos, fornecedores, estrutura, investimentos ou outros movimentos estratégicos: a pauta parte das necessidades de cada mentorado.",
        "Leonardo atua como conselheiro, ajudando a analisar decisões, definir caminhos e acompanhar os próximos passos.",
      ],
      forWhom:
        "líderes que têm clareza sobre o momento que vivem e querem transformar essa clareza em movimento.",
      cta: "Conhecer a Mentoria 1:1",
    },
    {
      id: "implementacao",
      name: "Implementação de Marketing e Comercial",
      title:
        "Estruture a presença digital e prepare o comercial da sua escola para as próximas matrículas.",
      body: [
        "Sua escola precisa ser encontrada, apresentar com clareza o que oferece e ter um caminho estruturado para transformar interesse em oportunidade de matrícula.",
        [
          "Nesse projeto, a ECN trabalha junto com sua equipe para criar, atualizar ou melhorar os principais pontos dessa estrutura: ",
          {
            strong:
              "Instagram, landing page, Google Meu Negócio, análise de concorrentes, CRM, atendimento e processo comercial.",
          },
        ],
        [
          "A ECN monta e configura a estrutura, orienta sua equipe e acompanha a implementação. ",
          { strong: "A operação dos leads e das matrículas continua com a escola." },
        ],
      ],
      forWhom: "escolas que precisam criar, atualizar ou organizar sua estrutura digital e comercial.",
      cta: "Conhecer o Projeto",
    },
    {
      id: "cursos",
      name: "Cursos",
      title: "Formação prática para gestores e equipes escolares.",
      body: [
        "Conteúdos online sobre gestão, inteligência artificial, produção de conteúdo, marketing e vendas, desenvolvidos a partir da experiência prática dos profissionais da ECN.",
      ],
      cta: "Conhecer os cursos",
      links: [
        { label: "IA na Educação", href: "https://www.escolacomonegocio.com.br/ine/" },
        { label: "Gravação e Edição Simplificadas", href: "https://www.escolacomonegocio.com.br/ges/" },
        { label: "Educador de Sucesso", href: "https://www.escolacomonegocio.com.br/eds/" },
      ],
    },
    {
      id: "palestras",
      name: "Palestras",
      title: "Gestão, liderança e inovação para quem transforma a educação.",
      body: [
        "Conteúdos para eventos, redes de ensino, secretarias, associações e encontros de educadores, conectando experiência prática de gestão aos desafios atuais da educação.",
      ],
      cta: "Conhecer as palestras",
    },
  ] satisfies Solucao[],
};

export const metodo = {
  kicker: "Como a ECN trabalha",
  title: "Experiência prática transformada em método.",
  lead:
    "Cada escola tem sua realidade. Por isso, antes de indicar um caminho, precisamos entender o momento da instituição, seus desafios e suas prioridades.",
  steps: [
    {
      n: "01",
      name: "Diagnóstico",
      verb: "Diagnosticar.",
      text: "Entendemos o momento da escola, seus números, processos, equipe, posicionamento e principais desafios.",
    },
    {
      n: "02",
      name: "Plano sob medida",
      verb: "Estruturar.",
      text: "Definimos prioridades e caminhos de acordo com as necessidades e objetivos da instituição.",
    },
    {
      n: "03",
      name: "Implementação acompanhada",
      verb: "Implementar.",
      text: "Transformamos planejamento em ação, com orientação, ferramentas, acompanhamento e revisões ao longo do processo.",
    },
    {
      n: "04",
      name: "Crescimento sustentável",
      verb: "Evoluir.",
      text: "Acompanhamos indicadores e aprendizados para que a escola possa tomar decisões melhores e construir seu próximo ciclo.",
    },
  ],
};

export const comecar = {
  kicker: "Por onde começar?",
  title: "Sua escola está em qual momento?",
  lead:
    "Não existe uma única solução para todas as escolas. Existe a solução mais adequada para o desafio que sua instituição vive agora.",
  paths: [
    { q: "Quer desenvolver você ou sua equipe?", pre: "Conheça os ", target: "Cursos ECN", id: "cursos" },
    {
      q: "Precisa estruturar sua presença digital e seu processo comercial?",
      pre: "Conheça a ",
      target: "Implementação de Marketing e Comercial",
      id: "implementacao",
    },
    {
      q: "Está diante de decisões importantes e quer contar com a experiência de um conselheiro?",
      pre: "Conheça a ",
      target: "Mentoria 1:1",
      id: "mentoria",
    },
    {
      q: "Quer profissionalizar diferentes áreas da gestão e acompanhar a implementação das mudanças?",
      pre: "Conheça a ",
      target: "Consultoria Diamante",
      id: "diamante",
    },
    {
      q: "Quer levar conteúdo de gestão, liderança ou inovação para seu evento?",
      pre: "Conheça nossas ",
      target: "Palestras",
      id: "palestras",
    },
  ] satisfies Array<{ q: string; pre: string; target: string; id: SolucaoId }>,
  unsure: {
    q: "Não sabe qual solução faz sentido para sua escola?",
    text: "Converse com nosso time.",
    cta: "Falar com um especialista",
  },
};

export const equipe = {
  kicker: "Quem está por trás da ECN",
  title: "Liderada por quem conhece os desafios de construir e gerir uma operação educacional.",
  intro: [
    "A ECN foi fundada por ",
    { strong: "Leonardo Chucrute" },
    ", fundador do Grupo Transforma Educação, ao lado de sócios que participaram da construção dessa trajetória.",
  ] as Array<string | { strong: string }>,
  vision:
    "É dessa experiência que nasce a visão da ECN: ajudar outras instituições a tomar decisões melhores, estruturar sua gestão e crescer de forma sustentável.",
  people: [
    {
      name: "Leonardo Chucrute",
      role: "Fundador da ECN e fundador do Grupo Transforma Educação",
      bio: "Mentor e responsável pela criação do Método EDS.",
    },
    {
      name: "Mauricio Thomas",
      role: "Sócio da ECN e vice-presidente da holding Transforma Educação",
      bio: "Advogado, com MBA em Gestão Educacional e Digital e atuação em gestão e inteligência artificial aplicada aos negócios.",
    },
    {
      name: "Paulo Pereira",
      role: "Sócio da ECN e CMO do Grupo Transforma",
      bio: "Mestre em Matemática pelo IMPA e comunicador da educação, com mais de 3 milhões de seguidores.",
    },
  ],
  team: {
    name: "E uma equipe multidisciplinar",
    text: [
      "Ao lado dos fundadores, a ECN conta com profissionais especializados em ",
      { strong: "finanças, comercial, tecnologia, marketing, tráfego pago e gestão de projetos" },
      ".",
    ] as Array<string | { strong: string }>,
  },
  cta: "Conheça nossa história",
};

// Prova social: o documento exige depoimentos e logos REAIS ("sem depoimentos genéricos").
// Enquanto não houver material aprovado, as listas ficam vazias e a seção mostra só as
// fotos reais dos eventos ECN. Formato esperado de cada depoimento:
// { quote: "...", name: "Nome", role: "Cargo", school: "Escola", city: "Cidade/UF" }
export const prova = {
  kicker: "Prova social",
  title: "Escolas que já caminham com a ECN.",
  testimonials: [] as Array<{ quote: string; name: string; role: string; school: string; city: string }>,
  logos: [] as Array<{ name: string; src: string }>,
};

export const ctaFinal = {
  title: "Sua escola não precisa enfrentar os próximos desafios sozinha.",
  paragraphs: [
    "Cada instituição tem uma realidade, uma história e um momento diferente.",
    "Conte para a nossa equipe onde sua escola está hoje. Vamos entender seus desafios e indicar qual solução do ecossistema ECN pode fazer sentido para o próximo passo.",
  ],
  cta: "Falar com um especialista",
};

export const contato = {
  kicker: "Contato",
  title: "Vamos conversar sobre a sua escola.",
  paragraphs: [
    "Conte um pouco sobre sua instituição e o momento que ela vive.",
    "Nosso time vai entender seu cenário e ajudar você a encontrar o caminho mais adequado.",
  ],
  interestLabel: "O que você procura?",
  interests: [
    { id: "diamante", label: "Consultoria Diamante" },
    { id: "mentoria", label: "Mentoria 1:1" },
    { id: "implementacao", label: "Implementação de Marketing e Comercial" },
    { id: "cursos", label: "Cursos" },
    { id: "palestras", label: "Palestras" },
    { id: "nao-sei", label: "Ainda não sei" },
  ],
  submit: "Enviar e falar com um especialista",
  whatsappLabel: "Prefere falar pelo WhatsApp?",
  whatsappCta: "Falar diretamente com nosso time",
};

export const rodape = {
  name: "ECN — Escola como Negócio",
  tagline: "Soluções de gestão, marketing e crescimento para instituições de ensino.",
  about:
    "Uma empresa fundada por profissionais que construíram sua experiência na gestão educacional e que hoje transformam esse conhecimento em soluções para outras escolas.",
  columns: [
    {
      title: "Soluções",
      links: [
        { label: "Consultoria Diamante", href: "#diamante" },
        { label: "Mentoria 1:1", href: "#mentoria" },
        { label: "Implementação MKT & Comercial", href: "#implementacao" },
      ],
    },
    {
      title: "Formação",
      links: [
        { label: "Cursos", href: "#cursos" },
        { label: "Palestras", href: "#palestras" },
      ],
    },
    {
      title: "Institucional",
      links: [
        { label: "Quem somos", href: "#quem-somos" },
        { label: "Contato", href: "#contato" },
        { label: "Política de privacidade", href: "https://www.escolacomonegocio.com.br/politica-de-privacidade/" },
      ],
    },
  ],
  group: "Grupo Transforma Educação",
};
