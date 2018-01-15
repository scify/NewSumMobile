import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {TopicsProvider} from "../../providers/topics/topics";
import {SummariesProvider} from "../../providers/summaries/summaries";
import {CategoriesProvider} from "../../providers/categories/categories";

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
  public selectedTopic: any;
  public selectedSummary: any;

  constructor(private navCtrl: NavController, private topicsProvider: TopicsProvider,
              private summaryProvider: SummariesProvider, private categoriesProvider: CategoriesProvider) {
    this.selectedSummary = this.summaryProvider.getSummary();
    if (this.selectedSummary) {
      this.selectedCategory = this.categoriesProvider.getSelectedCategory();
      this.selectedTopic = this.topicsProvider.getSelectedTopic();
    }
  }

  ionViewDidLoad() {
    this.summaryProvider.summaryUpdated.subscribe((newSummary) => {
      if (newSummary) {
        this.selectedCategory = this.categoriesProvider.getSelectedCategory();
        this.selectedTopic = this.topicsProvider.getSelectedTopic();
        this.selectedSummary = newSummary;
        console.log(newSummary);
      }
    });
  }
}
