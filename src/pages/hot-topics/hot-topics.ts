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

  ionViewWillEnter(){ // 	Runs when the page is about to enter and become the active page.
    //set the state of the topic provider. We are viewing only hot topics
    this.topicsProvider.setTopicFilter(true);
    this.displayLoading();
    this.subscribeToChanges("Popular news");
  }

  ionViewDidLeave() {
    this.unsubscribeToChanges();
  }
}
