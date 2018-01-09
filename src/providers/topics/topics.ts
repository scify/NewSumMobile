import { Injectable } from '@angular/core';
import {ServiceClientProvider} from "../service-client/service-client";
import {ContentLanguagesProvider} from "../content-languages/content-languages";
import {SourcesProvider} from "../sources/sources";
import {CategoriesProvider} from "../categories/categories";
import {Subject} from "rxjs/Subject";

/*
  Generated class for the TopicsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TopicsProvider {
  public topicsUpdated: Subject<any>;
  private selectedCategories: Array<string>;
  private selectedSourcesUrls: Array<string>;
  private selectedLang: string;
  private topics: Array<any>;
  private topicsByKeyword: Array<any>;

  constructor(private serviceClient: ServiceClientProvider, private sourcesProvider: SourcesProvider,
              private contentLanguages: ContentLanguagesProvider, private categoriesProvider: CategoriesProvider) {
    this.topicsUpdated = new Subject<any>();
    this.selectedCategories = this.categoriesProvider.getSelectedCategories();
    this.selectedSourcesUrls = this.sourcesProvider.getSelectedSourcesUrls();
    this.categoriesProvider.categoriesUpdated.subscribe((newCategories) => {
      this.selectedLang = this.contentLanguages.getSelectedContentLanguage();
      if (newCategories.length > 0) {
        this.selectedCategories = newCategories;
        this.selectedSourcesUrls = this.sourcesProvider.getSelectedSourcesUrls();
        this.topics = this.serviceClient.getTopics(this.selectedSourcesUrls,
          this.selectedCategories[0], this.selectedLang);
        this.topicsUpdated.next(this.topics);
      }
    }, error => console.error(error));
    if (this.selectedCategories.length > 0) {
      this.selectedLang = this.contentLanguages.getSelectedContentLanguage();
      this.topics = this.serviceClient.getTopics(this.selectedSourcesUrls,
        this.selectedCategories[0], this.selectedLang);
      this.topicsUpdated.next(this.topics);
    }
  }

  public getTopics(): Array<any> {
    return this.topics;
  }

  // TODO: pass keyword as parameter
  public getTopicsByKeyword(): Array<any> {
    let keyword = 'Συρία';
    this.topicsByKeyword = this.serviceClient.getTopicsByKeyword(keyword, this.selectedSourcesUrls, this.selectedLang);
    return this.topicsByKeyword;
  }
}
