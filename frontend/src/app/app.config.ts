import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.service'; // Vérifie que ce fichier existe bien

export const appConfig = {
  providers: [
    provideHttpClient(withInterceptorsFromDi()),  // Ajoute automatiquement les interceptors
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
};
