import {Component, ViewChild} from '@angular/core';
import {Content, NavController} from 'ionic-angular';
import {TopicsProvider} from "../../providers/topics/topics";
import {CategoriesProvider} from "../../providers/categories/categories";
import {TextManipulationService} from "../../lib/text-manipulation";
import {CategoriesViewManager} from "../../lib/categories-view-manager";
import {SummaryPage} from "../summary/summary";
import {SettingsPage} from "../settings/settings";
import {GoogleAnalytics} from '@ionic-native/google-analytics';


@Component({
  selector: 'page-all-topics',
  templateUrl: 'all-topics.html'
})
export class AllTopicsPage {
  @ViewChild(Content) content: Content;

  public articles: Array<any>;
  public selectedCategory: string;
  public selectedCategoryForUppercase: string;
  public selectedCategoryDefaultImage: string;

  constructor(protected navCtrl: NavController,
              protected topicsProvider: TopicsProvider,
              protected categoriesProvider: CategoriesProvider,
              protected ga: GoogleAnalytics) {
  }

  ionViewDidLoad() {
    this.topicsProvider.topicsUpdated.subscribe((newTopics) => {
      if (newTopics.length > 0)
        this.articles = newTopics;
    }, error2 => console.log(error2));
    this.articles = this.topicsProvider.getTopics();
    this.fetchSelectedCategoryAndSubscribeToChanges("All news");
  }

  protected fetchSelectedCategoryAndSubscribeToChanges(nameOfFilter) {
    this.categoriesProvider.selectedCategoryUpdated.subscribe((selectedCategory) => {
      this.selectedCategory = selectedCategory;
      this.selectedCategoryForUppercase = TextManipulationService.getUppercaseFriendlyText(this.selectedCategory);
      this.selectedCategoryDefaultImage = CategoriesViewManager.getCategoryDefaultImage(this.selectedCategory);
      // when the category is changed, scroll to top,
      // otherwise the scroll will remain on the place it was before the category change
      this.content.scrollToTop();
      this.ga.trackView(nameOfFilter + ' page for ' + this.selectedCategory);
    }, error => this.ga.trackException(error,false));//todo: add messages when an error occurs

    this.selectedCategory = this.categoriesProvider.getSelectedCategory();
    this.selectedCategoryForUppercase = TextManipulationService.getUppercaseFriendlyText(this.selectedCategory);
    this.selectedCategoryDefaultImage = CategoriesViewManager.getCategoryDefaultImage(this.selectedCategory);
    this.ga.trackView('All news for ' + this.selectedCategory);
  }

  public selectTopicAndDisplaySummary(topic: any) {
    this.topicsProvider.setSelectedTopic(topic);
    this.navCtrl.push(SummaryPage);
  }

  public displaySettingsPage() {
    this.navCtrl.push(SettingsPage);
  }
}

