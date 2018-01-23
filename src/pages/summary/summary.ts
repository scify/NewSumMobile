import {Component} from '@angular/core';
import {Loading, LoadingController, NavController, NavParams, Platform, ViewController} from 'ionic-angular';
import {TopicsProvider} from "../../providers/topics/topics";
import {CategoriesProvider} from "../../providers/categories/categories";
import {CategoriesViewManager} from "../../lib/categories-view-manager";
import {GoogleAnalytics} from '@ionic-native/google-analytics';
import {Storage} from "@ionic/storage";
import {Subscription} from "rxjs";
import {ImageLoadOptionProvider} from "../../providers/image-load-option/image-load-option";
import {NetworkProvider} from "../../providers/network/network";


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
  public selectedImgLoadOption: string;
  public isConnectedToWiFi: boolean = false;

  public instanceCreationDate: Date;

  public fetchingSummarySubscription :Subscription;
  public topicUpdatedSubscription :Subscription;
  private loadingIndicator: Loading = null;

  private networkConnectionChangeSubscription: Subscription;

  constructor(private navCtrl: NavController, private navParams: NavParams,
              private topicsProvider: TopicsProvider,
              private categoriesProvider: CategoriesProvider,
              private imgLoadProvider: ImageLoadOptionProvider,
              private networkProvider: NetworkProvider,
              private platform: Platform,
              private ga: GoogleAnalytics,
              private storage: Storage,
              private viewCtrl: ViewController,
              private loadingCtrl: LoadingController) {
    this.instanceCreationDate = new Date();
  }
  ionViewDidLoad() {
    this.initPage();
    this.subscribeToChanges();
  }
  ionViewDidEnter() {
    this.selectedImgLoadOption = this.imgLoadProvider.getSelectedImageLoadOption();
    this.subscribeToNetworkConnectionChanges();
  }
  ionViewDidLeave() {
    this.unsubscribeToChanges();
    this.unsubscribeFromNetworkConnectionChanges();
  }
  displayLoading() {
    this.loadingIndicator = this.loadingCtrl.create();
    this.loadingIndicator.present();
  }

  subscribeToChanges() {
   this.topicUpdatedSubscription= this.topicsProvider.selectedTopicUpdated.subscribe((data) => {
     if (data==null){
       this.displayLoading();
       this.selectedSummary = null;
       this.selectedTopic = null;
     }
     else
     {
       if (this.loadingIndicator)
         this.loadingIndicator.dismiss();
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

  swipeActivity(event) {
    if (event.direction == 2)
      this.topicsProvider.loadNextTopic(this.isSearch);
     else if (event.direction == 4)
      this.topicsProvider.loadPreviousTopic(this.isSearch);
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
