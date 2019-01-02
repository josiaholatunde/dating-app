import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/service/auth.service';
import { AlertifyService } from 'src/app/service/alertify.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent implements OnInit {
  @Input() user: User;
  constructor(private userService: UserService, private alertifyService: AlertifyService) { }

  ngOnInit() {
  }
  likeUser(recipientId: number) {
    const loggedInUser: User = JSON.parse(localStorage.getItem('user'));
    this.userService.likeUser(loggedInUser.id, recipientId).subscribe(() => {
      this.alertifyService.success('successfully liked user');
    }, err => {
      this.alertifyService.error(err);
    });
  }

}
