import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
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
    return this.http.post(`${this.backendUrl}api/accounts/login/`, payload).pipe(
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

    return this.http.post(`${this.backendUrl}api/accounts/logout/`, { refresh: refreshToken }).pipe(
      catchError(this.handleError)
    );
  }

  // ✅ Mise à jour des informations utilisateur (PUT /update/)
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

  // ✅ Récupérer les informations de l'utilisateur
  getUserInfo(): Observable<any> {
    return this.http.get(`${this.backendUrl}api/accounts/user-info/`, {
      headers: this.getAuthHeaders(),
    }).pipe(
      catchError(this.handleError)
    );
  }

  // ✅ Fonction pour gérer les erreurs HTTP
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



/*import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private backendUrl = 'http://127.0.0.1:8000/'; // Base URL de ton backend

  constructor(private http: HttpClient) {}

  // Tester la connexion au backend
  getData(): Observable<any> {
    return this.http.get(`${this.backendUrl}test-backend/`); // Remplace '/api/data/' par '/test-backend/'
  }

  // Enregistrer un nouvel utilisateur
  registerUser(payload: any): Observable<any> {
    return this.http.post(`${this.backendUrl}api/accounts/register/`, payload);
  }

  // Connexion d'un utilisateur
  loginUser(payload: any): Observable<any> {
    return this.http.post(`${this.backendUrl}api/accounts/login/`, payload);
  }

  // Déconnexion d'un utilisateur
  logoutUser(): Observable<any> {
    return this.http.post(`${this.backendUrl}api/accounts/logout/`, {}); // POST vide pour la déconnexion
  }

  // Mise à jour des informations utilisateur
  updateUser(payload: any): Observable<any> {
    return this.http.put(`${this.backendUrl}api/accounts/update/`, payload);
  }

  // Suppression de l'utilisateur
  deleteUser(): Observable<any> {
    return this.http.delete(`${this.backendUrl}api/accounts/delete/`);
  }
}*/
