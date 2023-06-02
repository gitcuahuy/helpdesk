import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of, throwError} from "rxjs";
import {ILoginResponse, IUser, UserLevel} from "@shared/auth/model/user/user.model";
import {AuthService, IAuthService} from "@shared/auth/service/auth.service";
import {AuthedResponse} from "@shared/auth/model/authedResponse";
import {BaseService} from "@shared/service/base/abstract-service.service";
import {LocalStorageService} from "ngx-webstorage";
import {AngularFirestore} from "@angular/fire/firestore";
import {AngularFireAuth} from "@angular/fire/auth";
import {FIRE_COLLECTION} from "@shared/constants/document.constants";
import {fromPromise} from "rxjs/internal-compatibility";
import {catchError, map, mergeMap, switchMap, take, tap} from "rxjs/operators";
import firebase from "firebase";
import {RegisterUserRequest} from "@shared/auth/model/user/register-user.request";
import {UserService} from "@shared/service/user.service";

@Injectable({
  providedIn: 'root'
})
export class AuthFirebaseService extends AuthService<IUser> implements IAuthService<IUser> {


  private userCollection = this.afs.collection<IUser>(FIRE_COLLECTION.users);

  // userData: firebase.User | null = null; // Save logged in user data
  constructor(
    public afs: AngularFirestore, // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    private userService: UserService,
    // protected localStorageService: LocalStorageService
  ) {
    super();
    /* Saving user data in localstorage when
    logged in and setting up null when logged out */
    this.afAuth.authState.pipe(
      mergeMap(user => {
        if (user) {
          return this.userCollection.doc(user.uid).get({source: 'default'}).pipe(
            map((doc) => {
              if (!doc.exists) {
                console.warn('user not found');
                return null;
              }
              return doc.data() as IUser;
            })
          );
        }
        return of(null);
      }),
      catchError(err => {
        console.error(err, 'errorxxxxx');
        return of(null);
      })
    ).subscribe(user => {
      this.user = user;
      /// check location
      if (navigator.geolocation && user?.id) {
        navigator.geolocation.getCurrentPosition((position) => {
          //check location
          if (user?.latitude !== position.coords.latitude || user?.longitude !== position.coords.longitude) {
            this.userCollection.doc(user.id).get().pipe(take(1)).subscribe(doc => {
              doc.ref.update({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              });
            });
          }
        });
      } else {
        console.warn('Geolocation is not supported by this browser.');
      }
    });
  }
  getUserLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log(position);
      });
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  }
  check(): Observable<boolean> {
    return this.user$.pipe(map(user => !!user));
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
              // const userData = user.data();
              const response: ILoginResponse = {
                refreshToken: loginResponse.user?.refreshToken ?? "",
                accessToken: "",
                // fullName: userData?.fullName,
                // avatarUrl: userData?.avatarUrl ?? loginResponse.user?.photoURL,
                // id: loginResponse.user?.uid,
                // description: userData?.description,
                // gender: userData?.gender,
                // username: userData?.username,
                // status: userData?.status,
                // dayOfBirth: userData?.dayOfBirth,
                // accountType: userData?.accountType,
                // departmentName: userData?.departmentName,
                // address: userData?.address,
                // userLevel: userData?.userLevel,
                // avatarFileId: userData?.avatarFileId,
                // lastLoginAt: userData?.lastLoginAt,
                // title: userData?.title,
                // emailVerified: userData?.emailVerified,
                // background: userData?.background,
                // userPrimary: userData?.userPrimary,
                // deleted: userData?.deleted,
              }
              user.ref.update({lastLoginAt: new Date()});
              // this.user = response;
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

  OAuthLogin(provider: firebase.auth.AuthProvider): Observable<IUser> {
    return fromPromise(this.afAuth.signInWithPopup(provider)).pipe(
      switchMap(oauthResponse => {
        if (!oauthResponse.user?.uid) {
          return throwError('login failed');
        }
        return this.userService.getUserById(oauthResponse.user?.uid).pipe(take(1));
      })
    );
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

  registerUser(loginRequest: RegisterUserRequest): Observable<IUser> {

    return fromPromise(this.afAuth.createUserWithEmailAndPassword(loginRequest.username, loginRequest.password))
      .pipe(
        switchMap(
          userCredential => {
            const id = userCredential.user?.uid;
            return fromPromise(this.userCollection.doc(id).set({
              username: userCredential.user?.email ?? "",
              fullName: loginRequest.fullName,
              avatarUrl: userCredential.user?.photoURL ?? "",
              emailVerified: userCredential.user?.emailVerified ?? false,
              id: id,
              deleted: false,
            })).pipe(map(() => {
              return {}
            }))
          }))
  }
}
