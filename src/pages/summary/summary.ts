import {Component} from '@angular/core';
import {NavController, NavParams, ViewController} from 'ionic-angular';
import {TopicsProvider} from "../../providers/topics/topics";
import {CategoriesViewManager} from "../../lib/categories-view-manager";
import {GoogleAnalytics} from '@ionic-native/google-analytics';
import {Storage} from "@ionic/storage";
import {Subscription} from "rxjs";
import {LoaderProvider} from "../../providers/loader/loader";


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

  public topicUpdatedSubscription: Subscription;

  constructor(private navParams: NavParams,
              private topicsProvider: TopicsProvider,
              private ga: GoogleAnalytics,
              private storage: Storage,
              private viewCtrl: ViewController,
              private loader: LoaderProvider) {
  }

  ionViewDidLoad() {
    this.initPage();
    this.subscribeToChanges();
  }

  ionViewDidLeave() {
    this.unsubscribeToChanges()
  }


  subscribeToChanges() {
    this.topicUpdatedSubscription = this.topicsProvider.selectedTopicUpdated.subscribe((data) => {
      this.loader.hideLoader()
      if (data == null) {
        this.selectedSummary = null;
        this.selectedTopic = null;
      }
      else {
        this.selectedCategory = data.category;
        this.selectedSummary = data.summary;
        this.selectedTopic = data.topic;
        this.summaryIsConstructedByMoreThanOneSources = this.selectedSummary.Sources.length > 1;
        this.ga.trackView("Summary: " + this.selectedTopic.Title);
      }
    });
  }

  unsubscribeToChanges() {
    this.topicUpdatedSubscription.unsubscribe();
  }

  initPage() {

    this.storage.ready().then(() => {
      this.storage.get("displaySources").then((val) => {
        this.displaySourcesUponEachSentence = val == 1;
      })
    });

    this.isSearch = this.navParams.get('isSearch');
    if (!this.isSearch) {
      this.selectedCategory = this.topicsProvider.getCategory();
      this.selectedCategoryDefaultImage = CategoriesViewManager.getCategoryDefaultImage(this.selectedCategory);
    } else {
      this.selectedCategory = this.navParams.get('forcedCategoryTitle');
      this.selectedCategoryDefaultImage = CategoriesViewManager.getCategoryDefaultImage('Search');
    }
  }

  public toggleDisplaySources() {
    this.storage.set("displaySources", this.displaySourcesUponEachSentence);
  }

  swipeActivity(event) {
    this.loader.showLoader();
    if (event.direction == 2)
      this.topicsProvider.loadNextTopic(this.selectedTopic, this.selectedCategory, this.isSearch);
    else if (event.direction == 4)
      this.topicsProvider.loadPreviousTopic(this.selectedTopic, this.selectedCategory, this.isSearch);
  }
}
