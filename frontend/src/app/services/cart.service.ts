// src/app/services/cart.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

/* ce service gère les opérations du panier
Il permet de récupérer le panier, d'ajouter, de mettre à jour et de supprimer des articles, ainsi que de vider le panier.
Il utilise HttpClient pour communiquer avec l'API backend.
*/

// Interfaces pour typer les réponses de l'API. ils définissent la structure des objets de panier et des articles de panier.
export interface CartItem {
  id: number;
  product: { id: number; name: string; price: string };
  quantity: number;
}

// Interface pour la réponse du panier, incluant les articles et le total.
export interface CartResponse {
  items: CartItem[];
  total: string;
}

// Service pour gérer les opérations du panier. Il utilise HttpClient pour communiquer avec l'API backend.
@Injectable({ providedIn: 'root' })
export class CartService {
  private apiUrl = 'http://51.20.144.37:8000/api/store/cart/';

  constructor(private http: HttpClient) {}

  // cette méthode récupère le panier actuel et retourne la réponse observable. elle envoie une requête GET à l'API.
  getCart(): Observable<CartResponse> {
    console.log('📤 Requête GET my_cart envoyée');
    return this.http.get<CartResponse>(`${this.apiUrl}my_cart/`, { withCredentials: true });
  }

  // cette méthode ajoute un produit au panier avec une quantité spécifiée et retourne la réponse observable. elle envoie une requête POST à l'API.
  addToCart(productId: number, quantity: number): Observable<any> {
    console.log(`📤 Ajout au panier: Produit ID ${productId}, Quantité: ${quantity}`);
    console.log('Cookies disponibles:', document.cookie);
    return this.http.post(
      `${this.apiUrl}add_product/`,
      { product_id: productId, quantity },
      { withCredentials: true }
    );
  }

  // cette méthode met à jour la quantité d'un produit dans le panier et retourne la réponse observable. elle envoie une requête PATCH à l'API.
  updateCartItem(productId: number, quantity: number): Observable<any> {
    console.log(`📤 Mise à jour du panier: Produit ID ${productId}, Nouvelle quantité: ${quantity}`);
    return this.http.patch(
      `${this.apiUrl}update_product/`,
      { product_id: productId, quantity },
      { withCredentials: true }
    );
  }

  // cette méthode supprime un produit du panier en fonction de son ID et retourne la réponse observable. elle envoie une requête DELETE à l'API.
  removeCartItem(productId: number): Observable<any> {
    console.log(`📤 Suppression du produit ID ${productId} du panier`);
    const params = new HttpParams().set('product_id', productId.toString());
    return this.http.delete(`${this.apiUrl}remove_product/`, { withCredentials: true, params });
  }

  // cette méthode vide le panier et retourne la réponse observable. Elle envoie une requête DELETE à l'API.
  clearCart(): Observable<any> {
    return this.http.delete(`${this.apiUrl}clear_cart/`, { withCredentials: true });
  }
}
