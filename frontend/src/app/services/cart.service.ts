// src/app/services/cart.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

/*
  Service pour gérer le panier de l'utilisateur
  Ce service gère les opérations liées au panier, comme l'ajout, la mise à jour, la suppression d'articles et la récupération du panier.
  Il utilise HttpClient pour les requêtes HTTP.
*/
@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:8000/api/store/cart/';

  constructor(private http: HttpClient) {}

  // Récupérer le panier de l'utilisateur connecté
  getCart(): Observable<any> {
    console.log('📤 Requête GET my_cart envoyée');
    return this.http.get(`${this.apiUrl}my_cart/`, { withCredentials: true });
  }

  // Ajouter un produit au panier
  addToCart(productId: number, quantity: number): Observable<any> {
    console.log(`📤 Ajout au panier: Produit ID ${productId}, Quantité: ${quantity}`);
    console.log('Cookies disponibles:', document.cookie);    return this.http.post(
      `${this.apiUrl}add_product/`,
      { product_id: productId, quantity },
      { withCredentials: true }
    );
  }

  // Modifier la quantité d'un produit dans le panier
  updateCartItem(productId: number, quantity: number): Observable<any> {
    console.log(`📤 Mise à jour du panier: Produit ID ${productId}, Nouvelle quantité: ${quantity}`);
    return this.http.patch(
      `${this.apiUrl}update_product/`,
      { product_id: productId, quantity },
      { withCredentials: true }
    );
  }

  // Supprimer un produit du panier
  removeCartItem(productId: number): Observable<any> {
    console.log(`📤 Suppression du produit ID ${productId} du panier`);
    const params = new HttpParams().set('product_id', productId.toString());

    return this.http.delete(`${this.apiUrl}remove_product/`, {
      withCredentials: true,
      params
    });
  }

  // Vider le panier
  clearCart(): Observable<any> {
    return this.http.delete(`${this.apiUrl}clear_cart/`, { withCredentials: true });
  }
}
