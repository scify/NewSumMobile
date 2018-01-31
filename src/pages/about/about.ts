import {Component} from '@angular/core';
import {IonicPage,  Platform} from 'ionic-angular';
import {GoogleAnalytics} from '@ionic-native/google-analytics';
import {AppVersion} from '@ionic-native/app-version';

@IonicPage()
@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
})
export class AboutPage {
  public versionCode: string;
  public versionNumber: string;

  constructor(private ga: GoogleAnalytics,
              private appVersion: AppVersion,
              private platform: Platform) {

    this.ga.trackView('About page');

    if (platform.is("cordova"))
    {
      appVersion.getVersionCode().then((versionCode) => {
        this.versionCode = versionCode;
      })
      this.appVersion.getVersionNumber().then((versionNumber) => {
        this.versionNumber = versionNumber;
      })
    }
  }

}
