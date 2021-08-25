import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';
import { environment } from 'src/environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { WaitDialogComponent } from './wait-dialog/wait-dialog.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StripeService } from './stripe.service';



@Component({
  selector: 'app-stripe',
  templateUrl: './stripe.component.html',
  styleUrls: ['./stripe.component.scss', '../home/home.component.scss']
})


export class StripeComponent {
  loginForm: FormGroup;
  resetForm: FormGroup;
  loginRule: FormGroup;
  loginUser: string;
  loginUserName: string;
  loginPassword: string;
  rememberCheck: boolean;
  loginError: boolean;
  errorMessage: string;
  connecting: boolean;
  loggedIn: boolean;
  resisVisible: boolean = false;
  resetVisible: boolean = false;
  emailVerified: boolean;
  ruleCheck:boolean;

  // ログインユーザー情報
  public currentUser: any;

  // 商品情報
  public products = [];

  amount: number;

  constructor(
    private fns: AngularFireFunctions,
    public auth: AngularFireAuth,
    private db: AngularFirestore,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private router: Router,
    public stripe: StripeService) {
    // キャッシュ残っているユーザー情報を収集する
    this.setCurrentUser();
    // 商品情報を収集する
    // this.currentUser = this.stripe.currentUser;
    // this.setProduct();

    this.loginError = false;
    this.connecting = false;
    // this.resisVisible = false;

    // this.emailVerified = this.stripe.emailVerified;

  }


  ngOnInit() {
    // this.auth.signOut().then(() => {
    //   this.router.navigate(['/']);
    // });

    this.loginForm = this.fb.group({
      'name': ['', [Validators.required]],
      'email': ['', [Validators.required, Validators.email]],
      'password': ['', [Validators.required]]
    });


    this.auth.onAuthStateChanged((user) => {
      if (user) {
        this.emailVerified = user.emailVerified
      } else {
        this.emailVerified = false;
      }
    });
  }


  login() {
    this.connecting = true;
    const email = this.loginForm.get('email').value;
    const password = this.loginForm.get('password').value;
    this.auth
      .signInWithEmailAndPassword(email, password)
      .then(auth => {
        this.connecting = false;
        console.log(auth.user.uid);
        // メールアドレス確認が済んでいるかどうか
        if (!(auth.user.emailVerified)) {
          this.auth.signOut();
          return Promise.reject('メールアドレスが確認できていません。');
        } else {
          this.emailVerified = true;
          this.stripe.verify(this.emailVerified);
        }

        return this.amount = 1;
      })
      .catch(err => {
        this.connecting = false;
        this.loginError = true;
        this.errorMessage = err;
        return Promise.reject('ログインに失敗しました');
      });
  }

  resist() {
    this.connecting = true;
    const email = this.loginForm.get('email').value;
    const password = this.loginForm.get('password').value;
    const name = this.loginForm.get('name').value;
    if(this.ruleCheck){
    this.auth
      .createUserWithEmailAndPassword(email, password)
      .then(auth => {
        this.connecting = false;

        auth.user.updateProfile({
          displayName: name,
          photoURL: ""
        }).then(() => {
        }).catch((error) => {
          alert("名前が正しく登録できませんでした。")
        });

        auth.user.sendEmailVerification()
          .then(() => {
            alert("確認メールを送信しました。")
            this.resisVisible = false;
            this.loginError = false;
          });
        return;
      })
      .catch(err => {
        this.connecting = false;
        this.loginError = true;
        this.errorMessage = err;
        alert('アカウント作成に失敗しました。\n' + err);
      });
    }else{
      this.loginError = true;
      this.errorMessage = '利用規約に同意されない場合、サービスをご利用になれません。';
    }
  }

  onChange(event) {
    if (event.target.checked) {
      this.ruleCheck = true;
    }
  }

  new_resis() {
    this.resisVisible = true;
  }

  forgetPass() {
    this.resetVisible = true;
  }

  resetPass() {
    this.connecting = true;
    const email = this.loginForm.get('email').value;
    this.auth.sendPasswordResetEmail(email)
      .then(() => {
        alert("メールを送信しました");
        this.resetVisible = false;
      })
      .catch((error) => {
        alert('登録のないメールアドレスです。\n' + error);
        var errorCode = error.code;
        var errorMessage = error.message;
        this.resetVisible = false;
      });
  }


  // ユーザー情報を収集する
  private setCurrentUser(): void {
    this.currentUser = {
      uid: '',
      displayName: '',
      priceId: '',
      billing_scheme: '',  // 'per_unit'
      currency: '',        // 'jpy'
      interval: '',        // 'month'
      price: 0,            // 60000
    }

    // ログイン情報がキャッシュに残っていれば
    this.auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        this.currentUser.uid = firebaseUser.uid;
        this.currentUser.displayName = firebaseUser.displayName;
        this.checkUserProduct();
      }
    });

    this.stripe.chargeSend(this.currentUser);
  }

  // ユーザーが現在加入しているプランを情報を収集する
  private checkUserProduct() {

    const ref = this.db.collection('customers').ref;
    ref.doc(this.currentUser.uid)
      .collection('subscriptions')
      .where('status', 'in', ['trialing', 'active'])
      .onSnapshot(async (snapshot) => {
        if (snapshot.empty) {
          return;
        }

        // In this implementation we only expect one Subscription to exist
        const subscription = snapshot.docs[0].data();
        const priceData = (await subscription.price.get()).data();

        this.currentUser.billing_scheme = priceData.billing_scheme;
        this.currentUser.currency = priceData.currency;
        this.currentUser.interval = priceData.interval;
        this.currentUser.price = priceData.unit_amount;

        this.currentUser.priceId = subscription.price.id;
      });

  }

  public back() {
    this.resisVisible = false;
  }


  // ログアウト
  public logout() {
    this.auth.signOut();
    this.setCurrentUser();
    this.emailVerified = false;
    this.stripe.verify(this.emailVerified);
  }


}
