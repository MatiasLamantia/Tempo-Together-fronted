import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../shared/user/user.service';
import { CommonModule } from '@angular/common';
import { AddBandMemberComponent } from '../add-band-member/add-band-member.component';
import { state } from '@angular/animations';
import { HeaderComponent } from '../../sharedComponents/header/header.component';
import { ToastService } from '../../shared/toast/toast.service';

@Component({
  selector: 'app-register-band',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule,
    AddBandMemberComponent,
    RouterLink,
    HeaderComponent
  ],
  templateUrl: './register-band.component.html',
  styleUrls: ['./register-band.component.css']
})
export class RegisterBandComponent {
  registerBandForm: FormGroup;
  submitted = false;
  error_message = '';
  band_id = '';
  private latitude = '';
  private longitude = '';
  private user_id : number = 0;
  private user :any;
  finished = false; 

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private toastService: ToastService

  ) {

    if(!this.userService.isLoggedIn()){
      this.router.navigateByUrl("/");
    }

    //Se obtiene el id del usuario
    this.user = this.userService.getUser(); 
    this.user_id = this.user.user_id;

    //Se obtienen las coordenadas
    this.latitude = this.user.latitude;
    this.longitude = this.user.longitude;


    
    
    
    this.registerBandForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(12), Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.maxLength(120)]],
      latitude: [this.latitude, [Validators.required]],
      longitude: [this.longitude, [Validators.required]],
      user_id: [this.user_id, [Validators.required]]
    });
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.registerBandForm.valid) {
      this.userService.registerBand(this.registerBandForm.value).subscribe({
        next: (data: any) => {
          this.userService.addBandId(data.band.band_id);
          this.userService.changeUserType('band');
          this.toastService.showToast('Banda creada correctamente');
          this.finished = true;
        },
          
        error: (data: any) => {
          if (data.status === 422) {
            this.error_message = 'Fallo en la validación de los datos';
          } else {
            this.error_message = 'Error en el servidor';
          }
        }
      });
    }
    else {
      this.error_message = 'Fallo en la validación de los datos';
    }
  }


  getUserId(): number {
    return this.user_id;
  }

  getLatitude(): string {
    return this.latitude;
  }
  getLongitude(): string {
    return this.longitude;
  }

}
