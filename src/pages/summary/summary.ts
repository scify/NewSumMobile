import {Component, ViewChild} from '@angular/core';
import {Content, IonicPage, NavParams, Platform} from 'ionic-angular';
import {TopicsProvider} from "../../providers/topics/topics";
import {CategoriesViewManager} from "../../lib/categories-view-manager";
import {GoogleAnalytics} from '@ionic-native/google-analytics';
import {Storage} from "@ionic/storage";
import {Subscription} from "rxjs";
import {ImageLoadOptionProvider} from "../../providers/image-load-option/image-load-option";
import {NetworkProvider} from "../../providers/network/network";
import {LoaderProvider} from "../../providers/loader/loader";

@IonicPage()
@Component({
  selector: 'page-summary',
  templateUrl: 'summary.html',
})
export class SummaryPage {
  @ViewChild(Content) content: Content;

  public selectedCategory: string;
  public selectedCategoryDefaultImage: string;
  public selectedTopic: any;
  public selectedSummary: any;
  public isSearch: boolean;
  public displaySourcesUponEachSentence: boolean = true;
  public summaryIsConstructedByMoreThanOneSources: boolean;
  public selectedImgLoadOption: string;
  public isConnectedToWiFi: boolean = false;

  public topicUpdatedSubscription: Subscription;


  private networkConnectionChangeSubscription: Subscription;

  constructor(private navParams: NavParams,
              private topicsProvider: TopicsProvider,
              private ga: GoogleAnalytics,
              private imgLoadProvider: ImageLoadOptionProvider,
              private networkProvider: NetworkProvider,
              private platform: Platform,
              private storage: Storage,
              private loader: LoaderProvider) {
  }

  ionViewDidLoad() {
    this.subscribeToChanges();
  }

  ionViewDidEnter() {
    this.selectedImgLoadOption = this.imgLoadProvider.getSelectedImageLoadOption();
    // initialize variable because we may not have an update from observable
    this.isConnectedToWiFi = this.networkProvider.network.type === 'wifi';
    this.subscribeToNetworkConnectionChanges();
    this.initPage();
  }

  ionViewDidLeave() {
    this.unsubscribeToChanges();
    this.unsubscribeFromNetworkConnectionChanges();
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
        this.selectedCategoryDefaultImage = CategoriesViewManager.getCategoryDefaultImage(data.category);
        this.summaryIsConstructedByMoreThanOneSources = this.selectedSummary.Sources.length > 1;
        this.content.scrollToTop();
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
    if (this.isSearch) {
      this.selectedCategory = this.navParams.get('forcedCategoryTitle');
      this.selectedCategoryDefaultImage = CategoriesViewManager.getCategoryDefaultImage('Search');
    } else {
      this.selectedCategory = this.topicsProvider.getCategory();
      this.selectedCategoryDefaultImage = CategoriesViewManager.getCategoryDefaultImage(this.selectedCategory);
    }
  }


  public toggleDisplaySources() {
    this.storage.set("displaySources", this.displaySourcesUponEachSentence);
  }

  swipeActivity(event) {
    this.loader.showLoader();
    if (event.direction == 2)
      this.topicsProvider.loadNextTopic(this.selectedCategory, this.selectedTopic, this.isSearch);
    else if (event.direction == 4)
      this.topicsProvider.loadPreviousTopic(this.selectedCategory, this.selectedTopic, this.isSearch);
  }

  private subscribeToNetworkConnectionChanges() {
    if (this.platform.is('cordova')) {
      this.networkConnectionChangeSubscription = this.networkProvider.networkConnectionChanged.subscribe((newConnectionType) => {
        this.isConnectedToWiFi = newConnectionType === 'wifi';
      });
    }
  }

  private unsubscribeFromNetworkConnectionChanges() {
    if (this.platform.is('cordova')) {
      this.networkConnectionChangeSubscription.unsubscribe();
    }
  }
}
