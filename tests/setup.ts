// Test Setup File
// This file runs before all tests
// https://bun.sh/docs/runtime/bunfig#test-preload

import { beforeAll, afterAll } from 'bun:test';

// Global test configuration
console.log('🧪 Setting up test environment...');

// Set test environment
process.env.NODE_ENV = 'test';

// Mock console methods during tests to reduce noise
// Uncomment if you want quieter tests
// const originalLog = console.log;
// const originalError = console.error;
// console.log = () => {};
// console.error = () => {};

// Global setup before all tests
beforeAll(() => {
  // Setup test database connection (when Supabase is configured)
  // Initialize test data
  // Set up mocks
});

// Global cleanup after all tests
afterAll(() => {
  // Clean up test database
  // Remove test data
  // Restore console methods
  // console.log = originalLog;
  // console.error = originalError;

  console.log('✅ Test environment cleaned up');
});

// Global test utilities
export function setup() {
  // Return global test utilities
  return {
    // Add global helpers here
  };
}
