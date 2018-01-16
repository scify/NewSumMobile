import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { ContentLanguagesProvider } from '../../providers/content-languages/content-languages';
import {AboutPage} from "../about/about";
import { CategoriesProvider } from '../../providers/categories/categories';
import {InAppBrowser} from "@ionic-native/in-app-browser";

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
  public favoriteCategory: string;
  private static availableLanguages: any = {
    'EL': 'Ελληνικά',
    'EN': 'Αγγλικά'
  };

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private alertCtrl: AlertController,
              private contentLanguagesProvider: ContentLanguagesProvider,
              private categoryProvider: CategoriesProvider,
              private iab: InAppBrowser) {
    this.updateDefaultValues();
  }

  ionViewDidLoad() {

  }
  goToAbout(){
    this.navCtrl.push(AboutPage)
  }
  goToPrivacyPolicy(){
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
        this.selectedLangName = SettingsPage.availableLanguages[lang];
        this.contentLanguagesProvider.setSelectedContentLanguage(lang);
        this.updateDefaultValues();
      }
    });

    alert.present();
  }

  public selectFavoriteCategory() {
    let alert = this.alertCtrl.create();
    let favoriteCategory = this.categoryProvider.getFavoriteCategory();
    let categories = this.categoryProvider.getSelectedCategories();
    alert.setTitle('Επιλογή Αγαπημένης Κατηγορίας');    

    for (let i = 0; i < categories.length; i++) {  
      alert.addInput({
        type: 'radio',
        label: categories[i],
        value: categories[i],
        checked: (categories[i] === favoriteCategory)
      });      
    }    

    alert.addButton('ΑΚΥΡΩΣΗ');
    alert.addButton({
      text: 'ΕΠΙΛΟΓΗ',
      handler: (category: string) => {
        this.favoriteCategory = category;
        this.categoryProvider.setFavoriteCategory(category);
      }
    });

    alert.present();
  }

  private updateDefaultValues() {
    this.selectedLangName = SettingsPage.availableLanguages[
      this.contentLanguagesProvider.getSelectedContentLanguage()
      ];
    this.favoriteCategory = this.categoryProvider.getFavoriteCategory();
  }
}
