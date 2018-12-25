import { Router } from '@angular/router';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [AuthService]
})
export class RegisterComponent implements OnInit {
  registerVm: any = {};

  @Output() showSignUpChange = new EventEmitter();
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }
  register() {
   this.authService.register(this.registerVm).subscribe(createdUser => {
     console.log(createdUser);
     this.showSignUpChange.emit(false);
    }, err => console.log('something just happened right now'));
  }

  cancel() {
    this.showSignUpChange.emit(false);
  }

}
