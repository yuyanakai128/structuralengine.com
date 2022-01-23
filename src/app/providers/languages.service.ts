import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

@Injectable({
  providedIn: "root",
})
export class LanguagesService {
  public browserLang: string;
  public languageIndex = {
    ja: "日本語",
    en: "English",
  };

  constructor(public translate: TranslateService) {
    this.browserLang = translate.getBrowserLang();
    translate.use(this.browserLang);
  }

  public trans(key: string) {
    this.browserLang = key;
    this.translate.use(this.browserLang);
  }
}
