import {Injectable} from '@angular/core';
import {Subject} from "rxjs/Subject";
import {BehaviorSubject} from "rxjs";
import {ApplicationSettingsProvider} from "../applicationSettings/applicationSettings";
import {TopicsUpdatedInfo} from "../../models/TopicsUpdatedInfo";
import {ApiServiceProvider} from "../api-service/apiService";
import {SelectTopicEnum} from "../../models/selectTopicEnum";
import {SummariesProvider} from "../summaries/summaries";


@Injectable()
export class TopicsProvider {

  private topics: Array<any> = [];
  private category: string;
  private topicsByKeyword: Array<any>;
  private getOnlyHotTopics: boolean;

  public topicsUpdated: Subject<any>;
  public selectedTopicUpdated: BehaviorSubject<any>;

  private static DAY_IN_MILLIS: number = 24 * 60 * 60 * 1000;

  constructor(private serviceClient: ApiServiceProvider,
              private applicationSettings: ApplicationSettingsProvider,
              private summariesProvider: SummariesProvider) {
    this.topicsUpdated = new Subject<any>();
    this.getOnlyHotTopics = true; //todo :load from local storage
    this.selectedTopicUpdated = new BehaviorSubject<any>(null);
  }

  public refreshTopics(category: string, shouldUpdateTabsSelection: boolean = true): Promise<any> {
    this.topics = [];
    let refreshPromise = new Promise((resolve) => {
      this.applicationSettings.getApplicationSettings()
        .then((applicationSettings) => {
          this.serviceClient
            .getTopics(applicationSettings.sources,
              category,
              applicationSettings.language)
            .then((topics) => {
              this.topics = topics;
              this.category = category;
              this.formatDateAndTimeForTopics(this.topics);
              this.orderTopicsChronologically(this.topics);
              //get topics by taking into account the filters
              let topicsToDisplay = this.getTopics();
              let topicsUpdatedInfo = new TopicsUpdatedInfo(category, topicsToDisplay, this.topics.length, this.filterHotTopics().length, shouldUpdateTabsSelection);
              this.topicsUpdated.next(topicsUpdatedInfo);
              resolve(topicsUpdatedInfo);
            });
        });
    });
    return refreshPromise;
  }

  public getTopics(): Array<any> {
    if (this.getOnlyHotTopics)
      return this.filterHotTopics();
    else {
      return this.topics.slice(0);
    }
  }

  public getCategory(): string {
    return this.category;
  }

  public getTopicsByKeyword(keyword: string) {
    return new Promise((resolve) => {
      this.applicationSettings.getApplicationSettings()
        .then((applicationSettings) => {
          this.topicsByKeyword = this.serviceClient.getTopicsByKeyword(keyword, applicationSettings.sources, applicationSettings.language);
          this.formatDateAndTimeForTopics(this.topicsByKeyword);
          resolve(this.topicsByKeyword);
        });
    });
  }

  public setTopicFilter(getOnlyHotTopics: boolean) {
    //set to local storage for later use;
    this.getOnlyHotTopics = getOnlyHotTopics;
  }

  public setSelectedTopic(category: any, topic: any) {
    this.applicationSettings.getApplicationSettings()
      .then((applicationSettings) => {
        this.selectedTopicUpdated.next(null);
        this.summariesProvider.getSummary(topic, category, applicationSettings).then((summaryInfo: any) => {
          this.selectedTopicUpdated.next(summaryInfo);
          this.summariesProvider.fetchSummariesForCachingPurposes(this.topics, category, applicationSettings, topic);
        });
      });
  }

  private getPreviousCategory(currentCateg): Promise<any> {
    return new Promise((resolve) => {
      this.applicationSettings.getApplicationSettings()
        .then((applicationSettings) => {
          let index = applicationSettings.categories.indexOf(currentCateg); //find the index if the current category
          if (index == 0)
            resolve(applicationSettings.categories[applicationSettings.categories.length - 1]);
          else if (index < applicationSettings.categories.length)
            resolve(applicationSettings.categories[index - 1]); //get the previous one
          else
            resolve(null); //categ was not found in the array...now thats strange!
        });
    })
  }

  private getNextCategory(currentCateg): Promise<any> {
    return new Promise((resolve) => {
        this.applicationSettings.getApplicationSettings()
          .then((applicationSettings) => {
            let index = applicationSettings.categories.indexOf(currentCateg); //find the index if the current category
            if (index == applicationSettings.categories.length - 1) //current category is the last one.
              resolve(applicationSettings.categories[0]); //fetch the first one
            else if (index >= 0)
              resolve(applicationSettings.categories[index + 1]); //fetch next category
            else
              resolve(null);
          });
      }
    )
  }

