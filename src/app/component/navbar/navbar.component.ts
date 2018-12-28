import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import { Router } from '@angular/router';
import { AlertifyService } from 'src/app/service/alertify.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  providers: [AuthService]
})
export class NavbarComponent implements OnInit {

  loginVm: any = {};
  isLoggedIn = false;
  constructor(public authService: AuthService, private router: Router, private alertifyService: AlertifyService) { }

  ngOnInit() {
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
    console.log('uu', this.authService.loggedIn());
  }
  logOut() {
    localStorage.removeItem('token');
    this.isLoggedIn = false;
    this.router.navigate(['home']);
    this.alertifyService.success('Logout was successful');
  }

}
