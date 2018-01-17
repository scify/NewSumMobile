import {Component} from '@angular/core';
import {NavController, NavParams, ViewController} from 'ionic-angular';
import {TopicsProvider} from "../../providers/topics/topics";
import {SummariesProvider} from "../../providers/summaries/summaries";
import {CategoriesProvider} from "../../providers/categories/categories";
import {CategoriesViewManager} from "../../lib/categories-view-manager";
import {GoogleAnalytics} from '@ionic-native/google-analytics';
import {Storage} from "@ionic/storage";


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
  public displaySourcesUponEachSentence: boolean = true;
  public summaryIsConstructedByMoreThanOneSources: boolean;

  constructor(private navCtrl: NavController, private navParams: NavParams,
              private topicsProvider: TopicsProvider,
              private summaryProvider: SummariesProvider,
              private categoriesProvider: CategoriesProvider,
              private ga: GoogleAnalytics,
              private storage: Storage,
              private viewCtrl: ViewController) {

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
      this.summaryIsConstructedByMoreThanOneSources = this.selectedSummary.Sources.length > 1;
      this.ga.trackView("Summary: " + this.selectedTopic.Title);
    }
    storage.ready().then(() => {
      this.storage.get("displaySources").then((val) => {
        this.displaySourcesUponEachSentence = val == 1;
      })
    });
  }

  public toggleDisplaySources() {
    this.storage.set("displaySources", this.displaySourcesUponEachSentence);
  }

  loadSummary(animationDirection) {
    this.navCtrl.push(SummaryPage,{'forcedCategoryTitle':this.selectedCategory,'isSearch':this.isSearch},
      {animate: true, animation: 'ios-transition', direction: animationDirection}).then(() => {
      this.navCtrl.remove(this.viewCtrl.index);
    });
  }

  swipeActivity(event) {
    if (event.direction == 2) {
      if (this.topicsProvider.loadNextTopic(this.isSearch))
        this.loadSummary('forward');

    } else if (event.direction == 4) {
      if (this.topicsProvider.loadPreviousTopic(this.isSearch))
        this.loadSummary('back');
    }
  }

}
