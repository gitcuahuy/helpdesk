import {Injectable} from '@angular/core';
import {Params} from "@angular/router";
import {BehaviorSubject, Observable} from "rxjs";
import firebase from "firebase";
import {CONFIG_DEFAULT} from "@shared/constants/config.constants";

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  systemConfig: BehaviorSubject<Params>;
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



  delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

}
