import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {TopicsProvider} from "../../providers/topics/topics";
import {SummariesProvider} from "../../providers/summaries/summaries";
import {CategoriesProvider} from "../../providers/categories/categories";
import {CategoriesViewManager} from "../../lib/categories-view-manager";
import {GoogleAnalytics} from '@ionic-native/google-analytics';

/**
 * Generated class for the SummaryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-summary',
  templateUrl: 'summary.html',
})
export class SummaryPage {

  public selectedCategory: string;
  public selectedCategoryDefaultImage: string;
  public selectedTopic: any;
  public selectedSummary: any;
  public isSearch: boolean;

  constructor(private navCtrl: NavController, private navParams: NavParams, private topicsProvider: TopicsProvider,
              private summaryProvider: SummariesProvider, private categoriesProvider: CategoriesProvider,
              protected ga: GoogleAnalytics) {
    this.selectedSummary = this.summaryProvider.getSummary();
    this.isSearch = this.navParams.get('isSearch');
    if (this.selectedSummary) {
      if (!this.isSearch) {
        this.selectedCategory = this.categoriesProvider.getSelectedCategory();
        this.selectedCategoryDefaultImage = CategoriesViewManager.getCategoryDefaultImage(this.selectedCategory);
      } else {
        this.selectedCategory = this.navParams.get('forcedCategoryTitle');
        this.selectedCategoryDefaultImage = CategoriesViewManager.getCategoryDefaultImage('Search');
      }
      this.selectedTopic = this.topicsProvider.getSelectedTopic();
      this.ga.trackView("Summary: " + this.selectedTopic.Title);
    }
  }
}
