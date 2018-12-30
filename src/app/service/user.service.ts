import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { User } from '../models/user';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};
@Injectable({
  providedIn: 'root'
})
export class UserService {

  baseUrl = 'http://localhost:5000/api/users';
  constructor(private http: HttpClient) { }
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl).pipe();
  }
  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/${id}`).pipe();
  }
  updateUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/${id}`, user, httpOptions).pipe();
  }
  setMainPhoto(userId: number, photoId: number) {
    return this.http.post(`${this.baseUrl}/${userId}/photos/${photoId}/SetMain`, {}, httpOptions).pipe();
  }
  deletePhoto(userId: number, photoId: number) {
    return this.http.delete(`${this.baseUrl}/${userId}/photos/${photoId}`).pipe();

  }

}
