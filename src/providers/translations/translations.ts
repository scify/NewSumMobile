import {Injectable} from "@angular/core";
import {TranslateService} from "@ngx-translate/core";

/*
  Generated class for the TranslationsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TranslationsProvider {

  constructor(private translate: TranslateService) {}

  public setLanguage(lang: string) {
    this.translate.use(lang.toLowerCase());
  }
}
