import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { authGuard } from './auth.guard';

// on crée un test unitaire pour le guard d'authentification. cela permet de vérifier que le guard fonctionne correctement.
describe('authGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
      TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
