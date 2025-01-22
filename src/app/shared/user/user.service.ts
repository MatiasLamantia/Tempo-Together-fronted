import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8000/api'; // URL de tu API

  constructor(private http: HttpClient) {
    this.loadUserFromLocalStorage();
  }
  private saveBandIdToLocalStorage(bandId: any) {
    console.log("bandId", bandId);
    localStorage.setItem('bandId', JSON.stringify(bandId));
  }

  private saveUserToLocalStorage(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  private loadBandIdFromLocalStorage() {
    const bandIdJson = localStorage.getItem('bandId');
    if (bandIdJson !== null && bandIdJson !== undefined && bandIdJson !== 'undefined') {
      return JSON.parse(bandIdJson);
    }
    return null;
  }

  private loadUserFromLocalStorage() {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      return JSON.parse(userJson);
    }
    return null;
  }

  private clearBandIdFromLocalStorage() {
    localStorage.removeItem('bandId');
  }
  private clearUserFromLocalStorage() {
    localStorage.removeItem('user');
  }

  createUser(user: any) {
    this.saveUserToLocalStorage(user);
  }

  getUser() {
    return this.loadUserFromLocalStorage();
  }

  getUserId(){
    let user = this.loadUserFromLocalStorage();
     user = user.user_id;
    return user;
  }

  getUserIcon(){
    let user = this.loadUserFromLocalStorage();
     user = "http://localhost:8000"+ user.icon;
    return user;
  }

  isLoggedIn() {
    return this.loadUserFromLocalStorage() != null;
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((response: any) => {
        this.createUser(response.user); // Suponiendo que la respuesta contiene la información del usuario
      })
    );
  }

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  editUser(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/edit-user`, user);
  }

  registerBand(band: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register-band`, band);
  }

  addBandId(bandId: any) {
    this.saveBandIdToLocalStorage(bandId);
  }

  changeUserType(userType: string) {
    const user = this.getUser();
    user.type = userType;
    this.createUser(user);
  }
  getBandId() {
    return this.loadBandIdFromLocalStorage();
  }
  logout() {
    this.clearUserFromLocalStorage();
    this.clearBandIdFromLocalStorage();
    
  }

  getUserDetails(username : string){
    return this.http.get(`${this.apiUrl}/get-user?username=${username}`);
  }
}
