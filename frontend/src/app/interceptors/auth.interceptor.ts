// src/app/interceptors/auth.interceptor.ts
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpXsrfTokenExtractor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log("🚀 Intercepteur: préparation de la requête");
    
    // Récupérer le token CSRF
    const csrfToken = this.getCookie('csrftoken');
    console.log("🔑 CSRF Token trouvé:", !!csrfToken);
    
    // Vérifier la session
    const sessionId = this.getCookie('sessionid');
    console.log("🔑 Session ID trouvé:", !!sessionId);
    
    // Cloner la requête avec credentials
    let clonedRequest = req.clone({
      withCredentials: true
    });
    
    // // Ajouter le token CSRF pour les méthodes non-GET
    // // Modifiez ces lignes (environ ligne 18-23)
    if (req.method !== 'GET' && csrfToken) {
      clonedRequest = clonedRequest.clone({
        headers: clonedRequest.headers.set('X-CSRFToken', csrfToken)
      });
    }
    
    return next.handle(clonedRequest);
  }
  
  private getCookie(name: string): string {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift() || '';
    }
    return '';
  }
}