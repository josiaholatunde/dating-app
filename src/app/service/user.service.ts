import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user';
import { PaginationResult, UserPaginationResult } from '../models/PaginationResult';

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
  getUsers(pageNumber?: number, itemsPerPage?: number, userParams?: any, likesParams?: any): Observable<PaginationResult<User[]>> {
    const paginatedResult: PaginationResult<User[]> = new UserPaginationResult();
    let params = new HttpParams();
    if (pageNumber !== null && itemsPerPage !== null) {
      params = params.append('pageSize', itemsPerPage.toString());
      params = params.append('pageNumber', pageNumber.toString());
    }
    if (userParams != null) {
      params = params.append('minAge', userParams.minAge);
      params = params.append('maxAge', userParams.maxAge);
      params = params.append('gender', userParams.gender);
      params = params.append('orderBy', userParams.orderBy);
    }
    if (likesParams === 'Likers') {
      params = params.append('likers', 'true');
    }
    if (likesParams === 'Likees') {
      params = params.append('likees', 'true');
    }
    return this.http.get<User[]>(this.baseUrl, {observe: 'response', params}).pipe(
      map((response) => {
        paginatedResult.result = response.body;
        if (response.headers.get('Pagination')) {
          paginatedResult.paginationHeader = JSON.parse(response.headers.get('Pagination'));
        }
        return paginatedResult;
      })
    );
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
  likeUser(loggedInUserId, recipientId) {
    return this.http.post(`${this.baseUrl}/${loggedInUserId}/like/${recipientId}`, {}, httpOptions).pipe();
  }

}
