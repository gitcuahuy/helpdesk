import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of} from "rxjs";
import {IUser} from "@shared/auth/model/user.model";
import {AuthService, IAuthService} from "@shared/auth/service/auth.service";
import {AuthedResponse} from "@shared/auth/model/authedResponse";
import {BaseService} from "@shared/service/base/abstract-service.service";
import {LocalStorageService} from "ngx-webstorage";
import {AngularFirestore} from "@angular/fire/firestore";
import {AngularFireAuth} from "@angular/fire/auth";
import {FIRE_COLLECTION} from "@shared/constants/document.constants";
import {fromPromise} from "rxjs/internal-compatibility";
import {tap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthFirebaseService extends AuthService<IUser> implements IAuthService<IUser> {


  userCollection = this.afs.collection(FIRE_COLLECTION.users);
  userData: any; // Save logged in user data
  constructor(
              public afs: AngularFirestore, // Inject Firestore service
              public afAuth: AngularFireAuth, // Inject Firebase auth service
              // protected localStorageService: LocalStorageService
  ) {
    super();
    /* Saving user data in localstorage when
    logged in and setting up null when logged out */
    this.afAuth.authState.subscribe(user => {
      console.log('current user', user);
      if (user) {
        this.userData = user;
        // this.localStorageService.store()
        // localStorage.setItem('user', JSON.stringify(this.userData));
        // JSON.parse(localStorage.getItem('user')!);
      } else {
        // localStorage.setItem('user', 'null');
        // JSON.parse(localStorage.getItem('user')!);
      }
    });
  }

  check(): Observable<boolean> {
    return of(false);
  }

  initForgotPassword(identifyId: string): Observable<any> {
    this.afAuth.sendPasswordResetEmail(identifyId);
    return of(1);
  }
  // sendCodeResetPassword(email: string): Observable<boolean> {
  //   return of(true);
  // }

  resetPassword(token: string, password: string): Observable<boolean> {
    this.afAuth.confirmPasswordReset(token , password);
    return of(true);
  }
  initRefreshToken(): Observable<AuthedResponse> {
    const response: AuthedResponse = {
      refreshToken: "",
      accessToken: ""
    }
    return of(response);
  }

  loginOauth(code: string, PARTNER_ID: string): Observable<AuthedResponse> {
    const response: AuthedResponse = {
      refreshToken: "",
      accessToken: ""
    }
    return of(response);
  }

  loginUserName(username: string, password: string): Observable<AuthedResponse> {
    fromPromise(this.afAuth.signInWithEmailAndPassword(username, password)).subscribe(loginResponse => {
      console.log('login resoult', loginResponse);
    })
    const response: AuthedResponse = {
      refreshToken: "",
      accessToken: ""
    }
    return of(response);
  }

  logout(): Observable<void> {
    return fromPromise(this.afAuth.signOut()).pipe(tap(() => {
      this.user = undefined;
      this.updateToken();
    }));
  }

  profile(): Observable<IUser> {
    return of({});
  }

  changePassword(email: string, oldPassword: string, newPassword: string): Observable<boolean> {
    // this.afAuth.
    return of(true);
  }
  AuthLogin(provider: any) {
    return this.afAuth
      .signInWithPopup(provider)
      .then((result) => {
        console.log(result)
        // this.router.navigate(['dashboard']);
        // this.SetUserData(result.user);
      })
      .catch((error) => {
        window.alert(error);
      });
  }
}
