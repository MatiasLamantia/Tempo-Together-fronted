import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../shared/user/user.service';
import { SearchService } from '../../shared/search/search.service';
import { HeaderComponent } from '../../sharedComponents/header/header.component';
import { ConcertComponent } from '../../sharedComponents/concert/concert.component';
import { CommonModule } from '@angular/common';
import { RequestComponent } from '../../sharedComponents/request/request.component';

@Component({
  selector: 'app-detalle',
  standalone: true,
  imports: [HeaderComponent, ConcertComponent, CommonModule, RequestComponent],
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetailsUserBandComponent {

  username: string = "";
  isBand: boolean = false;
  respuesta : any = [];
  band_id: number = -1;

  emptyConcerts = true;
  emptyRequests = true;
  
  constructor(private router: Router, private http: HttpClient, private userService: UserService, private searchService: SearchService) { 
    // Se recibe el username que se ha enviado a través de un state en el history

    if(history.state.username){
      this.username = history.state.username;
    }
    else if(history.state.band_id){
      this.band_id = history.state.band_id;
      this.isBand = true;
    }

    this.getDetails();
  }

  getDetails() {
    if (this.band_id !== -1 && this.isBand) {
      this.searchService.getBandDetails(this.band_id).subscribe({
        next: (response) => {

          //Se le añaden los campos que faltan a las request
          response.band.requests.forEach((request: any) => {
            request.request_description = request.description;
            request.name = response.band.name;
            request.email = response.band.email;
            request.telephone = response.band.telephone;
            delete request.description;
          });

          //se le añade el campo name a los conciertos
          response.band.concerts.forEach((concert: any) => {
            concert.name = response.band.name;
          });

          this.emptyConcerts = response.band.concerts.length == 0;
          this.emptyRequests = response.band.requests.length == 0;

          this.respuesta = response.band;
        },
        error: (error) => {
          console.error(error);
        }
      });
    }else{
      this.searchService.getUserDetails(this.username).subscribe({
        next: (response) => {
          response.user.icon = "http://localhost:8000" + response.user.icon;
          this.respuesta = response.user;
        },
        error: (error) => {
          console.error(error);
        }
      });
    }

    }


    src(icon : string){
      return "assets/icons/"+ icon;
    }
    level(level : string){
      if(level == "1"){
        return "Principiante";
      }else if(level == "2"){
        return "Intermedio";
      }else if(level == "3"){
        return "Avanzado";
      }else{
        return "Profesional";
      }
    }
  }

