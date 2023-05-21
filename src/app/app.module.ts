import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {NgxFormValidateModule} from 'ngx-form-validate';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AngularFireModule} from "@angular/fire";
import {AngularFireStorageModule} from "@angular/fire/storage";
import {environment} from "@environment/environment";
import {ExtraOptions, PreloadAllModules, RouterModule} from "@angular/router";
import {AngularFireAuthModule} from "@angular/fire/auth";
import {AngularFireDatabaseModule} from "@angular/fire/database";
import {appRoutes} from "./app.routing";
import { Page404Component } from './modules/public/error/page404/page404.component';
import {CoreModule} from "./core/core.module";
import { LoginComponent } from './modules/auth/login/login.component';
import { ResetPasswordComponent } from './modules/auth/reset-password/reset-password.component';
import { VerifyOTPComponent } from './modules/auth/verify-otp/verify-otp.component';
import { ForgotPasswordComponent } from './modules/auth/forgot-password/forgot-password.component';

const routerConfig: ExtraOptions = {
  preloadingStrategy: PreloadAllModules,
  scrollPositionRestoration: 'enabled',
};

@NgModule({
  declarations: [
    AppComponent,
    Page404Component,
    LoginComponent,
    ResetPasswordComponent,
    VerifyOTPComponent,
    ForgotPasswordComponent
  ],
  imports: [
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
    CoreModule
    // ToastrModule.forRoot({timeOut: 5000}), // ToastrModule added,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
