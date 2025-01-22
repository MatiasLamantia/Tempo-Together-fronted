import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BandService } from '../../shared/band/band.service';
import { UserService } from '../../shared/user/user.service';
import { SearchService } from '../../shared/search/search.service';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../sharedComponents/header/header.component';
import { ToastService } from '../../shared/toast/toast.service';

@Component({
  selector: 'app-add-band-member',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HeaderComponent],
  templateUrl: './add-band-member.component.html',
  styleUrls: ['./add-band-member.component.css']
})
export class AddBandMemberComponent implements OnInit {
  addMemberForm: FormGroup;
  error_message: string | null = null;
  band_id: any; // Set this as appropriate for your app

  membersEdit: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private bandService: BandService,
    private router: Router,
    private userService: UserService,
    private searchService: SearchService,
    private toastService: ToastService
  ) {
    if (!this.userService.isLoggedIn()) {
      this.router.navigateByUrl("/");
    }

    // Get the band ID from the user service
    this.band_id = this.userService.getBandId();

    this.addMemberForm = this.formBuilder.group({
      band_id: [this.band_id, Validators.required], // Band ID
      members: this.formBuilder.array([]) // Inicializa el FormArray
    });
  }

  ngOnInit() {
    this.loadMembers();
  }

  loadMembers() {
    this.searchService.getBandMembers(this.band_id).subscribe({
      next: (data: any) => {
        this.membersEdit = data.members;
        if (this.membersEdit.length > 0) {
          this.membersEdit.forEach(member => {
            this.addExistingMember(member);
          });
        } else {
          this.addMember(); // Agrega un miembro por defecto si no hay miembros
        }
      },
      error: (err) => {
        console.error('Error añadiendo miembros', err);
        this.addMember(); // Agrega un miembro por defecto en caso de error
      }
    });
  }

  // Método para agregar un nuevo miembro al FormArray
  addMember(): void {
    const memberGroup = this.formBuilder.group({
      id: [null], // Campo para ID del miembro (nulo para nuevos miembros)
      name: ['', Validators.required],
      instrument: ['', Validators.required],
    });
    this.membersArray.push(memberGroup);
  }

  // Método para agregar un miembro existente al FormArray
  addExistingMember(member: any): void {
    const memberGroup = this.formBuilder.group({
      id: [member.id], // Campo para ID del miembro existente
      name: [member.name, Validators.required],
      instrument: [member.instrument, Validators.required],
    });
    this.membersArray.push(memberGroup);
  }

  // Getter para acceder al FormArray
  get membersArray(): FormArray {
    return this.addMemberForm.get('members') as FormArray;
  }

  onSubmit(): void {
    if (this.addMemberForm.valid) {
      this.bandService.addMembers(this.addMemberForm.value).subscribe({
        next: (data: any) => {
          this.error_message = null;
          this.toastService.showToast('Miembros agregados correctamente');
          this.router.navigateByUrl('/home-usuario');
        },
        error: (error: any) => {
          console.error('Error', error);
          this.error_message = 'Error en el servidor, por favor intenta más tarde';
        }
      });
    } else {
      this.error_message = 'Error en la validación de los campos, debe añadir al menos un miembro y este debe tener nombre e instrumento asignado';
    }
  }

  agregarMiembro(): void {
    this.addMember();
  }
}
