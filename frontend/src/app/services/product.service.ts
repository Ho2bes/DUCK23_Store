import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://127.0.0.1:8000/api/store/products/';

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
