// src/app/services/cart.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

// 🔹 Ajoute ces interfaces + export
export interface CartItem {
  id: number;
  product: { id: number; name: string; price: string };
  quantity: number;
}

export interface CartResponse {
  items: CartItem[];
  total: string;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private apiUrl = 'http://localhost:8000/api/store/cart/';

  constructor(private http: HttpClient) {}

  // 🔹 Tape la réponse avec CartResponse
  getCart(): Observable<CartResponse> {
    console.log('📤 Requête GET my_cart envoyée');
    return this.http.get<CartResponse>(`${this.apiUrl}my_cart/`, { withCredentials: true });
  }

  addToCart(productId: number, quantity: number): Observable<any> {
    console.log(`📤 Ajout au panier: Produit ID ${productId}, Quantité: ${quantity}`);
    console.log('Cookies disponibles:', document.cookie);
    return this.http.post(
      `${this.apiUrl}add_product/`,
      { product_id: productId, quantity },
      { withCredentials: true }
    );
  }

  updateCartItem(productId: number, quantity: number): Observable<any> {
    console.log(`📤 Mise à jour du panier: Produit ID ${productId}, Nouvelle quantité: ${quantity}`);
    return this.http.patch(
      `${this.apiUrl}update_product/`,
      { product_id: productId, quantity },
      { withCredentials: true }
    );
  }

  removeCartItem(productId: number): Observable<any> {
    console.log(`📤 Suppression du produit ID ${productId} du panier`);
    const params = new HttpParams().set('product_id', productId.toString());
    return this.http.delete(`${this.apiUrl}remove_product/`, { withCredentials: true, params });
  }

  clearCart(): Observable<any> {
    return this.http.delete(`${this.apiUrl}clear_cart/`, { withCredentials: true });
  }
}
