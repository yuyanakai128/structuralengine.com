import { Component } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { element } from 'protractor';

@Component({
  selector: 'app-home-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['../home.component.scss', './faq.component.scss'],
})
export class HomeFaqComponent {
  showDetail_0 = false;
  showDetail_1 = false;

  elementId: number = 0;

  constructor() {
  }
  onAccordion0(event: Event) {
    this.elementId = 0;
    this.showDetail_0 = !this.showDetail_0;
  }
  onAccordion1(event: Event) {
    this.elementId = 1;
    this.showDetail_1 = !this.showDetail_1;
  }
  // onAccordion(id:number) {
  //   this.elementId = idparseInt((event.target as Element).id);

  //   if (this.showDetail[this.elementId] === true) {
  //     this.showDetail[this.elementId] = false;
  //   }else {
  //     this.showDetail[this.elementId] = true;
  //   }



  // this.showDetail = !this.showDetail;
}



