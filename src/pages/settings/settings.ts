import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { ContentLanguagesProvider } from '../../providers/content-languages/content-languages';
import {AboutPage} from "../about/about";
import {InAppBrowser} from "@ionic-native/in-app-browser";
import {GoogleAnalytics} from '@ionic-native/google-analytics';

/**
 * Generated class for the SettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
  providers:[InAppBrowser]
})
export class SettingsPage {
  public selectedLangName: string;
  private static availableLanguages: any = {
    'EL': 'Ελληνικά',
    'EN': 'Αγγλικά'
  }

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private alertCtrl: AlertController,
              private contentLanguagesProvider: ContentLanguagesProvider,
              private iab: InAppBrowser,
              protected ga: GoogleAnalytics) {
    this.selectedLangName = SettingsPage.availableLanguages[
      this.contentLanguagesProvider.getSelectedContentLanguage()
    ];
  }

  ionViewDidLoad() {

  }
  goToAbout(){
    this.navCtrl.push(AboutPage)
  }
  goToPrivacyPolicy(){
    this.ga.trackView("Privacy policy page");
    const url = "http://www.scify.gr/site/el/impact-areas/169-newsum/433-newsum-privacy-policy";
    this.iab.create(url , "_blank", "location=yes");
  }

  public selectLanguage() {
    let alert = this.alertCtrl.create();
    let selectedLang = this.contentLanguagesProvider.getSelectedContentLanguage();
    alert.setTitle('Επιλογή Γλώσσας');

    for (let prop in SettingsPage.availableLanguages) {
      if (SettingsPage.availableLanguages.hasOwnProperty(prop)) {
        alert.addInput({
          type: 'radio',
          label: SettingsPage.availableLanguages[prop],
          value: prop,
          checked: (prop === selectedLang)
        });
      }
    }

    alert.addButton('ΑΚΥΡΩΣΗ');
    alert.addButton({
      text: 'ΕΠΙΛΟΓΗ',
      handler: (lang: string) => {
        this.selectedLangName = SettingsPage.availableLanguages[lang]
        this.contentLanguagesProvider.setSelectedContentLanguage(lang);
      }
    });

    alert.present();
  }
}
