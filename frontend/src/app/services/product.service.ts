import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/*
  Service pour gérer les produits
  Ce service permet de récupérer la liste des produits et les détails d'un produit spécifique.
  Il utilise HttpClient pour les requêtes HTTP.
*/
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:8000/api/store/products/';

  constructor(private http: HttpClient) {}

  /** Récupérer tous les produits */
  getProducts(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  /** Récupérer un produit par son ID */
  getProductById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}${id}/`);
  }
}
