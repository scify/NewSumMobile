import {Component} from '@angular/core';
import {NavController, NavParams, AlertController, IonicPage} from 'ionic-angular';
import {AboutPage} from "../about/about";
import {InAppBrowser} from "@ionic-native/in-app-browser";
import {GoogleAnalytics} from '@ionic-native/google-analytics';
import {ApplicationSettingsProvider} from "../../providers/applicationSettings/applicationSettings";
import {ApplicationSettings} from "../../models/applicationSettings";
import * as _ from "lodash";
import {ImageLoadOptionProvider} from "../../providers/image-load-option/image-load-option";
import {TranslateService} from "@ngx-translate/core";
import {LoaderProvider} from "../../providers/loader/loader";

@IonicPage()
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
  public selectedTheme: string;
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
  private themeText: string;
  private allText: string;
  private selectedText: string;
  private incorrectSelectionTitleText: string;
  private incorrectSelectionCategoriesText: string;
  private incorrectSelectionSourcesText: string;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private alertCtrl: AlertController,
              private translate: TranslateService,
              private imgLoadProvider: ImageLoadOptionProvider,
              private loader: LoaderProvider,
              private iab: InAppBrowser,
              protected ga: GoogleAnalytics,
              protected settingsProvider: ApplicationSettingsProvider) {


    this.fetchTranslationsAndUpdateDefaultValues(this.translate.currentLang);


    this.translate.onLangChange.subscribe(()=>{console.log("settings: on lang change")});
    this.translate.get("Αll news").subscribe((data)=>console.log(data));

  }

  goToAbout() {
    this.navCtrl.push('AboutPage');
  }

  goToPrivacyPolicy() {
    this.ga.trackView("Privacy policy page");
    const url = "http://www.scify.gr/site/el/impact-areas/169-newsum/433-newsum-privacy-policy";
    this.iab.create(url, "_blank", "location=yes");
  }

  private displayErrorAlert(title: string, message: string) {
    let alert = this.alertCtrl.create();
    alert.setTitle(title);
    alert.setCssClass(this.selectedTheme.toLowerCase() + '-theme');
    alert.setMessage(message);
    alert.addButton('OK');
    alert.present();
  }

  public selectLanguage() {
    this.settingsProvider.getApplicationSettings().then((applicationSettings: ApplicationSettings) => {
      let alert = this.alertCtrl.create();
      let selectedLang = applicationSettings.language;
      alert.setTitle(this.selectText + ' ' + this.languageText);
      alert.setCssClass(this.selectedTheme.toLowerCase() + '-theme');

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
      alert.setCssClass(this.selectedTheme.toLowerCase() + '-theme');

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
      alert.setCssClass(this.selectedTheme.toLowerCase() + '-theme');

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
          if (selectedCategories.length > 0) {
            this.selectedCategoriesStringified = selectedCategories.join();
            this.settingsProvider.changeSelectedCategories(selectedCategories)
              .then(() => this.updateDefaultValues());
          } else {
            this.displayErrorAlert(this.incorrectSelectionTitleText, this.incorrectSelectionCategoriesText);
            return false;
          }
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
      alert.setCssClass(this.selectedTheme.toLowerCase() + '-theme');

      for (let i = 0; i < sources.length; i++) {
        alert.addInput({
          type: 'checkbox',
          label: sources[i].sFeedLabel,
          value: sources[i],
          checked: ((selectedSources.length === 1 && selectedSources[0] === 'ALL') ||
            _.findIndex(selectedSources, (s) => _.isEqual(s, sources[i])) >= 0)
        });
      }
      alert.addButton(this.cancelCapsText);
      alert.addButton({
        text: this.selectCapsText,
        handler: (selectedSources: Array<any>) => {
          if (selectedSources.length > 0) {
          this.settingsProvider.changeSelectedSources(selectedSources.length === sources.length ? ['ALL'] : selectedSources)
            .then(() => this.updateDefaultValues());
          } else {
            this.displayErrorAlert(this.incorrectSelectionTitleText, this.incorrectSelectionSourcesText);
            return false;
          }
        }
      });
      alert.present();
    });
  }

  public selectImagesOption() {
    let alert = this.alertCtrl.create();
    let selectedOption: string = this.imgLoadProvider.getSelectedImageLoadOption();
    alert.setTitle(this.selectText + ' ' + this.imagesLoadText);
    alert.setCssClass(this.selectedTheme.toLowerCase() + '-theme');

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

  public selectTheme() {
    this.settingsProvider.getApplicationSettings().then((applicationSettings: ApplicationSettings) => {
      let alert = this.alertCtrl.create();
      let activeTheme = applicationSettings.activeTheme;
      let themes = ['Dark', 'Light'];
      alert.setTitle(this.selectText + ' ' + this.themeText);
      alert.setCssClass(this.selectedTheme.toLowerCase() + '-theme');

      for (let i = 0; i < themes.length; i++) {
        alert.addInput({
          type: 'radio',
          label: themes[i],
          value: themes[i],
          checked: (themes[i] === activeTheme)
        });
      }

      alert.addButton(this.cancelCapsText);
      alert.addButton({
        text: this.selectCapsText,
        handler: (newTheme: string) => {
          this.settingsProvider.changeActiveTheme(newTheme)
            .then(() => this.updateDefaultValues()
          );
        }
      });

      alert.present();
    });

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
    this.themeText = this.translate.instant("Theme");
    this.allText = this.translate.instant("All");
    this.selectedText = this.translate.instant("selected");
    this.incorrectSelectionTitleText = this.translate.instant("Incorrect Selection");
    this.incorrectSelectionCategoriesText = this.translate.instant("You need to select at least one category");
    this.incorrectSelectionSourcesText = this.translate.instant("You need to select at least one source");
    this.updateDefaultValues();
  }

  private updateDefaultValues() {
    this.settingsProvider.getApplicationSettings().then((applicationSettings: ApplicationSettings) => {
      this.selectedLangName = SettingsPage.availableLanguages[applicationSettings.language];
      this.favoriteCategory = applicationSettings.favoriteCategory;
      let selectedCategories = applicationSettings.categories;
      this.selectedCategoriesStringified = selectedCategories.join();
      let selectedSources = applicationSettings.sources;
      this.selectedSourcesStringified = ((selectedSources.length === 1 && selectedSources[0] === 'ALL') ?
          this.allText : selectedSources.length) + ' ' + this.selectedText;
      this.selectedImagesLoadOption = this.availableImageLoadingOptions[
        this.imgLoadProvider.getSelectedImageLoadOption()
        ];
      this.selectedTheme = applicationSettings.activeTheme;
      this.loader.hideLoader();
    });
  }
}
