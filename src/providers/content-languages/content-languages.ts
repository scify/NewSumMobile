import { Injectable } from '@angular/core';
import {SoapClientProvider} from "../soap-client/soap-client";
import {AppStorageProvider} from "../app-storage/app-storage";
import {Subject} from "rxjs/Subject";

/*
  Generated class for the ContentLanguagesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ContentLanguagesProvider {
  languages: Array<string>;
  contentLanguageUpdated: Subject<string>;

  constructor(public soapClient: SoapClientProvider, public appStorage: AppStorageProvider) {
    this.getContentLanguagesAPI();
    this.getSelectedContentLanguage().then((selectedLang) => {
      // TODO: make additional calls here to fetch topics or similar info
    });
  }

  public getContentLanguages(): Array<string> {
    return this.languages.splice(0);
  }

  private getContentLanguagesAPI() {
    this.languages = this.soapClient.getResource('getLanguages');
  }

  public setSelectedContentLanguage(langCode) {
    this.contentLanguageUpdated.next(langCode);
    return this.appStorage.set('selected-language', langCode);
  }

  public getSelectedContentLanguage(): Promise<any> {
    return this.appStorage.get('selected-language');
  }
}
