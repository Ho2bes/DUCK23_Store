// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, tap, of, map } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private backendUrl = 'http://localhost:8000/api/accounts/';

  constructor(private http: HttpClient, private router: Router) {}

  // Connexion utilisateur - utilise désormais les sessions
  loginUser(payload: any): Observable<any> {
    return this.http.post(`${this.backendUrl}login/`, payload, { withCredentials: true }).pipe(
      tap(() => {
        console.log("✅ Connexion réussie !");
        this.router.navigate(['/account-home']);
      }),
      catchError(this.handleError)
    );
  }

  // Vérifier si l'utilisateur est connecté
  isLoggedIn(): Observable<boolean> {
    console.log("🚀 Tentative de vérification de session");
  
    return this.http.get(`${this.backendUrl}user-info/`, { withCredentials: true }).pipe(
      tap(() => console.log("✅ Utilisateur authentifié")),
      map(() => true),  // Utilisez map pour transformer la réponse en boolean true
      catchError(() => {
        console.warn("❌ Non connecté");
        return of(false);
      })
    );
  }

  // Déconnexion utilisateur
  logoutUser(): Observable<any> {
    return this.http.post(`${this.backendUrl}logout/`, {}, { withCredentials: true }).pipe(
      tap(() => {
        console.log("✅ Déconnexion réussie !");
        this.router.navigate(['/login']);
      }),
      catchError(this.handleError)
    );
  }

  // Gestion des erreurs
  private handleError(error: any): Observable<never> {
    console.error("❌ Erreur API :", error);

    if (error.status === 401) {
      console.warn("❌ Non authentifié, redirection vers la page de connexion...");
      this.router.navigate(['/login']);
    }

    throw error;
  }
}