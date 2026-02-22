import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { ApiService } from '../services/api.service';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let apiService: jasmine.SpyObj<ApiService>;

  beforeEach(async () => {
    const apiServiceSpy = jasmine.createSpyObj('ApiService', ['registerUser']);

    await TestBed.configureTestingModule({
      imports: [RegisterComponent, RouterTestingModule.withRoutes([])], // Ajout d'une config vide pour éviter l'erreur "root"
      providers: [
        provideHttpClient(),
        { provide: ApiService, useValue: apiServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
