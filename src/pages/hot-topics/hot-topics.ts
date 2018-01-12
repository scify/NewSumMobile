import {Component, ViewChild} from '@angular/core';
import {Content} from 'ionic-angular';
import {AllTopics} from "../all-topics/all-topics";

/**
 * Generated class for the HotTopicsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-all-topics',
  templateUrl: 'hot-topics.html',
})
export class HotTopicsPage extends AllTopics {
  @ViewChild(Content) content: Content;

  ionViewDidLoad() {
    this.topicsProvider.topicsUpdated.subscribe((newTopics) => {
      this.articles = this.topicsProvider.getHotTopics();
    }, error => console.log(error));
    this.articles = this.topicsProvider.getHotTopics();
    this.fetchSelectedCategoryAndSubscribeToChanges();
  }
}
