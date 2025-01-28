module.exports = function (config) {
  const isCI = process.env.CI === 'true'; // Détection d'un environnement CI

  config.set({
    // Liste des navigateurs à utiliser
    browsers: isCI ? ['ChromeHeadlessCI'] : ['ChromeHeadless'],

    // Définir les configurations personnalisées pour les navigateurs
    customLaunchers: {
      ChromeHeadless: {
        base: 'Chrome',
        flags: [
          '--headless',
          '--disable-gpu',
          '--disable-software-rasterizer',
          '--disable-dev-shm-usage',
          '--no-sandbox',
          '--disable-extensions',
          '--disable-setuid-sandbox',
          '--remote-debugging-port=9222',
        ],
      },
      ChromeHeadlessCI: {
        base: 'Chrome',
        flags: [
          '--headless',
          '--disable-gpu',
          '--disable-software-rasterizer',
          '--disable-dev-shm-usage',
          '--no-sandbox',
          '--disable-extensions',
          '--disable-setuid-sandbox',
          '--remote-debugging-port=9222',
        ],
      },
    },

    // Exécute les tests une seule fois (utile pour CI)
    singleRun: true,

    // Limiter les exécutions simultanées pour éviter les surcharges
    concurrency: 1,

    // Framework de test utilisé
    frameworks: ['jasmine'],

    // Fichiers à inclure pour les tests
    files: [
      { pattern: 'src/**/*.spec.ts', watched: false },
    ],

    // Préprocesseurs pour les fichiers
    preprocessors: {
      'src/**/*.spec.ts': ['webpack'],
    },

    // Configuration des reporters
    reporters: ['progress'],

    // Configuration Webpack
    webpack: {
      mode: 'development',
      resolve: {
        extensions: ['.js', '.ts'],
      },
      module: {
        rules: [
          {
            test: /\.ts$/,
            use: 'ts-loader',
            exclude: /node_modules/,
          },
        ],
      },
    },

    // Configurations supplémentaires
    webpackMiddleware: {
      stats: 'errors-only',
    },

    // Configuration pour empêcher les erreurs de timeout sur CI
    browserNoActivityTimeout: 60000,
    browserDisconnectTimeout: 10000,

    // Niveau de log
    logLevel: config.LOG_INFO,
  });
};
