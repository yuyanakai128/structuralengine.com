import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LawComponent } from "./law/law.component";
import { PolicyComponent } from "./policy/policy.component";
import { RuleComponent } from "./rule/rule.component";
import { StripeComponent } from "./stripe/stripe.component";
import { PriceComponent } from "./price/price.component";
import { EmploymentComponent } from "./employment/employment.component";
import { FormalComponent } from "./formal/formal.component";

const routes: Routes = [
  { path: "", redirectTo: "/home", pathMatch: "full" },
  { path: "home", component: FormalComponent },
  { path: "law", component: LawComponent },
  { path: "policy", component: PolicyComponent },
  { path: "rule", component: RuleComponent },
  { path: "stripe", component: StripeComponent },
  { path: "price", component: PriceComponent },
  { path: "employment", component: EmploymentComponent },
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
