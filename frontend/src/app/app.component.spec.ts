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
        RouterTestingModule,  // ✅ Pour gérer le routing
        HttpClientTestingModule,  // ✅ Pour injecter HttpClient
        AppComponent,  // ✅ AppComponent est standalone, donc dans `imports` et pas `declarations`
      ],
      providers: [ApiService],  // ✅ Injection du service
    }).compileComponents();

    apiService = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should fetch user info from the API', (done) => {
    const mockData = { username: 'testuser', email: 'testuser@example.com' };

    spyOn(apiService, 'getUserInfo').and.returnValue(of(mockData));

    apiService.getUserInfo().subscribe(data => {
      expect(data).toEqual(mockData);
      done();
    });
  });
});
