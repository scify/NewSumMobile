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
import {TranslateService} from "@ngx-translate/core";

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
    'EN': 'English'
  };
  private availableImageLoadingOptions: any = {};
  private selectCapsText: string;
  private cancelCapsText: string;
  private selectText: string;
  private languageText: string;
  private favoriteCategoryText: string;
  private categoriesText: string;
  private sourcesText: string;
  private imagesLoadText: string;
  private allText: string;
  private selectedText: string;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private alertCtrl: AlertController,
              private translate: TranslateService,
              private contentLanguagesProvider: ContentLanguagesProvider,
              private categoryProvider: CategoriesProvider,
              private sourcesProvider: SourcesProvider,
              private imgLoadProvider: ImageLoadOptionProvider,
              private iab: InAppBrowser,
              protected ga: GoogleAnalytics) {
    this.fetchTranslations(this.translate.getDefaultLang());
    this.updateDefaultValues();
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
    alert.setTitle(this.selectText + ' ' + this.languageText);

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

    alert.addButton(this.cancelCapsText);
    alert.addButton({
      text: this.selectCapsText,
      handler: (lang: string) => {
        this.selectedLangName = SettingsPage.availableLanguages[lang];
        this.contentLanguagesProvider.setSelectedContentLanguage(lang);
        this.translate.setDefaultLang(lang.toLowerCase());
        this.fetchTranslations(lang.toLowerCase());
      }
    });

    alert.present();
  }

  public selectFavoriteCategory() {
    let alert = this.alertCtrl.create();
    let favoriteCategory = this.categoryProvider.getFavoriteCategory();
    let categories = this.categoryProvider.getSelectedCategories();
    alert.setTitle(this.selectText + ' ' + this.favoriteCategoryText);

    for (let i = 0; i < categories.length; i++) {
      alert.addInput({
        type: 'radio',
        label: categories[i],
        value: categories[i],
        checked: (categories[i] === favoriteCategory)
      });
    }

    alert.addButton(this.cancelCapsText);
    alert.addButton({
      text: this.selectCapsText,
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
    alert.setTitle(this.selectText + ' ' + this.categoriesText);

    for (let i = 0; i < categories.length; i++) {
      alert.addInput({
        type: 'checkbox',
        label: categories[i],
        value: categories[i],
        checked: (selectedCategories.indexOf(categories[i]) >= 0)
      });
    }

    alert.addButton(this.cancelCapsText);
    alert.addButton({
      text: this.selectCapsText,
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
    alert.setTitle(this.selectText + ' ' + this.sourcesText);

    for (let i = 0; i < sources.length; i++) {
      alert.addInput({
        type: 'checkbox',
        label: sources[i].sFeedLabel,
        value: sources[i],
        checked: (_.findIndex(selectedSources, (s) => _.isEqual(s, sources[i])) >= 0)
      });
    }

    alert.addButton(this.cancelCapsText);
    alert.addButton({
      text: this.selectCapsText,
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
    alert.setTitle(this.selectText + ' ' + this.imagesLoadText);

    for (let prop in this.availableImageLoadingOptions) {
      if (this.availableImageLoadingOptions.hasOwnProperty(prop)) {
        alert.addInput({
          type: 'radio',
          label: this.availableImageLoadingOptions[prop],
          value: prop,
          checked: (prop === selectedOption)
        });
      }
    }

    alert.addButton(this.cancelCapsText);
    alert.addButton({
      text: this.selectCapsText,
      handler: (imgOption: string) => {
        this.imgLoadProvider.setSelectedImageLoadOption(imgOption);
        this.updateDefaultValues();
      }
    });

    alert.present();
  }

  private fetchTranslations(lang: string) {
    this.translate.reloadLang(lang).subscribe((translation) => {
      this.availableImageLoadingOptions.all = translation["Always load images"];
      this.availableImageLoadingOptions.wifi = translation["Load images only with WiFi"];
      this.selectCapsText = translation["SELECT"];
      this.cancelCapsText = translation["CANCEL"];
      this.selectText = translation["Select"];
      this.languageText = translation["Language"];
      this.favoriteCategoryText = translation["Favorite Category2"];
      this.categoriesText = translation["Categories"];
      this.sourcesText = translation["Sources"];
      this.imagesLoadText = translation["Images Load2"];
      this.allText = translation["All"];
      this.selectedText = translation["selected"];
      this.updateDefaultValues();
    });
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
      this.allText : selectedSources.length) + ' ' + this.selectedText;
    this.selectedImagesLoadOption = this.availableImageLoadingOptions[
      this.imgLoadProvider.getSelectedImageLoadOption()
    ];
  }
}
