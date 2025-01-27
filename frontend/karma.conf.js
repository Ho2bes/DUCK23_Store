module.exports = function (config) {
  config.set({
    // Liste des navigateurs à utiliser
    browsers: ['ChromeHeadlessNoSandbox'], // Utilisation de ChromeHeadless avec configuration spécifique pour CI

    // Configuration pour ChromeHeadless avec des flags additionnels
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: [
          '--no-sandbox', // Nécessaire pour éviter les erreurs de permission
          '--disable-gpu', // Désactive l'accélération graphique
          '--disable-dev-shm-usage', // Réduit l'utilisation de la mémoire partagée
          '--headless', // Mode headless
          '--disable-extensions', // Désactive les extensions pour éviter les conflits
          '--remote-debugging-port=9222', // Nécessaire pour certains environnements CI
        ],
      },
    },

    // Exécute les tests une seule fois (utile pour CI)
    singleRun: true,

    // Framework de test utilisé
    frameworks: ['jasmine'],

    // Fichiers à inclure pour les tests
    files: [
      { pattern: 'src/**/*.spec.ts', watched: false } // Ajout de watched: false pour améliorer les performances
    ],

    // Préprocesseurs pour les fichiers
    preprocessors: {
      'src/**/*.spec.ts': ['webpack']
    },

    // Configuration des reporters
    reporters: ['progress'], // Utilisation du reporter "progress"

    // Configuration Webpack
    webpack: {
      mode: 'development', // Mode développement pour éviter la minification
      resolve: {
        extensions: ['.js', '.ts'] // Assurez-vous que .ts est pris en charge
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

    // Configurations supplémentaires pour Webpack
    webpackMiddleware: {
      stats: 'errors-only' // Réduit les logs inutiles
    },

    // Configuration pour empêcher les erreurs de timeout sur CI
    browserNoActivityTimeout: 60000, // Augmente le délai d'inactivité
    browserDisconnectTimeout: 10000, // Augmente le délai de déconnexion

    // Niveau de log
    logLevel: config.LOG_INFO
  });
};
