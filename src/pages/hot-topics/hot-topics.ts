import {Component, ViewChild} from '@angular/core';
import {Content, NavController} from 'ionic-angular';
import {TopicsProvider} from "../../providers/topics/topics";
import {CategoriesProvider} from "../../providers/categories/categories";
import {TextManipulationService} from "../../lib/text-manipulation";

/**
 * Generated class for the HotTopicsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-home',
  templateUrl: 'hot-topics.html',
})
export class HotTopicsPage {
  @ViewChild(Content) content: Content;

  public hotTopics: Array<any>;
  public selectedCategory: string;
  public selectedCategoryForUppercase: string;

  constructor(private navCtrl: NavController,
              private topicsProvider: TopicsProvider,
              private categoriesProvider: CategoriesProvider) {
  }

  ionViewDidLoad() {
    this.topicsProvider.topicsUpdated.subscribe((newTopics) => {
      this.hotTopics = this.topicsProvider.getHotTopics();
    }, error => console.log(error));
    this.hotTopics = this.topicsProvider.getHotTopics();
    this.categoriesProvider.selectedCategoryUpdated.subscribe((selectedCategory) => {
      this.selectedCategory = selectedCategory;
      this.selectedCategoryForUppercase = TextManipulationService.getUppercaseFriendlyText(this.selectedCategory);
      // when the category is changed, scroll to top,
      // otherwise the scroll will remain on the place it was before the category change
      this.content.scrollToTop();
    }, error => console.error(error));
    this.selectedCategory = this.categoriesProvider.getSelectedCategory();
    this.selectedCategoryForUppercase = TextManipulationService.getUppercaseFriendlyText(this.selectedCategory);
  }

}
