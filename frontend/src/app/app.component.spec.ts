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
