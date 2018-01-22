import {Injectable} from '@angular/core';
import {SourcesProvider} from "../sources/sources";
import {ServiceClientProvider} from "../service-client/service-client";
import {ContentLanguagesProvider} from "../content-languages/content-languages";
import {Subject} from "rxjs/Subject";
import {Storage} from "@ionic/storage";
import {BehaviorSubject} from "rxjs/BehaviorSubject";

/*
 Generated class for the CategoriesProvider provider.

 See https://angular.io/guide/dependency-injection for more info on providers
 and Angular DI.
 */
@Injectable()
export class CategoriesProvider {
  public selectedCategoryUpdated: BehaviorSubject<any>;
  public selectedCategoriesUpdated: Subject<any>;
  private favoriteCategory: string;
  private selectedCategory: string;
  private selectedCategories: Array<string> = [];
  private selectedLang: string;
  private allAvailableCategories: Array<string> = [];

  constructor(private serviceClient: ServiceClientProvider, private sourcesProvider: SourcesProvider,
              private contentLanguagesProvider: ContentLanguagesProvider,
              private appStorage: Storage) {
    this.selectedCategoryUpdated = new BehaviorSubject<any>(null);
    this.selectedCategoriesUpdated = new Subject<any>();
    this.initializeDataFromStorage();
    this.sourcesProvider.selectedSourcesUpdated.subscribe(this.sourcesUpdatedHandler.bind(this), error => console.error(error));
  }

  private sourcesUpdatedHandler(newSources){
    let newlySelectedLang = this.contentLanguagesProvider.getSelectedContentLanguage();
    if (newSources.length > 0) {
      this.allAvailableCategories = this.serviceClient.getCategories(this.sourcesProvider.getSelectedSourcesUrls(), newlySelectedLang);
      // when language is set to a different value, update the selected categories accordingly
      if (newlySelectedLang !== this.selectedLang) {
        // make sure to update selected categories only if selected lang has already been initialized
        if (this.selectedLang)
          this.selectedCategories = this.getAllAvailableCategories();
      } else {
        this.refreshSelectedCategories();
      }
      this.setSelectedCategories(this.selectedCategories);
      this.selectedLang = newlySelectedLang;
      this.selectedCategory = this.selectedCategories[0];
      this.selectedCategoryUpdated.next(this.selectedCategory);
    }
  }

  public getAllAvailableCategories(): Array<string> {
    return this.allAvailableCategories.slice(0);
  }

  public getSelectedCategories(): Array<string> {
    if (this.selectedCategories !== null)
      return this.selectedCategories.slice(0);
    else
      return [];
  }

  public getSelectedCategory(): string {
    return this.selectedCategory;
  }

  public getFavoriteCategory(): string {
    return this.favoriteCategory;
  }

  public setSelectedCategories(selectedCategories: Array<string>): Promise<any> {
    this.selectedCategories = selectedCategories;
    this.updateFavoriteCategory();
    this.selectedCategoriesUpdated.next(this.getSelectedCategories());
    return this.appStorage.set('selected-categories', this.selectedCategories.join());
  }

  public setSelectedCategory(newSelectedCategory: string) {
    this.selectedCategory = newSelectedCategory;
    this.selectedCategoryUpdated.next(this.selectedCategory);
  }

  public setFavoriteCategory(newFavoriteCategory: string): Promise<any> {
    this.favoriteCategory = newFavoriteCategory;
    return this.appStorage.set('favorite-category', this.favoriteCategory);
  }

  private getFavoriteCategoryFromStorage(): Promise<any> {
    return this.appStorage.get('favorite-category');
  }

  private getSelectedCategoriesFromStorage(): Promise<any> {
    return this.appStorage.get('selected-categories');
  }

  private updateFavoriteCategory() {
    if (this.selectedCategories.indexOf(this.favoriteCategory) < 0)
      this.setFavoriteCategory(this.selectedCategories[0]);
  }

  public loadNextCategory() {
    let index = this.selectedCategories.indexOf(this.selectedCategory);
    if (index < this.selectedCategory.length - 1) {
      this.setSelectedCategory(this.selectedCategories[index + 1]);
      return true;
    }
    else {
      this.setSelectedCategory(this.selectedCategories[0]); //switch to first
      return true;
    }
  }

  public loadPreviousCategory() {
    let index = this.selectedCategories.indexOf(this.selectedCategory);
    if (index > 0) {
      this.setSelectedCategory(this.selectedCategories[index - 1]);
      return true;
    }
    else {
      this.setSelectedCategory(this.selectedCategories[this.selectedCategories.length - 1]); //switch to last
      return true;
    }
  }

  private initializeDataFromStorage() {
    this.getSelectedCategoriesFromStorage().then((selectedCategories) => {
      this.selectedCategories = selectedCategories ? selectedCategories.split(',') : null;
      this.selectedCategories = this.selectedCategories || this.getAllAvailableCategories();
      this.selectedCategoriesUpdated.next(this.getSelectedCategories());

      this.getFavoriteCategoryFromStorage().then((favoriteCategory) => {
        this.favoriteCategory = favoriteCategory;
        // make sure that favorite category is set
        this.favoriteCategory = (this.favoriteCategory && this.selectedCategories.indexOf(this.favoriteCategory) > 0) ?
          this.favoriteCategory : this.selectedCategories[0];
        this.selectedCategory = this.favoriteCategory;
        this.selectedCategoryUpdated.next(this.selectedCategory);
      }, error => console.error('Could not set properly the categories.'));
    });
  }

  private refreshSelectedCategories() {
    let allAvailableCategories = this.getAllAvailableCategories();
    let currentlySelectedCategories = this.getSelectedCategories();
    this.selectedCategories = currentlySelectedCategories.filter(c => allAvailableCategories.indexOf(c) >= 0);
    if (this.selectedCategories.length === 0)
      this.selectedCategories = this.getAllAvailableCategories();
  }
}
