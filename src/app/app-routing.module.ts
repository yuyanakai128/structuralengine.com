import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LawComponent } from './law/law.component';
import { PolicyComponent } from './policy/policy.component';
import { RuleComponent } from './rule/rule.component';
import { StripeComponent } from './stripe/stripe.component';
import { PriceComponent } from './price/price.component'

const routes: Routes = [ 
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'law', component: LawComponent },
  { path: 'policy', component: PolicyComponent },
  { path: 'rule', component: RuleComponent },
  { path: 'stripe', component: StripeComponent },
  { path: 'price', component: PriceComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
