// src/app/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { map, catchError, of } from 'rxjs';

/*
On crée une fonction qui vérifie si une page peut être affichée
Cette fonction est utilisée pour protéger certaines pages de l'application.
Si l'utilisateur n'est pas connecté, il est redirigé vers la page de connexion.
Si l'utilisateur est connecté, il peut accéder à la page demandée.
  */
export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

    // On demande au service d'authentification si l'utilisateur est connecté
    // Si oui, on autorise l'accès à la page
    // Si non, on redirige vers la page de connexion avec l'URL de retour
    // On gère aussi les erreurs en redirigeant vers la page de connexion
  return authService.isLoggedIn().pipe(
    map(isLoggedIn => {
      if (isLoggedIn) {
        return true;
      } else {
        router.navigate(['/login'], {
          queryParams: { returnUrl: state.url }
        });
        return false;
      }
    }),
    catchError(() => {
      router.navigate(['/login']);
      return of(false);
    })
  );
};
