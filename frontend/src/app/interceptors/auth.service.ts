import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authToken = localStorage.getItem('accessToken');
    const excludedRoutes = [
      '/api/accounts/register/',
      '/api/accounts/login/',
      '/api/accounts/logout/' // 🔥 Ajouté ici pour exclure `logout`
    ];

    if (authToken && !excludedRoutes.some(route => req.url.includes(route))) {
      const cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      return next.handle(cloned);
    }

    return next.handle(req);
  }
}
