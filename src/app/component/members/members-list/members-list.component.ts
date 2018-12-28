import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/service/user.service';
import { User } from 'src/app/models/user';
import { AlertifyService } from 'src/app/service/alertify.service';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-members-list',
  templateUrl: './members-list.component.html',
  styleUrls: ['./members-list.component.css'],
  providers: [UserService, AlertifyService]
})
export class MembersListComponent implements OnInit {

  users: User[] = [];
  constructor(private userService: UserService, private alertify: AlertifyService, private authService: AuthService ) { }
  ngOnInit() {
    this.loadUsers();
  }
  loadUsers() {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
      console.log('Decoded Token', this.authService.decodedToken);
    }, err => this.alertify.error(err));
  }

}
