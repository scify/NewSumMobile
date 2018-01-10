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
  private selectedCategory: string;
  private selectedSourcesUrls: Array<string>;
  private selectedLang: string;
  private topics: Array<any>;
  private hotTopics: Array<any>;
  private topicsByKeyword: Array<any>;

  constructor(private serviceClient: ServiceClientProvider, private sourcesProvider: SourcesProvider,
              private contentLanguagesProvider: ContentLanguagesProvider, private categoriesProvider: CategoriesProvider) {
    this.topicsUpdated = new Subject<any>();
    this.selectedCategory = this.categoriesProvider.getSelectedCategory();
    this.selectedSourcesUrls = this.sourcesProvider.getSelectedSourcesUrls();
    this.categoriesProvider.selectedCategoryUpdated.subscribe((newCategory) => {
      this.selectedLang = this.contentLanguagesProvider.getSelectedContentLanguage();
      this.selectedCategory = newCategory;
      this.selectedSourcesUrls = this.sourcesProvider.getSelectedSourcesUrls();
      this.topics = this.serviceClient.getTopics(this.selectedSourcesUrls,
        this.selectedCategory, this.selectedLang);
      this.filterHotTopics();
      this.topicsUpdated.next(this.topics);
    }, error => console.error(error));
    if (this.selectedCategory) {
      this.selectedLang = this.contentLanguagesProvider.getSelectedContentLanguage();
      this.topics = this.serviceClient.getTopics(this.selectedSourcesUrls,
        this.selectedCategory, this.selectedLang);
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

  private filterHotTopics() {
    let topicsCopy = this.getTopics();
    topicsCopy.sort((a: any, b: any): any => {
      return a.FromArticles < b.FromArticles;
    });
    this.hotTopics = topicsCopy.slice(0, NUMBER_OF_HOT_TOPICS_TO_DISPLAY);
  }
}
