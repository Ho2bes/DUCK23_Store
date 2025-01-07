import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private backendUrl = 'http://127.0.0.1:8000/test-backend/'; // URL du backend

  constructor(private http: HttpClient) {}

  getTest(): Observable<any> {
    return this.http.get(this.backendUrl);
  }
}

