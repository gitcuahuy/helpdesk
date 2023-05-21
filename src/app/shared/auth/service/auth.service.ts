import {BehaviorSubject, Observable} from "rxjs";
import {BaseCredential} from "@shared/auth/model/base-cridential.model";
import {AuthedResponse} from "@shared/auth/model/authedResponse";
import {LocalStorageService} from "ngx-webstorage";
import {LOCAL_STORAGE_KEYS} from "@shared/constants/storage.constants";

export interface IAuthService<T extends BaseCredential> {
  get user$(): Observable<T | undefined>;

  set user(user: T | undefined);

  get token(): string | undefined;

  get refreshToken(): string | undefined;

  updateToken(token: string, refreshToken: string): void;

  loginUserName(username: string, password: string): Observable<AuthedResponse>;

  loginOauth(code: string, PARTNER_ID: string): Observable<AuthedResponse>;

  logout(): Observable<void>;

  initForgotPassword(identifyId: string): Observable<any>;

  changePassword(email: string, oldPassword: string, newPassword: string): Observable<boolean>;

  resetPassword(token: string, password: string): Observable<boolean>;

  initRefreshToken(): Observable<AuthedResponse>;

  check(): Observable<boolean>;

  profile(): Observable<T>;
}

export abstract class AuthService<T extends BaseCredential>{

  protected _user: BehaviorSubject<T | undefined>;

  protected constructor(protected localStorageService: LocalStorageService) {
    this._user = new BehaviorSubject<T | undefined>(this.localStorageService.retrieve(LOCAL_STORAGE_KEYS.PROFILE));
  }

  get user$(): Observable<T | undefined> {
    return this._user.asObservable();
  }

  set user(user: T | undefined) {
    this._user.next(user);
    if (user) {
      this.localStorageService.store(LOCAL_STORAGE_KEYS.PROFILE, user);
    } else {
      this.localStorageService.clear(LOCAL_STORAGE_KEYS.PROFILE);
    }
  }

  get refreshToken(): string | undefined {
    return this.localStorageService.retrieve(LOCAL_STORAGE_KEYS.REFRESH_TOKEN);
  }

  get token(): string | undefined {
    return this.localStorageService.retrieve(LOCAL_STORAGE_KEYS.TOKEN);
  }

  updateToken(token?: string, refreshToken?: string): void {
    if (token) {
      this.localStorageService.store(LOCAL_STORAGE_KEYS.TOKEN, token);
    } else {
      this.localStorageService.clear(LOCAL_STORAGE_KEYS.TOKEN);
    }
    if (refreshToken) {
      this.localStorageService.store(LOCAL_STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    } else {
      this.localStorageService.clear(LOCAL_STORAGE_KEYS.REFRESH_TOKEN);
    }
  };

}
