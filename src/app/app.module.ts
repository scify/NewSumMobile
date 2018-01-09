import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {IonicApp, IonicModule, IonicErrorHandler, Alert} from 'ionic-angular';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

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

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    HttpClientModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage
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
    ServiceClientProvider
  ]
})
export class AppModule {}
