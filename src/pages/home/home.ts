import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {ServiceClientProvider} from "../../providers/service-client/service-client";
import {TopicsProvider} from "../../providers/topics/topics";


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public articles: Array<any>;

  constructor(private navCtrl: NavController,
              private topicsProvider: TopicsProvider) {
  }

  ionViewDidLoad() {
    this.articles = this.topicsProvider.getTopics();
    console.log(this.articles);
    this.topicsProvider.topicsUpdated.subscribe((newTopics) => {
      if(newTopics)
        this.articles = newTopics;
    }, error2 => console.log(error2));
  }


}

