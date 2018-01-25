import { Component } from '@angular/core';

import { AllTopicsPage } from '../all-topics/all-topics';
import { HotTopicsPage } from '../hot-topics/hot-topics';
import {TopicsProvider} from "../../providers/topics/topics";
import {TopicsUpdatedInfo} from "../../models/TopicsUpdatedInfo";

@Component({
  templateUrl: 'tabs.html',
    providers: []
})
export class TabsPage {
  tab1Root = HotTopicsPage;
  tab2Root = AllTopicsPage;
  public allTopicsCounter: number;
  public hotTopicsCounter: number;

  constructor(private topicsProvider: TopicsProvider) {
    this.topicsProvider.topicsUpdated.subscribe((topicsUpdatedInfo: TopicsUpdatedInfo) => {
      this.allTopicsCounter = topicsUpdatedInfo.topicsCount;
      this.hotTopicsCounter = topicsUpdatedInfo.hotTopicsCount;
    });
  }
}


