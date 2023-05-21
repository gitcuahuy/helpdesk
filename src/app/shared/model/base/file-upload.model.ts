import {forkJoin, Observable} from "rxjs";
import {IFile} from "../IFile";
import {defaultIfEmpty} from "rxjs/operators";

export abstract class AbstractFileUploadService {
  abstract uploadFile(file: { data: File, name: string }): Observable<IFile>;

  uploadFiles: (files: { data: File, name: string }[]) => Observable<Array<IFile>>;

  protected constructor() {
    this.uploadFiles = files => {
      const fileObs = files.map(file => this.uploadFile(file));
      return forkJoin(fileObs)
        .pipe(defaultIfEmpty())
    }
  }
}
