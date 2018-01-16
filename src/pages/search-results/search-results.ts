import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TopicsProvider } from '../../providers/topics/topics';

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

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private topicsProvider: TopicsProvider) {
    this.keyword = this.navParams.get('keyword');
    this.results = this.topicsProvider.getTopicsByKeyword(this.keyword);
  }
}
