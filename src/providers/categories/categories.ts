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
  public selectedCategoryUpdated: Subject<any>;
  public categoriesUpdated: Subject<any>;
  private selectedCategory: string;
  private selectedLang: string;
  private selectedSourcesUrls: Array<string>;
  private categories: Array<string> = [];

  constructor(private serviceClient: ServiceClientProvider, private sourcesProvider: SourcesProvider,
              private contentLanguagesProvider: ContentLanguagesProvider) {
    this.selectedCategoryUpdated = new Subject<any>();
    this.categoriesUpdated = new Subject<any>();
    this.selectedSourcesUrls = this.sourcesProvider.getSelectedSourcesUrls();
    this.sourcesProvider.sourcesUpdated.subscribe((newSources) => {
      this.selectedLang = this.contentLanguagesProvider.getSelectedContentLanguage();      
      if (newSources.length > 0) {
        this.categories = this.serviceClient.getCategories(this.sourcesProvider.getSelectedSourcesUrls(), this.selectedLang);
        this.categoriesUpdated.next(this.categories);
        this.selectedCategory = this.categories[0]; // TODO: get the stored selected category
        this.selectedCategoryUpdated.next(this.selectedCategory);
      }
    }, error => console.error(error));
    if (this.selectedSourcesUrls.length > 0) {
      this.selectedLang = this.contentLanguagesProvider.getSelectedContentLanguage();
      this.categories = this.serviceClient.getCategories(this.selectedSourcesUrls, this.selectedLang);
      this.categoriesUpdated.next(this.categories);
      this.selectedCategory = this.categories[0]; // TODO: watch TODO above
      this.selectedCategoryUpdated.next(this.selectedCategory);
    }
  }

  public getSelectedCategories(): Array<string> {
    return this.categories.slice(0);
  }

  public getSelectedCategory(): string {
    // TODO: store and fetch category from storage
    return this.selectedCategory;
  }

  public setSelectedCategory(newSelectedCategory: string) {
    this.selectedCategory = newSelectedCategory;
    this.selectedCategoryUpdated.next(this.selectedCategory);
  }
}
