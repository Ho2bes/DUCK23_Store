import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Dossier où se trouvent tes tests
  testDir: './tests',

  // Timeout max par test (30s est bien)
  timeout: 30_000,

  // Rapporteurs (console + JUnit pour la CI + HTML pour le debug)
  reporter: [
    ['list'],
    ['junit', { outputFile: 'test-results/junit-e2e.xml' }],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],

  // --- C'EST ICI LA CORRECTION MAGIQUE 🧙‍♂️ ---
  // Cela dit à Playwright : "Lance le serveur si tu ne le trouves pas"
  webServer: {
    command: 'npm start',             // Lance 'ng serve' via npm
    url: 'http://localhost:4200',     // Attend que cette URL réponde "OK"
    reuseExistingServer: !process.env.CI, // En local, utilise ton serveur déjà lancé. En CI, lance-le.
    timeout: 120 * 1000,              // 2 minutes pour démarrer (Angular est parfois lent à compiler)
    ignoreHTTPSErrors: true,
  },
  // -------------------------------------------

  // Options communes à tous les tests
  use: {
    // Si la CI définit une URL, on la prend, sinon localhost
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
    // Tu peux décommenter Firefox si tu veux tester la compatibilité
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
  ],
});
