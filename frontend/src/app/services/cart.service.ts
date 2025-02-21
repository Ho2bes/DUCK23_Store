import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://127.0.0.1:8000/api/store/cart/';

  constructor(private http: HttpClient) {}

  /** Récupérer le panier de l'utilisateur connecté */
  getCart(): Observable<any> {
    return this.http.get(`${this.apiUrl}my_cart/`);
  }

  /** Ajouter un produit au panier */
  addToCart(productId: number, quantity: number): Observable<any> {
    return this.http.post(`${this.apiUrl}add_product/`, { product_id: productId, quantity });
  }

  /** Modifier la quantité d'un produit dans le panier */
  updateCartItem(cartItemId: number, quantity: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}cartitem/${cartItemId}/`, { quantity });
  }

  /** Supprimer un produit du panier */
  removeCartItem(cartItemId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}cartitem/${cartItemId}/`);
  }
}
