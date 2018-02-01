import {Component, ViewChild} from '@angular/core';
import {NavController, Platform, MenuController} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {TabsPage} from '../pages/tabs/tabs';
import {NotificationsProvider} from "../providers/notifications/notifications";
import {GoogleAnalytics} from '@ionic-native/google-analytics';
import {ScreenOrientation} from '@ionic-native/screen-orientation';
import {SearchResultsPage} from "../pages/search-results/search-results";
import {ImageLoadOptionProvider} from "../providers/image-load-option/image-load-option";
import {TranslateService} from "@ngx-translate/core";
import {ApplicationSettings} from "../models/applicationSettings";
import {LoaderProvider} from "../providers/loader/loader";
import {TopicsProvider} from "../providers/topics/topics";
import {ApplicationSettingsProvider} from "../providers/applicationSettings/applicationSettings";
import {CodePush} from "@ionic-native/code-push";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild('mainNav') navCtrl: NavController;
  rootPage: any = TabsPage;
  availableCategories: Array<string>;
  selectedTheme: string;

  constructor(private platform: Platform,
              private screenOrientation: ScreenOrientation,
              private statusBar: StatusBar,
              private splashScreen: SplashScreen,
              private menuCtrl: MenuController,
              private settingsProvider: ApplicationSettingsProvider,
              private topicsProvider: TopicsProvider,
              private loader: LoaderProvider,
              private ga: GoogleAnalytics,
              private imgLoadProvider: ImageLoadOptionProvider,
              private translate: TranslateService,
              private notification: NotificationsProvider,
              private codePush: CodePush) {

    platform.ready().then(this.platformReadyHandler.bind(this));
    this.settingsProvider.applicationSettingsChanged.subscribe(this.handleApplicationSettingsChange.bind(this));
  }

  private platformReadyHandler() {
    this.statusBar.styleDefault();
    this.rootPage = TabsPage;
    this.loader.showLoader();
    this.splashScreen.hide();
    this.settingsProvider.getApplicationSettings().then((applicationSettings: ApplicationSettings) => {
      this.selectedTheme = applicationSettings.activeTheme.toLowerCase() + '-theme';
      this.translate.setDefaultLang(applicationSettings.language.toLowerCase());
      this.translate.use(applicationSettings.language.toLowerCase());
      this.availableCategories = applicationSettings.categories;
      this.topicsProvider.refreshTopics(applicationSettings.favoriteCategory);
      this.initGoogleAnalytics();
      this.notification.startCheckingForNotifications();
      this.checkForNewUpdates();
    });
    this.screenOrientation.lock('portrait').then(() => console.log('Screen orientation locked successfully'),
      error => console.error('An error occurred while trying to lock screen orientation', error)
    );
  }

  private checkForNewUpdates() {
    if (this.platform.is('cordova')) {
      this.codePush.sync().subscribe((syncStatus) => {
        console.log(syncStatus);
      });

      const downloadProgress = (progress) => {
        console.log(`Downloaded ${progress.receivedBytes} of ${progress.totalBytes}`);
      }
      this.codePush.sync({}, downloadProgress).subscribe((syncStatus) => console.log(syncStatus));
    }
  }

  private handleApplicationSettingsChange(newApplicationSettings: ApplicationSettings) {
    this.selectedTheme = newApplicationSettings.activeTheme.toLowerCase() + '-theme';
    this.availableCategories = newApplicationSettings.categories;
    console.log("refreshing category: " + newApplicationSettings.favoriteCategory);
    this.topicsProvider.refreshTopics(newApplicationSettings.favoriteCategory, true);
  }

  private initGoogleAnalytics() {
    this.ga.startTrackerWithId('UA-31632742-8')
      .then(() => {
        console.log("google analytics started");
      })
      .catch(e => console.log('Error starting GoogleAnalytics', e));
  }

  public selectCategory(newSelectedCategory: string) {
    this.loader.showLoader();
    this.menuCtrl.close();
    this.topicsProvider.refreshTopics(newSelectedCategory);
  }

  public searchForTopic(e: any, searchInput: string) {
    if (e.keyCode === 13 && searchInput) {
      this.navCtrl.push('SearchResultsPage', {keyword: searchInput});
      this.menuCtrl.close();
    }
  }
}
