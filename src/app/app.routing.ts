import {Route} from "@angular/router";
import {Page404Component} from "./modules/public/error/page404/page404.component";
import {LayoutComponent} from "./core/layout/layout.component";
import {LAYOUT} from "@shared/constants/config.constants";
import {LoginComponent} from "./modules/auth/login/login.component";
import {ResetPasswordComponent} from "./modules/auth/reset-password/reset-password.component";
import {VerifyOTPComponent} from "./modules/auth/verify-otp/verify-otp.component";
import {ForgotPasswordComponent} from "./modules/auth/forgot-password/forgot-password.component";
import {NoAuthGuard} from "@shared/auth/guard/no-auth.guard";
import {RegisterComponent} from "./modules/auth/register/register.component";

export const appRoutes: Route[] = [
  // {path: '', pathMatch: 'full', redirectTo: 'dashboard'},
  // {path: 'signed-in-redirect', pathMatch: 'full', redirectTo: 'dashboard'},
  // Auth routes for guests
  {
    path: '',
    // canActivate: [NoAuthGuard],
    // canActivateChild: [NoAuthGuard],
    component: LayoutComponent,
    data: {
      layout: LAYOUT.EMPTY
    },
    children: [
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'reset-password',
        component: ResetPasswordComponent
      },
      {
        path: 'forgot-password',
        component: ForgotPasswordComponent
      },
      {
        path: 'verify-otp',
        component: VerifyOTPComponent
      },
      {
        path: 'register',
        component: RegisterComponent
      }
    ]
  },
  {
    path: 'main',
    component: LayoutComponent,
    data: {
      layout: LAYOUT.MAIN
    },
    loadChildren: () => import('./modules/business/bussiness.module').then(m => m.BussinessModule)
  },
  // Auth routes for authenticated users
  // sign-out
  // unlock
  // Landing routes
  // Admin routes
  // 404 & Catch all
  {
    path: '404', data: {
      layout: 'empty'
    },
    pathMatch: 'full',
    component: Page404Component
  },
  {
    path: '**', redirectTo: '404'
  },
]
