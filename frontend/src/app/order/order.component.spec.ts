import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { OrderComponent } from './order.component';
import { OrderService, OrderDetail } from '../services/order.service';
import { AuthService } from '../services/auth.service';
import { LOCALE_ID } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';

describe('OrderComponent', () => {
  let fixture: ComponentFixture<OrderComponent>;
  let component: OrderComponent;
  let svc: jasmine.SpyObj<OrderService>;

  // Enregistrer la locale française
  beforeAll(() => {
    registerLocaleData(localeFr, 'fr');
  });

  beforeEach(async () => {
    const spy = jasmine.createSpyObj<OrderService>('OrderService', ['getOrderById']);
    await TestBed.configureTestingModule({
      imports: [OrderComponent, HttpClientTestingModule, CommonModule], // Ajout de CommonModule
      providers: [
        { provide: OrderService, useValue: spy },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: new Map([['id', '1']]) } } },
        { provide: AuthService, useValue: {} },
        { provide: LOCALE_ID, useValue: 'fr-FR' },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderComponent);
    component = fixture.componentInstance;
    svc = TestBed.inject(OrderService) as jasmine.SpyObj<OrderService>;
  });

  it('rend le détail de la commande', () => {
    const order: OrderDetail = {
      id: 1,
      order_number: 'ORD-0001',
      total: '20.00',
      status: 'PAID',
      created_at: new Date().toISOString(),
      items: [{ product: { id: 1, name: 'Tee', price_amount: '10.00' }, quantity: 2, price_amount: '10.00' }]
    };
    svc.getOrderById.and.returnValue(of(order));
    fixture.detectChanges();
    const html = fixture.nativeElement as HTMLElement;
    expect(html.textContent).toMatch(/20\.00|Tee/);
  });

  it('affiche un état d’erreur (403/404) sans crasher', () => {
    svc.getOrderById.and.returnValue(throwError(() => ({ status: 403 })));
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
