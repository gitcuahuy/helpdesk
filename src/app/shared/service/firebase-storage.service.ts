import {Injectable} from '@angular/core';
import {AbstractFileUploadService} from "../model/base/file-upload.model";
import {Observable, of} from "rxjs";
import {IFile} from "../model/IFile";
import {AngularFireStorage} from "@angular/fire/storage";
import {finalize, switchMap} from "rxjs/operators";
import {AngularFirestore} from "@angular/fire/firestore";
import {FIRE_COLLECTION} from "../constants/document.constants";
import CommonUtils from "../utils/coomon.utils";

@Injectable({
  providedIn: 'root'
})
export class FirebaseStorageService extends AbstractFileUploadService {
  fileUploadCollection = this.db.collection(FIRE_COLLECTION.files);

  constructor(private storage: AngularFireStorage,
              private db: AngularFirestore) {
    super();

  }

// create sigle file
  uploadFile(file: { data: File; name: string }): Observable<IFile> {
    const path = `ahelp/${Date.now()}_${file.name}`;

    return new Observable<string>((observe) => {
      // tạo một đường dẫn tới file trên Firebase Storage
      // tạo một tham chiếu tới file trên Firebase Storage
      const ref = this.storage.ref(path);
      // upload file lên Firebase Storage
      const task = ref.put(file);

      task.snapshotChanges().pipe(
        finalize(() => {
          ref.getDownloadURL().subscribe(url => {
            observe.next(url);
            observe.complete();
          });
        })).subscribe();
    }).pipe(switchMap((value) => {
      const data: IFile = {
        id: CommonUtils.getRandom(36),
        viewUrl: value,
        originName: file.name,
        buket: path,
      };
      this.fileUploadCollection.doc(data.id).set(data).then();
      return of(data)
    }));
  }
}
