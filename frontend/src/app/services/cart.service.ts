import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://127.0.0.1:8000/api/store/cart/';

  constructor(private http: HttpClient) {}

  /** ✅ Récupérer le panier de l'utilisateur connecté */
  getCart(): Observable<any> {
    console.log('📤 Requête GET my_cart envoyée');
    return this.http.get(`${this.apiUrl}my_cart/`, {
      withCredentials: true,
      headers: this.getHeaders()
    });
  }

  /** ✅ Ajouter un produit au panier */
  addToCart(productId: number, quantity: number): Observable<any> {
    console.log(`📤 Ajout au panier: Produit ID ${productId}, Quantité: ${quantity}`);
    return this.http.post(
      `${this.apiUrl}add_product/`,
      { product_id: productId, quantity },
      { withCredentials: true, headers: this.getHeaders() }
    );
  }

  /** ✅ Modifier la quantité d'un produit dans le panier */
  updateCartItem(productId: number, quantity: number): Observable<any> {
    console.log(`📤 Mise à jour du panier: Produit ID ${productId}, Nouvelle quantité: ${quantity}`);
    return this.http.patch(
      `${this.apiUrl}update_product/`,
      { product_id: productId, quantity },
      { withCredentials: true, headers: this.getHeaders() }
    );
  }

  /** ✅ Supprimer un produit du panier */
  removeCartItem(productId: number): Observable<any> {
    console.log(`📤 Suppression du produit ID ${productId} du panier`);
    const params = new HttpParams().set('product_id', productId.toString());

    return this.http.delete(`${this.apiUrl}remove_product/`, {
      withCredentials: true,
      headers: this.getHeaders(),
      params
    });
  }

  /** ✅ Récupérer automatiquement le token JWT depuis les cookies */
  private getToken(): string {
    console.log(document.cookie);
    const token = document.cookie.split('; ')
      .find(row => row.startsWith('accessToken='))
      ?.split('=')[1];

    console.log(`🔑 Token récupéré : ${token ? 'Oui' : 'Non'}`);
    return token || '';
  }

  /** ✅ Ajouter automatiquement l'Authorization Header avec le token JWT */
  private getHeaders(): HttpHeaders {
    const token = this.getToken();

    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    } else {
      console.warn('⚠️ Aucun token trouvé dans les cookies !');
    }

    return headers;
  }
}
