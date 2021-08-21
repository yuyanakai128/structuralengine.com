import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HttpClientModule, HttpClient } from "@angular/common/http";

import { HeaderComponent } from "./header/header.component";
import { FooterComponent } from "./footer/footer.component";

import { LawComponent } from "./law/law.component";
import { PolicyComponent } from "./policy/policy.component";
import { RuleComponent } from "./rule/rule.component";

import { HomeComponent } from "./home/home.component";
import { HomeHowtouseComponent } from "./home/howtouse/howtouse.component";
import { HomeserviceComponent } from "./home/service/service.component";
import { HomeNewsComponent } from "./home/news/news.component";
import { HomeFaqComponent } from "./home/faq/faq.component";
import { HomeContactComponent } from "./home/contact/contact.component";
import { ParallaxComponent } from "./home/parallax/parallax.component";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { AngularFireModule } from "@angular/fire";
import { AngularFireFunctionsModule, REGION } from "@angular/fire/functions";

import { environment } from "src/environments/environment";
import { StripeComponent } from "./stripe/stripe.component";

import { firebase, firebaseui, FirebaseUIModule } from "firebaseui-angular";
import {
  AngularFireAuthModule,
  USE_EMULATOR as USE_AUTH_EMULATOR,
} from "@angular/fire/auth";

import { WaitDialogComponent } from "./stripe/wait-dialog/wait-dialog.component";
import { PriceComponent } from "./price/price.component";
import { ChargeComponent } from "./charge/charge.component";

// import { MatIconModule } from "@angular/material/icon"; // <-- 追加
// import { MatToolbarModule } from "@angular/material/toolbar"; // <-- 追加
// import { MatSidenavModule } from "@angular/material/sidenav"; // <-- 追加
// import { MatListModule } from "@angular/material/list";
// import { MatMenuModule } from "@angular/material/menu";
// import {
//   MdCheckboxModule,
//   MdRadioModule,
//   MdCardModule,
//   MdInputModule,
//   MdButtonModule,
//   MdToolbarModule,
//   MdMenuModule,
//   MdIconModule } from '@angular/material';



 
import { MatIconModule } from '@angular/material/icon';  // <-- 追加
import { MatToolbarModule } from '@angular/material/toolbar';  // <-- 追加
import { MatSidenavModule } from '@angular/material/sidenav';  // <-- 追加
import { MatListModule } from '@angular/material/list';  // <-- 追加




const firebaseUiAuthConfig: firebaseui.auth.Config = {
  signInFlow: "popup",
  signInOptions: [
    //   firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    //   {
    //     scopes: [
    //       'public_profile',
    //       'email',
    //       'user_likes',
    //       'user_friends'
    //     ],
    //     customParameters: {
    //       'auth_type': 'reauthenticate'
    //     },
    //     provider: firebase.auth.FacebookAuthProvider.PROVIDER_ID
    //   },
    //   firebase.auth.TwitterAuthProvider.PROVIDER_ID,
    //   firebase.auth.GithubAuthProvider.PROVIDER_ID,
    //   {
    //     requireDisplayName: false,
    //     provider: firebase.auth.EmailAuthProvider.PROVIDER_ID
    //   },
    //   firebase.auth.PhoneAuthProvider.PROVIDER_ID,
    //   firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
  ],
  tosUrl: "./rule",
  privacyPolicyUrl: "./policy",
  credentialHelper: firebaseui.auth.CredentialHelper.GOOGLE_YOLO,
};

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    LawComponent,
    PolicyComponent,
    RuleComponent,
    HomeHowtouseComponent,
    HomeserviceComponent,
    HomeNewsComponent,
    HomeFaqComponent,
    HomeContactComponent,
    ParallaxComponent,
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

  
      MatIconModule,  // <-- 追加
      MatToolbarModule,  // <-- 追加
      MatSidenavModule,  // <-- 追加
      MatListModule,  // <-- 追加
    
  ],
  providers: [{ provide: REGION, useValue: "asia-northeast1" }],
  entryComponents: [WaitDialogComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
