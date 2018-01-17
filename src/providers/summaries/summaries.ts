import { Injectable } from '@angular/core';
import {ContentLanguagesProvider} from "../content-languages/content-languages";
import {SourcesProvider} from "../sources/sources";
import {ServiceClientProvider} from "../service-client/service-client";
import {TopicsProvider} from "../topics/topics";
import {Subject} from "rxjs/Subject";

/*
  Generated class for the SummariesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SummariesProvider {

  private selectedTopic: any;
  private selectedSourcesUrls: Array<string>;
  private selectedLang: string;
  private summary: any;

  constructor(private serviceClient: ServiceClientProvider, private sourcesProvider: SourcesProvider,
              private contentLanguagesProvider: ContentLanguagesProvider, private topicsProvider: TopicsProvider) {
    this.selectedTopic = this.topicsProvider.getSelectedTopic();
    this.topicsProvider.selectedTopicUpdated.subscribe((newTopic) => {
      this.selectedLang = this.contentLanguagesProvider.getSelectedContentLanguage();
      this.selectedSourcesUrls = this.sourcesProvider.getSelectedSourcesUrls();
      if (newTopic) {
        this.selectedTopic = newTopic;
        this.summary = this.serviceClient.getSummary(this.selectedTopic.ID, this.selectedSourcesUrls, this.selectedLang);
      }
    });
    if (this.selectedTopic) {
      this.selectedLang = this.contentLanguagesProvider.getSelectedContentLanguage();
      this.selectedSourcesUrls = this.sourcesProvider.getSelectedSourcesUrls();
      this.summary = this.serviceClient.getSummary(this.selectedTopic.ID, this.selectedSourcesUrls, this.selectedLang);
    }

  }

  public getSummary(): any {
    return this.summary;
  }
}
