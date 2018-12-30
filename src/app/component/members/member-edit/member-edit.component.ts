import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from 'src/app/models/user';
import { AlertifyService } from 'src/app/service/alertify.service';
import { UserService } from 'src/app/service/user.service';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {

  @ViewChild('editForm') editForm: NgForm;
  user: User;
  photoUrl: string;
  constructor(private route: ActivatedRoute, private alertifyService: AlertifyService, private userService: UserService,
     private authService: AuthService ) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.user = data['user'];
    });
    this.authService.currentPhotoUrl.subscribe(photoUrl => this.photoUrl = photoUrl);
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
