import { Injectable } from '@angular/core';
import {SoapClientProvider} from "../soap-client/soap-client";

/*
  Generated class for the ServiceClientProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ServiceClientProvider {

  constructor(private soapClient: SoapClientProvider) {}

  public getLanguages(): Array<string> {
    return JSON.parse(this.soapClient.getResource('getLanguages', null));
  }

  public getFeedSources(selectedLang: string): Array<any> {
    return JSON.parse(this.soapClient.getResource('getFeedSources', {sLang: selectedLang}));
  }

  public getCategories(selectedSources: Array<string>, selectedLang: string): Array<string> {
    return JSON.parse(this.soapClient.getResource('getCategories', {sUserSources: selectedSources, sLang: selectedLang}));
  }
}
