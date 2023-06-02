import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {AuthFirebaseService} from "../../../auth/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {IUser} from "@shared/auth/model/user/user.model";
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainLayoutComponent implements OnInit, OnDestroy {
  currentUser?: IUser;
  unSub$ = new Subject();

  constructor(private _cdr: ChangeDetectorRef,
              private router: Router,
              private authFirebaseService: AuthFirebaseService,) {
  }

  ngOnInit(): void {
    this.authFirebaseService.user$.pipe(takeUntil(this.unSub$)).subscribe(user => {
      this.currentUser = user;
      this._cdr.markForCheck();
    });
  }

  logout(): void {
    this.authFirebaseService.logout().subscribe(() => {
      this.router.navigate(['/login']);
      this._cdr.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.unSub$.next();
    this.unSub$.complete();
  }

  // utils
  // get user location

}
