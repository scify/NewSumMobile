import { Injectable } from '@angular/core';
import {ContentLanguagesProvider} from "../content-languages/content-languages";
import {Subject} from "rxjs/Subject";
import {ServiceClientProvider} from "../service-client/service-client";

/*
  Generated class for the SourcesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SourcesProvider {
  public sourcesUpdated: Subject<any>;
  public selectedLang: string;
  private sources: Array<any> = [];

  constructor(private serviceClient: ServiceClientProvider, private contentLanguagesProvider: ContentLanguagesProvider) {
    this.sourcesUpdated = new Subject<any>();
    this.selectedLang = this.contentLanguagesProvider.getSelectedContentLanguage();
    this.contentLanguagesProvider.contentLanguageUpdated.subscribe((newLang) => {
        this.selectedLang = newLang;
        if (newLang) {
          this.sources = this.serviceClient.getFeedSources(this.selectedLang);
          this.sourcesUpdated.next(this.sources);
        }
    }, error => console.error(error));
    if (this.selectedLang) {
      this.sources = this.serviceClient.getFeedSources(this.selectedLang);
      this.sourcesUpdated.next(this.sources);
    }
  }

  public getSelectedSources() {
    return this.sources.splice(0);
  }

  public getSelectedSourcesUrls() {
    return this.sources.map(s => s.sFeedLink);
  }
}
