import { BandService } from './../../shared/band/band.service';
import { RequestService } from './../../shared/request/request.service';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../shared/user/user.service';
import { HeaderComponent } from '../../sharedComponents/header/header.component';
import { Router, RouterLink } from '@angular/router';
import { RequestComponent } from '../../sharedComponents/request/request.component';
import { ConcertComponent } from '../../sharedComponents/concert/concert.component';
import { isPlatformBrowser } from '@angular/common';
import { VariablesService } from '../../shared/variables/variables.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-home-user',
  standalone: true,
  imports: [HeaderComponent, RequestComponent, ConcertComponent, RouterLink],
  templateUrl: './home-user.component.html',
  styleUrl: './home-user.component.css'
})
export class HomeUserComponent implements OnInit{
  
  user: any;
  user_id: number = 0;
  private requests: any = [];
  private concerts: any = [];
  contactoSeleccionado: any = null;
  conciertoSeleccionado: any = null;

  map: any;
  marker: any;

  constructor(
    private userService: UserService,
    private router: Router,
    private requestService: RequestService,
    private bandService: BandService,
    private variableService: VariablesService
  ) {}

  ngOnInit(): void {
    this.user = this.userService.getUser();

    if (!this.userService.isLoggedIn()) {
      this.router.navigateByUrl("/");
    } else {
      this.user_id = this.user.user_id;
    }

    if (this.user_id !== 0) {
      this.requestService.getRequestDistance(this.user_id).subscribe((data: any) => {
        this.requests = data;
      });

      this.bandService.getConcertsOrderDistance(this.user_id).subscribe({
        next: (data: any) => {
          this.concerts = data;
        }
      });
    }
  }



 
  getConcerts(): any[] {
    if (!Array.isArray(this.concerts.concerts)) {
      return [];
    }

    if (this.concerts.concerts.length > 4) {
      return this.concerts.concerts.slice(0, 4);
    } else {
      return this.concerts.concerts;
    }
  }

  getRequest(): any[] {
    if (!Array.isArray(this.requests.requests)) {
      return [];
    }

    if (this.requests.requests && this.requests.requests.length >= 4) {
      return this.requests.requests.slice(0, 4);
    } else {
      return this.requests.requests;
    }
  }

  verConciertos(): void {
    this.router.navigateByUrl('/concerts') ;
  }

    
}
