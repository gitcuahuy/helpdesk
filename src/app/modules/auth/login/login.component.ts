import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AuthFirebaseService} from "../../../core/auth/auth.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import firebase from "firebase";
import GoogleAuthProvider = firebase.auth.GoogleAuthProvider;
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";

export const FORM_FIELDS = {
  username: 'username',
  password: 'password',
  rememberMe: 'rememberMe'
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {
  readonly loginForm: FormGroup;
  readonly FORM_FIELDS = FORM_FIELDS;

  constructor(private authService: AuthFirebaseService,
              private _cdr: ChangeDetectorRef,
              private router: Router,
              private toastrService: ToastrService,
              private _fb: FormBuilder) {
    this.loginForm = this._fb.group({
      [FORM_FIELDS.username]: ['', [Validators.required]],
      [FORM_FIELDS.password]: ['', [Validators.required]],
      [FORM_FIELDS.rememberMe]: [true]
    });
  }

  ngOnInit(): void {
    // this.authService.logout().subscribe();

  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      console.error('onSubmit', this.loginForm);
      return;
    }
    this.authService.loginUserName({username: this.loginForm.get(FORM_FIELDS.username)?.value,
      password: this.loginForm.get(FORM_FIELDS.password)?.value,
      isRememberMe: this.loginForm.get(FORM_FIELDS.rememberMe)?.value})
      .subscribe(res => {
        this.toastrService.success('Login success');
        this.router.navigate(['/dashboard']);
    });
  }

  loginGoogle(): void {
    const authProvider = new GoogleAuthProvider();
    authProvider.setCustomParameters({
      prompt: "select_account"
    });
    this.authService.OAuthLogin(authProvider).subscribe(res => {
      console.log('res oauth goolge', res);
    })
  }

  loginFacebook(): void {
    const authProvider = new firebase.auth.FacebookAuthProvider();
    this.authService.OAuthLogin(authProvider).subscribe(res => {
      console.log('res', res);
    })
  }
}
