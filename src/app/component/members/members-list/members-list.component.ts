import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/service/user.service';
import { User } from 'src/app/models/user';
import { AlertifyService } from 'src/app/service/alertify.service';
import { AuthService } from 'src/app/service/auth.service';
import { Pagination, PaginationResult } from 'src/app/models/PaginationResult';

@Component({
  selector: 'app-members-list',
  templateUrl: './members-list.component.html',
  styleUrls: ['./members-list.component.css'],
  providers: [UserService, AlertifyService]
})
export class MembersListComponent implements OnInit {

  users: User[] = [];
  gender = [
    {value: 'male', display: 'Males'},
    {value: 'female', display: 'Females'},
  ];
  userParams: any = {};
  user: User = JSON.parse(localStorage.getItem('user'));
  pagination: Pagination;
  constructor(private userService: UserService, private alertify: AlertifyService, private authService: AuthService,
    private route: ActivatedRoute ) { }
  ngOnInit() {
    this.route.data.subscribe( data => {
      this.users = data['user'].result;
      this.pagination = data['user'].paginationHeader;
    });
    this.userParams.gender = this.user.gender === 'male' ? 'female' : 'male';
    this.userParams.minAge = 18;
    this.userParams.maxAge = 99;
    this.userParams.orderBy = 'lastActive';
  }
  resetFilter() {
    this.userParams.gender = this.user.gender === 'male' ? 'female' : 'male';
    this.userParams.minAge = 18;
    this.userParams.maxAge = 99;
    this.loadUsers();
  }
  loadUsers() {
    console.log('Order By', this.userParams.orderBy);

    this.userService.getUsers(this.pagination.currentPage, this.pagination.itemsPerPage, this.userParams)
                      .subscribe((response: PaginationResult<User[]>) => {
                        this.users = response.result;
                        this.pagination = response.paginationHeader;
                      }, err => {
                        this.alertify.error('failed to load users');
                      });
  }
  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
     this.loadUsers();
  }

}
