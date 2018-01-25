import {Storage} from "@ionic/storage";
import {Injectable} from '@angular/core';
import {ApplicationSettings} from "../../models/applicationSettings";
import {ApiServiceProvider} from "../api-service/apiService";
import {Subject} from "rxjs";


@Injectable()
export class ApplicationSettingsProvider {

  public applicationSettingsChanged: Subject<any>;

  constructor(private appStorage: Storage,
              private serviceClient: ApiServiceProvider) {
    this.applicationSettingsChanged = new Subject();
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

  private setSelectedLanguage(language: string): Promise<any> {
    return this.appStorage.set("selected-language", language);
  }

  private setSelectedSources(selectedSources): Promise<any> {
    return this.appStorage.set("selected-source", selectedSources);
  }

  private setSelectedCategories(selectedCategories): Promise<any> {
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
          console.log(`applicationSettings: ${language}`);
          let defaultSources: Array<string> = this.serviceClient.getFeedSources(language);
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

  public getAllAvailableCategories(sources, language) {
    return this.serviceClient.getCategories(sources, language);
  }

  public getAllAvailableSources(language: string) {
    return this.serviceClient.getFeedSources(language);
  }

  public changeApplicationLanguage(newLanguage: string): Promise<ApplicationSettings> {
    let setLanguagePromise = this.setSelectedLanguage(newLanguage);
    let sources = this.serviceClient.getFeedSources(newLanguage);
    let setSourcesPromise = this.setSelectedSources(sources);
    let categories = this.serviceClient.getCategories(sources, newLanguage);
    let setCategoriesPromise = this.setSelectedCategories(categories);
    let favoriteCategory = categories[0];
    let setFavoritePromise = this.setFavoriteCategory(favoriteCategory);

    //when all writes to local storage complete, fire events
    return new Promise((resolve) => {
      Promise.all([setLanguagePromise, setSourcesPromise, setCategoriesPromise, setFavoritePromise])
        .then(() => {
          let applicationSettings = new ApplicationSettings(newLanguage, sources, categories, favoriteCategory);
          resolve(applicationSettings);
          this.applicationSettingsChanged.next(applicationSettings);
        });
    })
  }

  public changeSelectedSources(newSources): Promise<ApplicationSettings> {
    let getLanguagePromise = this.getSelectedLanguage();

    return new Promise((resolve) => {
      getLanguagePromise.then((language) => {
        let categories = this.serviceClient.getCategories(newSources, language);
        let setCategoriesPromise = this.setSelectedCategories(categories);
        let favoriteCategory = categories[0];
        let setFavoritePromise = this.setFavoriteCategory(favoriteCategory);

        //when all writes to local storage complete, fire events
        Promise.all([setCategoriesPromise, setFavoritePromise])
          .then(() => {
            let applicationSettings = new ApplicationSettings(language, newSources, categories, favoriteCategory);
            resolve(applicationSettings);
            this.applicationSettingsChanged.next(applicationSettings);
          });
      });
    });
  }

  public changeSelectedCategories(newCategories) {
    return new Promise((resolve) => {
      let setCategoriesPromise = this.setSelectedCategories(newCategories);
      let favoriteCategory =newCategories[0];
      let setFavoriteCatPromise = this.setFavoriteCategory(favoriteCategory );
      let getLanguagePromise = this.getSelectedLanguage();
      let getSourcesPromise = this.getSelectedSources();

      Promise.all([getLanguagePromise,getSourcesPromise,setCategoriesPromise,setFavoriteCatPromise])
          .then(([language,sources])=>{
            let applicationSettings = new ApplicationSettings(language, sources, newCategories, favoriteCategory);
            resolve(applicationSettings);
            this.applicationSettingsChanged.next(applicationSettings);
          })
    });
  }

}
