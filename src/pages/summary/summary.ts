import {Component} from '@angular/core';
import {NavController, NavParams, ViewController} from 'ionic-angular';
import {TopicsProvider} from "../../providers/topics/topics";
import {CategoriesProvider} from "../../providers/categories/categories";
import {CategoriesViewManager} from "../../lib/categories-view-manager";
import {GoogleAnalytics} from '@ionic-native/google-analytics';
import {Storage} from "@ionic/storage";
import {Observable} from 'rxjs/Observable';
import {Subscription} from "rxjs";


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

  public instanceCreationDate: Date;

  public fetchingSummarySubscription :Subscription;
  public topicUpdatedSubscription :Subscription;


  constructor(private navCtrl: NavController, private navParams: NavParams,
              private topicsProvider: TopicsProvider,
              private categoriesProvider: CategoriesProvider,
              private ga: GoogleAnalytics,
              private storage: Storage,
              private viewCtrl: ViewController) {
    this.instanceCreationDate = new Date();
  }
  ionViewDidLoad() {
    this.initPage();
    this.subscribeToChanges();
  }
  ionViewDidLeave() {
    this.unsubscribeToChanges()
  }
  subscribeToChanges() {
   this.fetchingSummarySubscription= this.topicsProvider.fetchingSummary.subscribe(() => {
      //todo: display loading;
      this.selectedSummary = null;
      this.selectedTopic = null;
    });
   this.topicUpdatedSubscription= this.topicsProvider.selectedTopicUpdated.subscribe((data) => {
     this.selectedCategory = data.category;
     this.selectedSummary = data.summary;
     this.selectedTopic = data.topic;
     this.summaryIsConstructedByMoreThanOneSources = this.selectedSummary.Sources.length > 1;
     this.ga.trackView("Summary: " + this.selectedTopic.Title);
   });
  }
  unsubscribeToChanges() {
   this.fetchingSummarySubscription.unsubscribe();
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
      this.selectedCategory = this.categoriesProvider.getSelectedCategory();
      this.selectedCategoryDefaultImage = CategoriesViewManager.getCategoryDefaultImage(this.selectedCategory);
    } else {
      this.selectedCategory = this.navParams.get('forcedCategoryTitle');
      this.selectedCategoryDefaultImage = CategoriesViewManager.getCategoryDefaultImage('Search');
    }
  }

  public toggleDisplaySources() {
    this.storage.set("displaySources", this.displaySourcesUponEachSentence);
  }

  loadSummary(animationDirection) {
    this.navCtrl.push(SummaryPage, {'forcedCategoryTitle': this.selectedCategory, 'isSearch': this.isSearch},
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
