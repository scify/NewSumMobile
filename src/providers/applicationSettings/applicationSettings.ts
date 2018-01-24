import {Storage} from "@ionic/storage";
import {Injectable} from '@angular/core';
import {ApplicationSettings} from "../../models/applicationSettings";
import {ApiServiceProvider} from "../api-service/apiService";


@Injectable()
export class ApplicationSettingsProvider {

  constructor(private appStorage: Storage,
              private serviceClient: ApiServiceProvider) {
  }


  private getSelectedLanguage(): Promise<string> {
    return this.appStorage.get("selected-language");
  }

  private getSelectedSources(): Promise<Array<string>> {
    return this.appStorage.get("selected-source");
  }

  private getSelectedCategories(): Promise<Array<string>> {
    return this.appStorage.get("selected-categories");
  }

  private getFavoriteCategory(): Promise<string> {
    return this.appStorage.get("favorite-category");
  }

  public setSelectedLanguage(language: string): Promise<any> {
    return this.appStorage.set("selected-language", language);
  }

  public setSelectedSources(selectedSources): Promise<any> {
    return this.appStorage.set("selected-source", selectedSources);
  }

  public setSelectedCategories(selectedCategories): Promise<any> {
    return this.appStorage.set("selected-categories", selectedCategories);
  }

  public setFavoriteCategory(favoriteCategory): Promise<any> {
    return this.appStorage.set("favorite-category", favoriteCategory);
  }

  public getApplicationSettings(): Promise<ApplicationSettings> {
    return new Promise((resolve) => {
      Promise.all([this.getSelectedLanguage(),
        this.getSelectedSources(),
        this.getSelectedCategories(),
        this.getFavoriteCategory()])
        .then(([languageFromStorage, sourcesFromStorage, categoriesFromStorage, favoriteCategoryFromStorage]) => {
          this.checkIfAllApplicationSettingsAreSetOrSetDefaultValues(languageFromStorage,
            sourcesFromStorage,
            categoriesFromStorage,
            favoriteCategoryFromStorage)
            .then(([language, sources, categories, favoriteCategory]) => {
              resolve(new ApplicationSettings(language, sources, categories, favoriteCategory));
            });
        });
    });
  }

  private checkIfAllApplicationSettingsAreSetOrSetDefaultValues(languageFromStorage,
                                                                sourcesFromStorage,
                                                                categoriesFromStorage,
                                                                favoriteCategoryFromStorage): Promise<any> {
    let languagePromise = new Promise((resolveLanguagePromise) => {
      if (languageFromStorage) //language already exists
        resolveLanguagePromise(languageFromStorage);
      else {
        //save to storage
        //todo:fetch from service, get devices information and select proper value from service
        this.setSelectedLanguage("EL").then(() => resolveLanguagePromise("EL"));
      }
    });

    let sourcesPromise = new Promise((resolveSourcesPromise) => {
      if (sourcesFromStorage) //sources already set
        resolveSourcesPromise(sourcesFromStorage);
      else {
        //when we have the language
        languagePromise.then((language) => {
          //fetch from service all sources
          let defaultSources = this.serviceClient.getFeedSources(language);
          //save to storage and we are done! now we have default sources
          this.setSelectedSources(defaultSources)
            .then(() => resolveSourcesPromise(defaultSources));
        });
      }
    });

    let categoriesPromise = new Promise((resolveCategPromise) => {
      if (categoriesFromStorage) //categories already set
        resolveCategPromise(categoriesFromStorage);
      else {
        //when we have the language and the sources
        Promise.all([languagePromise, sourcesPromise]).then(([language, sources]) => {
          //fetch from service, get all categories
          let defaultCategories = this.serviceClient.getCategories(sources, language);
          //save to local storage and we are done! now we have default categories
          this.setSelectedCategories(defaultCategories)
            .then(() => resolveCategPromise(defaultCategories));
        });
      }
    });

    let favoriteCategoryPromise = new Promise((resolveFavCategPromise) => {
      if (favoriteCategoryFromStorage) //favorite category already set
        resolveFavCategPromise(favoriteCategoryFromStorage);
      else {
        categoriesPromise.then((categories) => {
          let defaultFavCategory = categories[0];
          this.setFavoriteCategory(defaultFavCategory).then(() => {
            resolveFavCategPromise(defaultFavCategory);
          });
        })
      }
    });

    return Promise.all([languagePromise, sourcesPromise, categoriesPromise, favoriteCategoryPromise]);
  }

  public getAllAvailableCategories(sources, language){
    return this.serviceClient.getCategories(sources, language);
  }
  public getAllAvailableSources(language:string){
    return this.serviceClient.getFeedSources(language);
  }
}
