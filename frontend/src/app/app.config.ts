/*
on importe les modules nécessaires pour la configuration de l'application Angular, y compris les services HTTP et les interceptors.
*/
import {
  provideHttpClient,
  withInterceptorsFromDi,
  withXsrfConfiguration
} from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';

/*
  Configuration de l'application Angular
  Cette configuration inclut les fournisseurs pour les requêtes HTTP avec gestion des CSRF et les interceptors.
  L'interceptor AuthInterceptor est utilisé pour ajouter des en-têtes d'authentification aux requêtes sortantes.
*/
export const appConfig = {
  providers: [
    provideHttpClient(
      withXsrfConfiguration({
        cookieName: 'csrftoken',
        headerName: 'X-CSRFToken'
      }),
      withInterceptorsFromDi()
    ),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ]
};
