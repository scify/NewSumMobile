import {Component, ViewChild} from '@angular/core';
import {Content} from 'ionic-angular';
import {AllTopicsPage} from "../all-topics/all-topics";

/**
 * Generated class for the HotTopicsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-all-topics',
  templateUrl: '../all-topics/all-topics.html',
})
export class HotTopicsPage extends AllTopicsPage {
  @ViewChild(Content) content: Content;

  ionViewDidLoad() {
    this.topicsProvider.topicsUpdated.subscribe((newTopics) => {
      this.topics = this.topicsProvider.getHotTopics();;
    }, error => console.log(error));
    this.topics = this.topicsProvider.getHotTopics();
    this.fetchSelectedCategoryAndSubscribeToChanges("Popular news");
  }
}
