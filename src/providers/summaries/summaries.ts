import { Injectable } from '@angular/core';
import {ContentLanguagesProvider} from "../content-languages/content-languages";
import {SourcesProvider} from "../sources/sources";
import {ServiceClientProvider} from "../service-client/service-client";

/*
  Generated class for the SummariesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SummariesProvider {

  constructor(private serviceClient: ServiceClientProvider, private sourcesProvider: SourcesProvider,
              private contentLanguagesProvider: ContentLanguagesProvider) {}

  public getSummary(topicId: string) {
    let selectedLang = this.contentLanguagesProvider.getSelectedContentLanguage();
    let selectedSourcesUrls = this.sourcesProvider.getSelectedSourcesUrls();
    return this.serviceClient.getSummary(topicId, selectedSourcesUrls, selectedLang);
  }
}
