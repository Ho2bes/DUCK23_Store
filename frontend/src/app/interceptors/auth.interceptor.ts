import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log("🚀 Intercepteur : Ajout de withCredentials aux requêtes");

    const clonedRequest = req.clone({
      withCredentials: true  // ✅ Forcer l’envoi des cookies
    });

    return next.handle(clonedRequest);
  }
}

