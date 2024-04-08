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
export class AuthenticationService {
  constructor(private http: HttpClient) { }

  login(credentials: any): Observable<any> {
    return this.http.post(`${environment.authenticationServiceUrl}/login`, credentials, httpOptions);
  }

  register(data: any): Observable<any> {
    return this.http.post(`${environment.authenticationServiceUrl}/register`, data, httpOptions);
  }

  getProfile(): Observable<any> {
    return this.http.get(`${environment.authenticationServiceUrl}/profile`, httpOptions);
  }

  updateProfile(data: any): Observable<any> {
    return this.http.put(`${environment.authenticationServiceUrl}/profile`, data, httpOptions);
  }
}
