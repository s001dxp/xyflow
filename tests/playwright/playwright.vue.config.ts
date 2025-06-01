import { defineConfig } from '@playwright/test';
import { sharedConfig } from './playwright.shared.config';

// Run tests for Vue examples
export default defineConfig({
  ...sharedConfig,
  testDir: './e2e',
  testMatch: '**/*.vue.spec.ts',
  webServer: {
    command: 'cd ../examples/vue && pnpm dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
