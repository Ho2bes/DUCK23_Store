import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, tap, switchMap, of } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private backendUrl = 'http://127.0.0.1:8000/api/accounts/';

  constructor(private http: HttpClient, private router: Router) {}

  // ✅ Connexion utilisateur
  loginUser(payload: any): Observable<any> {
    return this.http.post(`${this.backendUrl}login/`, payload, { withCredentials: true }).pipe(
      tap(() => {
        console.log("✅ Connexion réussie !");
        this.router.navigate(['/account-home']);
      }),
      catchError(this.handleError)
    );
  }

  // ✅ Vérifier si l'utilisateur est connecté (Correction : Ajout de logs)
  isLoggedIn(): Observable<boolean> {
    console.log("🚀 Tentative d’envoi de GET /user-info/ avec withCredentials");

    return this.http.get(`${this.backendUrl}user-info/`, { withCredentials: true }).pipe(
      tap(() => console.log("✅ Utilisateur authentifié")),
      switchMap(() => of(true)),
      catchError(() => {
        console.warn("❌ Non connecté");
        return of(false);
      })
    );
  }



  // ✅ Rafraîchissement du token
  refreshToken(): Observable<any> {
    return this.http.post(`${this.backendUrl}refresh-token/`, {}, { withCredentials: true }).pipe(
      tap(() => console.log("🔄 Token rafraîchi avec succès.")),
      catchError(this.handleError)
    );
  }

  // ✅ Déconnexion utilisateur
  logoutUser(): Observable<any> {
    return this.http.post(`${this.backendUrl}logout/`, {}, { withCredentials: true }).pipe(
      tap(() => {
        console.log("✅ Déconnexion réussie !");
        this.router.navigate(['/login']);
      }),
      catchError(this.handleError)
    );
  }

  // ✅ Gestion des erreurs
  private handleError(error: any): Observable<never> {
    console.error("❌ Erreur API :", error);

    if (error.status === 401) {
      console.warn("🔄 Redirection vers la page de connexion...");
      this.router.navigate(['/login']);
    }

    throw error;
  }
}
