import {Component, OnInit} from '@angular/core';
import {FirebaseStorageService} from "./shared/service/firebase-storage.service";
import {ConfigService} from "./core/config/config.service";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'a-help-fe';

  ngOnInit(): void {
    this.spinner.show()
    setTimeout(() => {
      this.spinner.hide()
    }, 3000)
  }

  constructor(private _firebaseUpload: FirebaseStorageService,
              private _ConfigService: ConfigService,
              private spinner: NgxSpinnerService
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
