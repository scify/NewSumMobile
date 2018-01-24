import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {IonicApp, IonicModule, IonicErrorHandler, Alert} from 'ionic-angular';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { AllTopicsPage } from '../pages/all-topics/all-topics';
import { TabsPage } from '../pages/tabs/tabs';
import { HotTopicsPage } from "../pages/hot-topics/hot-topics";
import { SummaryPage } from "../pages/summary/summary";
import { SearchResultsPage } from "../pages/search-results/search-results";
import { SettingsPage } from "../pages/settings/settings";

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { NotificationsProvider } from '../providers/notifications/notifications';
import {HttpClientModule} from "@angular/common/http";
import { IonicStorageModule } from '@ionic/storage';
import { TopicsProvider } from '../providers/topics/topics';
import {ScreenOrientation} from "@ionic-native/screen-orientation";
import {ComponentsModule} from "../components/components.module";
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { ApplicationSettingsProvider } from '../providers/applicationSettings/applicationSettings';
import { LoaderProvider } from '../providers/loader/loader';
import {ApiServiceProvider} from "../providers/api-service/apiService";
import {SoapApiCaller} from "../providers/api-service/soap-api-caller";

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    AllTopicsPage,
    TabsPage,
    HotTopicsPage,
    SummaryPage,
    SearchResultsPage,
    SettingsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {tabsPlacement: 'top'}),
    IonicStorageModule.forRoot(),
    HttpClientModule,
    ComponentsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    AllTopicsPage,
    TabsPage,
    HotTopicsPage,
    SummaryPage,
    SearchResultsPage,
    SettingsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    GoogleAnalytics,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    NotificationsProvider,
    ApiServiceProvider,
    SoapApiCaller,
    TopicsProvider,
    ScreenOrientation,
    ApplicationSettingsProvider,
    LoaderProvider
  ]
})
export class AppModule {}
