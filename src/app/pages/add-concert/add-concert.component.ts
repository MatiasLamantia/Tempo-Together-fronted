import { Component, OnInit, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as L from 'leaflet';
import { BandService } from '../../shared/band/band.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { UserService } from '../../shared/user/user.service';
import { HeaderComponent } from '../../sharedComponents/header/header.component';
import { ToastService } from '../../shared/toast/toast.service';

@Component({
  selector: 'app-add-concert',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HeaderComponent],
  templateUrl: './add-concert.component.html',
  styleUrls: ['./add-concert.component.css']
})
export class AddConcertComponent implements  AfterViewInit {
  concertForm: FormGroup;
  submitted = false;
  error_message = '';
  map: any;
  marker: any;
  bandId: number;
  posterFile: File | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private bandservice: BandService,
    private router: Router,
    private user: UserService,
    private toastService: ToastService,

    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.concertForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.maxLength(30) , Validators.minLength(5)]],
      date: ['', Validators.required],
      time: ['', [Validators.required, Validators.pattern('([01]?[0-9]|2[0-3]):[0-5][0-9]')]],
      place: ['', [Validators.required, Validators.maxLength(50)]],
      desc: ['', [Validators.maxLength(100)]],
      latitude: ['', Validators.required],
      longitude: ['', Validators.required],
      poster: [null]
    });

    // Recibir bandId del estado de la navegación
    this.bandId = this.user.getBandId();
  
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initializeMap();
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
      this.map = L.map('map').setView([40.4167, -3.70325], 6);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map);

      this.map.on('click', (e: any) => {
        const { lat, lng } = e.latlng;
        if (this.marker) {
          this.map.removeLayer(this.marker);
        }
        this.marker = L.marker([lat, lng], { icon: greenIcon }).addTo(this.map);
        this.concertForm.patchValue({
          latitude: lat,
          longitude: lng
        });
      });
    } else {
      console.error('Map container not found');
    }
  }

  onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      this.posterFile = event.target.files[0];
    }
  }

  onSubmit(): void {
    console.log(this.concertForm);
    this.submitted = true;
    if (this.concertForm.valid) {
      const formData = new FormData();
      formData.append('title', this.concertForm.get('title')?.value);
      formData.append('date', this.concertForm.get('date')?.value);
      formData.append('time', this.concertForm.get('time')?.value);
      formData.append('place', this.concertForm.get('place')?.value);
      formData.append('desc', this.concertForm.get('desc')?.value);
      formData.append('latitude', this.concertForm.get('latitude')?.value);
      formData.append('longitude', this.concertForm.get('longitude')?.value);
      formData.append('band_id', this.bandId.toString());

      if (this.posterFile) {
        formData.append('poster', this.posterFile);
      }

      this.bandservice.addConcert(formData).subscribe({
        next: (data: any) => {
          this.toastService.showToast('Concierto añadido correctamente');
          this.router.navigate(['/']);
        },
        error: (data: any) => {
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
  
}
