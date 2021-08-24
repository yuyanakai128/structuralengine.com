import { Component, OnInit } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFireFunctions } from "@angular/fire/functions";
import { FormBuilder } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { environment } from "src/environments/environment";
import { StripeService } from "../stripe/stripe.service";
import { WaitDialogComponent } from "../wait-dialog/wait-dialog.component";
// import { Observable, of } from "rxjs";

@Component({
  selector: "app-charge",
  templateUrl: "./charge.component.html",
  styleUrls: [
    "./charge.component.scss",
    "../price/price.component.scss",
    "../home/home.component.scss",
  ],
})
export class ChargeComponent implements OnInit {
  // ログインユーザー情報
  public currentUser: any;

  // 商品情報
  public products: any = [];

  // user: Observable<User>;

  public emailVerified: boolean;

  constructor(
    private db: AngularFirestore,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private fns: AngularFireFunctions,
    public auth: AngularFireAuth,
    public stripe: StripeService
  ) {
    this.setCurrentUser();
    this.setProduct();
  }

  ngOnInit(): void {
    // 商品情報を収集する
    let result = [];
    const ref = this.db.collection("products").ref;
    ref
      .where("active", "==", true)
      .get()
      .then((querySnapshot) => {
        const items = [];
        querySnapshot.forEach(async function (doc) {
          const priceSnap = await doc.ref
            .collection("prices")
            .where("active", "==", true)
            .orderBy("unit_amount")
            .get();

          const product: any = doc.data();

          priceSnap.docs.forEach((doc) => {
            const priceId = doc.id;
            const priceData = doc.data();

            if (priceData.active === true) {
              items.push({
                name: product.name, // 'BASICプラン'
                description: product.description,
                billing_scheme: priceData.billing_scheme, // 'per_unit'
                currency: priceData.currency, // 'jpy'
                interval: priceData.interval, // 'month'
                price: priceData.unit_amount, // 60000
                limit_point: product.metadata.limit_point,
                priceId, //
              });
            }
          });
        });
        this.products = items;
      });

    //　メール認証されているユーザーかを確認する．
    this.auth.onAuthStateChanged((user) => {
      if (user) {
        this.emailVerified = user.emailVerified;
      } else {
        this.emailVerified = false;
      }
    });
  }

  // プラン購入
  public async subscribe(price: string) {
    const modalRef = this.modalService.open(WaitDialogComponent);
    const selectedPrice = [
      {
        price,
        quantity: 1,
      },
    ];

    const id = [];
    for (const prod of this.products) {
      id.push({
        price: prod.priceId,
        quantity: 1,
      });
    }

    const checkoutSession = {
      // automatic_tax: true,
      // tax_id_collection: true,
      collect_shipping_address: true,
      tax_rates: environment.taxRates,
      allow_promotion_codes: true,
      line_items: selectedPrice, // id,
      success_url: window.location.href,
      cancel_url: window.location.href,
      metadata: {
        key: "value",
      },
    };

    this.db
      .collection("customers")
      .doc(this.currentUser.uid)
      .collection("checkout_sessions")
      .add(checkoutSession)
      .then((docRef) => {
        // Wait for the CheckoutSession to get attached by the extension
        docRef.onSnapshot((snap) => {
          const { error, url } = snap.data();
          if (error) {
            alert(`An error occured: ${error.message}`);
          } else if (url) {
            window.location.assign(url);
          }
        });
      });
  }

  // 既に有料プランに加入したユーザーのマイページを表示する
  public async mypage() {
    const modalRef = this.modalService.open(WaitDialogComponent);

    // Call billing portal function
    const callable = this.fns.httpsCallable(
      "ext-firestore-stripe-subscriptions-createPortalLink"
    );

    callable({ returnUrl: window.location.href })
      .pipe()
      .subscribe(
        (resp) => {
          window.location.assign(resp.url);
        },
        (err) => {
          modalRef.close();
          alert(`An error occured: ${err}`);
        }
      );
  }

  // 商品情報を収集する
  private setProduct(): void {
    const ref = this.db.collection("products").ref;
    ref
      .where("active", "==", true)
      .get()
      .then((querySnapshot) => {
        const items = [];
        querySnapshot.forEach(async function (doc) {
          const priceSnap = await doc.ref
            .collection("prices")
            .where("active", "==", true)
            .orderBy("unit_amount")
            .get();

          const product: any = doc.data();

          priceSnap.docs.forEach((doc) => {
            const priceId = doc.id;
            const priceData = doc.data();

            if (priceData.active === true) {
              items.push({
                name: product.name, // 'BASICプラン'
                billing_scheme: priceData.billing_scheme, // 'per_unit'
                currency: priceData.currency, // 'jpy'
                interval: priceData.interval, // 'month'
                price: priceData.unit_amount, // 60000
                priceId, //
              });
            }
          });

          this.products = items;
        });
      });
  }

  // ユーザー情報を収集する
  private setCurrentUser(): void {
    this.currentUser = {
      uid: "",
      displayName: "",
      priceId: "",
      billing_scheme: "", // 'per_unit'
      currency: "", // 'jpy'
      interval: "", // 'month'
      price: 0, // 60000
    };

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
    const ref = this.db.collection("customers").ref;
    ref
      .doc(this.currentUser.uid)
      .collection("subscriptions")
      .where("status", "in", ["trialing", "active"])
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
}
