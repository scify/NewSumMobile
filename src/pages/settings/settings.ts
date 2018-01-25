import {Component} from '@angular/core';
import {NavController, NavParams, AlertController} from 'ionic-angular';
import {AboutPage} from "../about/about";
import {InAppBrowser} from "@ionic-native/in-app-browser";
import {GoogleAnalytics} from '@ionic-native/google-analytics';
import {ApplicationSettingsProvider} from "../../providers/applicationSettings/applicationSettings";
import {ApplicationSettings} from "../../models/applicationSettings";
import * as _ from "lodash";
import {ImageLoadOptionProvider} from "../../providers/image-load-option/image-load-option";
import {TranslateService} from "@ngx-translate/core";
import {LoaderProvider} from "../../providers/loader/loader";


@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
  providers: [InAppBrowser]
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
              private imgLoadProvider: ImageLoadOptionProvider,
              private loader: LoaderProvider,
              private iab: InAppBrowser,
              protected ga: GoogleAnalytics,
              protected settingsProvider: ApplicationSettingsProvider) {


    this.fetchTranslationsAndUpdateDefaultValues(this.translate.currentLang);

  }

  goToAbout() {
    this.navCtrl.push(AboutPage)
  }

  goToPrivacyPolicy() {
    this.ga.trackView("Privacy policy page");
    const url = "http://www.scify.gr/site/el/impact-areas/169-newsum/433-newsum-privacy-policy";
    this.iab.create(url, "_blank", "location=yes");
  }

  public selectLanguage() {
    this.settingsProvider.getApplicationSettings().then((applicationSettings: ApplicationSettings) => {
      let alert = this.alertCtrl.create();
      let selectedLang = applicationSettings.language;
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
          if (lang != selectedLang)
            this.handleLanguageChange(lang);
        }
      });
      alert.present();
    });
  }

  private handleLanguageChange(lang) {
    this.loader.showLoader();
    this.selectedLangName = SettingsPage.availableLanguages[lang];
    this.settingsProvider
      .changeApplicationLanguage(lang)
      .then(() => {
        this.translate.use(lang.toLowerCase()).subscribe(() => {
          this.fetchTranslationsAndUpdateDefaultValues(lang.toLowerCase());// update translations at this page;
        }); //update translation service
      });
  }

  public selectFavoriteCategory() {
    this.settingsProvider.getApplicationSettings().then((applicationSettings: ApplicationSettings) => {
      let alert = this.alertCtrl.create();
      let favoriteCategory = applicationSettings.favoriteCategory;
      let categories = applicationSettings.categories;
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
          this.settingsProvider.setFavoriteCategory(category);
        }
      });

      alert.present();
    });

  }

  public selectCategories() {
    this.settingsProvider.getApplicationSettings().then((applicationSettings: ApplicationSettings) => {
      let alert = this.alertCtrl.create();
      let selectedCategories = applicationSettings.categories;
      let categories = this.settingsProvider.getAllAvailableCategories(applicationSettings.sources, applicationSettings.language);
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
          this.settingsProvider.changeSelectedCategories(selectedCategories)
            .then(() => this.updateDefaultValues());
        }
      });

      alert.present();
    });

  }

  public selectSources() {
    this.settingsProvider.getApplicationSettings().then((applicationSettings: ApplicationSettings) => {
      let alert = this.alertCtrl.create();
      let selectedSources = applicationSettings.sources;
      let sources = this.settingsProvider.getAllAvailableSources(applicationSettings.language);
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
          this.settingsProvider.changeSelectedSources(selectedSources)
            .then(() => this.updateDefaultValues());
        }
      });
      alert.present();
    });
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


  private fetchTranslationsAndUpdateDefaultValues(lang: string) {
    this.availableImageLoadingOptions.all = this.translate.instant("Always load images");
    this.availableImageLoadingOptions.wifi = this.translate.instant("Load images only with WiFi");
    this.selectCapsText = this.translate.instant("SELECT");
    this.cancelCapsText = this.translate.instant("CANCEL");
    this.selectText = this.translate.instant("Select");
    this.languageText = this.translate.instant("Language");
    this.favoriteCategoryText = this.translate.instant("Favorite Category2");
    this.categoriesText = this.translate.instant("Categories");
    this.sourcesText = this.translate.instant("Sources");
    this.imagesLoadText = this.translate.instant("Images Load2");
    this.allText = this.translate.instant("All");
    this.selectedText = this.translate.instant("selected");
    this.updateDefaultValues();
  }

  private updateDefaultValues() {
    this.settingsProvider.getApplicationSettings().then((applicationSettings: ApplicationSettings) => {
      this.selectedLangName = SettingsPage.availableLanguages[applicationSettings.language];
      this.favoriteCategory = applicationSettings.favoriteCategory;
      let selectedCategories = applicationSettings.categories;
      this.selectedCategoriesStringified = selectedCategories.join();
      let selectedSources = applicationSettings.sources;
      let allAvailableSources = this.settingsProvider.getAllAvailableSources(applicationSettings.language);
      this.selectedSourcesStringified = ((selectedSources.length === allAvailableSources.length) ?
          this.allText : selectedSources.length) + ' ' + this.selectedText;
      this.selectedImagesLoadOption = this.availableImageLoadingOptions[
        this.imgLoadProvider.getSelectedImageLoadOption()
        ];

      this.loader.hideLoader();
    });
  }
}
