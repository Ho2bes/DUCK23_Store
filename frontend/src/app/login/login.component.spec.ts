import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing'; // ✅ Import indispensable
import { of, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  // Mocks
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let router: Router; // On utilisera l'instance réelle du routeur de test

  beforeEach(async () => {
    // 1. Mock du service Auth
    authServiceSpy = jasmine.createSpyObj('AuthService', ['loginUser']);

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        FormsModule,
        RouterTestingModule // ✅ Charge un Router compatible avec RouterLink
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        {
          provide: ActivatedRoute,
          // ✅ Mock plus complet pour ActivatedRoute (RouterLink a besoin des Observables)
          useValue: {
            snapshot: { queryParams: { returnUrl: '/dashboard' } },
            queryParams: of({ returnUrl: '/dashboard' }),
            params: of({}),
            url: of([])
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;

    // 2. On récupère le Router injecté et on espionne la méthode navigateByUrl
    router = TestBed.inject(Router);
    spyOn(router, 'navigateByUrl');

    fixture.detectChanges();
  });

  it('doit créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('doit appeler loginUser, attendre 1.5s, puis rediriger', fakeAsync(() => {
    authServiceSpy.loginUser.and.returnValue(of({ token: 'fake-token' }));

    component.username = 'testuser';
    component.password = 'password123';
    component.onSubmit();

    const expectedPayload = { username: 'testuser', password: 'password123' };
    expect(authServiceSpy.loginUser).toHaveBeenCalledWith(expectedPayload);

    // Pas encore redirigé
    expect(router.navigateByUrl).not.toHaveBeenCalled();

    // On avance le temps
    tick(1500);

    // Vérification sur l'espion du router
    expect(router.navigateByUrl).toHaveBeenCalledWith('/dashboard');
  }));

  it('ne doit pas rediriger si le login échoue', () => {
    authServiceSpy.loginUser.and.returnValue(throwError(() => new Error('Login failed')));

    component.username = 'baduser';
    component.password = 'badpass';
    component.onSubmit();

    expect(authServiceSpy.loginUser).toHaveBeenCalled();
    expect(router.navigateByUrl).not.toHaveBeenCalled();
    expect(component.errorMessage).toContain('Identifiants incorrects');
  });

  it('ne doit rien faire si les champs sont vides', () => {
    component.username = '';
    component.password = '';
    component.onSubmit();

    expect(authServiceSpy.loginUser).not.toHaveBeenCalled();
    expect(component.errorMessage).toContain('Tous les champs doivent être remplis');
  });
});
