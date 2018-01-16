import { Component , ViewChild} from '@angular/core';
import { NavController } from 'ionic-angular';
import {TopicsProvider} from "../../providers/topics/topics";
import {SummariesProvider} from "../../providers/summaries/summaries";
import {CategoriesProvider} from "../../providers/categories/categories";
import {GoogleAnalytics} from '@ionic-native/google-analytics';
import {CategoriesViewManager} from "../../lib/categories-view-manager";

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
  @ViewChild('title') titleElement: any;
  @ViewChild('titleBackground') titleBackgroundElement: any;

  public selectedCategory: string;
  public selectedCategoryDefaultImage: string;
  public selectedTopic: any;
  public selectedSummary: any;

  constructor(private navCtrl: NavController, private topicsProvider: TopicsProvider,
              private summaryProvider: SummariesProvider,
              private categoriesProvider: CategoriesProvider,
              protected ga: GoogleAnalytics) {

  }

  ionViewDidEnter() {
    this.selectedSummary = this.summaryProvider.getSummary();
    if (this.selectedSummary) {
      this.selectedCategory = this.categoriesProvider.getSelectedCategory();
      this.selectedCategoryDefaultImage = CategoriesViewManager.getCategoryDefaultImage(this.selectedCategory);
      this.selectedTopic = this.topicsProvider.getSelectedTopic();
    }
  }

  ionViewDidLoad() {
    this.displayTitleCorrectly();
  }

  private displayTitleCorrectly() {
    let titleElementOffsetHeight = this.titleElement.nativeElement.offsetHeight;
    this.titleElement.nativeElement.style.marginTop = (-1 * titleElementOffsetHeight) + 'px';
    this.titleBackgroundElement.nativeElement.style.height = titleElementOffsetHeight + 'px';
    this.titleBackgroundElement.nativeElement.style.marginTop = (-1 * (titleElementOffsetHeight + 5)) + 'px';
  }
}
