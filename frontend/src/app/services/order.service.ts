// src/app/services/order.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

/** Une ligne “commande” dans /my_orders/ */
export interface MyOrder {
  id: number;
  order_number: string;
  total: string;
  status: string;
  created_at: string; // ISO datetime
}

/** Détail d’une commande dans /orders/:id/ */
export interface OrderDetail extends MyOrder {
  items: {
    product: { id: number; name: string; price_amount: string };
    quantity: number;
    price_amount: string; // snapshot unitaire
  }[];
}

@Injectable({ providedIn: 'root' })
export class OrderService {
  private apiUrl = 'http://localhost:8000/api/store/cart/';

  constructor(private http: HttpClient) {}

  /**
   * POST /cart/checkout/
   * Le back renvoie { order_id, total, status, created_at, ... }
   * On mappe vers { id, total, status, created_at } pour cohérence front.
   */
  checkout(): Observable<{ id: number; total?: string; status?: string; created_at?: string }> {
    return this.http
      .post<any>(`${this.apiUrl}checkout/`, {}, { withCredentials: true })
      .pipe(
        map(res => ({
          id: res?.order_id,
          total: res?.total,
          status: res?.status,
          created_at: res?.created_at,
        }))
      );
  }

  /** GET /cart/my_orders/ */
  getMyOrders(): Observable<MyOrder[]> {
    return this.http.get<MyOrder[]>(`${this.apiUrl}my_orders/`, { withCredentials: true });
  }

  /** GET /cart/orders/:id/ */
  getOrderById(id: number): Observable<OrderDetail> {
    return this.http.get<OrderDetail>(`${this.apiUrl}orders/${id}/`, { withCredentials: true });
  }
}
