import {Component} from '@angular/core';
import {NavController, NavParams, AlertController} from 'ionic-angular';
import {AboutPage} from "../about/about";
import {InAppBrowser} from "@ionic-native/in-app-browser";
import {GoogleAnalytics} from '@ionic-native/google-analytics';
import {ApplicationSettingsProvider} from "../../providers/applicationSettings/applicationSettings";
import {ApplicationSettings} from "../../models/applicationSettings";
import _ from "lodash";


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
  private static availableLanguages: any = {
    'EL': 'Ελληνικά',
    'EN': 'Αγγλικά'
  };

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private alertCtrl: AlertController,
              private iab: InAppBrowser,
              protected ga: GoogleAnalytics,
              protected settingsProvider: ApplicationSettingsProvider) {
    this.updateDefaultValues();
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
          this.settingsProvider.setSelectedLanguage(lang)
            .then(() => this.updateDefaultValues());
        }
      });

      alert.present();
    });

  }

  public selectFavoriteCategory() {
    this.settingsProvider.getApplicationSettings().then((applicationSettings: ApplicationSettings) => {
      let alert = this.alertCtrl.create();
      let favoriteCategory = applicationSettings.favoriteCategory;
      let categories = applicationSettings.categories;
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
          this.settingsProvider.setSelectedCategories(selectedCategories)
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
          this.settingsProvider
              .setSelectedSources(selectedSources)
              .then(() => this.updateDefaultValues());

        }
      });

      alert.present();
    });

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
          'Όλες' : selectedSources.length) + ' επιλεγμένες';
    });

  }
}
