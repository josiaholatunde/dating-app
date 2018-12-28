import { Router } from '@angular/router';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import { AlertifyService } from 'src/app/service/alertify.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [AuthService]
})
export class RegisterComponent implements OnInit {
  registerVm: any = {};

  @Output() showSignUpChange = new EventEmitter();
  constructor(private authService: AuthService, private router: Router, private alertifyService: AlertifyService) { }

  ngOnInit() {
  }
  register() {
   this.authService.register(this.registerVm).subscribe(createdUser => {
     this.alertifyService.success('Registeration was successful');
     this.showSignUpChange.emit(false);
    }, err => this.alertifyService.error('Username exists'));
  }

  cancel() {
    this.showSignUpChange.emit(false);
  }

}
