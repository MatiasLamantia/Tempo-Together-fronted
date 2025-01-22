import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InstrumentService {
  private apiUrl = 'http://localhost:8000/api'; // URL de tu API

  constructor(private http: HttpClient) {}

  getInstruments(): Observable<any> {
    return this.http.get(`${this.apiUrl}/get-instruments`);
  }

  addInstruments(instrument: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add-instruments-user`, instrument);
  }

  getInstrumentsUser(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/get-instruments-user/?user_id=${userId}`);
  }
}
