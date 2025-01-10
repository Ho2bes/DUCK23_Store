module.exports = function (config) {
  config.set({
    // Liste des navigateurs à utiliser
    browsers: ['ChromeHeadless'], // Utilisation de ChromeHeadless pour CI

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

    // Configurations supplémentaires
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
