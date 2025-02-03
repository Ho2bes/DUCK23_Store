import { Injectable } from '@angular/core';
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

  // Récupérer les informations de l'utilisateur
  getUserInfo(): Observable<any> {
    return this.http.get(`${this.backendUrl}api/accounts/user-info/`);
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
