// src/app/services/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private backendUrl = 'http://localhost:8000/api/accounts/';

  constructor(private http: HttpClient, private router: Router) {}

  // Enregistrement d'un nouvel utilisateur
  registerUser(payload: any): Observable<any> {
    return this.http.post(`${this.backendUrl}register/`, payload, { withCredentials: true }).pipe(
      catchError(this.handleError)
    );
  }

  // Déconnexion utilisateur
  logoutUser(): Observable<any> {
    return this.http.post(`${this.backendUrl}logout/`, {}, { withCredentials: true }).pipe( // ✅ Envoie une requête POST pour se déconnecter (avec les cookies) whitcredentials: true permet de conserver les cookies
      tap(() => {
        console.log("✅ Déconnexion réussie !");
        this.router.navigate(['/login']);
      }),
      catchError(this.handleError)
    );
  }

  // Récupération des informations utilisateur
  getUserInfo(): Observable<any> {
    return this.http.get(`${this.backendUrl}user-info/`, { withCredentials: true }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  // Mise à jour des informations utilisateur
  updateUser(payload: any): Observable<any> {
    return this.http.put(`${this.backendUrl}update/`, payload, { withCredentials: true }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  // Suppression du compte utilisateur
  deleteUser(): Observable<any> {
    return this.http.delete(`${this.backendUrl}delete/`, { withCredentials: true }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  // Gestion des erreurs
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error("❌ Erreur API :", error);

    if (error.status === 401) {
      console.warn("❌ Non authentifié, redirection vers la page de connexion...");
      this.router.navigate(['/login']);
    }

    return throwError(() => new Error(error.error?.message || "Une erreur est survenue."));
  }
}
