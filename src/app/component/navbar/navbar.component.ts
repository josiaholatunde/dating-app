import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  providers: [AuthService]
})
export class NavbarComponent implements OnInit {

  loginVm: any = {};
  isLoggedIn = false;
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }
  login() {
    console.log(this.loginVm);
    this.authService.login(this.loginVm).subscribe(next => {
      this.isLoggedIn = true;
      this.router.navigate(['home']);
    }, err => {
      this.isLoggedIn = false;
      console.log('failed', err);
    });
  }
  logOut() {
    localStorage.removeItem('token');
    this.router.navigate(['login']);
  }

}
