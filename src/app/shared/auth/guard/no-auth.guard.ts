import {Injectable} from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate, CanActivateChild,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
  UrlTree
} from '@angular/router';
import {Observable, of} from 'rxjs';
import {switchMap} from "rxjs/operators";
import {AuthFirebaseService} from "../../../core/auth/auth.service";

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate, CanActivateChild {
  /**
   * Constructor
   */
  constructor(
    private _authService: AuthFirebaseService,
    private _router: Router
  ) {
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Can activate
   *
   * @param route
   * @param state
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this._check();
  }

  /**
   * Can activate child
   *
   * @param childRoute
   * @param state
   */
  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this._check();
  }

  /**
   * Can load
   *
   * @param route
   * @param segments
   */
  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    return this._check();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Check the authenticated status
   *
   * @private
   */
  private _check(): Observable<boolean> {
    // Check the authentication status
    return this._authService.check()
      .pipe(
        switchMap((authenticated) => {
          // đăng nhập rồi thì vào đây làm gì
          // If the user is authenticated...
          if (authenticated) {
            // Redirect to the root
            this._router.navigate(['']);

            // Prevent the access
            return of(false);
          }

          // Allow the access
          return of(true);
        })
      );
  }
}
