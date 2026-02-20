# AGENTS.md

## Data Engineering Indonesia Website

Comprehensive guidelines for AI agents operating in this repository.

---

## Quick Start Commands

```bash
# Install dependencies
bun install

# Development server
bun run dev          # http://localhost:4321

# Build and test
bun run build        # Must pass with 0 errors
bun run preview      # Verify production build

# Testing
bun test                              # Run all tests
bun test tests/integration/events.spec.ts  # Run single test file
bun test --watch                     # Watch mode
bun test --coverage                  # With coverage

# Linting
bun run lint                         # Check code style
bun run lint --fix                   # Auto-fix issues

# Formatting
bun run format                       # Auto-format code
bun run format:check                 # Check formatting
```

---

## Verification Commands

**Always run this chain after ANY code change:**

```bash
bun audit --ignore=GHSA-2g4f-4pwh-qvx6 && bun run lint && bun run build
```

This verifies:
1. Security audit passes (ignoring known non-exploitable ajv CVE)
2. Lint passes (0 errors, warnings acceptable)
3. Build completes successfully

---

## Pre-Commit Checklist

Run in order:
1. Security audit: `bun audit --ignore=GHSA-2g4f-4pwh-qvx6`
2. Lint: `bun run lint`
3. Build: `bun run build`
4. Tests: `bun test`
5. Review changes: `git diff`
6. Commit with Conventional Commits format

---

## Code Style Guidelines

### ESLint Configuration
- Uses ESLint 9 flat config
- TypeScript parser enabled with strict mode
- Rules enforced:
  - `@typescript-eslint/no-unused-vars` (error)
  - `@typescript-eslint/no-explicit-any` (warn)
  - `no-console` (warn, only `error` and `warn` allowed)

### Prettier Settings
```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "bracketSpacing": true,
  "arrowParens": "avoid"
}
```

### TypeScript
- Strict mode enabled via `astro/tsconfigs/strict`
- **NEVER use `any` type** - ESLint will warn
- Always define proper types for function parameters and return values

### Import Conventions
```typescript
// Relative imports for same-package modules
import { getEvents } from '../lib/supabase';
import type { Event } from '../types';

// Absolute imports for external packages
import { createClient } from '@supabase/supabase-js';
```

### Naming Conventions
| Type | Convention | Example |
|------|------------|---------|
| Interfaces | PascalCase | `Event`, `TeamMember` |
| Types | PascalCase | `SiteConfig` |
| Variables/Functions | camelCase | `getEvents`, `siteConfig` |
| Components (Astro/React) | PascalCase | `Header.astro`, `LegoBatikSea.astro` |
| Files | kebab-case | `supabase.ts`, `medium-rss.spec.ts` |
| CSS Classes | kebab-case | `btn-primary`, `text-white` |

---

## Styling Rules

### Brand Colors
| Element | Value |
|---------|-------|
| Primary Dark | `#1e3a5f` |
| Accent | `#2a4a73` |
| Light | `#152a45` |

### Golden Rule
- **Dark backgrounds (`#1e3a5f`) MUST have white text (`text-white`)**
- Use `text-gray-600` for body text on light backgrounds

### Common Tailwind Classes
```html
<!-- Dark section -->
<section class="bg-[#1e3a5f] text-white">

<!-- Card -->
<article class="card p-6">

<!-- Button primary -->
<a class="btn-primary px-4 py-2">

<!-- Grid -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
```

---

## Error Handling

### Pattern: Graceful Fallbacks
```typescript
// Always return something meaningful - never throw
export async function getEvents(): Promise<Event[]> {
  if (!isSupabaseConfigured) {
    console.log('Supabase not configured, returning sample events');
    return sampleEvents;  // Return fallback data
  }

  try {
    const { data, error } = await supabase.from('events').select('*');
    if (error) {
      console.error('Error fetching events:', error);
      return sampleEvents;  // Fallback on error
    }
    return data || sampleEvents;
  } catch (error) {
    console.error('Error in getEvents:', error);
    return sampleEvents;  // Catch-all fallback
  }
}
```

### Console Usage
- **ALLOWED:** `console.error()`, `console.warn()`
- **DISALLOWED:** `console.log()`, `console.info()` (will trigger lint warning)

---

## Project Structure

```
dei-website/
├── src/
│   ├── components/      # Reusable UI components (.astro)
│   ├── layouts/         # Page layouts (Layout.astro, BaseLayout.astro)
│   ├── lib/            # Utilities and clients
│   │   ├── supabase.ts # Supabase client with sample data fallback
│   │   └── medium.ts   # Medium RSS parser
│   ├── pages/          # File-based routing (Astro)
│   │   ├── index.astro # Homepage
│   │   ├── about.astro
│   │   ├── contact.astro
│   │   ├── events/
│   │   └── articles/
│   ├── styles/         # Global CSS
│   └── types/          # TypeScript interfaces
├── tests/              # Bun test files
│   ├── integration/
│   ├── utils/
│   └── fixtures/
├── public/             # Static assets
└── dist/               # Build output (auto-generated)
```

---

## Key Rules

### NEVER Do
- ❌ Use `npm` - use `bun` exclusively
- ❌ Use `any` type in TypeScript
- ❌ Commit `.env` files or secrets
- ❌ Push without running verification chain
- ❌ Use `console.log()` - use `console.error()` or `console.warn()`

### ALWAYS Do
- ✅ Use `bun` commands only
- ✅ Run verification chain before commit
- ✅ Define proper TypeScript types
- ✅ Use white text on `#1e3a5f` backgrounds
- ✅ Return fallbacks instead of throwing errors
- ✅ Document lessons in LESSONS.md and PLANS.md when fixing issues

---

## Issue Resolution Protocol

When fixing a bug or issue:

1. **Analyze and fix the root cause**
2. **Document the lesson:**
   - Add brief lesson to `PLANS.md` (Lessons Learned section)
   - Add detailed entry to `LESSONS.md` with: Issue, Root Cause, Solution, Lesson Learned, Prevention
3. **Verify the fix works:**
   ```bash
   bun audit --ignore=GHSA-2g4f-4pwh-qvx6 && bun run lint && bun run build
   ```
4. **Test** the specific fix works (run relevant tests)

---

## Testing Guidelines

### Test File Naming
- Unit tests: `*.test.ts`
- Integration tests: `*.spec.ts`
- Location: `tests/` directory

### Test Structure
```typescript
import { describe, it, expect, beforeEach } from 'bun:test';

describe('Feature Name', () => {
  beforeEach(() => {
    // Setup
  });

  it('should do something specific', () => {
    // Arrange
    const input = 'test';

    // Act
    const result = someFunction(input);

    // Assert
    expect(result).toBe('expected');
  });
});
```

---

## Environment Variables

```bash
# .env.local (gitignored)
PUBLIC_SUPABASE_URL=https://your-project.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**NEVER commit these files.**

---

## Tech Stack

- **Framework:** Astro 5.x
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS 4.x
- **Runtime:** Bun
- **Testing:** Bun test
- **Linting:** ESLint 9
- **Formatting:** Prettier

---

**Last Updated:** February 2026
**Version:** 2.0
