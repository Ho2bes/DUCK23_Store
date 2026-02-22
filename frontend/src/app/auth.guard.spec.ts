import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from './services/auth.service';
import { of, throwError, Observable } from 'rxjs';

describe('authGuard', () => {
  // Fonction helper pour exécuter le guard dans le contexte d'injection d'Angular
  // C'est obligatoire car authGuard utilise inject()
  const executeGuard: CanActivateFn = (...guardParameters) =>
      TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    // 1. On mock AuthService et Router
    authServiceSpy = jasmine.createSpyObj('AuthService', ['isLoggedIn']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });
  });

  it('doit être créé', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('doit AUTORISER l\'accès si isLoggedIn renvoie TRUE', (done) => {
    // A. On simule que le service répond "true" via un Observable
    authServiceSpy.isLoggedIn.and.returnValue(of(true));

    // B. On exécute le guard
    const result = executeGuard(
      {} as ActivatedRouteSnapshot,
      { url: '/dashboard' } as RouterStateSnapshot
    ) as Observable<boolean>;

    // C. On souscrit au résultat (car c'est un Observable)
    result.subscribe(isAllowed => {
      expect(isAllowed).toBeTrue(); // Le guard doit laisser passer
      expect(routerSpy.navigate).not.toHaveBeenCalled(); // Pas de redirection
      done(); // On signale à Jasmine que le test asynchrone est fini
    });
  });

  it('doit BLOQUER l\'accès et REDIRIGER avec returnUrl si isLoggedIn renvoie FALSE', (done) => {
    // A. On simule que le service répond "false"
    authServiceSpy.isLoggedIn.and.returnValue(of(false));

    // B. On définit l'URL cible (celle que l'utilisateur voulait voir)
    const targetUrl = '/mon-panier';
    const mockState = { url: targetUrl } as RouterStateSnapshot;

    // C. On exécute
    const result = executeGuard(
      {} as ActivatedRouteSnapshot,
      mockState
    ) as Observable<boolean>;

    // D. Vérification
    result.subscribe(isAllowed => {
      expect(isAllowed).toBeFalse(); // Accès refusé

      // Vérification précise de la redirection avec le paramètre returnUrl
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login'], {
        queryParams: { returnUrl: targetUrl }
      });

      done();
    });
  });

  it('doit BLOQUER et REDIRIGER (sans params) en cas d\'ERREUR du service', (done) => {
    // A. On simule une erreur serveur (ex: API down)
    authServiceSpy.isLoggedIn.and.returnValue(throwError(() => new Error('Erreur API')));

    // B. On exécute
    const result = executeGuard(
      {} as ActivatedRouteSnapshot,
      { url: '/dashboard' } as RouterStateSnapshot
    ) as Observable<boolean>;

    // C. Vérification du catchError
    result.subscribe(isAllowed => {
      expect(isAllowed).toBeFalse(); // Le catchError renvoie of(false)

      // Dans ton code, le catchError redirige vers /login SANS queryParams
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);

      done();
    });
  });
});
