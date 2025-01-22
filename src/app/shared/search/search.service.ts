import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private apiUrl = 'http://localhost:8000/api'; // URL de tu API

  constructor(private http: HttpClient) {}

    search(query: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/search?search=${query}`);
    }

    getBandDetails(band_id: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/get-band?band_id=${band_id}`);
    }

    getUserDetails(username: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/get-user?username=${username}`);
    }

    getBandMembers(band_id: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/get-band-members?band_id=${band_id}`);
    }
    
}