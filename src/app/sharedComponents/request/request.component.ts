import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { VariablesService } from '../../shared/variables/variables.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-request',
  standalone: true,
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.css']
})
export class RequestComponent implements OnInit {

  @Input() request: any;

  constructor(private variablesService : VariablesService, private router : Router) { }

  ngOnInit(): void {
    console.log(this.request);
  }

  enviarContacto() {
    this.variablesService.updateRequest(this.request);
  }

  bandDetalles() {
    this.router.navigate(['/detalles'], { state: { band_id: this.request.band_id } });
  }
}
