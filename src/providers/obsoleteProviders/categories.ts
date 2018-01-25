import {Injectable} from '@angular/core';
import {SourcesProvider} from "./sources";
import {Subject} from "rxjs/Subject";
import {Storage} from "@ionic/storage";
import {CategoryUpdatedInfo} from "../../models/categoryUpdatedInfo";
import {SelectTopicEnum} from "../../models/selectTopicEnum";
import {ApiServiceProvider} from "../api-service/apiService";

@Injectable()
export class CategoriesProvider {
  public selectedCategoryUpdated: Subject<any>;
  public selectedCategoriesUpdated: Subject<any>;
  private favoriteCategory: string;
  private selectedCategory: string;
  private selectedCategories: Array<string> = [];
  private selectedLang: string;
  private allAvailableCategories: Array<string> = [];

  constructor(private serviceClient: ApiServiceProvider,
              private sourcesProvider: SourcesProvider,
              private appStorage: Storage) {
    this.selectedCategoryUpdated = new Subject<any>();
    this.selectedCategoriesUpdated = new Subject<any>();
    //this.sourcesProvider.selectedSourcesUpdated.subscribe(this.sourcesUpdatedHandler.bind(this), error => console.error(error));
  }

/*
  private sourcesUpdatedHandler(newSources) {
    console.log("sources updated handler");
    //todo:
    // sources changed. Refresh
    // 1. selectedCategories
    // 2. favoriteCategory
    // 3. all categories
    // raise event that category changed
    let newlySelectedLang = this.contentLanguagesProvider.getSelectedContentLanguage();
    if (newSources.length > 0) {
      this.allAvailableCategories = this.serviceClient.getCategories(this.sourcesProvider.getSelectedSourcesUrls(), newlySelectedLang);
      // when language is set to a different value, update the selected categories accordingly
      if (newlySelectedLang !== this.selectedLang) {
        // make sure to update selected categories only if selected lang has already been initialized
        if (this.selectedLang) // this is not defined
          this.selectedCategories = this.getAllAvailableCategories(); //categories is null
      } else {
        this.refreshSelectedCategories();
      }
      this.setSelectedCategories(this.selectedCategories);
      this.selectedLang = newlySelectedLang;
      this.selectedCategory = this.selectedCategories[0];
      this.selectedCategoryUpdated.next(new CategoryUpdatedInfo(this.selectedCategory, null));
    }
  }

  public getAllAvailableCategories(): Promise<Array<string>> {
    return new Promise((resolve, reject) => {
      this.allAvailableCategories = this.serviceClient.getCategories(
             this.sourcesProvider.getSelectedSourcesUrls() //todo: <-- this should return a promise
           , this.contentLanguagesProvider.getSelectedContentLanguage()); //todo: <-- this should return a promise
      resolve(this.allAvailableCategories);

    });
  }

  public getSelectedCategories(): Promise {
    return new Promise((resolve, reject) => {
      //if we already have the value read from local storage,
      this.getSelectedCategoriesFromStorage()
        .then((selectedCategories) => {
          resolve(this.selectedCategories);

          if (selectedCategories) {
            this.selectedCategories = selectedCategories.split(',');
            resolve(this.selectedCategories);
          }
          else {
            this.getAllAvailableCategories()
                .then((allCategories)=> this.setSelectedCategories(allCategories));

          }
        }, (error) => reject(error));
    });
  }

  public setSelectedCategories(selectedCategories: Array<string>): Promise<any> {
    this.selectedCategories = selectedCategories;
    this.updateFavoriteCategory();
    this.selectedCategoriesUpdated.next(this.getSelectedCategories());
    return this.appStorage.set('selected-categories', this.selectedCategories.join());
  }

  public getSelectedCategory(): string {
    return this.selectedCategory;
  }

  public getFavoriteCategory(): Promise {
    return new Promise((resolve, reject) => {
      this.getFavoriteCategoryFromStorage().then((favoriteCategory) => {
        // make sure that favorite category is set
        this.favoriteCategory = (favoriteCategory && this.selectedCategories.indexOf(favoriteCategory) > 0) ?
          favoriteCategory : this.selectedCategories[0];
       //this should be set by the setter of getFavoriteCategory
        //this.selectedCategory = this.favoriteCategory;
        resolve(this.favoriteCategory);
      }, (error) => reject(error));
    });
  }

  public setFavoriteCategory(newFavoriteCategory: string): Promise<any> {
    this.favoriteCategory = newFavoriteCategory;
    return this.appStorage.set('favorite-category', this.favoriteCategory);
  }


  public setSelectedCategory(newSelectedCategory: string, topicToSelect?: SelectTopicEnum) {
    this.selectedCategory = newSelectedCategory;
    this.selectedCategoryUpdated.next(new CategoryUpdatedInfo(this.selectedCategory, topicToSelect));
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

  public loadNextCategory(selectTopicEnum?: SelectTopicEnum) {
    let index = this.selectedCategories.indexOf(this.selectedCategory);
    if (index < this.selectedCategory.length - 1) {
      this.setSelectedCategory(this.selectedCategories[index + 1], selectTopicEnum);
      return true;
    }
    else {
      this.setSelectedCategory(this.selectedCategories[0], selectTopicEnum); //switch to first
      return true;
    }
  }

  public loadPreviousCategory(selectTopicEnum?: SelectTopicEnum) {
    let index = this.selectedCategories.indexOf(this.selectedCategory);
    if (index > 0) {
      this.setSelectedCategory(this.selectedCategories[index - 1], selectTopicEnum);
      return true;
    }
    else {
      this.setSelectedCategory(this.selectedCategories[this.selectedCategories.length - 1], selectTopicEnum); //switch to last
      return true;
    }
  }


   private
   initializeSelectedAndFavoriteCategories() {
   let promise1 = this.getSelectedCategoriesFromStorage().then((selectedCategories) => {
   if (selectedCategories) {
   this.selectedCategories = selectedCategories ? selectedCategories.split(',') : null;
   this.selectedCategories = this.selectedCategories || this.getAllAvailableCategories();
   //this.selectedCategoriesUpdated.next(this.getSelectedCategories());
   this.getFavoriteCategoryFromStorage().then((favoriteCategory) => {
   this.favoriteCategory = favoriteCategory;
   // make sure that favorite category is set
   this.favoriteCategory = (this.favoriteCategory && this.selectedCategories.indexOf(this.favoriteCategory) > 0) ?
   this.favoriteCategory : this.selectedCategories[0];
   this.selectedCategory = this.favoriteCategory;
   //this.selectedCategoryUpdated.next(new CategoryUpdatedInfo(this.selectedCategory, null));
   })
   }
   });

   return promise1;
   }

  private refreshSelectedCategories() {
    let allAvailableCategories = this.getAllAvailableCategories();
    let currentlySelectedCategories = this.getSelectedCategories();
    this.selectedCategories = currentlySelectedCategories.filter(c => allAvailableCategories.indexOf(c) >= 0);
    if (this.selectedCategories.length === 0)
      this.selectedCategories = this.getAllAvailableCategories();
  }*/
}
