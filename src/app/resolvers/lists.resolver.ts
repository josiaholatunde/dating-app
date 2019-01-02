import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { UserService } from '../service/user.service';
import { AlertifyService } from '../service/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ListsResolver implements Resolve<User[]> {

  pageSize = 5;
  pageNumber = 1;
  likesParams = 'Likers';
  constructor(private userService: UserService, private alertify: AlertifyService, private router: Router,
    private authService: AuthService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<User[]> {
    return this.userService.getUsers(this.pageNumber, this.pageSize, null, this.likesParams).pipe(
      catchError(err => {
        this.alertify.error(err);
        this.router.navigate(['members']);
        return of(null);
      }));
  }
}
