import { Injectable } from '@angular/core';
import {SourcesProvider} from "../sources/sources";
import {ServiceClientProvider} from "../service-client/service-client";
import {ContentLanguagesProvider} from "../content-languages/content-languages";
import {Subject} from "rxjs/Subject";
import { AppStorageProvider } from '../app-storage/app-storage';

/*
  Generated class for the CategoriesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CategoriesProvider {
  public selectedCategoryUpdated: Subject<any>;
  public categoriesUpdated: Subject<any>;
  private favoriteCategory: string;
  private selectedCategory: string;
  private selectedLang: string;
  private selectedSourcesUrls: Array<string>;
  private categories: Array<string> = [];

  constructor(private serviceClient: ServiceClientProvider, private sourcesProvider: SourcesProvider,
              private contentLanguagesProvider: ContentLanguagesProvider,
              private appStorage: AppStorageProvider) {
    this.selectedCategoryUpdated = new Subject<any>();
    this.categoriesUpdated = new Subject<any>();
    this.selectedSourcesUrls = this.sourcesProvider.getSelectedSourcesUrls();
    this.sourcesProvider.sourcesUpdated.subscribe((newSources) => {
      let newlySelectedLang = this.contentLanguagesProvider.getSelectedContentLanguage();
      if (newSources.length > 0) {
        this.categories = this.serviceClient.getCategories(this.sourcesProvider.getSelectedSourcesUrls(), newlySelectedLang);
        this.categoriesUpdated.next(this.categories);
        // when language is set to a different value, update the favorite category as well
        if (newlySelectedLang !== this.selectedLang) {
          this.favoriteCategory = this.categories[0];
          this.setFavoriteCategory(this.favoriteCategory);
        }
        this.selectedLang = newlySelectedLang;
        this.selectedCategory = this.categories[0];
        this.selectedCategoryUpdated.next(this.selectedCategory);
      }
    }, error => console.error(error));
    if (this.selectedSourcesUrls.length > 0) {
      this.selectedLang = this.contentLanguagesProvider.getSelectedContentLanguage();
      this.categories = this.serviceClient.getCategories(this.selectedSourcesUrls, this.selectedLang);
      this.categoriesUpdated.next(this.categories);
      this.getFavoriteCategoryFromStorage().then((favoriteCategory) => {
        this.favoriteCategory = favoriteCategory;
        // make sure that favorite category is set
        this.favoriteCategory = this.favoriteCategory || this.categories[0];
        this.selectedCategory = this.favoriteCategory;      
        this.selectedCategoryUpdated.next(this.selectedCategory);
      }, error => console.error('Could not set properly the categories.'));            
    }
  }

  public getSelectedCategories(): Array<string> {
    return this.categories.slice(0);
  }

  public getSelectedCategory(): string {    
    return this.selectedCategory;
  }

  public getFavoriteCategory(): string {
    console.error(this.favoriteCategory);
    return this.favoriteCategory;
  }

  public setSelectedCategory(newSelectedCategory: string) {
    this.selectedCategory = newSelectedCategory;
    this.selectedCategoryUpdated.next(this.selectedCategory);
  }

  public setFavoriteCategory(newFavoriteCategory: string) {
    this.favoriteCategory = newFavoriteCategory;
    this.appStorage.set('favorite-category', this.favoriteCategory);
  }

  private getFavoriteCategoryFromStorage(): Promise<any> {
    return this.appStorage.get('favorite-category');
  }
}
