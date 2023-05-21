import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {ConfigService} from "../config/config.service";
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";
import {ActivatedRoute, Params} from "@angular/router";
import {CONFIG_KEY, LAYOUT} from "@shared/constants/config.constants";

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutComponent implements OnInit, OnDestroy {

  readonly LAYOUT = LAYOUT;
  private _unsubscribeAll = new Subject();
  public layout: LAYOUT = LAYOUT.EMPTY
  public scheme: string = 'classic';

  set currentConfig(value: Params) {
    if (value[CONFIG_KEY.scheme]) {
      this.scheme = value[CONFIG_KEY.scheme]
    }
  }

  constructor(private _configService: ConfigService,
              private _cdr: ChangeDetectorRef,
              private _activateRouter: ActivatedRoute) {
  }


  ngOnInit(): void {
    // handler change config
    this._configService.config$.pipe(takeUntil(this._unsubscribeAll)).subscribe(values => {
      this.currentConfig = values;
    })
    // handler change layout
    this._activateRouter.data.pipe(takeUntil(this._unsubscribeAll)).subscribe(data => {
      this.layout = data.layout
    })
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
