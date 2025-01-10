module.exports = function (config) {
  config.set({
    browsers: ['ChromeHeadless'], // Utilisez ChromeHeadless au lieu de Chrome
    singleRun: true, // Assurez-vous que les tests s'arrêtent après une exécution
    frameworks: ['jasmine'],
    files: [
      'src/**/*.spec.ts',
    ],
    preprocessors: {
      'src/**/*.spec.ts': ['webpack'],
    },
    reporters: ['progress'],
    webpack: {
      // Votre configuration Webpack ici
    },
  });
};
