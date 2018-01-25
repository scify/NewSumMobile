import {Injectable} from '@angular/core';
import {Subject} from "rxjs/Subject";
import {BehaviorSubject} from "rxjs";
import {ApplicationSettingsProvider} from "../applicationSettings/applicationSettings";
import {TopicsUpdatedInfo} from "../../models/TopicsUpdatedInfo";
import {ApiServiceProvider} from "../api-service/apiService";

// TODO: move to configuration file
const NUMBER_OF_HOT_TOPICS_TO_DISPLAY: number = 10;

@Injectable()
export class TopicsProvider {

  private topics: Array<any> = [];
  private category: string;
  private topicsByKeyword: Array<any>;
  private getOnlyHotTopics: boolean;

  public topicsUpdated: Subject<any>;
  public selectedTopicUpdated: BehaviorSubject<any>;

  constructor(private serviceClient: ApiServiceProvider,
              private applicationSettings: ApplicationSettingsProvider) {
    this.topicsUpdated = new Subject<any>();
    this.getOnlyHotTopics = true; //todo :load from local storage
    this.selectedTopicUpdated = new BehaviorSubject<any>(null);
  }

  public refreshTopics(category: string): Promise<any> {
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
              //get topics by taking into account the filters
              let topicsToDisplay = this.getTopics();
              let topicsUpdatedInfo = new TopicsUpdatedInfo(category, topicsToDisplay, this.topics.length, this.filterHotTopics().length);
              this.topicsUpdated.next(topicsUpdatedInfo);
              resolve(topicsUpdatedInfo);
              /*if (topicToSelect && topicsToDisplay.length > 0)
               this.selectedTopicUpdated.next(topicToSelect == SelectTopicEnum.FIRST ?
               topicsToDisplay[0] :
               topicsToDisplay[topicsToDisplay.length - 1]);*/
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
        this.serviceClient
          .getSummary(topic.ID, applicationSettings.sources, applicationSettings.language)
          .then((summary) => {
            this.selectedTopicUpdated.next({category: category, topic: topic, summary: summary});
          })
      });


  }

  public loadNextTopic(category: any, currentTopic: any, isSearch: boolean) {
    let existingTopics = isSearch ? this.topicsByKeyword : this.getTopics();
    let index = existingTopics.indexOf(currentTopic);
    if (index == existingTopics.length - 1) //we have reached the end,select next category
    {
      //  if (!isSearch) //for search results there is no next/previous category to navigate
      //this.categoriesProvider.loadNextCategory(SelectTopicEnum.FIRST);
    }
    else
      this.setSelectedTopic(category, existingTopics[index + 1]);
  }

  public loadPreviousTopic(category: any, currentTopic: any, isSearch: boolean) {
    let existingTopics = isSearch ? this.topicsByKeyword : this.getTopics();
    let index = existingTopics.indexOf(currentTopic);
    if (index == 0) //we have reached the start,
    {
      // if (!isSearch)
      //this.categoriesProvider.loadPreviousCategory(SelectTopicEnum.LAST);
    }
    else
      this.setSelectedTopic(category, existingTopics[index - 1]);
  }

  private filterHotTopics(): Array<any> {
    let topicsCopy = this.topics.slice(0);
    // get the first *NUMBER_OF_HOT_TOPICS_TO_DISPLAY* topics with the most sources as hot topics
    topicsCopy = topicsCopy
      .filter((topic) => topic.FromArticles > 1)
      .sort((a: any, b: any): any => {
        // sorting with DESC order
        if (a.FromArticles < b.FromArticles)
          return 1;
        else if (a.FromArticles > b.FromArticles)
          return -1;
        return 0;
      });
    return topicsCopy.slice(0, NUMBER_OF_HOT_TOPICS_TO_DISPLAY);
  }

  private formatDateAndTimeForTopics(topics: Array<any>) {
    topics.map(t => {
      let newestDate: any = t.NewestDate;
      t.DateFormatted = (newestDate.dayOfMonth < 10 ? '0' : '') + newestDate.dayOfMonth + '-' +
        ((newestDate.month + 1) < 10 ? '0' : '') + (newestDate.month + 1) + '-' + newestDate.year;
      t.TimeFormatted = (newestDate.hourOfDay < 10 ? '0' : '') + newestDate.hourOfDay + ':' +
        (newestDate.minute < 10 ? '0' : '') + newestDate.minute;
      return t;
    });
  }
}
