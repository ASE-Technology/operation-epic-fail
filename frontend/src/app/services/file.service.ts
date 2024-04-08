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
export class FileService {
  constructor(private http: HttpClient) { }

  getFiles(): Observable<any> {
    return this.http.get(`${environment.fileServiceUrl}`, httpOptions);
  }

  addFile(file: any): Observable<any> {
    let formData: FormData = new FormData();
    formData.append('file', file);
    
    return this.http.post(`${environment.fileServiceUrl}`, formData, httpOptions);
  }

  downloadFile(id: string): Observable<any> {
    return this.http.get(`${environment.fileServiceUrl}/${id}`, httpOptions);
  }
}
