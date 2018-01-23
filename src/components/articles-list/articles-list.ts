import {Component, Input} from '@angular/core';
import {SummaryPage} from "../../pages/summary/summary";
import {NavController, NavParams} from "ionic-angular";
import {TopicsProvider} from "../../providers/topics/topics";
import {NetworkProvider} from "../../providers/network/network";
import {Subscription} from "rxjs/Subscription";
import { Platform } from 'ionic-angular';
import {ImageLoadOptionProvider} from "../../providers/image-load-option/image-load-option";

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

  public selectedImgLoadOption: string;
  private networkConnectionChangeSubscription: Subscription;
  private isConnectedToWiFi: boolean = false;

  constructor(public navCtrl: NavController,
              protected topicsProvider: TopicsProvider,
              protected imgLoadProvider: ImageLoadOptionProvider,
              protected networkProvider: NetworkProvider,
              protected platform: Platform) {}

  public selectTopicAndDisplaySummary(topic: any) {
    this.topicsProvider.setSelectedTopic(topic);
    this.navCtrl.push(SummaryPage, {isSearch: this.isSearch, forcedCategoryTitle: this.forcedCategoryTitle});
  }

  ngOnInit() {
    if (this.platform.is('cordova')) {
      this.networkConnectionChangeSubscription = this.networkProvider.networkConnectionChanged.subscribe((newConnectionType) => {
        this.isConnectedToWiFi = newConnectionType === 'wifi';
      });
    }
  }

  ngOnChanges() {
    this.selectedImgLoadOption = this.imgLoadProvider.getSelectedImageLoadOption();
    // if variable wasn't already set, get the value from storage
    if (!this.selectedImgLoadOption)
      this.imgLoadProvider.getSelectedImageLoadOptionFromStorage().then((newOption) => {
        this.selectedImgLoadOption = newOption;
      });
  }

  ngOnDestroy() {
    if (this.platform.is('cordova')) {
      this.networkConnectionChangeSubscription.unsubscribe();
    }
  }
}
