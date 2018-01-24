import {Injectable} from '@angular/core';
import {SoapApiCaller} from "./soap-api-caller";



/*
 Generated class for the ApiServiceProvider provider.

 See https://angular.io/guide/dependency-injection for more info on providers
 and Angular DI.
 */
@Injectable()
export class ApiServiceProvider {


  constructor(private soapApiCaller: SoapApiCaller) {
  }

  public getLanguages(): Array<string> {
    return this.soapApiCaller.getResource('getLanguages', null);
  }

  public getFeedSources(selectedLang: string): Array<any> {
    return this.soapApiCaller.getResource('getFeedSources', {sLang: selectedLang});
  }

  public getCategories(selectedSources: Array<string>, selectedLang: string): Array<string> {
    return this.soapApiCaller.getResource('getCategories', {
      sUserSources: selectedSources,
      sLang: selectedLang
    });
  }

  public getTopics(selectedSources: Array<string>, selectedCategory: string, selectedLang: string): Promise<any> {
    return this.soapApiCaller.getResourceAsync('getTopics',
      {
        sUserSources: selectedSources,
        sCategory: selectedCategory,
        sLang: selectedLang
      });
  }

  public getTopicsByKeyword(keyword: string, selectedSources: Array<string>, selectedLang: string): Array<any> {
    return this.soapApiCaller.getResource('getTopicsByKeyword',
      {sKeyword: keyword, sUserSources: selectedSources, sLang: selectedLang}
    );
  }

  public getSummary(topicId: string, selectedSources: Array<string>, selectedLang: string): Promise<any> {
    return this.soapApiCaller.getResourceAsync('getSummary',
      {
        sTopicID: topicId,
        sUserSources: selectedSources,
        sLang: selectedLang
      }
    );
  }
}
