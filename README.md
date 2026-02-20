# Data Engineering Indonesia Website

Community website for Data Engineering Indonesia (DEI) - showcasing events, articles, and connecting data professionals in Indonesia.

## Tech Stack

| Tool         | Version    | Purpose                   |
| ------------ | ---------- | ------------------------- |
| Astro        | 5.17.1     | Static Site Generation    |
| TypeScript   | Latest     | Type safety               |
| Tailwind CSS | 4.1.18     | Styling                   |
| Bun          | 1.3+       | Runtime & Package Manager |
| Supabase     | PostgreSQL | Database (pending)        |

## Prerequisites

- [Bun](https://bun.sh/) 1.3+ installed
- Node.js not required (Bun includes its own runtime)

## Quick Start

```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Build for production
bun run build

# Preview production build
bun run preview
```

## Commands

All commands use Bun (not npm):

| Command               | Action                             |
| --------------------- | ---------------------------------- |
| `bun install`         | Install dependencies               |
| `bun run dev`         | Start dev server at localhost:4321 |
| `bun run build`       | Build production site to ./dist/   |
| `bun run preview`     | Preview build locally              |
| `bun test`            | Run tests                          |
| `bun test --watch`    | Run tests in watch mode            |
| `bun test --coverage` | Run tests with coverage            |
| `bun run lint`        | Run ESLint                         |
| `bun run format`      | Format code with Prettier          |

## Project Structure

```
dei-website/
├── src/
│   ├── components/       # UI components (Header, Footer, etc.)
│   ├── layouts/         # Page layouts
│   ├── lib/             # Utilities (medium.ts, supabase.ts)
│   ├── pages/           # Routes (index, about, contact, events, articles)
│   ├── styles/          # Global CSS
│   └── types/           # TypeScript definitions
├── public/              # Static assets
├── tests/              # Test files
└── dist/               # Build output (generated)
```

## Pages

- `/` - Homepage with hero, events, articles
- `/about` - About DEI, mission, team
- `/events` - Upcoming events listing
- `/articles` - Medium RSS articles
- `/contact` - Contact information

## Development Guidelines

- Always use Bun (never npm)
- Run `bun run build` before committing
- Follow Conventional Commits: `feat:`, `fix:`, `docs:`, etc.
- Ensure white text on dark blue (#1e3a5f) backgrounds
