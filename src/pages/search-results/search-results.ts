import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { TopicsProvider } from '../../providers/topics/topics';
import {GoogleAnalytics} from '@ionic-native/google-analytics';
import {CategoriesViewManager} from "../../lib/categories-view-manager";

/**
 * Generated class for the SearchResultsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-search-results',
  templateUrl: 'search-results.html',
})
export class SearchResultsPage {
  public keyword: string;
  public results: Array<any>;
  public selectedCategoryDefaultImage: string;
  public selectedCategoryForUppercase: string = 'ΑΠΟΤΕΛΕΣΜΑ';
  public forcedCategoryTitle: string;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private topicsProvider: TopicsProvider,
              protected ga: GoogleAnalytics) {
    this.keyword = this.navParams.get('keyword');
    this.selectedCategoryDefaultImage = CategoriesViewManager.getCategoryDefaultImage('Search');
    this.forcedCategoryTitle = 'Αναζήτηση';
    this.results = this.topicsProvider.getTopicsByKeyword(this.keyword);
  }
}
