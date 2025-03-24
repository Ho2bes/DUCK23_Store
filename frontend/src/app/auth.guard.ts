// src/app/auth.guard.ts
// On importe des outils nécessaires pour faire fonctionner notre garde d'authentification
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { map, catchError, of } from 'rxjs';

// On crée une fonction qui vérifie si une page peut être affichée
export const authGuard: CanActivateFn = (route, state) => {
  // On utilise 'inject' pour obtenir un outil qui nous permet de naviguer entre les pages
  const router = inject(Router);
    // On utilise 'inject' pour obtenir un service qui vérifie si l'utilisateur est connecté
  const authService = inject(AuthService);

    // On demande au service d'authentification si l'utilisateur est connecté
  return authService.isLoggedIn().pipe(
    map(isLoggedIn => {
            // Si l'utilisateur est connecté, on le laisse accéder à la page
      if (isLoggedIn) {
        return true;
      } else {
        // Si l'utilisateur n'est pas connecté, on le redirige vers la page de connexion
        // On garde en mémoire la page qu'il voulait voir pour le rediriger après la connexion
        router.navigate(['/login'], {
          queryParams: { returnUrl: state.url }
        });
        return false;
      }
    }),
    // Si quelque chose ne va pas lors de la vérification, on redirige vers la page de connexion
    catchError(() => {
      router.navigate(['/login']);
      return of(false);
    })
  );
};
