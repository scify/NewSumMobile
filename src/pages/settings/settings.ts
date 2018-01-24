import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { ContentLanguagesProvider } from '../../providers/content-languages/content-languages';
import {AboutPage} from "../about/about";
import { CategoriesProvider } from '../../providers/categories/categories';
import {InAppBrowser} from "@ionic-native/in-app-browser";
import {GoogleAnalytics} from '@ionic-native/google-analytics';
import {SourcesProvider} from "../../providers/sources/sources";
import * as _ from 'lodash';
import {ImageLoadOptionProvider} from "../../providers/image-load-option/image-load-option";
import {TranslationsProvider} from "../../providers/translations/translations";

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
  public selectedCategoriesStringified: string;
  public selectedSourcesStringified: string;
  public selectedImagesLoadOption: string;
  private static availableLanguages: any = {
    'EL': 'Ελληνικά',
    'EN': 'Αγγλικά'
  };
  private static availableImageLoadingOptions: any = {
    'all': 'Φόρτωση εικόνων πάντοτε',
    'wifi': 'Φόρτωση εικόνων μόνο στο WiFi'
  };

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private alertCtrl: AlertController,
              private translationsProvider: TranslationsProvider,
              private contentLanguagesProvider: ContentLanguagesProvider,
              private categoryProvider: CategoriesProvider,
              private sourcesProvider: SourcesProvider,
              private imgLoadProvider: ImageLoadOptionProvider,
              private iab: InAppBrowser,
              protected ga: GoogleAnalytics) {
    this.updateDefaultValues();
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
        this.selectedLangName = SettingsPage.availableLanguages[lang];
        this.contentLanguagesProvider.setSelectedContentLanguage(lang);
        this.translationsProvider.setLanguage(lang);
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

  public selectCategories() {
    let alert = this.alertCtrl.create();
    let selectedCategories = this.categoryProvider.getSelectedCategories();
    let categories = this.categoryProvider.getAllAvailableCategories();
    alert.setTitle('Επιλογή Κατηγοριών');

    for (let i = 0; i < categories.length; i++) {
      alert.addInput({
        type: 'checkbox',
        label: categories[i],
        value: categories[i],
        checked: (selectedCategories.indexOf(categories[i]) >= 0)
      });
    }

    alert.addButton('ΑΚΥΡΩΣΗ');
    alert.addButton({
      text: 'ΕΠΙΛΟΓΗ',
      handler: (selectedCategories: Array<string>) => {
        this.selectedCategoriesStringified = selectedCategories.join();
        this.categoryProvider.setSelectedCategories(selectedCategories);
        this.updateDefaultValues();
      }
    });

    alert.present();
  }

  public selectSources() {
    let alert = this.alertCtrl.create();
    let selectedSources = this.sourcesProvider.getSelectedSources();
    let sources = this.sourcesProvider.getAllAvailableSources();
    alert.setTitle('Επιλογή Πηγών');

    for (let i = 0; i < sources.length; i++) {
      alert.addInput({
        type: 'checkbox',
        label: sources[i].sFeedLabel,
        value: sources[i],
        checked: (_.findIndex(selectedSources, (s) => _.isEqual(s, sources[i])) >= 0)
      });
    }

    alert.addButton('ΑΚΥΡΩΣΗ');
    alert.addButton({
      text: 'ΕΠΙΛΟΓΗ',
      handler: (selectedSources: Array<any>) => {
        this.selectedSourcesStringified = selectedSources.join();
        this.sourcesProvider.setSelectedSources(selectedSources);
        this.updateDefaultValues();
      }
    });

    alert.present();
  }

  public selectImagesOption() {
    let alert = this.alertCtrl.create();
    let selectedOption: string = this.imgLoadProvider.getSelectedImageLoadOption();
    alert.setTitle('Επιλογή Φόρτωσης Εικόνων');

    for (let prop in SettingsPage.availableImageLoadingOptions) {
      if (SettingsPage.availableImageLoadingOptions.hasOwnProperty(prop)) {
        alert.addInput({
          type: 'radio',
          label: SettingsPage.availableImageLoadingOptions[prop],
          value: prop,
          checked: (prop === selectedOption)
        });
      }
    }

    alert.addButton('ΑΚΥΡΩΣΗ');
    alert.addButton({
      text: 'ΕΠΙΛΟΓΗ',
      handler: (imgOption: string) => {
        this.imgLoadProvider.setSelectedImageLoadOption(imgOption);
        this.updateDefaultValues();
      }
    });

    alert.present();
  }

  private updateDefaultValues() {
    this.selectedLangName = SettingsPage.availableLanguages[
      this.contentLanguagesProvider.getSelectedContentLanguage()
    ];
    this.favoriteCategory = this.categoryProvider.getFavoriteCategory();
    let selectedCategories = this.categoryProvider.getSelectedCategories();
    this.selectedCategoriesStringified = selectedCategories.join();
    let selectedSources = this.sourcesProvider.getSelectedSources();
    let allAvailableSources = this.sourcesProvider.getAllAvailableSources();
    this.selectedSourcesStringified = ((selectedSources.length === allAvailableSources.length) ?
      'Όλες' : selectedSources.length) + ' επιλεγμένες';
    this.selectedImagesLoadOption = SettingsPage.availableImageLoadingOptions[
      this.imgLoadProvider.getSelectedImageLoadOption()
    ];
  }
}
