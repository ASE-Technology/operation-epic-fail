import { Injectable } from '@angular/core';
import * as signalR from "@microsoft/signalr";
import { Observable, Subject } from 'rxjs';
import { SIGNALR_METHODS } from '../shared/constants/signalr.constant';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
  })
export class SignalrService {
    private hubConnection?: signalR.HubConnection;
    private fileProcessesSubject = new Subject<string>();
    fileProcesses$: Observable<string> = this.fileProcessesSubject.asObservable();

    constructor() { 
        this.hubConnection = new signalR.HubConnectionBuilder()
        .withUrl(environment.hubConnectionEndpoint, {
            accessTokenFactory: () => localStorage.getItem('token')?.toString() || ''
        })
        .build();
    
      this.hubConnection
        .start()
        .then(() => console.log('Connected to SignalR hub'))
        .catch(err => console.error('Error connecting to SignalR hub:', err));
    
      this.hubConnection.on(SIGNALR_METHODS.fileProcessed, (message: string) => {
        this.fileProcessesSubject.next(message);
      });
    }
}
