import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import {map} from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  jwtHelper = new JwtHelperService();
  decodedToken: any = {};
  private baseUrl = 'http://localhost:5000/api/auth';

  constructor(private http: HttpClient) { }

  login(loginVm: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, loginVm, httpOptions)
    .pipe(
      map((response: any) => {
        if (response) {
          localStorage.setItem('token', response.token);
          this.decodedToken = this.jwtHelper.decodeToken(localStorage.getItem('token'));
        }
      })
    );
  }

  loggedIn() {
    const token = localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token);
  }

  register(registerVm: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, registerVm, httpOptions)
    .pipe();
  }
}
