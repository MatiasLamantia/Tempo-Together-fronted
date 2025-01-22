import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { RegisterComponent } from './pages/register/register.component';
import { RegisterBandComponent } from './pages/register-band/register-band.component';
import { AddBandMemberComponent } from './pages/add-band-member/add-band-member.component';
import { HomeUserComponent } from './pages/home-user/home-user.component';
import { AddRequestComponent } from './pages/add-request/add-request.component';
import { AddConcertComponent } from './pages/add-concert/add-concert.component';
import { AddInstrumentComponent } from './pages/add-instrument/add-instrument.component';
import { DetailsUserBandComponent } from './pages/details-user-band/detalle.component';
import { VerTodosComponent } from './pages/ver-todos/ver-todos.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'registrate', component: RegisterComponent},
    { path: 'editar-usuario', component: RegisterComponent},
    { path: 'registro-banda', component: RegisterBandComponent},
    { path : 'miembros', component: AddBandMemberComponent},
    { path : 'home-usuario' , component: HomeUserComponent},
    { path : "nueva-request", component: AddRequestComponent},
    { path : "nuevo-concierto", component: AddConcertComponent},
    { path : "instrumentos" ,component: AddInstrumentComponent},
    { path: '', component: HomeComponent},
    { path: 'detalles', component: DetailsUserBandComponent},

    { path: 'buscar/:tipo', component: VerTodosComponent},

    { path: '**', redirectTo: '' }

];
