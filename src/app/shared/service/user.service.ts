import {Injectable} from '@angular/core';
import {IUser} from "@shared/auth/model/user/user.model";
import {FIRE_COLLECTION} from "@shared/constants/document.constants";
import {AngularFirestore} from "@angular/fire/firestore";
import {Observable, of, throwError} from "rxjs";
import {map, switchMap, take} from "rxjs/operators";
import CommonUtils from "@shared/utils/comon.utils";
import {fromPromise} from "rxjs/internal-compatibility";
import {AngularFireAuth} from "@angular/fire/auth";
import {UserCreateRequest} from "@shared/auth/model/user/user-create.request";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userCollection = this.afs.collection<IUser>(FIRE_COLLECTION.users);

  constructor(
    private afs: AngularFirestore, // Inject Firestore service
    private afAuth: AngularFireAuth,
  ) {
  }

  getUserById(id: string): Observable<IUser> {
    return this.userCollection.doc<IUser>(id).get({source: 'server'}).pipe(switchMap(doc => {
      if (!doc.exists) {
        return throwError('User not found');
      }
      return of(doc.data() as IUser);
    }));
  }

  createUser(user: UserCreateRequest): Observable<IUser> {
    if (!user.username || !user.password) {
      return throwError('Username or password is empty');
    }

    return fromPromise(this.afAuth.createUserWithEmailAndPassword(user.username, user.password))
      .pipe(switchMap((userCredential) => {
        user.id = userCredential.user?.uid;
        return fromPromise(this.userCollection.doc<IUser>(user.id).set(user))
          .pipe(take(1), map(() => user))
      }));
  }
}
