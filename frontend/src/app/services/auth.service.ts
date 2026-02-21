// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, tap, of, map } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

/*
  Service pour gérer l'authentification des utilisateurs
  Ce service gère la connexion, la déconnexion et la vérification de l'état de connexion des utilisateurs.
  Il utilise HttpClient pour les requêtes HTTP et Router pour la navigation après certaines actions.
*/

export interface Me {
  id: number;
  username: string;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  role: 'user' | 'admin';
  created_at: string;   // Django enverra une date ISO → string côté TS
  updated_at: string;
  address?: string | null;
  phone_number?: string | null;
}
@Injectable({
  providedIn: 'root', // Ce service est disponible dans toute l'application
})
export class AuthService {
  private backendUrl = `${environment.apiUrl}/api/accounts/`;

  constructor(private http: HttpClient, private router: Router) {}   // Le constructeur est une fonction spéciale qui est appelée quand le service est créé

  getMe(): Observable<Me> {
    return this.http.get<Me>(`${this.backendUrl}user-info/`, { withCredentials: true });
  }

  // Connexion utilisateur - utilise désormais les sessions
  loginUser(payload: any): Observable<any> {
        // On envoie une requête POST au serveur pour se connecter
    return this.http.post(`${this.backendUrl}login/`, payload, { withCredentials: true }).pipe(
      tap(() => {
        console.log("✅ Connexion réussie !");
        // Si la connexion est réussie, on redirige l'utilisateur vers la page d'accueil de son compte
        this.router.navigate(['/account-home']);
      }),
      catchError(this.handleError)
    );
  }

  // Vérifier si l'utilisateur est connecté
  isLoggedIn(): Observable<boolean> {
    console.log("🚀 Tentative de vérification de session");
    // On envoie une requête GET au serveur pour vérifier si l'utilisateur est connecté
    return this.http.get(`${this.backendUrl}user-info/`, { withCredentials: true }).pipe(
      tap(() => console.log("✅ Utilisateur authentifié")),
      map(() => true),  // Utilisez map pour transformer la réponse en boolean true si l'utilisateur est connecté (sinon catchError)
      catchError(() => {
        console.warn("❌ Non connecté");
        return of(false);
      })
    );
  }

  // Déconnexion utilisateur
  logoutUser(): Observable<any> {
    // On envoie une requête POST au serveur pour se déconnecter
    return this.http.post(`${this.backendUrl}logout/`, {}, { withCredentials: true }).pipe(
      tap(() => {
        console.log("✅ Déconnexion réussie !");
        this.router.navigate(['/login']); // Redirige l'utilisateur vers la page de connexion
      }),
      catchError(this.handleError)
    );
  }

  // Gestion des erreurs
  private handleError(error: any): Observable<never> { // Utilisez 'any' pour capturer toutes les erreurs possibles
    console.error("❌ Erreur API :", error); // Affiche l'erreur dans la console

    if (error.status === 401) {
      console.warn("❌ Non authentifié, redirection vers la page de connexion...");
      this.router.navigate(['/login']);
    }

    throw error; // Lance une erreur pour que le composant puisse la gérer à sa manière (par exemple, afficher un message d'erreur)
  }
}
