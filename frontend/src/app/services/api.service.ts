import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) { }

  login(credentials: any, headers: any): Observable<any> {
    return this.http.post(`${environment.authenticationServiceUrl}/login`, credentials, { headers });
  }

  register(data: any): Observable<any> {
    return this.http.post(`${environment.authenticationServiceUrl}/register`, data, httpOptions);
  }
}