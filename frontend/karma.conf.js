module.exports = function (config) {
  config.set({
    // Liste des navigateurs à utiliser
    browsers: ['ChromeHeadlessNoSandbox'],

    // Définir les configurations personnalisées pour les navigateurs
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox', '--disable-gpu']
      }
    },

    // Exécute les tests une seule fois (utile pour CI)
    singleRun: true,

    // Framework de test utilisé
    frameworks: ['jasmine'],

    // Fichiers à inclure pour les tests
    files: [
      { pattern: 'src/**/*.spec.ts', watched: false }
    ],

    // Préprocesseurs pour les fichiers
    preprocessors: {
      'src/**/*.spec.ts': ['webpack']
    },

    // Configuration des reporters
    reporters: ['progress'],

    // Configuration Webpack
    webpack: {
      mode: 'development',
      resolve: {
        extensions: ['.js', '.ts']
      },
      module: {
        rules: [
          {
            test: /\.ts$/,
            use: 'ts-loader',
            exclude: /node_modules/
          }
        ]
      }
    },

    // Configurations supplémentaires
    webpackMiddleware: {
      stats: 'errors-only'
    },

    // Configuration pour empêcher les erreurs de timeout sur CI
    browserNoActivityTimeout: 60000,
    browserDisconnectTimeout: 10000,

    // Niveau de log
    logLevel: config.LOG_INFO
  });
};
