import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import { Router } from '@angular/router';
import { AlertifyService } from 'src/app/service/alertify.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {

  jwtHelper = new JwtHelperService();
  loginVm: any = {};
  isLoggedIn = false;
  photoUrl: string;
  constructor(private authService: AuthService, private router: Router, private alertifyService: AlertifyService) { }

  ngOnInit() {
    this.authService.currentPhotoUrl.subscribe(photoUrl => this.photoUrl = photoUrl);
  }
  login() {
    console.log(this.loginVm);
    this.authService.login(this.loginVm).subscribe(next => {
      this.isLoggedIn = true;
      this.alertifyService.success('Login was successful');
    }, err => {
      this.alertifyService.error('Invalid username or password ');
    }, () => {
      this.router.navigate(['members']);
    });
  }

  loggedIn() {
    return this.authService.loggedIn();
  }
  displayLoggedInUserName() {
    return this.jwtHelper.decodeToken(localStorage.getItem('token')).unique_name;
  }
  logOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.isLoggedIn = false;
    this.authService.decodedToken = null;
    this.authService.currentUser = null;
    this.router.navigate(['home']);
    this.alertifyService.success('Logout was successful');
  }

}
