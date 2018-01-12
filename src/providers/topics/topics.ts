import { Injectable } from '@angular/core';
import {ServiceClientProvider} from "../service-client/service-client";
import {ContentLanguagesProvider} from "../content-languages/content-languages";
import {SourcesProvider} from "../sources/sources";
import {CategoriesProvider} from "../categories/categories";
import {Subject} from "rxjs/Subject";

// TODO: move to configuration file
const NUMBER_OF_HOT_TOPICS_TO_DISPLAY: number = 10;

/*
  Generated class for the TopicsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TopicsProvider {
  public topicsUpdated: Subject<any>;
  public selectedTopicUpdated: Subject<any>;
  private selectedCategory: string;
  private selectedSourcesUrls: Array<string>;
  private selectedLang: string;
  private topics: Array<any>;
  private hotTopics: Array<any>;
  private topicsByKeyword: Array<any>;
  private selectedTopic: string;

  constructor(private serviceClient: ServiceClientProvider, private sourcesProvider: SourcesProvider,
              private contentLanguagesProvider: ContentLanguagesProvider, private categoriesProvider: CategoriesProvider) {
    this.topicsUpdated = new Subject<any>();
    this.selectedTopicUpdated = new Subject<any>();
    this.selectedCategory = this.categoriesProvider.getSelectedCategory();
    this.selectedSourcesUrls = this.sourcesProvider.getSelectedSourcesUrls();
    this.categoriesProvider.selectedCategoryUpdated.subscribe((newCategory) => {
      this.selectedLang = this.contentLanguagesProvider.getSelectedContentLanguage();
      this.selectedCategory = newCategory;
      this.selectedSourcesUrls = this.sourcesProvider.getSelectedSourcesUrls();
      this.topics = this.serviceClient.getTopics(this.selectedSourcesUrls,
        this.selectedCategory, this.selectedLang);
      this.formatDateAndTimeForTopics();
      this.filterHotTopics();
      this.topicsUpdated.next(this.topics);
    }, error => console.error(error));
    if (this.selectedCategory) {
      this.selectedLang = this.contentLanguagesProvider.getSelectedContentLanguage();
      this.topics = this.serviceClient.getTopics(this.selectedSourcesUrls,
        this.selectedCategory, this.selectedLang);
      this.formatDateAndTimeForTopics();
      this.filterHotTopics();
      this.topicsUpdated.next(this.topics);
    }
  }

  public getTopics(): Array<any> {
    return this.topics.slice(0);
  }

  public getHotTopics(): Array<any> {
    return this.hotTopics.slice(0);
  }

  public getTopicsByKeyword(keyword: string): Array<any> {
    this.topicsByKeyword = this.serviceClient.getTopicsByKeyword(keyword, this.selectedSourcesUrls, this.selectedLang);
    return this.topicsByKeyword;
  }

  public getSelectedTopic(): any {
    return this.selectedTopic;
  }

  public setSelectedHotTopic(topicIndex: number) {
    this.selectedTopic = this.hotTopics[topicIndex];
    this.selectedTopicUpdated.next(this.selectedTopic);
  }

  public setSelectedTopic(topicIndex: number) {
    this.selectedTopic = this.topics[topicIndex];
    this.selectedTopicUpdated.next(this.selectedTopic);
  }

  private filterHotTopics() {
    let topicsCopy = this.getTopics();
    // get the first *NUMBER_OF_HOT_TOPICS_TO_DISPLAY* topics with the most sources as hot topics
    topicsCopy.sort((a: any, b: any): any => {
      // sorting with DESC order
      if (a.FromArticles < b.FromArticles)
        return 1;
      else if (a.FromArticles > b.FromArticles)
        return -1;
      return 0;
    });
    this.hotTopics = topicsCopy.slice(0, NUMBER_OF_HOT_TOPICS_TO_DISPLAY);
  }

  private formatDateAndTimeForTopics() {
    this.topics.map(t => {
      let newestDate: any = t.NewestDate;
      t.DateFormatted = (newestDate.dayOfMonth < 10 ? '0' : '') + newestDate.dayOfMonth + '-' +
        ((newestDate.month + 1) < 10 ? '0' : '') + (newestDate.month + 1) + '-' + newestDate.year;
      t.TimeFormatted = (newestDate.hourOfDay < 10 ? '0' : '') + newestDate.hourOfDay + ':' +
        (newestDate.minute < 10 ? '0' : '') + newestDate.minute;
      return t;
    });
  }
}
