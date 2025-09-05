import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartComponent } from './cart.component';
import { CartService } from '../services/cart.service';
import { of } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;
  let cartService: jasmine.SpyObj<CartService>;

  beforeEach(async () => {
    const cartServiceSpy = jasmine.createSpyObj('CartService', ['getCart']);

    await TestBed.configureTestingModule({
      imports: [CartComponent], // Standalone component
      providers: [
        provideHttpClient(),
        { provide: CartService, useValue: cartServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    cartService = TestBed.inject(CartService) as jasmine.SpyObj<CartService>;

    cartService.getCart.and.returnValue(of([{ id: 1, name: 'Test Product', price: '10.00' }]));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch cart items on init', () => {
    component.ngOnInit();
    expect(cartService.getCart).toHaveBeenCalled();
  });
});
