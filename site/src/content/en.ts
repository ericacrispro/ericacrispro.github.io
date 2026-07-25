/**
 * English content — a translation of `pt-pt.ts`, which is the SOURCE OF TRUTH.
 * This file is typed against it: if a key is born there, TypeScript demands the
 * same key here.
 *
 * Project rule: **no text in the JSX**. If it shows up on screen, it comes from here.
 *
 * Tone: warm, direct, no wellness mysticism — the way a hairdresser actually talks.
 */
export const en = {
  meta: {
    lang: 'en',
    locale: 'en_GB',
    title: 'Erica Gonçalves — Redhead Hair Specialist',
    description:
      'Red hair colour, colour correction and tone maintenance, by someone who understands and lives red. Bookings via WhatsApp.',
    ogTitle: 'Erica Gonçalves — Redhead Specialist',
    ogDescription: 'Red done by someone who lives in red. Bookings via WhatsApp.',
  },

  brand: {
    name: 'Erica Gonçalves',
    firstName: 'Erica',
    tagline: 'Redhead Specialist',
    signature: 'Gonçalves',
  },

  nav: {
    trabalho: 'Work',
    tons: 'Shades',
    servicos: 'Services',
    sobre: 'About me',
    processo: 'How it works',
    duvidas: 'Questions',
    contacto: 'Contact',
    abrirMenu: 'Open menu',
    fecharMenu: 'Close menu',
    idioma: 'Language',
  },

  cta: {
    /** The first action on the whole site. */
    primary: 'Message me on WhatsApp',
    primaryShort: 'WhatsApp',
    primaryLong: 'Get in touch on WhatsApp',
    secondary: 'Call',
    secondaryLong: 'Call +351 932 386 898',
    /** Message already written when WhatsApp opens. */
    whatsappMessage:
      'Hi Erica! I saw your site and I would love to talk about my hair. 🦊',
    whatsappMessageAgenda: 'Hi Erica! I would like to book a red colour appointment. 🦊',
    whatsappMessageCorrecao:
      'Hi Erica! My colour did not turn out the way I wanted and I would like to know if it can be fixed.',
    helper: 'Send me a photo of your hair and we take it from there.',
    helperShort: 'Bookings and quotes by message.',
    maps: 'View on the map',
    instagram: 'Instagram',
    verTrabalho: 'See the work',
    verMais: 'See more',
    verTodos: 'See all',
  },

  hero: {
    /** One line per item — each version composes them as it likes. */
    titleLines: ['A perfect red', 'for my little', 'foxes.'],
    titleFlat: 'A perfect red for my little foxes.',
    /** Shorter alternative, for the big-type versions. */
    titleShort: 'Your perfect red.',
    lead: 'Red done by someone who lives in red — and who therefore knows what your hair can take before touching it.',
    leadShort: 'Red done by someone who lives in red.',
    note: 'Book by message, no commitment.',
    scroll: 'Scroll to see the work',
  },

  /** Strong lines, for the versions built around manifesto/big type. */
  manifesto: {
    lines: [
      'Red is the hardest colour to get right.',
      'It is also the one that fades fastest.',
      'It has to be done by someone who lives it.',
    ],
    kicker: 'Why only red',
    body: 'Every head of hair takes colour differently — what is already in it, what has been done to it before, how thick the strand is. With red you see it straight away: either it comes out alive, or it comes out orange and dull. Anyone who does not live with this colour every day finds that out too late, with the mix already on the hair. I am a redhead and I make redheads: I know this colour from both sides, in the mirror and in the chair.',
  },

  sobre: {
    title: 'Who is colouring your hair',
    kicker: 'About me',
    lead: 'I am Erica. I am a redhead, and I make redheads.',
    body: [
      'Colouring from scratch, correcting what went wrong somewhere else, and maintenance — which with red is half the job. It is the colour I live with every day, in the mirror and in the chair, and that is why I can read a head of hair before I touch it.',
      'Before I touch your hair, I want to know what has already been put on it. That is what decides what can be done today, and what will only work two sessions from now. I would rather tell you that to your face than promise a shade that will not hold.',
      'What I do is right there in the photos below. They are all my own clients — not one of them is from a catalogue.',
    ],
    badge: 'A redhead making redheads',
  },

  servicos: {
    title: 'What I do',
    kicker: 'Services',
    lead: 'All of it around the same thing: getting the right red into your hair, and keeping it there.',
    nota: 'The price depends on the length, the history of your hair and what needs doing — I tell you by message before you book.',
    items: [
      {
        title: 'Red colour',
        body: 'From the shade you have now to the red you want. Copper, auburn, ginger, cherry or bright orange — we choose together, based on what your hair can take.',
        tag: 'The speciality',
      },
      {
        title: 'Colour correction',
        body: 'Red that has gone orange, patchy, with roots in another colour or ends that came out darker. It can be brought back — sometimes in one session, sometimes in two.',
        tag: 'The rescue',
      },
      {
        title: 'Toning and maintenance',
        body: 'Red pigment fades faster than any other. A toner brings back the shine and the shade without colouring the whole head again.',
        tag: 'Every 4 to 8 weeks',
      },
      {
        title: 'Cut and shape',
        body: 'Bobs, layers, curtain fringe, curls. Colour only looks right if the cut gives it movement.',
        tag: 'With or without colour',
      },
      {
        title: 'Treatment and rebuilding',
        body: 'For hair that has been through bleach. Before the colour, when it is needed — so the shade takes evenly.',
        tag: 'When it is needed',
      },
      {
        title: 'Curls and waves',
        body: 'Cuts and colour designed for wavy and curly hair, which catches the light differently.',
        tag: 'Textured hair',
      },
    ],
  },

  processo: {
    title: 'How it starts',
    kicker: 'How it works',
    lead: 'From the first hello to the colour in your hair, with no surprises.',
    steps: [
      {
        title: 'You write to me',
        body: 'On WhatsApp, with a photo of your hair as it is today — in daylight if you can.',
      },
      {
        title: 'I tell you what is possible',
        body: 'What can be done straight away, what needs more than one session, how long it takes and what it costs.',
      },
      {
        title: 'We book it in',
        body: 'We pick the day. If it is a big transformation, I set aside more time for your hair.',
      },
      {
        title: 'We do the colour',
        body: 'On the day, I confirm the diagnosis with your hair in front of me before I mix anything at all.',
      },
    ],
  },

  galeria: {
    title: 'Work',
    kicker: 'Portfolio',
    lead: 'My own clients, photographed in the salon. No colour filters, no stock images.',
    filtroTodos: 'All shades',
    filtroLabel: 'Filter by shade',
    vazio: 'No photos in this shade yet.',
    contagem: 'looks',
    ampliar: 'Enlarge photo',
    /** Shade names — the keys are the ones from the photo manifest. */
    tons: {
      cobre: 'Copper',
      acaju: 'Auburn',
      gengibre: 'Ginger',
      cereja: 'Cherry',
      laranja: 'Bright orange',
      'ruivo-escuro': 'Dark red',
    } as Record<string, string>,
  },

  tons: {
    title: 'Which red is yours',
    kicker: 'The shade chart',
    lead: 'There is no such thing as "the" red. There is the one that suits your skin, your hair and your patience for the upkeep.',
    items: [
      { name: 'Copper', body: 'The warm, luminous red. The most requested one, and the best at hiding the roots growing out.' },
      { name: 'Auburn', body: 'Red pulled towards reddish brown. Quieter in the sun, easier to keep.' },
      { name: 'Ginger', body: 'The natural red, light and orange-toned — the one that looks like you were born with it.' },
      { name: 'Cherry', body: 'Proper red, with wine underneath it. Spectacular, and the one that needs the most touch-ups.' },
      { name: 'Bright orange', body: 'The boldest of the lot. It needs a light base and a real commitment to the upkeep.' },
      { name: 'Dark red', body: 'A brown base with a coppery glow. For anyone who wants the shine without the leap.' },
    ],
  },

  produtos: {
    title: 'What I use',
    kicker: 'Product',
    lead: 'Professional colour, chosen shade by shade. The colour chart lives in the salon — and the mix is made for your hair, not for the average one.',
  },

  faq: {
    title: 'The questions I always get',
    kicker: 'Questions',
    items: [
      {
        q: 'I have never been a redhead. Can I go from brown — or black — to red?',
        a: 'Almost always, but the route depends on what is already in your hair. Virgin hair gets there faster; hair with old dark dye may need two sessions. Send me a photo and I will tell you straight away which one you are.',
      },
      {
        q: 'How often do I need to come back?',
        a: 'Red is the pigment that fades fastest — as a rule, a toner every 4 to 8 weeks, depending on the shade and on your shampoo. The brighter shades need it more often.',
      },
      {
        q: 'I had it coloured somewhere else and it went orange/patchy. Can you fix it?',
        a: 'That is half of what I do. Correcting takes longer than colouring from scratch, so I need to see the hair first — but in most cases it can be brought back.',
      },
      {
        q: 'How much does it cost?',
        a: 'It depends on the length, the history of the hair and the work involved. I tell you the price by message, before you book — there is never a surprise at the end.',
      },
      {
        q: 'How long does it take?',
        a: 'A maintenance appointment is done in a few hours. A big transformation or a correction can take the whole afternoon. I set the time aside to match your case.',
      },
      {
        q: 'Do I need an appointment?',
        a: 'Yes. I work by appointment so I can give each head of hair the time it deserves. Write to me on WhatsApp.',
      },
    ],
  },

  contacto: {
    title: 'Let us talk about your hair',
    kicker: 'Contact',
    lead: 'Send me a photo of your hair as it is today. I will reply with what can be done.',
    telefoneLabel: 'Phone',
    whatsappLabel: 'WhatsApp',
    localLabel: 'Where',
    /** Until the address comes from Erica, this is what shows. */
    localPendente: 'The salon address goes here.',
    horarioLabel: 'Hours',
    horarioPendente: 'By appointment.',
    instagramLabel: 'Instagram',
  },

  footer: {
    tagline: 'Redhead specialist.',
    direitos: 'All rights reserved.',
    feitoPor: 'Photographs of real work, shared with the clients’ permission.',
    idiomaLabel: 'Language',
    voltarTopo: 'Back to top',
  },

  idiomas: {
    'pt-PT': 'Português (PT)',
    'pt-BR': 'Português (BR)',
    en: 'English',
  } as Record<string, string>,

  /** Alt text for each photo. Key = slug in `photos.data.ts`. */
  photoAlt: {
    'erica-retrato-estudio':
      'Erica Gonçalves, redhead specialist, with a curly copper bob and an all-black outfit, in a studio portrait',
    'erica-sorriso-salao': 'Close-up of Erica, her curly bob in an intense orange red, in the salon',
    'erica-raposa-croche':
      'Erica in the salon, red hair in full curls, holding a crocheted fox and chameleon',
    'ruivo-acaju-camadas-longas':
      'Auburn red hair in long layers with flicked ends, mirror shine in natural light',
    'caracois-ruivos-cobre-volume':
      'Defined coppery red curls, full volume and even colour from root to tip',
    'ruivo-acaju-ondas-medias': 'Shoulder-length auburn waves, loose movement and a warm shine',
    'ruivo-laranja-vivo-ondas-longas': 'Bright orange red in long, voluminous waves, with a wide smile in the salon',
    'ruivo-cobre-ondas-volumosas': 'Copper red in full, glossy waves, styled with plenty of root lift',
    'ruivo-gengibre-franja-cortina': 'Long ginger red with a curtain fringe and flicked ends, in a salon full of light',
    'ruivo-gengibre-ondas-compridas': 'Ginger red in long layered waves, shining brightly under the salon lights',
    'ruivo-cereja-vinho-ondas': 'Cherry red in a wine tone, wide satiny waves framing the face',
    'ruivo-acaju-liso-camadas': 'Long, straight auburn red with layers in movement, mirror shine',
    'caracois-acaju-compridos': 'Very long, well-defined auburn curls, warm colour from root to tip',
    'ruivo-cereja-medio-camadas': 'Vibrant cherry red in a mid-length layered cut with redder ends',
    'ruivo-escuro-liso-comprido': 'Dark brownish red, long and straight, with a satin shine',
    'ruivo-cobre-dourado-ondas': 'Golden copper red in wide waves, with strawberry-leaning highlights',
    'erica-com-cliente-ruivo-comprido':
      'Erica beside a client with long, blow-dried copper red hair, both of them redheads in the salon',
    'coloracao-fantasia-laranja-fogo':
      'Fantasy colour in a fire gradient, from magenta at the root to orange and yellow at the ends, held in Erica’s hands',
    'caracois-acaju-medios': 'Mid-length auburn curls, well defined and shining',
    'ruivo-gengibre-comprido-ondulado': 'Long ginger red with soft waves at the ends and a centre parting',
    'ruivo-acaju-escuro-medio': 'Dark auburn red in a mid-length wavy cut, with coppery highlights',
    'ruivo-cobre-caramelo-liso': 'Caramel copper red, long and straight, seen in profile in the salon',
    'kc-color-cachorro-caramelo-frasco':
      'A bottle of professional colour in a golden copper shade, on the salon counter',
    'kc-color-gama-tons-ruivos': 'Three professional colours side by side, with the chart of red shades',
    'erica-com-coloracao-kc-color': 'Erica in gloves holding up two bottles of copper-toned colour, smiling',
  } as Record<string, string>,

  a11y: {
    skip: 'Skip to content',
    logo: 'Erica Gonçalves — redhead specialist',
    galeriaRegiao: 'Gallery of work',
    fecharFoto: 'Close photo',
    fotoAnterior: 'Previous photo',
    fotoSeguinte: 'Next photo',
    abrirPergunta: 'Open answer',
    marcaDecorativa: '',
  },
}
