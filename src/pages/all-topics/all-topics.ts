import {Component, ViewChild} from '@angular/core';
import {Content, NavController, Platform, Refresher} from 'ionic-angular';
import {TopicsProvider} from "../../providers/topics/topics";
import {TextManipulationService} from "../../lib/text-manipulation";
import {CategoriesViewManager} from "../../lib/categories-view-manager";
import {SettingsPage} from "../settings/settings";
import {GoogleAnalytics} from '@ionic-native/google-analytics';
import {Subscription} from "rxjs";
import {TopicsUpdatedInfo} from "../../models/TopicsUpdatedInfo";
import {LoaderProvider} from "../../providers/loader/loader";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'page-all-topics',
  templateUrl: 'all-topics.html'
})
export class AllTopicsPage {
  @ViewChild(Content) content: Content;
  @ViewChild(Refresher) refresher: Refresher;

  public topics: Array<any>;
  public selectedCategory: string;
  public selectedCategoryForUppercase: string;
  public selectedCategoryDefaultImage: string;
  public isRefreshing: boolean = false;
  private topicsUpdatedSubscription: Subscription;

  constructor(protected navCtrl: NavController,
              protected ga: GoogleAnalytics,
              protected loader: LoaderProvider,
              protected topicsProvider: TopicsProvider,
              protected platform:Platform
              ) {

  }

  ionViewDidLoad() {
    // set refresher values
    this.refresher.pullMin = 80;
    this.refresher.pullMax = 80 + 60;
  }

  ionViewWillEnter() { // 	Runs when the page is about to enter and become the active page.
    //set the state of the topic provider. We are viewing all topics
    this.topicsProvider.setTopicFilter(false);
    this.initPageData();
    this.subscribeToChanges("All news");
  }
  initPageData(){
    this.topics = this.topicsProvider.getTopics();
    this.selectedCategory = this.topicsProvider.getCategory();
    this.selectedCategoryForUppercase = TextManipulationService.getUppercaseFriendlyText(this.selectedCategory);
    this.selectedCategoryDefaultImage = CategoriesViewManager.getCategoryDefaultImage(this.selectedCategory);
  }

  ionViewDidLeave() {
    this.unsubscribeToChanges();
  }

  protected unsubscribeToChanges() {
    this.topicsUpdatedSubscription.unsubscribe();
  }

  protected subscribeToChanges(nameOfFilter) {
    this.topicsUpdatedSubscription = this.topicsProvider.topicsUpdated.subscribe((topicsUpdatedInfo: TopicsUpdatedInfo) => {
      if (topicsUpdatedInfo == null) {
        this.topics = [];
        this.loader.showLoader();
      } else {
        this.loader.hideLoader();

        if (topicsUpdatedInfo.topics && topicsUpdatedInfo.topicsCount > 0) {
          this.topics = topicsUpdatedInfo.topics;
          this.selectedCategory = topicsUpdatedInfo.category;
          this.selectedCategoryForUppercase = TextManipulationService.getUppercaseFriendlyText(this.selectedCategory);
          this.selectedCategoryDefaultImage = CategoriesViewManager.getCategoryDefaultImage(this.selectedCategory);
          // when the category is changed, scroll to top,
          // otherwise the scroll will remain on the place it was before the category change
          this.content.scrollToTop();
          this.platform.ready().then(() => {
            this.ga.trackView(nameOfFilter + ' page for ' + this.selectedCategory);
          });
        } else {
          this.topics = [];
        }
      }
    }, error2 => console.log(error2));
  }

  public displaySettingsPage() {
    this.navCtrl.push('SettingsPage');
  }

  public refreshArticles(refresher) {
    this.isRefreshing = true;
    this.topicsProvider.refreshTopics(this.selectedCategory).then(() => {
      this.isRefreshing = false;
      refresher.complete();
    });
  }
}

