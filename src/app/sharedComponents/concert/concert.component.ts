import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { VariablesService } from '../../shared/variables/variables.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-concert',
  standalone: true,
  imports: [],
  templateUrl: './concert.component.html',
  styleUrl: './concert.component.css'
})
export class ConcertComponent implements OnInit{

  @Input() concert : any;

  constructor(private variablesService : VariablesService, private router : Router){
  }

  ngOnInit(): void {

this.concert.poster = "http://localhost:8000"+ this.concert.poster;
  }

  concertInfo(){
    this.variablesService.updateConcert(this.concert);
  }



  bandaDetalles(){
    this.router.navigate(['/detalles'], { state: { band_id: this.concert.band_id } });
  }
}
