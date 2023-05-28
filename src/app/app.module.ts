import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {NgxFormValidateModule} from 'ngx-form-validate';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AngularFireModule} from "@angular/fire";
import {AngularFireStorageModule} from "@angular/fire/storage";
import {environment} from "@environment/environment";
import {ExtraOptions, PreloadAllModules, RouterModule} from "@angular/router";
import {AngularFireAuth, AngularFireAuthModule} from "@angular/fire/auth";
import {AngularFireDatabase, AngularFireDatabaseModule} from "@angular/fire/database";
import {appRoutes} from "./app.routing";
import {Page404Component} from './modules/public/error/page404/page404.component';
import {CoreModule} from "./core/core.module";
import {LoginComponent} from './modules/auth/login/login.component';
import {ResetPasswordComponent} from './modules/auth/reset-password/reset-password.component';
import {VerifyOTPComponent} from './modules/auth/verify-otp/verify-otp.component';
import {ForgotPasswordComponent} from './modules/auth/forgot-password/forgot-password.component';
import {ReactiveFormsModule} from "@angular/forms";
import {AuthFirebaseService} from "./core/auth/auth.service";
import {HttpClientModule} from "@angular/common/http";
import {FirebaseStorageService} from "@shared/service/firebase-storage.service";
import {RegisterComponent} from './modules/auth/register/register.component';
import {NgxSpinnerModule} from "ngx-spinner";

const routerConfig: ExtraOptions = {
  preloadingStrategy: PreloadAllModules,
  scrollPositionRestoration: 'enabled',
};
interface NgxSpinnerConfig {
  type?: string;
}
@NgModule({
  declarations: [
    AppComponent,
    Page404Component,
    LoginComponent,
    ResetPasswordComponent,
    VerifyOTPComponent,
    ForgotPasswordComponent,
    RegisterComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    NgxFormValidateModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    RouterModule,
    RouterModule.forRoot(appRoutes, routerConfig),
    CoreModule,
    ReactiveFormsModule,
    // NgxSpinnerModule
    NgxSpinnerModule
    // ToastrModule.forRoot({timeOut: 5000}), // ToastrModule added,
  ],
  providers: [AngularFireAuth, AngularFireDatabase, AuthFirebaseService, FirebaseStorageService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {
}
