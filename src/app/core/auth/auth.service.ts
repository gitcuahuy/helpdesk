import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of} from "rxjs";
import {ILoginResponse, IUser, UserLevel} from "@shared/auth/model/user.model";
import {AuthService, IAuthService} from "@shared/auth/service/auth.service";
import {AuthedResponse} from "@shared/auth/model/authedResponse";
import {BaseService} from "@shared/service/base/abstract-service.service";
import {LocalStorageService} from "ngx-webstorage";
import {AngularFirestore} from "@angular/fire/firestore";
import {AngularFireAuth} from "@angular/fire/auth";
import {FIRE_COLLECTION} from "@shared/constants/document.constants";
import {fromPromise} from "rxjs/internal-compatibility";
import {map, switchMap, tap} from "rxjs/operators";
import firebase from "firebase";

@Injectable({
  providedIn: 'root'
})
export class AuthFirebaseService extends AuthService<IUser> implements IAuthService<IUser> {


  private userCollection = this.afs.collection<IUser>(FIRE_COLLECTION.users);
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
      console.log('current user', user?.uid);
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
    this.afAuth.confirmPasswordReset(token, password);
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

  loginUserName(data: { username: string, password: string, isRememberMe: boolean }): Observable<ILoginResponse> {
    return fromPromise(this.afAuth.signInWithEmailAndPassword(data.username, data.password)).pipe(
      switchMap(
        loginResponse => {
          console.log('loginResponse', loginResponse)
          return this.userCollection.doc(loginResponse.user?.uid).get({source: 'default'}).pipe(
            map((user) => {
              if (!user.exists) {
                user.ref.set({
                  username: loginResponse.user?.email ?? "",
                  avatarUrl: loginResponse.user?.photoURL ?? "",
                  emailVerified: loginResponse.user?.emailVerified ?? false,
                  fullName: loginResponse.user?.displayName ?? "",
                })
              }
              const userData = user.data();
              console.log('user', user)
              const response: ILoginResponse = {
                refreshToken: loginResponse.user?.refreshToken ?? "",
                accessToken: "",
                fullName: userData?.fullName,
                avatarUrl: userData?.avatarUrl ?? loginResponse.user?.photoURL,
                id: loginResponse.user?.uid,
                description: userData?.description,
                gender: userData?.gender,
                username: userData?.username,
                status: userData?.status,
                dayOfBirth: userData?.dayOfBirth,
                accountType: userData?.accountType,
                departmentName: userData?.departmentName,
                address: userData?.address,
                userLevel: userData?.userLevel,
                avatarFileId: userData?.avatarFileId,
                lastLoginAt: userData?.lastLoginAt,
                title: userData?.title,
              }
              user.ref.update({lastLoginAt: new Date()});
              return response;
            })
          )
        }
      ));
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

  OAuthLogin(provider: firebase.auth.AuthProvider): Promise<any> {
    return this.afAuth
      .signInWithPopup(provider)
      .then((result) => {
        console.log('dashboard', result)
        // this.router.navigate(['dashboard']);
        // this.SetUserData(result.user);
      })
      .catch((error) => {
        window.alert(error);
      });
  }

  hasAnyAuthority(authorities: string[] | string, userLevel?: UserLevel | UserLevel[]): boolean {
    // TODO: implement
    if (!this._user.value) {
      return false;
    }
    const user = this._user.value;
    if (user?.userPrimary?.isRoot) {
      return true;
    }
    if (userLevel) {
      if (!Array.isArray(userLevel)) {
        userLevel = [userLevel];
      }
      if (user?.userPrimary?.userLevel
        && !userLevel.includes(user?.userPrimary?.userLevel)) {
        return false;
      }
    }
    if (!Array.isArray(authorities)) {
      authorities = [authorities];
    }
    return authorities.some((authority: string) => user?.userPrimary?.grantedPermissions?.includes(authority));
  }
}
