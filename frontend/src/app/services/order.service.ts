// src/app/services/order.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

/* ce service gère les opérations liées aux commandes
Il permet de passer une commande (checkout), de récupérer la liste des commandes de l'utilisateur et les détails d'une commande spécifique.
Il utilise HttpClient pour communiquer avec l'API backend.
*/

/** Une ligne “commande” dans /my_orders/ */
// on définit une interface TypeScript pour représenter une commande dans la liste des commandes de l'utilisateur.
export interface MyOrder {
  id: number;
  order_number: string;
  total: string;
  status: string;
  created_at: string; // ISO datetime
}

/** Détail d’une commande dans /orders/:id/ */
// on définit une interface TypeScript pour représenter le détail d'une commande, incluant les articles commandés.
export interface OrderDetail extends MyOrder {
  items: {
    product: { id: number; name: string; price_amount: string };
    quantity: number;
    price_amount: string; // snapshot unitaire
  }[];
}

// on crée un service injectable Angular pour gérer les opérations liées aux commandes.
@Injectable({ providedIn: 'root' })
export class OrderService {
  private apiUrl = 'http://51.20.144.37:8000/api/store/cart/';

  constructor(private http: HttpClient) {}

  /**
   * POST /cart/checkout/
   * Le back renvoie { order_id, total, status, created_at, ... }
   * On mappe vers { id, total, status, created_at } pour cohérence front.
   */
  // on passe une commande en envoyant une requête POST à l'API backend.
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
  // on récupère la liste des commandes de l'utilisateur en envoyant une requête GET à l'API backend.
  // on utilise withCredentials pour inclure les cookies d'authentification.
  // on retourne un Observable contenant un tableau de commandes.
  // on gère le cas où la réponse pourrait être null en utilisant l'opérateur de coalescence nulle (??).
  // cela garantit que l'on retourne toujours un tableau, même si la réponse est vide.
  // on utilise le type MyOrder pour typer les objets dans le tableau.
  getMyOrders(): Observable<MyOrder[]> {
    return this.http.get<MyOrder[]>(`${this.apiUrl}my_orders/`, { withCredentials: true });
  }

  /** GET /cart/orders/:id/ */
  getOrderById(id: number): Observable<OrderDetail> {
    return this.http.get<OrderDetail>(`${this.apiUrl}orders/${id}/`, { withCredentials: true });
  }
}
