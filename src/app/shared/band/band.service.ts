import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BandService {
  private apiUrl = 'http://localhost:8000/api'; // URL de tu API

  constructor(private http: HttpClient) {}

  addRequest(request: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add-request`, request);
  }

  addConcert(concert: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add-concert`, concert);
  }

  addMembers(members: any): Observable<any> { 
    return this.http.post(`${this.apiUrl}/add-members-band`, members);
  }

  getConcertsOrderDistance(userId: number): Observable<any> {
    const body = { user_id: userId }; // Crear el objeto con la propiedad user_id
    return this.http.post(`${this.apiUrl}/get-concert-order-distance`, body);
  }
}
