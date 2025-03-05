import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AppComponent } from './app.component';
import { ApiService } from './services/api.service';
import { of } from 'rxjs';

describe('AppComponent', () => {
  let apiService: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,  // Simule le routing pour éviter les erreurs
        HttpClientTestingModule,  // Fournit un environnement de test pour les requêtes HTTP
      ],
      declarations: [AppComponent],  // Déclare le composant testé
      providers: [ApiService],  // Fournit le service API
    }).compileComponents();

    apiService = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Vérifie qu'il n'y a pas de requêtes en attente
  });

  // Vérifie que l'application se crée sans erreur
  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  // Vérifie que le composant récupère bien les informations utilisateur depuis l'API
  it('should fetch user info from the API', (done) => {
    const mockUserInfo = { username: 'testuser', email: 'testuser@example.com' };

    spyOn(apiService, 'getUserInfo').and.returnValue(of(mockUserInfo)); // Mock de `getUserInfo`

    apiService.getUserInfo().subscribe(data => {
      expect(data).toEqual(mockUserInfo);
      done(); // Indique que le test async est terminé
    });
  });

  // Vérifie que l'API est bien appelée et retourne une réponse correcte
  it('should call the API and return expected data', () => {
    const mockResponse = { message: 'Hello from backend' };

    apiService.getUserInfo().subscribe(data => {
      expect(data).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:8000/api/accounts/user-info/'); // Vérifie l'URL correcte
    expect(req.request.method).toBe("GET");
    req.flush(mockResponse); // Simule une réponse de l'API
  });
});
