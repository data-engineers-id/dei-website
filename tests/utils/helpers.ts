// Test Utilities and Helpers
// Place shared test utilities here

// Mock Supabase Client
export function createMockSupabaseClient() {
  return {
    from: (_table: string) => ({
      select: () => ({
        data: [],
        error: null,
      }),
      insert: () => ({
        data: null,
        error: null,
      }),
      update: () => ({
        data: null,
        error: null,
      }),
      delete: () => ({
        data: null,
        error: null,
      }),
    }),
  };
}

// Test Database Setup
export async function setupTestDatabase() {
  // Setup code for test database
  // This would connect to your test Supabase instance
}

export async function teardownTestDatabase() {
  // Cleanup code
  // Remove test data after each test
}

// Test Data Factories
export function createMockEvent(overrides = {}) {
  return {
    id: crypto.randomUUID(),
    title: 'Test Event',
    slug: 'test-event',
    description: 'Test description',
    excerpt: 'Test excerpt',
    startDate: new Date(),
    timezone: 'Asia/Jakarta',
    locationType: 'virtual',
    category: 'Workshop',
    status: 'upcoming',
    isFeatured: false,
    ...overrides,
  };
}
