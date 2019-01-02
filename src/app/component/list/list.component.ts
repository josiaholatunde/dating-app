import { User } from './../../models/user';
import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/service/user.service';
import { AlertifyService } from 'src/app/service/alertify.service';
import { AuthService } from 'src/app/service/auth.service';
import { ActivatedRoute } from '@angular/router';
import { Pagination, PaginationResult } from 'src/app/models/PaginationResult';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  users: User[];
  pagination: Pagination;
  likesParams: string;
  constructor(private userService: UserService, private alertify: AlertifyService, private authService: AuthService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe( data => {
      this.users = data['user'].result;
      this.pagination = data['user'].paginationHeader;
    });
    this.likesParams = 'Likers';
  }
  loadUsers() {
    this.userService.getUsers(this.pagination.currentPage, this.pagination.itemsPerPage, null, this.likesParams)
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
