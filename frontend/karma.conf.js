module.exports = function (config) {
  config.set({
    // Liste des navigateurs à utiliser
    browsers: ['Puppeteer'],

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
    logLevel: config.LOG_INFO,

    // Configuration Puppeteer
    puppeteer: {
      headless: true, // Garde l'environnement sans interface graphique
      args: ['--no-sandbox'] // Désactive le sandboxing
    }
  });
};
