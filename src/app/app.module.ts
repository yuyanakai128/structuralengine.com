import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { AngularFireModule } from "@angular/fire";
import { AngularFireFunctionsModule, REGION } from "@angular/fire/functions";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { firebase, firebaseui, FirebaseUIModule } from "firebaseui-angular";
import {
  AngularFireAuthModule,
  USE_EMULATOR as USE_AUTH_EMULATOR,
} from "@angular/fire/auth";

import { MatIconModule } from "@angular/material/icon";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatListModule } from "@angular/material/list";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";

const httpLoaderFactory = (http: HttpClient): TranslateHttpLoader =>
  new TranslateHttpLoader(http, "./assets/i18n/", ".json");

const firebaseUiAuthConfig: firebaseui.auth.Config = {
  signInFlow: "popup",
  signInOptions: [
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
  ],
  tosUrl: "./rule",
  privacyPolicyUrl: "./policy",
  credentialHelper: firebaseui.auth.CredentialHelper.GOOGLE_YOLO,
};

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { environment } from "src/environments/environment";


// 昔のページ
import { FooterComponent } from "./_old/footer/footer.component";
import { LawComponent } from "./_old/law/law.component";
import { PolicyComponent } from "./_old/policy/policy.component";
import { RuleComponent } from "./_old/rule/rule.component";
import { StripeComponent } from "./_old/stripe/stripe.component";
import { WaitDialogComponent } from "./_old/wait-dialog/wait-dialog.component";
import { PriceComponent } from "./_old/price/price.component";
import { ChargeComponent } from "./_old/charge/charge.component";


@NgModule({
  declarations: [
    AppComponent,

    // 昔のページ
    FooterComponent,
    LawComponent,
    PolicyComponent,
    RuleComponent,
    StripeComponent,
    WaitDialogComponent,
    PriceComponent,
    ChargeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFireFunctionsModule,
    FirebaseUIModule.forRoot(firebaseUiAuthConfig),
    MatIconModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [{ provide: REGION, useValue: "asia-northeast1" }],
  entryComponents: [WaitDialogComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
