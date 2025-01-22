import { Component, OnInit, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../shared/user/user.service';
import { Router, RouterLink } from '@angular/router';
import * as L from 'leaflet';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HeaderComponent } from '../../sharedComponents/header/header.component';
import { ToastService } from '../../shared/toast/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements AfterViewInit {
  registerForm: FormGroup;
  submitted = false;
  error_message = '';
  map: any;
  marker: any;
  selectedFile: File | null = null;
  editUser = false;
  latUser = 0;
  longUser = 0;
  iconUser = '';
  originalValues: any;
  user_id = '';

 username = '';
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    private toastService: ToastService

  ) {
    if (this.userService.isLoggedIn()) {
      const user = this.userService.getUser();
      if (user) {
        this.editUser = true;
        this.username = user.username;
        this.user_id = user.user_id;
      }
    }
    
    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.maxLength(12)]],
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      lastname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]],
      age: ['', [Validators.required, Validators.max(99)]],
      telephone: ['', [Validators.minLength(9), Validators.maxLength(9)]],
      latitude: ['', Validators.required],
      longitude: ['', Validators.required],
      type: ['', Validators.required],
      icon: [null]
    });

    if (this.editUser) {
      this.registerForm.get('password')?.clearValidators();
      this.registerForm.get('password')?.updateValueAndValidity();
    }
  }

  ngAfterViewInit() {
   
    if (isPlatformBrowser(this.platformId)) {
      if (this.editUser) {
        this.userService.getUserDetails(this.username).subscribe({
          next: (data : any) => {
            data = data.user;
             this.registerForm.patchValue({
              username: data.username,
              name: data.name,
              lastname: data.lastname,
              email: data.email,
              age: data.age,
              telephone: data.telephone,
              latitude: data.latitude,
              longitude: data.longitude,
              type: data.type
            });    
            this.latUser = data.latitude;
            this.longUser = data.longitude;    
            this.iconUser = "http://localhost:8000"+ data.icon;
            this.initializeMap();
            this.originalValues = this.registerForm.value;
 
          },
          error: (error : any) => {
            console.error('Error loading user data', error);
          }
        });
      }else{
        this.initializeMap();
      }
    }
  }

  initializeMap(): void {
    var greenIcon = L.icon({
      iconUrl: 'assets/icons/pin-map.png',
      iconSize: [55, 55],
      shadowSize: [50, 64],
      iconAnchor: [22, 55],
      shadowAnchor: [4, 62],
      popupAnchor: [-3, -76]
    });

    const mapContainer = document.getElementById('map');
    if (mapContainer) {
      if (this.editUser) {
        this.map = L.map('map').setView([this.latUser, this.longUser], 6);
        this.marker = L.marker([this.latUser, this.longUser], { icon: greenIcon }).addTo(this.map);
      }
      else {
        this.map = L.map('map').setView([40.4167, -3.70325], 6);
      }

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map);

      this.map.on('click', (e: any) => {
        const { lat, lng } = e.latlng;
        if (this.marker) {
          this.map.removeLayer(this.marker);
        }
        this.marker = L.marker([lat, lng], { icon: greenIcon }).addTo(this.map);
        this.registerForm.patchValue({
          latitude: lat,
          longitude: lng
        });
      });
    } else {
      console.error('Map container not found');
    }
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.registerForm.patchValue({
        icon: file
      });
    }
  }

  handleError(data: any) {
    if (data.status === 422) {
      const validationErrors = data.error.errors;
      const errorMessages = Object.values(validationErrors).flatMap((errors: any) => errors);
      const errorMessage = errorMessages.join('\n');
      this.error_message = errorMessage;
    } else {
      this.error_message = 'Server error';
    }
    document.getElementById('username')?.focus();
  }
  
  

  onSubmit(): void {
    this.submitted = true;
    this.registerForm.patchValue({
      type: 'musician'
    });
  
    if (this.registerForm.valid) {
      const formData = new FormData();
  
      // Si el icono es null, eliminarlo del formData
      if (this.registerForm.get('icon')?.value !== null && this.selectedFile) {
        formData.append('icon', this.selectedFile);
      }
  
      if (!this.editUser) {
        // Agrega todos los campos al FormData para el registro
        Object.keys(this.registerForm.controls).forEach(key => {
          if (key !== 'icon') {
            formData.append(key, this.registerForm.get(key)?.value);
          }
        });
  
        this.userService.register(formData).subscribe({
          next: (data) => {
            this.userService.createUser(data.user);
            this.toastService.showToast('Usuario registrado correctamente');
            this.router.navigateByUrl('/instrumentos');
          },
          error: (data) => {
            this.handleError(data);
          }
        });
      } else {
        // Agrega los campos modificados al FormData para la edición
        Object.keys(this.registerForm.controls).forEach(key => {
          const controlValue = this.registerForm.get(key)?.value;
          const originalValue = this.originalValues[key];
  
          if (controlValue !== originalValue) {
            formData.append(key, controlValue);
          }
        });
  
        formData.append('user_id', this.user_id);
        formData.delete('type');
  
        this.userService.editUser(formData).subscribe({
          next: (data) => {
            this.userService.createUser(data.user);
            this.toastService.showToast('Usuario actualizado correctamente');
            this.router.navigateByUrl('/home-user');
          },
          error: (data) => {
            this.handleError(data);
          }
        });
      }
    } else {
      this.error_message = 'Error en la validación de los campos';
      document.getElementById('username')?.focus();
    }
  }
  
  
}