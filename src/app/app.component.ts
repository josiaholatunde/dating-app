import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from './service/auth.service';
import { User } from './models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  jwtHelper = new JwtHelperService();
  currentUser: User;
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    const user: User = JSON.parse(localStorage.getItem('user'));
    if (token) {
      this.authService.decodedToken = this.jwtHelper.decodeToken(token);
    }
    if (user) {
      this.authService.currentUser = user;
      console.log('user photo', user.photoUrl);
      this.authService.changeMemberMainPhoto(user.photoUrl);
    }
  }

}
