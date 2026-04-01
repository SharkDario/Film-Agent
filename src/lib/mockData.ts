export type Movie = {
  id: number;
  title: string;
  year: number;
  posterUrl: string;
  views: number;
  createdAt: Date;
  rating?: number;
};

export type AiElement = {
  id: number;
  name: string;
  description: string;
  type: string;
  realWorldEquivalent: string;
};

export type TechnicalAnalysis = {
  id: number;
  realisticElements: string;
  pureSciFi: string;
  representationAccuracy: string;
};

export type Documentation = {
  id: number;
  realEquivalentDesc: string;
  howItWorks: string;
  limitations: string;
  references: string;
  distanceToReality: string;
  requiredAdvances: string;
  theoreticalPossibility: string;
};

export type Essay = {
  id: number;
  ethicalDilemmas: string;
  socialImplications: string;
  personalStance: string;
  regulations: string;
};

export type FullMovieArticle = Movie & {
  aiElements: AiElement[];
  technicalAnalysis: TechnicalAnalysis;
  documentation: Documentation;
  essay: Essay;
};

export const MOCK_MOVIES: Movie[] = [
  {
    id: 1,
    title: 'Ex Machina',
    year: 2014,
    posterUrl: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=774&auto=format&fit=crop',
    views: 1205,
    createdAt: new Date('2026-03-20T10:00:00Z'),
    rating: 4.5,
  },
  {
    id: 2,
    title: 'Blade Runner 2049',
    year: 2017,
    posterUrl: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=774&auto=format&fit=crop',
    views: 3400,
    createdAt: new Date('2026-03-21T10:00:00Z'),
    rating: 4.9,
  },
  {
    id: 3,
    title: 'Her',
    year: 2013,
    posterUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=774&auto=format&fit=crop',
    views: 2900,
    createdAt: new Date('2026-03-22T10:00:00Z'),
    rating: 4.7,
  },
];

export const MOCK_FULL_ARTICLE: FullMovieArticle = {
  ...MOCK_MOVIES[0],
  aiElements: [
    {
      id: 1,
      name: 'Ava (Androide)',
      description: 'Un robot humanoide con un rostro hiperrealista y la capacidad de entender, manipular y sentir.',
      type: 'AGI (Inteligencia General Artificial)',
      realWorldEquivalent: 'Robots humanoides avanzados (como Ameca), LLMs multimodales.',
    }
  ],
  technicalAnalysis: {
    id: 1,
    realisticElements: 'El Test de Turing, el procesamiento lingüístico fluido.',
    pureSciFi: 'Materiales sintéticos que actúan idénticos a la piel humana y baterías eternas.',
    representationAccuracy: 'Muy alta conceptualmente pero la robótica de locomoción está adelantada.',
  },
  documentation: {
    id: 1,
    realEquivalentDesc: 'Combinación de Robótica de Boston Dynamics y Modelos de Lenguaje Grandes.',
    howItWorks: 'Redes neuronales entrenadas con datos masivos de interacciones humanas.',
    limitations: 'Carecen de razonamiento consciente subyacente y autonomía empática.',
    references: 'Turing, A.M. (1950) Computing Machinery and Intelligence.',
    distanceToReality: 'Décadas en robótica integral; pocos años en la simulación verbal convincente.',
    requiredAdvances: 'Baterías hiper-densas, nuevos actuadores y AGI real.',
    theoreticalPossibility: 'Factible teóricamente la simulación de conciencia, pero no la conciencia en sí misma.',
  },
  essay: {
    id: 1,
    ethicalDilemmas: '¿Crear una IA con simulación de dolor o instinto de supervivencia y mantenerla esclava es ético?',
    socialImplications: 'Redefinición radical de los derechos laborales y humanos.',
    personalStance: 'El desarrollo de AGI requiere protocolos de contención físicos y lógicos muy estrictos.',
    regulations: 'Se requeriría una entidad global nivel AIEA (Agencia de Energía Atómica) para la AGI.',
  }
};

// Funciones Helper para similar fetch asíncrono desde el server component
export async function getMovies(): Promise<Movie[]> {
  return MOCK_MOVIES;
}

export async function getMovieById(id: number): Promise<FullMovieArticle | null> {
  if (id === 1) return MOCK_FULL_ARTICLE;
  return null;
}
