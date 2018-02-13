import {Storage} from "@ionic/storage";
import {Injectable} from '@angular/core';
import {ApplicationSettings} from "../../models/applicationSettings";
import {ApiServiceProvider} from "../api-service/apiService";
import {Subject} from "rxjs";
import {APP_CONFIG} from "../../app/app-config";


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

  private getActiveTheme(): Promise<string> {
    return this.appStorage.get("active-theme");
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

  private setActiveTheme(theme: string): Promise<any> {
    return this.appStorage.set("active-theme", theme);
  }

  public getApplicationSettings(): Promise<ApplicationSettings> {
    return new Promise((resolve) => {
      Promise.all([
        this.getActiveTheme(),
        this.getSelectedLanguage(),
        this.getSelectedSources(),
        this.getSelectedCategories(),
        this.getFavoriteCategory()])
        .then(([activeThemeFromStorage, languageFromStorage, sourcesFromStorage, categoriesFromStorage, favoriteCategoryFromStorage]) => {
          this.checkIfAllApplicationSettingsAreSetOrSetDefaultValues(
            activeThemeFromStorage,
            languageFromStorage,
            sourcesFromStorage,
            categoriesFromStorage,
            favoriteCategoryFromStorage)
            .then(([activeTheme, language, sources, categories, favoriteCategory]) => {
              resolve(new ApplicationSettings(activeTheme, language, sources, categories, favoriteCategory));
            });
        });
    });
  }

  private checkIfAllApplicationSettingsAreSetOrSetDefaultValues(activeThemeFromStorage,
                                                                languageFromStorage,
                                                                sourcesFromStorage,
                                                                categoriesFromStorage,
                                                                favoriteCategoryFromStorage): Promise<any> {
    let activeThemePromise = new Promise((resolveThemePromise) => {
      if (activeThemeFromStorage) {
        resolveThemePromise(activeThemeFromStorage);
      } else {
        // set light as default theme, if none is selected
        let newTheme: string = 'Light';
        this.setActiveTheme(newTheme).then(() => {
          resolveThemePromise(newTheme);
        })
      }
    });

    let languagePromise = new Promise((resolveLanguagePromise) => {
      if (languageFromStorage) //language already exists
        resolveLanguagePromise(languageFromStorage);
      else {
        // get device preferred language
        // (e.g. preferred language might be something like 'en-US' and we only need 'en',
        // so we check if the language is 'el', otherwise it will be 'en')
        let deviceLang = (navigator.language.substr(0, 2).toLowerCase() === 'el') ? 'EL' : 'EN';
        this.setSelectedLanguage(deviceLang).then(() => resolveLanguagePromise(deviceLang));
      }
    });

    let sourcesPromise = new Promise((resolveSourcesPromise) => {
      if (sourcesFromStorage) //sources already set
        resolveSourcesPromise(sourcesFromStorage);
      else {
        //when we have the language
        languagePromise.then((language: string) => {
          //fetch from service all sources
          console.log(`applicationSettings: ${language}`);
          let defaultSources: Array<any> = this.serviceClient.getFeedSources(language);
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
        Promise.all([languagePromise, sourcesPromise]).then((values) => {
          let language: string = values[0].toString();
          let sources: Array<any> = values[1] as Array<any>;
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
        Promise.all([languagePromise, categoriesPromise]).then((values) => {
          // set default favourite category depending on system language, values[0] is the language code
          let defaultFavCategory = APP_CONFIG['defaultFavouriteCategory_' + values[0]];
          this.setFavoriteCategory(defaultFavCategory).then(() => {
            resolveFavCategPromise(defaultFavCategory);
          });
        })
      }
    });

    return Promise.all([activeThemePromise, languagePromise, sourcesPromise, categoriesPromise, favoriteCategoryPromise]);
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
    let favoriteCategory = APP_CONFIG['defaultFavouriteCategory_' + newLanguage];
    let setFavoritePromise = this.setFavoriteCategory(favoriteCategory);
    let getThemePromise = this.getActiveTheme();

    //when all writes to local storage complete, fire events
    return new Promise((resolve) => {
      Promise.all([getThemePromise, setLanguagePromise, setSourcesPromise, setCategoriesPromise, setFavoritePromise])
        .then(([theme]) => {
          let applicationSettings = new ApplicationSettings(theme, newLanguage, sources, categories, favoriteCategory);
          resolve(applicationSettings);
          this.applicationSettingsChanged.next(applicationSettings);
        });
    })
  }

  public changeSelectedSources(newSources): Promise<ApplicationSettings> {
    let getLanguagePromise = this.getSelectedLanguage();

    return new Promise((resolve) => {
      getLanguagePromise.then((language) => {
        let setSourcesPromise = this.setSelectedSources(newSources);
        let categories = this.serviceClient.getCategories(newSources, language);
        let setCategoriesPromise = this.setSelectedCategories(categories);
        let favoriteCategory = categories.indexOf(APP_CONFIG['defaultFavouriteCategory_' + language]) !== -1 ?
          APP_CONFIG['defaultFavouriteCategory_' + language] : categories[0];
        let setFavoritePromise = this.setFavoriteCategory(favoriteCategory);
        let getThemePromise = this.getActiveTheme();

        //when all writes to local storage complete, fire events
        Promise.all([getThemePromise, setSourcesPromise, setCategoriesPromise, setFavoritePromise])
          .then(([theme]) => {
            let applicationSettings = new ApplicationSettings(theme, language, newSources, categories, favoriteCategory);
            resolve(applicationSettings);
            this.applicationSettingsChanged.next(applicationSettings);
          });
      });
    });
  }

  public changeSelectedCategories(newCategories) {
    return new Promise((resolve) => {
      let setCategoriesPromise = this.setSelectedCategories(newCategories);
      // if default favourite category for english exists in newCategories, set it,
      // else check if the favourite category in greek exists and set it, otherwise, just set the first category
      let favoriteCategory = newCategories.indexOf(APP_CONFIG['defaultFavouriteCategory_EN']) !== -1 ?
        APP_CONFIG['defaultFavouriteCategory_EN'] :
          (newCategories.indexOf(APP_CONFIG['defaultFavouriteCategory_EL']) !== -1 ?
            APP_CONFIG['defaultFavouriteCategory_EL'] : newCategories[0]);
      let setFavoriteCatPromise = this.setFavoriteCategory(favoriteCategory );
      let getLanguagePromise = this.getSelectedLanguage();
      let getSourcesPromise = this.getSelectedSources();
      let getThemePromise = this.getActiveTheme();

      Promise.all([getThemePromise, getLanguagePromise,getSourcesPromise,setCategoriesPromise,setFavoriteCatPromise])
          .then(([theme, language,sources])=>{
            let applicationSettings = new ApplicationSettings(theme, language, sources, newCategories, favoriteCategory);
            resolve(applicationSettings);
            this.applicationSettingsChanged.next(applicationSettings);
          })
    });
  }

  public changeActiveTheme(newTheme: string) {
    let setThemePromise = this.setActiveTheme(newTheme);
    let getLanguagePromise = this.getSelectedLanguage();
    let getSourcesPromise = this.getSelectedSources();
    let getCategoriesPromise = this.getSelectedCategories();
    let getFavoritePromise = this.getFavoriteCategory();

    return new Promise((resolve) => {
      Promise.all([setThemePromise, getLanguagePromise, getSourcesPromise, getCategoriesPromise, getFavoritePromise])
        .then(([theme, language, sources, categories, favoriteCategory]) => {
          let applicationSettings = new ApplicationSettings(theme, language, sources, categories, favoriteCategory);
          resolve(applicationSettings);
          this.applicationSettingsChanged.next(applicationSettings);
        });
    })
  }
}
