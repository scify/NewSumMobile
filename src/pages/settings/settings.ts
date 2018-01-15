import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { ContentLanguagesProvider } from '../../providers/content-languages/content-languages';
import {AboutPage} from "../about/about";
import { CategoriesProvider } from '../../providers/categories/categories';

/**
 * Generated class for the SettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  public selectedLangName: string;
  public favoriteCategory: string;
  private static availableLanguages: any = {
    'EL': 'Ελληνικά',
    'EN': 'Αγγλικά'
  }  

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private alertCtrl: AlertController,
              private contentLanguagesProvider: ContentLanguagesProvider,
              private categoryProvider: CategoriesProvider) {
    this.selectedLangName = SettingsPage.availableLanguages[
      this.contentLanguagesProvider.getSelectedContentLanguage()
    ];
    this.favoriteCategory = this.categoryProvider.getFavoriteCategory();
  }

  ionViewDidLoad() {

  }
  goToAbout(){
    this.navCtrl.push(AboutPage)
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
      }
    });

    alert.present();
  }

  public selectFavoriteCategory() {
    let alert = this.alertCtrl.create();
    let favoriteCategory = this.categoryProvider.getFavoriteCategory();
    let categories = this.categoryProvider.getSelectedCategories();
    alert.setTitle('Επιλογή Αγαπημένης Κατηγορίας');    

    for (let category in categories) {      
      alert.addInput({
        type: 'radio',
        label: category,
        value: category,
        checked: (category === favoriteCategory)
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
}
