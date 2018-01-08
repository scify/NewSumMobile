import { Injectable } from '@angular/core';
import {SoapClientProvider} from "../soap-client/soap-client";
import {ContentLanguagesProvider} from "../content-languages/content-languages";

/*
  Generated class for the SourcesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SourcesProvider {
  selectedLang: string;
  sources: any;

  constructor(private soapClient: SoapClientProvider, private contentLanguagesProvider: ContentLanguagesProvider) {
    this.selectedLang = this.contentLanguagesProvider.getSelectedContentLanguage();
    this.contentLanguagesProvider.contentLanguageUpdated.subscribe((newLang) => {
        this.selectedLang = newLang;
        if (newLang)
          this.sources = this.getSourcesFromAPI();
    }, error => console.error(error));
    if (this.selectedLang)
      this.sources = this.getSourcesFromAPI();
  }

  private getSourcesFromAPI() {
    return this.soapClient.getResource('getFeedSources', {sLang: this.selectedLang});
  }
}
