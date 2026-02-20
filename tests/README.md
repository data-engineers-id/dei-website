# Integration Tests for DEI Website

This directory contains integration tests for the Data Engineering Indonesia website.

## Test Structure

```
tests/
├── integration/          # Integration tests
│   ├── events.spec.ts    # Event CRUD operations
│   └── medium-rss.spec.ts # Medium RSS feed integration
├── fixtures/            # Test data
│   └── data.ts          # Mock events, articles, team members
├── utils/               # Test utilities
│   └── helpers.ts       # Mock functions, factories
├── setup.ts            # Global test setup
└── README.md           # This file
```

## Running Tests

```bash
# Run all tests
bun test

# Run specific test file
bun test tests/integration/events.spec.ts

# Run tests with watch mode (dev)
bun test --watch

# Run tests with coverage
bun test --coverage
```

## Test Categories

### 1. Event Integration Tests (`events.spec.ts`)

Tests Supabase database operations for events:

- **CRUD Operations**: Create, Read, Update, Delete events
- **Filtering**: Filter by category, location type, status
- **Sorting**: Sort by date, category
- **Registration Flow**: Registration count updates, capacity checks

### 2. Medium RSS Integration Tests (`medium-rss.spec.ts`)

Tests Medium RSS feed fetching and parsing:

- **RSS Fetching**: Successful fetch, error handling, timeouts
- **Data Parsing**: Parse titles, authors, dates, categories
- **Content Processing**: Extract excerpts, images, format dates
- **Edge Cases**: Empty feeds, malformed RSS, special characters

## Writing New Tests

### Basic Test Structure

```typescript
import { describe, it, expect } from 'bun:test';

describe('Feature Name', () => {
  it('should do something specific', () => {
    // Arrange
    const input = 'test';

    // Act
    const result = yourFunction(input);

    // Assert
    expect(result).toBe('expected output');
  });
});
```

### Using Fixtures

```typescript
import { mockEvents } from '../fixtures/data';

it('should use mock data', () => {
  const event = mockEvents[0];
  expect(event.title).toBeDefined();
});
```

### Using Helpers

```typescript
import { createMockEvent } from '../utils/helpers';

it('should create custom mock event', () => {
  const event = createMockEvent({
    title: 'Custom Title',
    status: 'upcoming',
  });
  expect(event.title).toBe('Custom Title');
});
```

## Test Best Practices

### 1. Test Isolation

Each test should be independent:

```typescript
import { beforeEach, afterEach } from 'bun:test';

let testData;

beforeEach(() => {
  testData = createMockEvent();
});

afterEach(() => {
  // Cleanup
  testData = null;
});
```

### 2. Descriptive Test Names

Use clear, descriptive names:

```typescript
// ✅ Good
it('should return upcoming events sorted by start date', () => {
  // test code
});

// ❌ Bad
it('test events', () => {
  // test code
});
```

### 3. AAA Pattern

Arrange, Act, Assert:

```typescript
it('should validate email format', () => {
  // Arrange
  const invalidEmail = 'not-an-email';

  // Act
  const isValid = validateEmail(invalidEmail);

  // Assert
  expect(isValid).toBe(false);
});
```

### 4. Mock External Services

Always mock external APIs:

```typescript
// Mock Supabase
const mockSupabase = {
  from: () => ({
    select: () => ({ data: [], error: null }),
  }),
};

// Mock fetch for RSS
const mockFetch = () =>
  Promise.resolve({
    text: () => Promise.resolve('<rss>...</rss>'),
  });
```

## Future Test Additions

As the project grows, add tests for:

- [ ] **API Routes**: Test Astro API endpoints
- [ ] **Authentication**: Login, logout, session management
- [ ] **Image Upload**: Supabase Storage integration
- [ ] **Email Notifications**: Resend API integration
- [ ] **Search Functionality**: Event/article search
- [ ] **Analytics**: Page view tracking

## Troubleshooting

### Common Issues

**Issue: Tests fail with "Cannot find module"**

```bash
# Solution: Check imports use correct relative paths
import { helper } from '../utils/helpers'; // ✅
import { helper } from './utils/helpers';  // ❌
```

**Issue: Async tests timeout**

```typescript
// Solution: Increase timeout
it('should complete long operation', async () => {
  // test code
}, 10000); // 10 second timeout
```

**Issue: Tests pass individually but fail together**

```typescript
// Solution: Ensure proper cleanup
afterEach(() => {
  // Reset mocks
  // Clear database
  // Reset state
});
```

## CI/CD Integration

When setting up CI/CD, add test step:

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bun test
```

## Resources

- [Bun Test Documentation](https://bun.sh/docs/cli/test)
- [Testing Library](https://testing-library.com/)
- [Supabase Testing](https://supabase.com/docs/guides/testing)

---

**Questions?** Check the main [AGENTS.md](../AGENTS.md) for project setup details.
