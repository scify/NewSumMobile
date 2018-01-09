import { Injectable } from '@angular/core';
import {SourcesProvider} from "../sources/sources";
import {ServiceClientProvider} from "../service-client/service-client";
import {ContentLanguagesProvider} from "../content-languages/content-languages";
import {Subject} from "rxjs/Subject";

/*
  Generated class for the CategoriesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CategoriesProvider {
  public categoriesUpdated: Subject<any>;
  private selectedLang: string;
  private selectedSourcesUrls: Array<string>;
  private categories: Array<string> = [];

  constructor(private serviceClient: ServiceClientProvider, private sourcesProvider: SourcesProvider,
              private contentLanguages: ContentLanguagesProvider) {
    this.categoriesUpdated = new Subject<any>();
    this.selectedSourcesUrls = this.sourcesProvider.getSelectedSourcesUrls();
    this.sourcesProvider.sourcesUpdated.subscribe((newSources) => {
      this.selectedLang = this.contentLanguages.getSelectedContentLanguage();
      if (newSources.length > 0) {
        this.categories = this.serviceClient.getCategories(this.sourcesProvider.getSelectedSourcesUrls(), this.selectedLang);
        this.categoriesUpdated.next(this.categories);
      }
    }, error => console.error(error));
    if (this.selectedSourcesUrls.length > 0) {
      this.selectedLang = this.contentLanguages.getSelectedContentLanguage();
      this.categories = this.serviceClient.getCategories(this.selectedSourcesUrls, this.selectedLang);
      this.categoriesUpdated.next(this.categories);
    }
  }

  public getSelectedCategories(): Array<string> {
    return this.categories.splice(0);
  }
}
