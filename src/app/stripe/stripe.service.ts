import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

// import { auth } from '@angular/fire/auth';
import auth from "firebase";
import firebase from "firebase/app";
import "firebase/firestore"
// import { firebaseConfig } from "@/config.js";
// import firebase from 'firebase/app';
import { AngularFireAuth } from "@angular/fire/auth";
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from "@angular/fire/firestore";

// import { Observable } from "rxjs/Observable";
import { Observable, of } from "rxjs";
import { switchMap } from "rxjs/operators";
// import { UserInfoService } from "../providers/user-info.service";
// import { LoginJudgeService } from './login-judge.service';

export interface Shirt {
  name: string;
  price: number;
}
// export interface ShirtId extends Shirt { id: string; }

interface User {
  uid: string;
  email: string;
  photoURL?: string;
  displayName?: string;
  favoriteColor?: string;
}

interface Item {
  name: string;
}

@Injectable({
  providedIn: "root",
})
export class StripeService {
  private shirtCollection: AngularFirestoreCollection<Shirt>;
  user: Observable<User>;
  private itemsCollection: AngularFirestoreCollection<Item>;
  items: Observable<Item[]>;
  amount: number;
  currentUser: any;
  emailVerified:boolean ;

  constructor(
    private auth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router,
  ) // private judge:LoginJudgeService
  {
    //// Get auth data, then get firestore user document || null
    this.user = this.auth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return this.db.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
    this.emailVerified = false;
    }

  chargeSend(user) {
    this.currentUser = user;
  }

  verify(eVerified){
    this.emailVerified = eVerified;
  }

  // authLogin(email: string, password: string): Promise<any> {
  //   return this.auth
  //     .signInWithEmailAndPassword(email, password)
  //     .then((user) => {
  //       console.log(user);
  //       this.currentUser = user.user.uid;
  //       console.log("current", this.currentUser);
  //       // this.db
  //       //   .collection("customers")
  //       //   .doc(this.currentUser)
  //       //   .collection("subscriptions")
  //       //   .valueChanges()
  //       //   .subscribe(
  //       //     (value) => {
  //       //       console.log("value", value);
  //       //       this.amount = value[0].items[0].plan.amount;
  //       //       console.log("amount", this.amount);
  //       //     },
  //       //     (error) => {
  //       //       console.log("error", error);
  //       //     }
  //       //   );
  //       console.log("user", user);
  //       return this.updateUserData(user.user);
  //     });
  // }


  // private updateUserData(user) {
  //   // Sets user data to firestore on login

  //   const userRef: AngularFirestoreDocument<any> = this.db.doc(
  //     `users/${user.uid}`
  //   );

  //   const data: User = {
  //     uid: user.uid,
  //     email: user.email,
  //     displayName: user.displayName,
  //     photoURL: user.photoURL,
  //   };
  //   // this.User.loggedIn = true;
  //   return userRef.set(data, { merge: true });
  // }

}
