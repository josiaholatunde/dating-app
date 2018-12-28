import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from 'src/app/models/user';
import { AlertifyService } from 'src/app/service/alertify.service';
import { UserService } from 'src/app/service/user.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {

  @ViewChild('editForm') editForm: NgForm;
  user: User;
  constructor(private route: ActivatedRoute, private alertifyService: AlertifyService, private userService: UserService ) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.user = data['user'];
    });
  }
  updateUser() {
    console.log('was here oo', this.user);
    this.userService.updateUser(this.user.id, this.user).subscribe(user => {
      this.alertifyService.success('Profile updated successfully');
      this.editForm.reset(this.user);
    }, err => {
      this.alertifyService.error('Updating profile failed');
    });
  }

}
