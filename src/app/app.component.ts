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
import {HomePage} from "../pages/home/home";
import {SummariesProvider} from "../providers/summaries/summaries";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = HomePage;

  constructor(platform: Platform,
              statusBar: StatusBar,
              splashScreen: SplashScreen,
              private contentLanguagesProvider: ContentLanguagesProvider,
              private sourcesProvider: SourcesProvider,
              private categoriesProvider: CategoriesProvider,
              private topicsProvider: TopicsProvider,
              private summariesProvider: SummariesProvider,
              public notification: NotificationsProvider) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      this.contentLanguagesProvider.getSelectedContentLanguageFromStorage().then((selectedLang) => {
        if (!!selectedLang)
          this.rootPage = HomePage; // TODO: set different view if lang is not set
        splashScreen.hide();
      });
    });

    if (notification.hasNotification())
      notification.displayNotification();
  }
}
