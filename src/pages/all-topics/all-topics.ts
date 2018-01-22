import {Component, ViewChild} from '@angular/core';
import {Content, Loading, NavController, ViewController} from 'ionic-angular';
import {TopicsProvider} from "../../providers/topics/topics";
import {CategoriesProvider} from "../../providers/categories/categories";
import {TextManipulationService} from "../../lib/text-manipulation";
import {CategoriesViewManager} from "../../lib/categories-view-manager";
import {SettingsPage} from "../settings/settings";
import {GoogleAnalytics} from '@ionic-native/google-analytics';
import {TabsPage} from "../tabs/tabs";
import {Subscription} from "rxjs";
import {LoadingController} from 'ionic-angular';

@Component({
  selector: 'page-all-topics',
  templateUrl: 'all-topics.html'
})
export class AllTopicsPage {
  @ViewChild(Content) content: Content;

  public topics: Array<any>;
  public selectedCategory: string;
  public selectedCategoryForUppercase: string;
  public selectedCategoryDefaultImage: string;
  private topicsUpdatedSubscription: Subscription;
  private categoryUpdatedSubscription: Subscription;
  private loadingIndicator: Loading = null;

  constructor(protected navCtrl: NavController,
              protected topicsProvider: TopicsProvider,
              protected categoriesProvider: CategoriesProvider,
              protected ga: GoogleAnalytics,
              private viewCtrl: ViewController,
              private loadingCtrl: LoadingController) {

  }


  ionViewWillEnter() { // 	Runs when the page is about to enter and become the active page.
    //set the state of the topic provider. We are viewing all topics
    this.topicsProvider.setTopicFilter(false);
    this.topics = this.topicsProvider.getTopics();
    this.subscribeToChanges("All news");
  }

  displayLoading() {
    this.loadingIndicator = this.loadingCtrl.create();
    this.loadingIndicator.present();
  }

  ionViewDidLeave() {
    this.unsubscribeToChanges();
  }

  protected unsubscribeToChanges() {
    this.topicsUpdatedSubscription.unsubscribe();
    this.categoryUpdatedSubscription.unsubscribe();
  }

  protected subscribeToChanges(nameOfFilter) {
    this.topicsUpdatedSubscription = this.topicsProvider.topicsUpdated.subscribe((newTopics) => {
      if (newTopics==null) {
        this.topics = [];
        this.displayLoading();
      }
      else{
        if (this.loadingIndicator)
          this.loadingIndicator.dismissAll();
        if (newTopics && newTopics.length > 0)
          this.topics = newTopics;
        else {
          //display no topics found message
          this.topics = [];
        }
      }
    }, error2 => console.log(error2));
    this.categoryUpdatedSubscription = this.categoriesProvider.selectedCategoryUpdated.subscribe((selectedCategory) => {
      this.selectedCategory = selectedCategory;
      this.selectedCategoryForUppercase = TextManipulationService.getUppercaseFriendlyText(this.selectedCategory);
      this.selectedCategoryDefaultImage = CategoriesViewManager.getCategoryDefaultImage(this.selectedCategory);
      // when the category is changed, scroll to top,
      // otherwise the scroll will remain on the place it was before the category change
      this.content.scrollToTop();
      this.ga.trackView(nameOfFilter + ' page for ' + this.selectedCategory);
    }, error => this.ga.trackException(error, false));//todo: add messages when an error occurs
  }

  public displaySettingsPage() {
    this.navCtrl.push(SettingsPage);
  }
}

