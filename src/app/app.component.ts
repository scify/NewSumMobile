import {Component, ViewChild} from '@angular/core';
import {NavController, Platform, MenuController} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {TabsPage} from '../pages/tabs/tabs';
import {NotificationsProvider} from "../providers/notifications/notifications";
import {ContentLanguagesProvider} from "../providers/content-languages/content-languages";
import {CategoriesProvider} from "../providers/categories/categories";
import {GoogleAnalytics} from '@ionic-native/google-analytics';
import {ScreenOrientation} from '@ionic-native/screen-orientation';
import {SearchResultsPage} from "../pages/search-results/search-results";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild('mainNav') navCtrl: NavController;
  rootPage: any = TabsPage;
  availableCategories: Array<string>;

  constructor(platform: Platform,
              private statusBar: StatusBar,
              private splashScreen: SplashScreen,
              public menuCtrl: MenuController,
              private contentLanguagesProvider: ContentLanguagesProvider,
              private categoriesProvider: CategoriesProvider,
              private screenOrientation: ScreenOrientation,
              private ga: GoogleAnalytics,
              public notification: NotificationsProvider) {


    platform.ready().then(this.platformReadyHandler.bind(this));


  }

  private platformReadyHandler(){
    this.statusBar.styleDefault();
    // lock portrait orientation, it prevents the summary page from breaking on orientation change
    this.screenOrientation.lock('portrait').then(() => console.log('Screen orientation locked successfully'),
      error => console.error('An error occurred while trying to lock screen orientation', error)
    );
    //todo: display loader.
    //todo:
    this.contentLanguagesProvider.getSelectedContentLanguageFromStorage().then((selectedLang) => {
      if (!!selectedLang)
        this.rootPage = TabsPage; // TODO: set different view if lang is not set
      // splashScreen.hide();
    });

    this.initGoogleAnalytics();
    this.notification.startCheckingForNotifications();
  }

  private initGoogleAnalytics() {
    this.ga.startTrackerWithId('UA-31632742-8')
      .then(() => {
        console.log("google analytics started");
      })
      .catch(e => console.log('Error starting GoogleAnalytics', e));
  }

  public selectCategory(newSelectedCategory: string) {
    this.categoriesProvider.setSelectedCategory(newSelectedCategory);
  }

  public searchForTopic(e: any, searchInput: string) {
    if (e.keyCode === 13 && searchInput) {
      this.navCtrl.push(SearchResultsPage, {keyword: searchInput});
      this.menuCtrl.close();
    }
  }
}
