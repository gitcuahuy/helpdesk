import {Component, OnInit} from '@angular/core';
import {AuthFirebaseService} from "../../../core/auth/auth.service";
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {RegisterUserRequest} from "@shared/auth/model/user/register-user.request";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";

const FORM_FIELDS = {
  username: 'username',
  password: 'password',
  confirmPassword: 'confirmPassword',
  fullName: 'fullName',
  agree: 'agree'
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  readonly FORM_FIELDS = FORM_FIELDS;

  constructor(private authService: AuthFirebaseService,
              private toastService: ToastrService,
              private router: Router,
              private _fb: FormBuilder) {
    this.registerForm = this._fb.group({
      [FORM_FIELDS.username]: ['', [Validators.required, Validators.email]],
      [FORM_FIELDS.password]: ['', [Validators.required]],
      [FORM_FIELDS.confirmPassword]: ['', [Validators.required, this.validateConfirmPassword]],
      [FORM_FIELDS.fullName]: ['', [Validators.required]],
      [FORM_FIELDS.agree]: [false, [Validators.requiredTrue]]
    });
    this.registerForm.get(FORM_FIELDS.password)?.valueChanges.subscribe(() => {
      this.registerForm.get(FORM_FIELDS.confirmPassword)?.updateValueAndValidity({emitEvent: false});
    });
  }

  // validate confirm password and password
  validateConfirmPassword( target: string): ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.root.get(target)?.value;
      const confirmPassword = control.value;
      return password !== confirmPassword ? {notMatch: true} : null;
    }
  }

  ngOnInit(): void {
  }

  register(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      console.error('invalid form', this.registerForm);
      return;
    }
    const request: RegisterUserRequest = {
      username: this.registerForm.get(FORM_FIELDS.username)?.value,
      password: this.registerForm.get(FORM_FIELDS.password)?.value,
      fullName: this.registerForm.get(FORM_FIELDS.fullName)?.value,
      signUpType: 'email'
    }
    this.authService.registerUser(request).subscribe((res) => {
      console.log('register success', res);
      this.toastService.success('Register success', 'Success', {
        timeOut: 3000,
      });
      this.router.navigate(['/login']);
    });
  }
}
