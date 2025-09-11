import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MyOrdersComponent } from './my-orders.component';
import { OrderService } from '../services/order.service';
import { ActivatedRoute } from '@angular/router';
import { MyOrder } from '../services/order.service'; // Utilisation du type exporté

describe('MyOrdersComponent', () => {
  let fixture: ComponentFixture<MyOrdersComponent>;
  let component: MyOrdersComponent;
  let svc: jasmine.SpyObj<OrderService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj<OrderService>('OrderService', ['getMyOrders']);
    await TestBed.configureTestingModule({
      imports: [MyOrdersComponent],
      providers: [
        provideHttpClientTesting(),
        { provide: OrderService, useValue: spy },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: new Map() } } }, // Mock ActivatedRoute
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MyOrdersComponent);
    component = fixture.componentInstance;
    svc = TestBed.inject(OrderService) as jasmine.SpyObj<OrderService>;
  });

  it('affiche la liste des commandes', () => {
    const mockOrders: MyOrder[] = [
      {
        id: 1,
        order_number: 'ORD-0001',
        status: 'PAID',
        created_at: new Date().toISOString(),
        total: '20.00',
      },
      {
        id: 2,
        order_number: 'ORD-0002',
        status: 'PENDING',
        created_at: new Date().toISOString(),
        total: '35.00',
      }
    ];
    svc.getMyOrders.and.returnValue(of(mockOrders));
    fixture.detectChanges();
    const html = fixture.nativeElement as HTMLElement;
    expect(html.textContent).toMatch(/20\.00|35\.00/);
  });

  it('gère une erreur service (ex. 401/403) sans crasher', () => {
    svc.getMyOrders.and.returnValue(throwError(() => ({ status: 401 })));
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
