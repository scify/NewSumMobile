import {Injectable} from '@angular/core';
import {SoapClientProvider} from "../soap-client/soap-client";


/*
 Generated class for the ServiceClientProvider provider.

 See https://angular.io/guide/dependency-injection for more info on providers
 and Angular DI.
 */
@Injectable()
export class ServiceClientProvider {


  constructor(private soapClient: SoapClientProvider) {
  }

  public getLanguages(): Array<string> {
    return JSON.parse(this.soapClient.getResource('getLanguages', null));
  }

  public getFeedSources(selectedLang: string): Array<any> {
    return JSON.parse(this.soapClient.getResource('getFeedSources', {sLang: selectedLang}));
  }

  public getCategories(selectedSources: Array<string>, selectedLang: string): Array<string> {
    return JSON.parse(this.soapClient.getResource('getCategories', {
      sUserSources: selectedSources,
      sLang: selectedLang
    }));
  }

  public getTopics(selectedSources: Array<string>, selectedCategory: string, selectedLang: string): Promise<any> {
    const promise = new Promise((resolve, reject) => {
      const topics = JSON.parse(this.soapClient.getResource('getTopics',
        {
          sUserSources: selectedSources,
          sCategory: selectedCategory,
          sLang: selectedLang
        }));
        resolve(topics);
    });
    return promise;
  }

  public getTopicsByKeyword(keyword: string, selectedSources: Array<string>, selectedLang: string): Array<any> {
    return JSON.parse(this.soapClient.getResource('getTopicsByKeyword',
      {sKeyword: keyword, sUserSources: selectedSources, sLang: selectedLang}
      )
    );
  }

  public getSummary(topicId: string, selectedSources: Array<string>, selectedLang: string): Array<any> {
    return JSON.parse(this.soapClient.getResource('getSummary',
      {sTopicID: topicId, sUserSources: selectedSources, sLang: selectedLang}
      )
    );
  }
}
