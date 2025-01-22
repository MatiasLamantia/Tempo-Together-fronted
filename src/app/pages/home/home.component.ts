import { RequestService } from './../../shared/request/request.service';
import { Component, signal } from '@angular/core';
import { HeaderComponent } from '../../sharedComponents/header/header.component';
import { UserService } from '../../shared/user/user.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent,RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  userId = signal(0);
  constructor(private userService: UserService, private router : Router, private requestService : RequestService) { 
    if(this.userService.isLoggedIn()){
      this.router.navigateByUrl("/home-usuario");
    }
  }

  ngOninit(){
    this.getRequestLocation();
  }


   getRequestLocation(){
  }

}
