import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Dossier où se trouvent tes tests
  testDir: './tests',

  // Timeout max par test
  timeout: 30_000,

  // Rapporteurs (console + JUnit pour la CI)
  reporter: [
    ['list'],
    ['junit', { outputFile: 'test-results/junit-e2e.xml' }],
	['html', { outputFolder: 'playwright-report', open: 'never' }],

  ],

  // Options communes à tous les tests
  use: {
    baseURL: process.env['BASE_URL'] || 'http://localhost:4200',
    headless: true,
    trace: 'on-first-retry',   // génère un "trace.zip" si un test échoue
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },

  // Définition des navigateurs à utiliser
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Tu peux en ajouter si tu veux : firefox, webkit
  ],
});
