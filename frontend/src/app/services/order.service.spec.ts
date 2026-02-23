import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { OrderService, MyOrder, OrderDetail } from './order.service';

describe('OrderService', () => {
  let svc: OrderService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OrderService],
    });
    svc = TestBed.inject(OrderService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('getMyOrders() appelle /api/store/cart/my_orders/', () => {
    let received: MyOrder[] = [];
    svc.getMyOrders().subscribe((res: MyOrder[]) => {
      received = res;
    });
    const req = http.expectOne('http://51.20.144.37:8000/api/store/cart/my_orders/');
    expect(req.request.method).toBe('GET');
    req.flush([{
      id: 1,
      order_number: 'ORD123',
      total: '20.00',
      status: 'completed',
      created_at: '2025-01-01T00:00:00Z'
    }]);
    expect(received).toEqual([{
      id: 1,
      order_number: 'ORD123',
      total: '20.00',
      status: 'completed',
      created_at: '2025-01-01T00:00:00Z'
    }]);
  });

  it('getOrderById() appelle /api/store/cart/orders/:id/', () => {
    let received!: OrderDetail;
    svc.getOrderById(1).subscribe((res: OrderDetail) => {
      received = res;
    });
    const req = http.expectOne('http://localhost:8000/api/store/cart/orders/1/');
    expect(req.request.method).toBe('GET');
    req.flush({
      id: 1,
      order_number: 'ORD123',
      total: '20.00',
      status: 'completed',
      created_at: '2025-01-01T00:00:00Z',
      items: [
        {
          product: { id: 1, name: 'Tee', price_amount: '10.00' },
          quantity: 2,
          price_amount: '10.00'
        }
      ]
    });
    expect(received.id).toBe(1);
    expect(received.items.length).toBe(1);
  });

  it('checkout() appelle /api/store/cart/checkout/', () => {
    let received!: { id: number; total?: string; status?: string; created_at?: string };
    svc.checkout().subscribe((res) => {
      received = res;
    });
    const req = http.expectOne('http://localhost:8000/api/store/cart/checkout/');
    expect(req.request.method).toBe('POST');
    // Le backend retourne { order_id, ... }, mais le service mappe vers { id, ... }
    req.flush({ order_id: 123, total: '20.00', status: 'completed', created_at: '2025-01-01T00:00:00Z' });
    expect(received.id).toBe(123);
    expect(received.total).toBe('20.00');
  });

  it('renvoie une erreur propre en cas de 403 sur getOrderById', () => {
    let status = 0;
    svc.getOrderById(999).subscribe({
      next: () => {},
      error: (e: { status: number }) => {
        status = e.status;
      },
    });
    const req = http.expectOne('http://localhost:8000/api/store/cart/orders/999/');
    req.flush({ detail: 'Forbidden' }, { status: 403, statusText: 'Forbidden' });
    expect(status).toBe(403);
  });
});
