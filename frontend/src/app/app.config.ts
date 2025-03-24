// src/app/app.config.ts
import {
  provideHttpClient, // ✅ Import de la fonction 'provideHttpClient' pour configurer le client HTTP avec des intercepteurs et des options
  withInterceptorsFromDi, // ✅ Import de la fonction 'withInterceptorsFromDi' pour ajouter des intercepteurs depuis le DI (Dependency Injection)
  withXsrfConfiguration // ✅ Import de la fonction 'withXsrfConfiguration' pour configurer la protection CSRF
} from '@angular/common/http'; // ✅ Import des fonctions nécessaires pour configurer le client HTTP
import { HTTP_INTERCEPTORS } from '@angular/common/http'; // ✅ Import de la constante 'HTTP_INTERCEPTORS' pour ajouter des intercepteurs
import { AuthInterceptor } from './interceptors/auth.interceptor'; // ✅ Import de l'intercepteur 'AuthInterceptor'

// ✅ Configuration de l'application
export const appConfig = {
  providers: [
    provideHttpClient( // ✅ Configuration du client HTTP
      withXsrfConfiguration({// ✅ Configuration de la protection CSRF
        cookieName: 'csrftoken',// ✅ Nom du cookie CSRF Token (généré par Django) à envoyer avec les requêtes HTTP
        headerName: 'X-CSRFToken' // ✅ Nom de l'en-tête CSRF Token à envoyer avec les requêtes HTTP
      }),
      withInterceptorsFromDi() // ✅ Ajout des intercepteurs depuis le DI (Dependency Injection) pour le client HTTP (ex: AuthInterceptor)
    ),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true } // ✅ Ajout de l'intercepteur 'AuthInterceptor' au DI (Dependency Injection) pour le client HTTP
  ]
};
