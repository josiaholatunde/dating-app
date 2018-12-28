import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { UserService } from '../service/user.service';
import { AlertifyService } from '../service/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MemberDetailResolver implements Resolve<User> {

  constructor(private userService: UserService, private alertify: AlertifyService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot): Observable<User> {
    return this.userService.getUser(route.params['id']).pipe(
      catchError(err => {
        this.alertify.error(err);
        this.router.navigate(['members']);
        return of(null);
      }));
  }
}