  private getTopicsAndSelect(category, topicToSelect: SelectTopicEnum) {
    if (category) {
      let topicToSelectAfterRetrieval = topicToSelect;
      this.refreshTopics(category, false)
        .then((topicsUpdatedInfo: TopicsUpdatedInfo) => {
          if (topicsUpdatedInfo.topics && topicsUpdatedInfo.topics.length > 0) {
            let topicToSelect = topicToSelectAfterRetrieval == SelectTopicEnum.FIRST ?
              topicsUpdatedInfo.topics[0] : topicsUpdatedInfo.topics[topicsUpdatedInfo.topics.length - 1];
            this.setSelectedTopic(topicsUpdatedInfo.category, topicToSelect);
          } else {
            if (topicToSelectAfterRetrieval === SelectTopicEnum.FIRST)
              this.loadNextTopic(category, null, false, true);
            else
              this.loadPreviousTopic(category, null, false, true);
          }
        });
    }
  }

  public loadNextTopic(category: any, currentTopic: any, isSearch: boolean, shouldForceNextCategory: boolean = false) {
    let existingTopics = isSearch ? this.topicsByKeyword : this.getTopics();
    let index = currentTopic ? existingTopics.map(x => x.ID).indexOf(currentTopic.ID) : -1;
    //we have reached the end or should force the next category selection
    if (index == existingTopics.length - 1 || shouldForceNextCategory) {
      if (!isSearch) //for search results there is no next/previous category to navigate
        this.getNextCategory(category)
          .then((nextCategory) => this.getTopicsAndSelect(nextCategory, SelectTopicEnum.FIRST));
    }
    else
      this.setSelectedTopic(category, existingTopics[index + 1]);
  }

  public loadPreviousTopic(category: any, currentTopic: any, isSearch: boolean, shouldForcePreviousCategory: boolean = false) {
    let existingTopics = isSearch ? this.topicsByKeyword : this.getTopics();
    let index = currentTopic ? existingTopics.map(x => x.ID).indexOf(currentTopic.ID) : -1;
    //we have reached the start or should force the previous category selection
    if (index == 0 || shouldForcePreviousCategory) {
      if (!isSearch)
        this.getPreviousCategory(category)
          .then((previousCateg) => this.getTopicsAndSelect(previousCateg, SelectTopicEnum.LAST));
    }
    else
      this.setSelectedTopic(category, existingTopics[index - 1]);
  }

  private filterHotTopics(): Array<any> {
    let topicsCopy = this.topics.slice(0);
    topicsCopy = topicsCopy
      .filter((topic) => topic.FromArticles > 1)
      .sort((a: any, b: any): number => {
        // sorting with DESC order
        if (a.FromArticles < b.FromArticles)
          return 1;
        else if (a.FromArticles > b.FromArticles)
          return -1;
        return 0;
      });
    return topicsCopy.slice(0);
  }

  private formatDateAndTimeForTopics(topics: Array<any>) {
    let now: Date = new Date();
    now.setHours(0, 0, 0, 0);
    let nowDateFormatted = (now.getDate() < 10 ? '0' : '') + now.getDate() + '-' +
      ((now.getMonth() + 1) < 10 ? '0' : '') + (now.getMonth() + 1) + '-' + now.getFullYear();
    topics.map(t => {
      let newestDate: any = t.NewestDate;
      t.DateFormatted = (newestDate.dayOfMonth < 10 ? '0' : '') + newestDate.dayOfMonth + '-' +
        ((newestDate.month + 1) < 10 ? '0' : '') + (newestDate.month + 1) + '-' + newestDate.year;
      t.TimeFormatted = (newestDate.hourOfDay < 10 ? '0' : '') + newestDate.hourOfDay + ':' +
        (newestDate.minute < 10 ? '0' : '') + newestDate.minute;
      t.Date = new Date(Date.UTC(newestDate.year, newestDate.month, newestDate.dayOfMonth,
        newestDate.hourOfDay, newestDate.minute, newestDate.second));
      if (nowDateFormatted === t.DateFormatted)
        t.DisplayTime = t.TimeFormatted;
      else if (t.Date.getTime() > now.getTime() - (TopicsProvider.DAY_IN_MILLIS))
        t.DisplayTime = 'YESTERDAY';
      else
        t.DaysAgo = parseInt((((now.getTime() - t.Date.getTime()) / (TopicsProvider.DAY_IN_MILLIS)) + 1).toString());
      return t;
    });
  }

  private orderTopicsChronologically(topics: Array<any>) {
    // sorting with DESC order
    topics.sort((a: any, b: any): number => {
      let dateA: Date = a.Date;
      let dateB: Date = b.Date;
      if (dateB > dateA) {
        return 1;
      } else if (dateB < dateA) {
        return -1;
      }
      return 0;
    });
  }
}
