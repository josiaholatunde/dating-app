import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import {map} from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from '../models/user';
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
  currentUser: User;
  private baseUrl = 'http://localhost:5000/api/auth';
  photoUrl = new BehaviorSubject<string>('../../assets/img/user.png');
  currentPhotoUrl = this.photoUrl.asObservable();

  constructor(private http: HttpClient) { }
  changeMemberMainPhoto(photo: string) {
    this.photoUrl.next(photo);
    console.log('i came too', this.photoUrl);

  }

  login(loginVm: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, loginVm, httpOptions)
    .pipe(
      map((response: any) => {
        if (response) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          this.currentUser = response.user;
          this.decodedToken = this.jwtHelper.decodeToken(localStorage.getItem('token'));

          this.changeMemberMainPhoto(this.currentUser.photoUrl);
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
