import {Component, Input} from '@angular/core';
import {SummaryPage} from "../../pages/summary/summary";
import {NavController, NavParams} from "ionic-angular";
import {TopicsProvider} from "../../providers/topics/topics";

/**
 * Generated class for the ArticlesListComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'articles-list',
  templateUrl: 'articles-list.html'
})
export class ArticlesListComponent {

  @Input('articles') articles: Array<any>;
  @Input('selectedCategoryDefaultImage') selectedCategoryDefaultImage: string;
  @Input('selectedCategoryForUppercase') selectedCategoryForUppercase: string;
  @Input('isSearch') isSearch: boolean = false;
  @Input('forcedCategoryTitle') forcedCategoryTitle: string;

  constructor(public navCtrl: NavController, protected topicsProvider: TopicsProvider) {}

  public selectTopicAndDisplaySummary(topic: any) {
    this.topicsProvider.setSelectedTopic(topic);
    this.navCtrl.push(SummaryPage, {isSearch: this.isSearch, forcedCategoryTitle: this.forcedCategoryTitle});
  }
}
