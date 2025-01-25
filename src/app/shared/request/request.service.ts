import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  private apiUrl = 'https://tempo-together-backend-production.up.railway.app/api'; // URL de tu API

  constructor(private http: HttpClient) {
  }

getRequestDistance(user_id : number): Observable<any> {
    return this.http.post(`${this.apiUrl}/get-request-order-distance`, { user_id });
  }
}
