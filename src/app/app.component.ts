import {Component} from '@angular/core';
import {Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';

import {TabsPage} from '../pages/tabs/tabs';
import {NotificationsProvider} from "../providers/notifications/notifications";
import {ContentLanguagesProvider} from "../providers/content-languages/content-languages";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = TabsPage;

  constructor(platform: Platform,
              statusBar: StatusBar,
              splashScreen: SplashScreen,
              private contentLanguagesProvider: ContentLanguagesProvider,
              public notification: NotificationsProvider) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      this.contentLanguagesProvider.getSelectedContentLanguage().then((lang) => {
        if(lang)
          this.rootPage = TabsPage;
      });
      this.contentLanguagesProvider.contentLanguageUpdated.subscribe((newLang) => {
        console.log("GOT A NEW LANG", newLang);
      });
    });

    if (notification.hasNotification())
      notification.displayNotification();
  }
}
