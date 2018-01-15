import {Component, ViewChild} from '@angular/core';
import {Content, NavController} from 'ionic-angular';
import {TopicsProvider} from "../../providers/topics/topics";
import {CategoriesProvider} from "../../providers/categories/categories";
import {TextManipulationService} from "../../lib/text-manipulation";
import {CategoriesViewManager} from "../../lib/categories-view-manager";
import {SummaryPage} from "../summary/summary";
import {SearchResultsPage} from "../search-results/search-results";


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
              protected categoriesProvider: CategoriesProvider) {
  }

  ionViewDidLoad() {
    this.topicsProvider.topicsUpdated.subscribe((newTopics) => {
      if(newTopics.length > 0)
        this.articles = newTopics;
    }, error2 => console.log(error2));
    this.articles = this.topicsProvider.getTopics();
    this.fetchSelectedCategoryAndSubscribeToChanges();
  }

  protected fetchSelectedCategoryAndSubscribeToChanges() {
    this.categoriesProvider.selectedCategoryUpdated.subscribe((selectedCategory) => {
      this.selectedCategory = selectedCategory;
      this.selectedCategoryForUppercase = TextManipulationService.getUppercaseFriendlyText(this.selectedCategory);
      this.selectedCategoryDefaultImage = CategoriesViewManager.getCategoryDefaultImage(this.selectedCategory);
      // when the category is changed, scroll to top,
      // otherwise the scroll will remain on the place it was before the category change
      this.content.scrollToTop();
    }, error => console.error(error));
    this.selectedCategory = this.categoriesProvider.getSelectedCategory();
    this.selectedCategoryForUppercase = TextManipulationService.getUppercaseFriendlyText(this.selectedCategory);
    this.selectedCategoryDefaultImage = CategoriesViewManager.getCategoryDefaultImage(this.selectedCategory);
  }

  public selectTopicAndDisplaySummary(topic: any) {
    this.topicsProvider.setSelectedTopic(topic);
    this.navCtrl.push(SummaryPage);
  }

  public searchForTopic(searchInput: string) {
    if (searchInput)
      this.navCtrl.push(SearchResultsPage, {keyword: searchInput});
  }
}

