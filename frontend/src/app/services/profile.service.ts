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
export class ProfileService {
  constructor(private http: HttpClient) { }

  getProfile(): Observable<any> {
    return this.http.get(`${environment.authenticationServiceUrl}/profile`, httpOptions);
  }

  updateProfile(data: any): Observable<any> {
    return this.http.put(`${environment.authenticationServiceUrl}/profile`, data, httpOptions);
  }
}
