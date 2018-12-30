import { Router } from '@angular/router';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import { AlertifyService } from 'src/app/service/alertify.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [AuthService]
})
export class RegisterComponent implements OnInit {
  registerVm: User;
  registerForm: FormGroup;
  bsConfig: Partial<BsDatepickerConfig>;

  @Output() showSignUpChange = new EventEmitter();
  constructor(private authService: AuthService, private router: Router, private fb: FormBuilder,
    private alertifyService: AlertifyService) { }

  ngOnInit() {
   this.createRegisterationForm();
   this.bsConfig = {
     containerClass: 'theme-red'
   };
  }
  createRegisterationForm() {
    this.registerForm = this.fb.group({
      gender: ['male'],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      knownAs: ['', Validators.required],
      dateOfBirth: [null, Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }, {validators: this.passwordMatchValidator});
  }
  usingFormGroup() {
    this.registerForm  = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [ Validators.required, Validators.minLength(4), Validators.maxLength(8)]),
      confirmPassword: new FormControl('', Validators.required),
    }, this.passwordMatchValidator);
  }


  passwordMatchValidator(g: FormGroup) {
    return g.get('password').value === g.get('confirmPassword').value ? null : {'mismatch': true};
  }
  register() {
    if (this.registerForm.valid) {
      this.registerVm = { ...this.registerForm.value };
      this.authService.register(this.registerVm).subscribe(createdUser => {
         this.alertifyService.success('Registeration was successful');
         this.showSignUpChange.emit(false);
        }, err => this.alertifyService.error('Username exists'));
    }
  }

  cancel() {
    this.showSignUpChange.emit(false);
  }

}
