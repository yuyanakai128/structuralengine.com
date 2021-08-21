import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-price',
  templateUrl: './price.component.html',
  styleUrls: ['./price.component.scss', '../home/home.component.scss']
})
export class PriceComponent implements OnInit {
  loginUser: string;
  loginUserName: string;
  loginPassword: string;
  emailVerified: boolean;

  public currentUser: any;

  // 商品情報
  public products = [];

  constructor(private fns: AngularFireFunctions,
    public auth: AngularFireAuth,
    private db: AngularFirestore,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private router: Router) {
    this.setCurrentUser();
    this.setProduct();


    this.auth.onAuthStateChanged((user) => {
      if (user) {
        this.emailVerified = user.emailVerified
      } else {
        this.emailVerified = false;
      }
    });
  }

  ngOnInit(): void {
    // 商品情報を収集する
    let result = [];
    const ref = this.db.collection('products').ref;
    ref.where('active', '==', true)
      .get()
      .then(querySnapshot => {
        const items = [];
        querySnapshot.forEach(async function (doc) {


          const priceSnap = await doc.ref
            .collection('prices')
            .where('active', '==', true)
            .orderBy('unit_amount')
            .get();

          const product: any = doc.data();

          priceSnap.docs.forEach((doc) => {
            const priceId = doc.id;
            const priceData = doc.data();

            if (priceData.active === true) {
              items.push({
                name: product.name,                       // 'BASICプラン'
                description: product.description,
                billing_scheme: priceData.billing_scheme, // 'per_unit'
                currency: priceData.currency,             // 'jpy'
                interval: priceData.interval,             // 'month'
                price: priceData.unit_amount,             // 60000
                limit_point: product.metadata.limit_point,
                priceId,                                  //
              });
            }
          });

        });
        this.products = items;
      });
  }

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

    // this.stripe.chargeSend(this.currentUser);
  }

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
  // 商品情報を収集する
  private setProduct(): void {
    const ref = this.db.collection('products').ref;
    ref.where('active', '==', true)
      .get()
      .then(querySnapshot => {
        const items = [];
        querySnapshot.forEach(async function (doc) {
          const priceSnap = await doc.ref
            .collection('prices')
            .where('active', '==', true)
            .orderBy('unit_amount')
            .get();

          const product: any = doc.data();

          priceSnap.docs.forEach((doc) => {
            const priceId = doc.id;
            const priceData = doc.data();

            if (priceData.active === true) {
              items.push({
                name: product.name,                       // 'BASICプラン'
                billing_scheme: priceData.billing_scheme, // 'per_unit'
                currency: priceData.currency,             // 'jpy'
                interval: priceData.interval,             // 'month'
                price: priceData.unit_amount,             // 60000
                priceId,                                  //
              });
            }
          });

        });
        this.products = items;
      });
  }

}
