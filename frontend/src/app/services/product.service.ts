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
  private apiUrl = 'http://51.20.144.37:8000/api/store/products/';

  constructor(private http: HttpClient) {}

  /** Récupérer tous les produits. il retourne la réponse observable. il envoie une requête GET à l'API. il sert à afficher la liste des produits. */
  getProducts(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  /** Récupérer un produit par son ID. il retourne la réponse observable. il envoie une requête GET à l'API. il sert à afficher les détails d'un produit. */
  getProductById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}${id}/`);
  }
}
