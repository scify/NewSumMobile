import { Injectable } from '@angular/core';
import {Storage} from "@ionic/storage"
import {Subject} from "rxjs/Subject";
import {ServiceClientProvider} from "../service-client/service-client";

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

  constructor(private serviceClient: ServiceClientProvider, private appStorage: Storage) {
    this.contentLanguageUpdated = new Subject<string>();
    this.languages = this.serviceClient.getLanguages();
    this.getSelectedContentLanguageFromStorage().then((selectedLang) => {
      this.selectedLanguage = selectedLang;
      if (selectedLang)
        this.contentLanguageUpdated.next(selectedLang);
    });
  }

  public getContentLanguages(): Array<string> {
    return this.languages.slice(0);
  }

  public setSelectedContentLanguage(langCode: string): Promise<any> {
    this.selectedLanguage = langCode;
    this.contentLanguageUpdated.next(langCode);
    return this.appStorage.set('selected-language', langCode);
  }

  public getSelectedContentLanguage(): string {
    // TODO: remove default, used only for testing purposes
    return this.selectedLanguage || 'EL';
  }

  public getSelectedContentLanguageFromStorage(): Promise<any> {
    return this.appStorage.get('selected-language');
  }
}
