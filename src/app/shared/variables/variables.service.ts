import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VariablesService {
  private requestSubject = new BehaviorSubject<any>(null);
  request$ = this.requestSubject.asObservable();
  concert$ = this.requestSubject.asObservable();

  constructor() { }

  updateRequest(request: any) {
    this.requestSubject.next(request);
  }

  getRequest() {
    return this.request$.pipe();
  }

  updateConcert(concert: any) {
    this.requestSubject.next(concert);
  }

  getConcert() {
    return this.concert$.pipe();
  }
}
