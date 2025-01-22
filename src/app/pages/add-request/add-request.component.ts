import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BandService } from '../../shared/band/band.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../shared/user/user.service';
import { HeaderComponent } from '../../sharedComponents/header/header.component';
import { ToastService } from '../../shared/toast/toast.service';

@Component({
  selector: 'app-request',
  standalone: true,
  imports: [CommonModule , ReactiveFormsModule, HeaderComponent],
  templateUrl: './add-request.component.html',
  styleUrls: ['./add-request.component.css']
})
export class AddRequestComponent implements OnInit {
  requestForm: FormGroup;
  submitted = false;
  error_message = '';
  private band_id = '';

  constructor(
    private formBuilder: FormBuilder,
    private bandService: BandService,
    private router: Router,
    private toastService: ToastService,

    private userService : UserService
  ) {

   this.band_id = this.userService.getBandId();
   if(this.band_id == ""){
    this.router.navigateByUrl("/");
  }
    this.requestForm = this.formBuilder.group({
      title : ['', [Validators.required, Validators.maxLength(50)]],
      new_member_instrument: ['', [Validators.required, Validators.maxLength(30)]],
      instrument_level: ['', [Validators.required, Validators.maxLength(20)]],
      description: ['', [Validators.maxLength(100)]],
      band_id: [this.band_id, [Validators.required]]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    this.submitted = true;
    if (this.requestForm.valid) {
      this.bandService.addRequest(this.requestForm.value).subscribe({
        next: (data) => {
          this.toastService.showToast('Vacante añadida correctamente');
          this.router.navigate(['/']);
        },
        error: (data) => {
          if (data.status === 422) {
            const validationErrors = data.error.errors;
            const errorMessages = Object.values(validationErrors).flatMap((errors: any) => errors);
            const errorMessage = errorMessages.join('\n');
            this.error_message = errorMessage;
            document.getElementById('title')?.focus();
          } else {
            this.error_message = 'Server error';
            document.getElementById('title')?.focus();
          }
        }
      });
    }else{
      this.error_message = 'Error en la validación de los campos';
      document.getElementById('title')?.focus();
    }
  }


  getBandId(): string {
    
    return this.band_id;
  }
}
