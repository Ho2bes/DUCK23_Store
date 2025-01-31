import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { AppComponent } from './app.component';
import { ApiService } from './services/api.service';
import { of } from 'rxjs';

describe('AppComponent', () => {
  let apiService: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent], // Importe AppComponent ici
      providers: [ApiService, provideHttpClientTesting()],
    }).compileComponents();

    apiService = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Vérifie qu'il n'y a pas de requêtes en attente
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should call ApiService to fetch data on init', () => {
    const mockData = { message: 'Hello from backend' };
    spyOn(apiService, 'getData').and.returnValue(of(mockData));

    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    app.ngOnInit();
    expect(apiService.getData).toHaveBeenCalled();
    expect(app.data).toEqual(mockData);
  });

  it('should set the fetched data to "data" property', () => {
    const mockData = { message: 'Hello from backend' };
    spyOn(apiService, 'getData').and.returnValue(of(mockData));

    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    app.ngOnInit();
    expect(app.data).toEqual(mockData);
  });

  it('should fetch data from the API', () => {
    const mockData = { message: 'Hello from backend' };
    apiService.getData().subscribe(data => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne('your-api-endpoint'); // Remplacez par votre endpoint
    expect(req.request.method).toBe("GET");
    req.flush(mockData);
  });
});







/*
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http'; // Nouvelle méthode pour fournir HttpClient
import { AppComponent } from './app.component'; // Composant standalone
import { ApiService } from './services/api.service'; // Service dépendant

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppComponent, // Ajout du composant standalone dans `imports`
      ],
      providers: [
        ApiService, // Fourniture de `ApiService`
        provideHttpClient(), // Nouvelle méthode pour fournir `HttpClient`
      ],
    }).compileComponents();
  });

  // Vérifie que le composant principal peut être créé
  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  // Vérifie que le composant contient un élément <h1>
  it('should render a title in an <h1> tag', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')).not.toBeNull(); // Vérifie la présence de l'élément <h1>
  });

  // Vérifie que la propriété "title" existe et a une valeur correcte
  it('should have a title property', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toBeDefined(); // Vérifie que `title` existe
    expect(typeof app.title).toBe('string'); // Vérifie que `title` est une chaîne de caractères
  });
});
*/

