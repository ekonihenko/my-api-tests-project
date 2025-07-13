import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  retries: 0,
  workers: 4,
  reporter: [['html', { open: 'never' }], ['list'], ['json', { outputFile: 'test-results.json' }]],
  use: {
    baseURL: 'https://apichallenges.herokuapp.com',
    extraHTTPHeaders: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'api-tests',
      testMatch: /.*\.spec\.js$/,
    },
  ],
});
