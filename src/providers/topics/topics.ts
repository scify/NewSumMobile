import {Injectable} from '@angular/core';
import {ServiceClientProvider} from "../service-client/service-client";
import {ContentLanguagesProvider} from "../content-languages/content-languages";
import {SourcesProvider} from "../sources/sources";
import {CategoriesProvider} from "../categories/categories";
import {Subject} from "rxjs/Subject";
import {BehaviorSubject} from "rxjs";

// TODO: move to configuration file
const NUMBER_OF_HOT_TOPICS_TO_DISPLAY: number = 10;

/*
 Generated class for the TopicsProvider provider.

 See https://angular.io/guide/dependency-injection for more info on providers
 and Angular DI.
 */
@Injectable()
export class TopicsProvider {
  public topicsUpdated: BehaviorSubject<any>;
  public fetchingNewTopics: Subject<any>;
  public selectedTopicUpdated: Subject<any>;
    private selectedCategory: string;
  private selectedSourcesUrls: Array<string>;
  private selectedLang: string;
  private topics: Array<any> = [];
  private topicsByKeyword: Array<any>;
  private selectedTopic: string;
  public getOnlyHotTopics: boolean;
  public dateOfCreation: Date = new Date();

  constructor(private serviceClient: ServiceClientProvider,
              private sourcesProvider: SourcesProvider,
              private contentLanguagesProvider: ContentLanguagesProvider,
              private categoriesProvider: CategoriesProvider) {

    this.fetchingNewTopics = new Subject<any>();
    this.topicsUpdated = new BehaviorSubject<any>(null);
    this.getOnlyHotTopics = true; //todo :load from local storage

    this.selectedTopicUpdated = new BehaviorSubject<any>(null);
    this.selectedCategory = this.categoriesProvider.getSelectedCategory();
    this.selectedSourcesUrls = this.sourcesProvider.getSelectedSourcesUrls();
    this.categoriesProvider.selectedCategoryUpdated.subscribe(this.selectedCategoryUpdatedHandler.bind(this), error => console.error(error));

    if (this.selectedCategory) {
      this.selectedLang = this.contentLanguagesProvider.getSelectedContentLanguage();
      this.getTopicsFromServiceProvider();
    }
  }

  private getTopicsFromServiceProvider() {
    console.log("topics provider,about to request topics for category" + this.selectedCategory);
    this.serviceClient
      .getTopics(this.selectedSourcesUrls,
        this.selectedCategory,
        this.selectedLang)
      .then((topics) => {
        console.log("received "+ topics.length+ " topics for category"+ this.selectedCategory);
        this.topics = topics;
        this.formatDateAndTimeForTopics(this.topics);
        this.topicsUpdated.next(this.topics);
      });
  }

  private selectedCategoryUpdatedHandler(newCategory) {
    if (newCategory) {
      this.topics = [];
      this.fetchingNewTopics.next(newCategory); //trigger event, fetching new category is starting!
      this.selectedLang = this.contentLanguagesProvider.getSelectedContentLanguage();
      this.selectedCategory = newCategory;
      this.selectedSourcesUrls = this.sourcesProvider.getSelectedSourcesUrls();
      this.getTopicsFromServiceProvider();
    }
  }

  public getTopics(): Array<any> {
    if (this.getOnlyHotTopics)
      return this.filterHotTopics();
    else {
      return this.topics.slice(0);
    }
  }

  public getTopicsByKeyword(keyword: string): Array<any> {
    this.topicsByKeyword = this.serviceClient.getTopicsByKeyword(keyword, this.selectedSourcesUrls, this.selectedLang);
    this.formatDateAndTimeForTopics(this.topicsByKeyword);
    return this.topicsByKeyword;
  }

  public getSelectedTopic(): any {
    return this.selectedTopic;
  }

  public setTopicFilter(getOnlyHotTopics: boolean) {
    //set to local storage for later use;
    this.getOnlyHotTopics = getOnlyHotTopics;
  }

  public setSelectedTopic(topic: any) {
    this.selectedTopic = null;
    this.selectedTopicUpdated.next(null);
    this.serviceClient
      .getSummary(topic.ID, this.selectedSourcesUrls, this.selectedLang)
      .then((summary) => {
        this.selectedTopic = topic;
        this.selectedTopicUpdated.next({category:this.selectedCategory, topic:topic,summary:summary});
      })

  }

  public loadNextTopic(isSearch: boolean) {
    let existingTopics = isSearch ? this.topicsByKeyword : this.getTopics();
    let index = existingTopics.indexOf(this.selectedTopic);
    if (index == existingTopics.length - 1) { //we have reached the end
      this.categoriesProvider.loadNextCategory();
    }
    else {
      let topic = existingTopics[index + 1];
      this.setSelectedTopic(topic);
      return true;
    }
  }

  public loadPreviousTopic(isSearch: boolean) {
    let existingTopics = isSearch ? this.topicsByKeyword : this.getTopics();
    let index = existingTopics.indexOf(this.selectedTopic);
    if (index == 0) { //we have reached the start,
      this.categoriesProvider.loadPreviousCategory();
      return false;
    }
    else {
      let topic = existingTopics[index - 1];
      this.setSelectedTopic(topic);
      return true;
    }
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
