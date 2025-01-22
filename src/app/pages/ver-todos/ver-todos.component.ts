import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderComponent } from '../../sharedComponents/header/header.component';
import { BandService } from '../../shared/band/band.service';
import { RequestService } from '../../shared/request/request.service';
import { UserService } from '../../shared/user/user.service';
import { VariablesService } from '../../shared/variables/variables.service';
import { ConcertComponent } from '../../sharedComponents/concert/concert.component';
import { RequestComponent } from '../../sharedComponents/request/request.component';

@Component({
  selector: 'app-ver-todos',
  standalone: true,
  imports: [HeaderComponent, ConcertComponent, RequestComponent],
  templateUrl: './ver-todos.component.html',
  styleUrls: ['./ver-todos.component.css']
})
export class VerTodosComponent implements OnInit {
  tipo: string = "";
  resultados: any[] = [];
  user_id: number = -1;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private requestService: RequestService,
    private bandService: BandService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.user_id = this.userService.getUserId();

    this.route.paramMap.subscribe(params => {
      this.tipo = params.get('tipo') || '';
      if (this.tipo !== 'conciertos' && this.tipo !== 'requests') {
        this.router.navigateByUrl('/home-user');
        return;
      }

      if (this.tipo === 'conciertos') {
        this.bandService.getConcertsOrderDistance(this.user_id).subscribe({
          next: (data: any) => {
            this.resultados = data.concerts;
            console.log(data);
          },
          error: (error: any) => {
            console.error(error);
          }
        });
      } else if (this.tipo === 'requests') {
        this.requestService.getRequestDistance(this.user_id).subscribe({
          next: (data: any) => {
            this.resultados = data.requests;
          },
          error: (error: any) => {
            console.error(error);
          }
        });
      }
    });
  }

  onOptionChange(event: any): void {
    const selectedValue = event.target.value;
    this.router.navigateByUrl(`/buscar/${selectedValue}`);
  }


}
