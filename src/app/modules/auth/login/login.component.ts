import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AuthFirebaseService} from "../../../core/auth/auth.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
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
              private _fb: FormBuilder) {
    this.loginForm = this._fb.group({
      [FORM_FIELDS.username]: ['', [Validators.required]],
      [FORM_FIELDS.password]: ['', [Validators.required]],
      [FORM_FIELDS.rememberMe]: [true]
    });
  }

  ngOnInit(): void {
  }

}
