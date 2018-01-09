import { Injectable } from '@angular/core';
import {SourcesProvider} from "../sources/sources";
import {ServiceClientProvider} from "../service-client/service-client";
import {ContentLanguagesProvider} from "../content-languages/content-languages";

/*
  Generated class for the CategoriesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CategoriesProvider {
  private selectedLang: string;
  private categories: Array<string> = [];

  constructor(private serviceClient: ServiceClientProvider, private sourcesProvider: SourcesProvider,
              private contentLanguages: ContentLanguagesProvider) {
    this.selectedLang = this.contentLanguages.getSelectedContentLanguage();
    this.sourcesProvider.sourcesUpdated.subscribe((newSources) => {
      this.selectedLang = this.contentLanguages.getSelectedContentLanguage();
      if (newSources.length > 0)
        this.categories = this.serviceClient.getCategories(this.sourcesProvider.getSelectedSourcesUrls(), this.selectedLang);
    }, error => console.error(error));
    if (this.selectedLang)
      this.categories = this.serviceClient.getCategories(this.sourcesProvider.getSelectedSourcesUrls(), this.selectedLang);
  }

  public getSelectedCategories(): Array<string> {
    return this.categories.splice(0);
  }
}
