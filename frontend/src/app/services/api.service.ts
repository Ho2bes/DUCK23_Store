import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private backendUrl = 'http://127.0.0.1:8000/';

  constructor(private http: HttpClient, private router: Router) {}

  // ✅ Récupérer les headers avec le token JWT
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  // ✅ Vérifier la connexion au backend
  getData(): Observable<any> {
    return this.http.get(`${this.backendUrl}test-backend/`).pipe(
      catchError(this.handleError)
    );
  }

  // ✅ Enregistrer un nouvel utilisateur
  registerUser(payload: any): Observable<any> {
    return this.http.post(`${this.backendUrl}api/accounts/register/`, payload).pipe(
      catchError(this.handleError)
    );
  }

  // ✅ Connexion d'un utilisateur
  loginUser(payload: any): Observable<any> {
    return this.http.post(`${this.backendUrl}api/token/`, payload).pipe(
      tap((response: any) => {
        if (response.access && response.refresh) {
          localStorage.setItem('accessToken', response.access);
          localStorage.setItem('refreshToken', response.refresh);
        }
      }),
      catchError(this.handleError)
    );
  }

  // ✅ Déconnexion de l'utilisateur
  logoutUser(): Observable<any> {
    const refreshToken = localStorage.getItem('refreshToken');

    if (!refreshToken) {
      console.error("❌ Aucun refresh token trouvé !");
      return throwError(() => new Error("Aucun token de déconnexion disponible."));
    }

    console.log("🚀 Envoi du refreshToken pour logout :", refreshToken);

    return this.http.post(`${this.backendUrl}api/accounts/logout/`, { refresh: refreshToken }).pipe(
      tap(() => {
        console.log("✅ Déconnexion réussie !");
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        this.router.navigate(['/login']);
      }),
      catchError(this.handleError)
    );
  }

  // ✅ Récupérer les informations de l'utilisateur
  getUserInfo(): Observable<any> {
    return this.http.get(`${this.backendUrl}api/accounts/user-info/`, {
      headers: this.getAuthHeaders(),
    }).pipe(
      catchError(this.handleError)
    );
  }

  // ✅ Mise à jour des informations utilisateur
  updateUser(payload: any): Observable<any> {
    return this.http.put(`${this.backendUrl}api/accounts/update/`, payload, {
      headers: this.getAuthHeaders(),
    }).pipe(
      catchError(this.handleError)
    );
  }

  // ✅ Suppression du compte utilisateur
  deleteUser(): Observable<any> {
    return this.http.delete(`${this.backendUrl}api/accounts/delete/`, {
      headers: this.getAuthHeaders(),
    }).pipe(
      catchError(this.handleError)
    );
  }

  // ✅ Gestion des erreurs
  private handleError(error: any): Observable<never> {
    console.error("❌ Erreur API :", error);

    if (error.status === 401) {
      console.warn("🔄 Redirection vers la page de connexion...");
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      this.router.navigate(['/login']);
    }

    return throwError(() => new Error(error.error?.message || "Une erreur est survenue."));
  }
}
