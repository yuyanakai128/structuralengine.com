import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";


// 昔のページ
import { LawComponent } from "./_old/law/law.component";
import { PolicyComponent } from "./_old/policy/policy.component";
import { RuleComponent } from "./_old/rule/rule.component";
import { StripeComponent } from "./_old/stripe/stripe.component";
import { PriceComponent } from "./_old/price/price.component";

const routes: Routes = [
  { path: "", redirectTo: "/top", pathMatch: "full" },
  { path: "top", component: StripeComponent },

  
  // 昔のページ
  { path: "law", component: LawComponent },
  { path: "policy", component: PolicyComponent },
  { path: "rule", component: RuleComponent },
  { path: "stripe", component: StripeComponent },
  { path: "price", component: PriceComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: false,
      scrollPositionRestoration: "enabled",
      anchorScrolling: "enabled",
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
