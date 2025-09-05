import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartComponent } from './cart.component';
import { CartService, CartResponse } from '../services/cart.service';
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
        { provide: CartService, useValue: cartServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    cartService = TestBed.inject(CartService) as jasmine.SpyObj<CartService>;

    // ✅ Mock conforme à CartResponse (avec 'price' et pas 'price_amount')
    const mockCart: CartResponse = {
      items: [
        {
          id: 1,
          product: { id: 5, name: 'Test Product', price: '10.00' },
          quantity: 2,
        },
      ],
      total: '20.00',
    };

    cartService.getCart.and.returnValue(of(mockCart));

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
