import {Component, ViewChild} from '@angular/core';
import {Content, NavController} from 'ionic-angular';
import {AllTopicsPage} from "../all-topics/all-topics";
import {TopicsProvider} from "../../providers/topics/topics";
import {CategoriesProvider} from "../../providers/categories/categories";
import {GoogleAnalytics} from "@ionic-native/google-analytics";

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

  ionViewWillEnter(){
    console.log("hot topics");
    this.topicsProvider.setTopicFilter(true);
    console.log(this.topicsProvider);
  }

  ionViewDidLoad() {
    this.topicsProvider.topicsUpdated.subscribe((newTopics) => {
      this.topics = this.topicsProvider.getTopics();;
    }, error => console.log(error));
    this.topics = this.topicsProvider.getTopics();
    this.fetchSelectedCategoryAndSubscribeToChanges("Popular news");
  }
}
