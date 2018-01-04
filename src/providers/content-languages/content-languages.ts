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
  public contentLanguageUpdated: Subject<string>;
  private languages: Array<string>;
  private selectedLanguage: string;

  constructor(public soapClient: SoapClientProvider, public appStorage: AppStorageProvider) {
    this.contentLanguageUpdated = new Subject<string>();
    this.getContentLanguagesFromAPI();
    this.getSelectedContentLanguageFromStorage().then((selectedLang) => {
      this.selectedLanguage = selectedLang;
      if (selectedLang)
        this.contentLanguageUpdated.next(selectedLang);
    });
  }

  public getContentLanguages(): Array<string> {
    return this.languages.splice(0);
  }

  private getContentLanguagesFromAPI() {
    this.languages = this.soapClient.getResource('getLanguages', null);
  }

  public setSelectedContentLanguage(langCode): Promise<any> {
    this.contentLanguageUpdated.next(langCode);
    this.selectedLanguage = langCode;
    return this.appStorage.set('selected-language', langCode);
  }

  public getSelectedContentLanguage(): string {
    return this.selectedLanguage || 'EL';
  }

  public getSelectedContentLanguageFromStorage(): Promise<any> {
    return this.appStorage.get('selected-language');
  }
}
