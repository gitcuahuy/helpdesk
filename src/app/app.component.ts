import {Component, OnInit} from '@angular/core';
import {FirebaseStorageService} from "./shared/service/firebase-storage.service";
import firebase from "firebase";
import {ConfigService} from "./core/config/config.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'a-help-fe';

  ngOnInit(): void {

  }

  constructor(private _firebaseUpload: FirebaseStorageService,
              private _ConfigService: ConfigService
  ) {

  }

  uploadFile(event: any): void {
    const [file] = event.target.files;
    console.log(file)
    if (!file) {
      console.error("file error")
      return;
    }
    this._firebaseUpload.uploadFile({data: file, name: file.name ?? 'lmao'}).subscribe(res => {
        console.log(res);
      }
    )
  }
}
