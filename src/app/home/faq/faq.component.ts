import { Component } from '@angular/core';

@Component({
  selector: 'app-home-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['../home.component.scss', './faq.component.scss'],
})
export class HomeFaqComponent {

  public FAQ = [];

  constructor() {
    this.FAQ.push({
        showDetail: false,
        Q: '(利用可能) ポイント数 とは',
        A: '各計算サービス・解析プログラムを利用するとお客様の利用ポイントが計測されます。ご契約いただいているプランに応じて１日当たりにご利用いただけるポイントに上限があります。'
      },
      {
        showDetail: false,
        Q: '各計算サービス・解析プログラムを利用するのに必要なポイント数 は？',
        A: 'ご契約いただいているプランの１日当たりの上限値に達するまで機能の制限なくご利用いただけます。ポイントの計算方法は各計算サービス・解析プログラムのヘルプページをご参照ください'
      },
      {
        showDetail: false,
        Q: 'ご利用いただけるカードの種類',
        A: 'Visa・MasterCard・American Express・JCB・Diners Club・Discoverです。ただし、 JCB・Diners Club・Discoverによる決済は、別途JCB社の審査が必要です。'
      },
      {
        showDetail: false,
        Q: '料金はいつ引き落としされますか？',
        A: 'お客様の契約日によって異なり、契約日から１か月毎に引き落としされます。'
      },
    )

  }

  onAccordion(index: number) {
    const target = this.FAQ[index];
    target.showDetail = !target.showDetail;
  }

}



