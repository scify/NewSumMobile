import {Component, ViewChild} from '@angular/core';
import {Content, NavController, ViewController} from 'ionic-angular';
import {TopicsProvider} from "../../providers/topics/topics";
import {CategoriesProvider} from "../../providers/categories/categories";
import {TextManipulationService} from "../../lib/text-manipulation";
import {CategoriesViewManager} from "../../lib/categories-view-manager";
import {SummaryPage} from "../summary/summary";
import {SettingsPage} from "../settings/settings";
import {GoogleAnalytics} from '@ionic-native/google-analytics';
import {TabsPage} from "../tabs/tabs";


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

  constructor(protected navCtrl: NavController,
              protected topicsProvider: TopicsProvider,
              protected categoriesProvider: CategoriesProvider,
              protected ga: GoogleAnalytics,
              private viewCtrl: ViewController) {

  }

  ionViewWillEnter() {
    //set the state of the topic provider. We are viewing all topics
    this.topicsProvider.setTopicFilter(false);
  }

  ionViewDidLoad() {
    this.subscribeToChanges("All news");
    this.initPage();
  }

  protected initPage() {
    this.topics = this.topicsProvider.getTopics();
    this.selectedCategory = this.categoriesProvider.getSelectedCategory();
    this.selectedCategoryForUppercase = TextManipulationService.getUppercaseFriendlyText(this.selectedCategory);
    this.selectedCategoryDefaultImage = CategoriesViewManager.getCategoryDefaultImage(this.selectedCategory);
    this.ga.trackView('All news for ' + this.selectedCategory);
  }

  protected subscribeToChanges(nameOfFilter) {

    this.topicsProvider.fetchingNewTopics.subscribe((categoryName) => {
      this.topics = [];
      //present loader
    });

    this.topicsProvider.topicsUpdated.subscribe((newTopics) => {
      //hide loader
      if (newTopics.length > 0)
        this.topics = newTopics;
      else {
        //display no topics found message
      }
    }, error2 => console.log(error2));


    this.categoriesProvider.selectedCategoryUpdated.subscribe((selectedCategory) => {
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

  loadCategory(animationDirection) {
    this.navCtrl.push(TabsPage, null,
      {animate: true, animation: 'ios-transition', direction: animationDirection}).then(() => {
      this.navCtrl.remove(this.viewCtrl.index);
    });
  }

  swipeActivity(event) {
    if (event.direction == 2) {
      if (this.categoriesProvider.loadNextCategory())
        this.loadCategory('forward');

    } else if (event.direction == 4) {
      if (this.categoriesProvider.loadPreviousCategory())
        this.loadCategory('back');
    }
  }


}

