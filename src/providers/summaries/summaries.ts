import { Injectable } from '@angular/core';
import {ApiServiceProvider} from "../api-service/apiService";

/*
  Generated class for the SummariesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SummariesProvider {

  private fetchedSummaries: any = {};

  constructor(private serviceClient: ApiServiceProvider) {
  }


  public getSummary(topic: any, category: string, applicationSettings: any): any {
    return new Promise<any>((resolve) => {
      if (this.fetchedSummaries[topic.ID]) { // check if summary is already fetched and return it
        resolve(this.fetchedSummaries[topic.ID]);
      } else { // if the summary is not already fetched, fetch it from service
        this.fetchSummaryFromService(topic, category, applicationSettings).then((summaryInfo: any) => {
          resolve(summaryInfo);
        })
      }
    });
  }

  public fetchSummariesForAllTopics(topics: Array<any>, category: string, applicationSettings: any) {
    for (let topic of topics) {
      if (!this.fetchedSummaries[topic.ID]) {
        this.fetchSummaryFromService(topic, category, applicationSettings);
      }
    }
  }

  private fetchSummaryFromService(topic: any, category: string, applicationSettings: any): Promise<any> {
    return this.serviceClient
      .getSummary(topic.ID, applicationSettings.sources, applicationSettings.language)
      .then((summary) => {
        this.fetchedSummaries[topic.ID] = {category: category, topic: topic, summary: summary};
        return this.fetchedSummaries[topic.ID];
      });
  }
}
