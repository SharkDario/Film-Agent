import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import * as schema from './schema';
import { config } from 'dotenv';

config({ path: '.env.local' });

const db = drizzle(sql, { schema });

async function main() {
  console.log('Seeding dummy data...');

  // 1. Crear el artículo de prueba
  const [newArticle] = await db.insert(schema.articles).values({
    title: 'Ex Machina',
    year: 2014,
    posterUrl: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=774&auto=format&fit=crop', // A placeholder poster image related to robots/AI
    views: 1205,
  }).returning();

  const articleId = newArticle.id;
  console.log(`Created article: ${newArticle.title} with ID ${articleId}`);

  // 2. Elementos de IA
  await db.insert(schema.aiElements).values([
    {
      articleId,
      name: 'Ava (Androide)',
      description: 'Un robot humanoide con un rostro hiperrealista y la capacidad de entender, manipular y sentir.',
      type: 'AGI (Inteligencia General Artificial)',
      realWorldEquivalent: 'Robots humanoides avanzados (como Ameca), LLMs multimodales.',
    }
  ]);

  // 3. Análisis Técnico
  await db.insert(schema.technicalAnalysis).values({
    articleId,
    realisticElements: 'El Test de Turing, el procesamiento del lenguaje natural fluido.',
    pureSciFi: 'Materiales sintéticos que actúan idénticos a la piel y músculos humanos instantáneos y autónomos.',
    representationAccuracy: 'Muy alta conceptualmente pero salta varios escalones en la robótica de locomoción y baterías.',
  });

  // 4. Documentación
  await db.insert(schema.documentation).values({
    articleId,
    realEquivalentDesc: 'ChatGPT y Boston Dynamics combinados.',
    howItWorks: 'Uso inmenso de redes neuronales entrenadas con datos de búsqueda (como el ficticio Bluebook).',
    limitations: 'Generación de razonamiento consciente subyacente.',
    references: 'Turing, A.M. (1950) Computing Machinery and Intelligence.',
    distanceToReality: 'Décadas en robótica integral; pocos años en la simulación verbal convincente.',
    requiredAdvances: 'Baterías hiper-densas, nuevos materiales actuadores, AGI real.',
    theoreticalPossibility: 'Muchos expertos creen que una AGI es teóricamente posible, pero la conciencia es un misterio.',
  });

  // 5. Ensayos
  await db.insert(schema.essays).values({
    articleId,
    ethicalDilemmas: '¿Crear una IA consciente y mantenerla esclava o encerrada es ético?',
    socialImplications: 'Redefinición de los derechos, peligro por engaño de la IA al humano.',
    personalStance: 'El desarrollo debería tener marcos estrictos en pruebas de confinamiento.',
    regulations: 'Se requerirían agencias globales de auditoría de IA de nivel AGI.',
  });

  // 6. Ratings y comentarios (Simulando 2 usuarios)
  await db.insert(schema.ratings).values([
    { articleId, userId: 'user_1', score: 5 },
    { articleId, userId: 'user_2', score: 4 }
  ]);

  await db.insert(schema.comments).values([
    { articleId, userId: 'user_1', content: 'Fascinante enfoque del Test de Turing.' },
    { articleId, userId: 'user_2', content: 'El final me dejó pensando semanas.' }
  ]);

  // 7. Visitas
  await db.insert(schema.articleVisits).values([
    { articleId, visitDate: '2026-03-25', count: 15 },
    { articleId, visitDate: '2026-03-26', count: 34 },
    { articleId, visitDate: '2026-03-27', count: 21 },
    { articleId, visitDate: '2026-03-28', count: 55 },
    { articleId, visitDate: '2026-03-29', count: 42 },
  ]);

  console.log('Dummy data seeding completed!');
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
