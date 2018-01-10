import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {TopicsProvider} from "../../providers/topics/topics";
import {CategoriesProvider} from "../../providers/categories/categories";
import {TextManipulationService} from "../../lib/text-manipulation";


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public articles: Array<any>;
  public selectedCategory: string;
  public selectedCategoryForUppercase: string;

  constructor(private navCtrl: NavController,
              private topicsProvider: TopicsProvider,
              private categoriesProvider: CategoriesProvider) {
  }

  ionViewDidLoad() {
    this.articles = this.topicsProvider.getTopics();
    console.log(this.articles);
    this.topicsProvider.topicsUpdated.subscribe((newTopics) => {
      if(newTopics)
        this.articles = newTopics;
    }, error2 => console.log(error2));
    this.categoriesProvider.selectedCategoryUpdated.subscribe((selectedCategory) => {
      this.selectedCategory = selectedCategory;
      this.selectedCategoryForUppercase = TextManipulationService.getUppercaseFriendlyText(this.selectedCategory);
    }, error => console.error(error));
    this.selectedCategory = this.categoriesProvider.getSelectedCategory();
    this.selectedCategoryForUppercase = TextManipulationService.getUppercaseFriendlyText(this.selectedCategory);
  }
}

