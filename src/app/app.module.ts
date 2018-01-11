import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {IonicApp, IonicModule, IonicErrorHandler, Alert} from 'ionic-angular';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { HotTopicsPage } from "../pages/hot-topics/hot-topics";
import { SummaryPage } from "../pages/summary/summary";

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { NotificationsProvider } from '../providers/notifications/notifications';
import { SoapClientProvider } from '../providers/soap-client/soap-client';
import { AlertProvider } from '../providers/alert/alert';
import {HttpClientModule} from "@angular/common/http";
import { ContentLanguagesProvider } from '../providers/content-languages/content-languages';
import { AppStorageProvider } from '../providers/app-storage/app-storage';
import { IonicStorageModule } from '@ionic/storage';
import { SourcesProvider } from '../providers/sources/sources';
import { CategoriesProvider } from '../providers/categories/categories';
import { ServiceClientProvider } from '../providers/service-client/service-client';
import { TopicsProvider } from '../providers/topics/topics';
import { SummariesProvider } from '../providers/summaries/summaries';

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    HotTopicsPage,
    SummaryPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {tabsPlacement: 'top'}),
    IonicStorageModule.forRoot(),
    HttpClientModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    HotTopicsPage,
    SummaryPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    NotificationsProvider,
    SoapClientProvider,
    AlertProvider,
    ContentLanguagesProvider,
    AppStorageProvider,
    SourcesProvider,
    CategoriesProvider,
    ServiceClientProvider,
    TopicsProvider,
    SummariesProvider
  ]
})
export class AppModule {}
