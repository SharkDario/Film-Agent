# 🎬 Film Agent — Blog de IA en el Cine

**Film Agent** es una plataforma web de análisis cinematográfico centrada en la **Inteligencia Artificial en películas**. Cada artículo profundiza en cómo una película representa la IA, comparando la ficción con la ciencia real, documentando papers académicos y explorando los dilemas éticos que plantea.

> Trabajo Práctico N°1 para la cátedra de **Sistemas Inteligentes** — Profesora Benítez Micaela.  
> Autores: **Acosta Marianela, Cano Brenda, Coronel Azul, Coronel Miguel Darío**.  
> Fecha de presentación: 7 de abril de 2026.

---

## 🎯 Objetivos

- Analizar la representación de la IA en películas de ciencia ficción, contrastando ficción con realismo científico.
- Documentar las tecnologías reales equivalentes, limitaciones actuales y avances requeridos.
- Explorar los dilemas éticos, implicaciones sociales y legislación propuesta alrededor de la IA.
- Permitir la interacción de los usuarios (calificaciones, comentarios y "me gusta").
- Registrar analíticas de visitas con línea de tiempo y tabla comparativa entre artículos.

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, Server Components, Server Actions) |
| **Lenguaje** | TypeScript |
| **Estilos** | Tailwind CSS (Dark Mode forzado estilo "Netflix") |
| **Base de Datos** | [Neon](https://neon.tech/) (PostgreSQL Serverless) |
| **ORM** | [Drizzle ORM](https://orm.drizzle.team/) |
| **Autenticación** | [Clerk](https://clerk.com/) (OAuth con Google, localizado en español) |
| **Gráficos** | [Recharts](https://recharts.org/) |
| **Iconos** | [Lucide React](https://lucide.dev/) |

---

## 🏗️ Arquitectura y Funcionalidades

### Roles de Usuario

- **Administrador**: Puede crear y editar artículos completos (datos básicos, catálogo de IA, análisis técnico, documentación científica, ensayos éticos). Los correos autorizados se configuran en la variable de entorno `ADMIN_EMAILS`.
- **Usuario Normal**: Puede leer artículos, calificar con estrellas (1-5), escribir comentarios y dar "me gusta" a los comentarios de otros.

### Secciones de cada Artículo

1. **Datos Básicos** — Título, año, portada y tráiler de YouTube (con Picture-in-Picture flotante).
2. **Catálogo de IA** — Listado de inteligencias artificiales presentes en la película, con descripción y equivalente real.
3. **Análisis Técnico** — Qué es realista, qué es ciencia ficción pura y un veredicto de representación.
4. **Documentación Científica** — Cómo funciona la IA equivalente hoy, limitaciones, distancia a la realidad, avances requeridos y bibliografía APA.
5. **Ensayos y Ética** — Dilemas éticos, implicaciones sociales, postura profesional y legislación sugerida.
6. **Zona Interactiva** — Calificación con estrellas, comentarios con foto de perfil y "me gusta", analíticas de visitas y tabla comparativa.

---

## 🚀 Cómo Ejecutar el Proyecto

### Prerrequisitos

- [Node.js](https://nodejs.org/) v18 o superior
- Una cuenta en [Neon](https://neon.tech/) (base de datos PostgreSQL)
- Una cuenta en [Clerk](https://clerk.com/) (autenticación)

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd tp1
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Variables de entorno

Crear un archivo **`.env.local`** en la raíz del proyecto con las siguientes variables:

```env
# Base de Datos (Neon)
DATABASE_URL=postgresql://usuario:contraseña@host.neon.tech/neondb?sslmode=require

# Autenticación (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Correos de Administradores (separados por coma)
ADMIN_EMAILS=correo1@gmail.com,correo2@gmail.com
```

### 4. Sincronizar la base de datos

```bash
npm run db:push
```

### 5. (Opcional) Cargar datos iniciales

```bash
npm run db:seed
```

### 6. Iniciar el servidor de desarrollo

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

---

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── page.tsx              # Página de inicio (grid de películas)
│   ├── about/page.tsx        # Sobre el Blog
│   ├── movie/[id]/page.tsx   # Vista del artículo (lectura + interacción)
│   ├── admin/
│   │   ├── layout.tsx        # Protección de rutas (403 si no es admin)
│   │   └── movies/
│   │       ├── new/page.tsx  # Formulario de creación
│   │       └── [id]/edit/    # Panel de edición por secciones
│   └── actions.ts            # Server Actions (CRUD + interactividad)
├── components/               # Componentes reutilizables (UI)
├── db/
│   ├── schema.ts             # Esquema Drizzle (tablas PostgreSQL)
│   └── index.ts              # Conexión a Neon
├── lib/
│   ├── data.ts               # Capa de acceso a datos
│   └── auth.ts               # Verificación de roles (admin por email)
└── middleware.ts              # Middleware de Clerk
```

---

## 📜 Scripts Disponibles

| Comando | Descripción |
|---------|------------|
| `npm run dev` | Inicia el servidor de desarrollo en `localhost:3000` |
| `npm run build` | Genera el bundle de producción |
| `npm run db:push` | Sincroniza el esquema de Drizzle con Neon (sin migraciones) |
| `npm run db:seed` | Inserta datos de ejemplo en la base de datos |

---

## 📄 Licencia

Proyecto académico desarrollado para la cátedra de Sistemas Inteligentes — Universidad de la Cuenca del Plata, 2026.
