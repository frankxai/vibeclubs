import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './apps/web/tests/e2e',
  timeout: 30_000,
  retries: process.env.CI ? 2 : 0,
  fullyParallel: true,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'pnpm dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [{ name: 'chromium', use: devices['Desktop Chrome'] }],
})
