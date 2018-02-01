import {Component, ViewChild} from '@angular/core';

import {AllTopicsPage} from '../all-topics/all-topics';
import {HotTopicsPage} from '../hot-topics/hot-topics';
import {TopicsProvider} from "../../providers/topics/topics";
import {TopicsUpdatedInfo} from "../../models/TopicsUpdatedInfo";
import {Tabs} from "ionic-angular";
import {TranslateService} from "@ngx-translate/core";

@Component({
  templateUrl: 'tabs.html',
  providers: []
})
export class TabsPage {
  @ViewChild('tabs') tabs: Tabs;

  tab1Root = HotTopicsPage;
  tab2Root = AllTopicsPage;
  public allTopicsTitle: string = "...";
  public hotTopicsTitle: string = "...";
  public allTopicsCounter: string = "";
  public hotTopicsCounter: string = "";

  constructor(private topicsProvider: TopicsProvider,
              private translate: TranslateService) {
    this.topicsProvider.topicsUpdated.subscribe((topicsUpdatedInfo: TopicsUpdatedInfo) => {
      this.allTopicsTitle = translate.instant("Αll news");
      this.allTopicsCounter = "(" + topicsUpdatedInfo.topicsCount + ")";
      this.hotTopicsTitle = translate.instant("Ηot news");
      this.hotTopicsCounter = "(" + topicsUpdatedInfo.hotTopicsCount + ")";
      // when topics update was not triggered by the settings page,
      // if no hot topics found select the 'all topics' tab,
      // else select the 'hot topics' tab
      if (!topicsUpdatedInfo.triggeredFromSettings)
        this.tabs.select(topicsUpdatedInfo.hotTopicsCount > 0 ? 0 : 1);
    });
  }
}


