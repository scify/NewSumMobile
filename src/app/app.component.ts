import {Component} from '@angular/core';
import {Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {TabsPage} from '../pages/tabs/tabs';
import {NotificationsProvider} from "../providers/notifications/notifications";
import {ContentLanguagesProvider} from "../providers/content-languages/content-languages";
import {SourcesProvider} from "../providers/sources/sources";
import {CategoriesProvider} from "../providers/categories/categories";
import {TopicsProvider} from "../providers/topics/topics";
import {SummariesProvider} from "../providers/summaries/summaries";
import { GoogleAnalytics } from '@ionic-native/google-analytics';

import { ScreenOrientation } from '@ionic-native/screen-orientation';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = TabsPage;
  availableCategories: Array<string>;

  constructor(platform: Platform,
              statusBar: StatusBar,
              splashScreen: SplashScreen,
              private contentLanguagesProvider: ContentLanguagesProvider,
              private sourcesProvider: SourcesProvider,
              private categoriesProvider: CategoriesProvider,
              private topicsProvider: TopicsProvider,
              private summariesProvider: SummariesProvider,
              private screenOrientation: ScreenOrientation,
              public notification: NotificationsProvider,
              private ga: GoogleAnalytics) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      // lock portrait orientation, it prevents the summary page from breaking on orientation change
      this.screenOrientation.lock('portrait').then(() => console.log('Screen orientation locked successfully'),
          error => console.error('An error occurred while trying to lock screen orientation', error)
      );
      this.contentLanguagesProvider.getSelectedContentLanguageFromStorage().then((selectedLang) => {
        if (!!selectedLang)
          this.rootPage = TabsPage; // TODO: set different view if lang is not set
        splashScreen.hide();
      });
      this.availableCategories = this.categoriesProvider.getSelectedCategories();
      this.categoriesProvider.categoriesUpdated.subscribe((newCategories) => {
        this.availableCategories = newCategories;
      });

      this.initGoogleAnalytics();

    });

    if (notification.hasNotification())
      notification.displayNotification();
  }

  private initGoogleAnalytics(){
    this.ga.startTrackerWithId('UA-31632742-8')
      .then(() => {
        console.log("google analytics started");
      })
      .catch(e => console.log('Error starting GoogleAnalytics', e));
  }

  public selectCategory(newSelectedCategory: string) {
    this.categoriesProvider.setSelectedCategory(newSelectedCategory);
  }
}
