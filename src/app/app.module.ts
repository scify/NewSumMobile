import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {IonicApp, IonicModule} from 'ionic-angular';
import { MyApp } from './app.component';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AllTopicsPage } from '../pages/all-topics/all-topics';
import { TabsPage } from '../pages/tabs/tabs';
import { HotTopicsPage } from "../pages/hot-topics/hot-topics";

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { NotificationsProvider } from '../providers/notifications/notifications';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import { IonicStorageModule } from '@ionic/storage';
import { TopicsProvider } from '../providers/topics/topics';
import {ScreenOrientation} from "@ionic-native/screen-orientation";
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { Network } from '@ionic-native/network';
import { NetworkProvider } from '../providers/network/network';
import { ImageLoadOptionProvider } from '../providers/image-load-option/image-load-option';
import { ApplicationSettingsProvider } from '../providers/applicationSettings/applicationSettings';
import { LoaderProvider } from '../providers/loader/loader';
import {ApiServiceProvider} from "../providers/api-service/apiService";
import {SoapApiCaller} from "../providers/api-service/soap-api-caller";
import {CustomErrorHandler} from "../providers/error/customErrorHandler";
import { CodePush } from '@ionic-native/code-push'
import {AppVersion} from "@ionic-native/app-version";
import {ComponentsModule} from "../components/components.module";
import {TranslateModule} from "@ngx-translate/core";
import {translationServiceConfig} from "./translation-module-config";
import { SummariesProvider } from '../providers/summaries/summaries';





@NgModule({
  declarations: [
    MyApp,
    AllTopicsPage,
    TabsPage,
    HotTopicsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {tabsPlacement: 'top'}),
    IonicStorageModule.forRoot(),
    HttpClientModule,
    ComponentsModule,
    TranslateModule.forRoot(translationServiceConfig)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AllTopicsPage,
    TabsPage,
    HotTopicsPage
  ],
  providers: [
    CodePush,
    StatusBar,
    SplashScreen,
    GoogleAnalytics,
    NotificationsProvider,
    ApiServiceProvider,
    SoapApiCaller,
    TopicsProvider,
    ScreenOrientation,
    ApplicationSettingsProvider,
    LoaderProvider,
    Network,
    NetworkProvider,
    ImageLoadOptionProvider,
    {provide: ErrorHandler, useClass: CustomErrorHandler},
    AppVersion,
    SummariesProvider
  ]
})
export class AppModule {}
