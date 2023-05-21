import {Injectable} from '@angular/core';
import {Params} from "@angular/router";
import {BehaviorSubject, Observable} from "rxjs";
import firebase from "firebase";
import {CONFIG_DEFAULT, LAYOUT} from "@shared/constants/config.constants";

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private systemConfig: BehaviorSubject<Params>;
  private remoteConfig = firebase.remoteConfig();

  constructor() {
    this.systemConfig = new BehaviorSubject<Params>({});
    this.remoteConfig.defaultConfig = {
      ...CONFIG_DEFAULT
    }
    this.remoteConfig.fetch().then(() => {
      this.systemConfig.next(this.remoteConfig.getAll());
      console.log('config', this.remoteConfig.getAll())
    })
  }

  get config$(): Observable<Params> {
    return this.systemConfig.asObservable();
  }
}
