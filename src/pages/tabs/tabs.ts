import {Component, ViewChild} from '@angular/core';

import { AllTopicsPage } from '../all-topics/all-topics';
import { HotTopicsPage } from '../hot-topics/hot-topics';
import {TopicsProvider} from "../../providers/topics/topics";
import {TopicsUpdatedInfo} from "../../models/TopicsUpdatedInfo";
import {ApplicationSettingsProvider} from "../../providers/applicationSettings/applicationSettings";
import {Tabs} from "ionic-angular";

@Component({
  templateUrl: 'tabs.html',
    providers: []
})
export class TabsPage {
  @ViewChild('tabs') tabs: Tabs;

  tab1Root = HotTopicsPage;
  tab2Root = AllTopicsPage;
  public allTopicsCounter: number;
  public hotTopicsCounter: number;
  public fetchedIndex: boolean;

  constructor(private topicsProvider: TopicsProvider, private applicationSettings: ApplicationSettingsProvider) {
    this.applicationSettings.getDefaultSelectedTabIndex().then((selectedTabIndex: number) => {
      if (selectedTabIndex)
        this.tabs.select(selectedTabIndex);
      this.fetchedIndex = true;
    });
    this.topicsProvider.topicsUpdated.subscribe((topicsUpdatedInfo: TopicsUpdatedInfo) => {
      this.allTopicsCounter = topicsUpdatedInfo.topicsCount;
      this.hotTopicsCounter = topicsUpdatedInfo.hotTopicsCount;
    });
  }

  public updateDefaultSelectedTab(indexOfTab: number) {
    if (this.fetchedIndex)
      this.applicationSettings.setDefaultSelectedTabIndex(indexOfTab);
  }
}


