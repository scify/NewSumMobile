import { Injectable } from '@angular/core';
import {Subject} from "rxjs/Subject";
import {Storage} from "@ionic/storage";
import {ApiServiceProvider} from "../api-service/apiService";

/*
  Generated class for the SourcesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SourcesProvider {
  public selectedSourcesUpdated: Subject<any>;
  private selectedLang: string;
  private sources: Array<any> = [];
  private selectedSources: Array<any> = [];

  /*constructor(private serviceClient: ApiServiceProvider,
              private appStorage: Storage) {
    this.selectedSourcesUpdated = new Subject<any>();
    this.selectedLang = this.contentLanguagesProvider.getSelectedContentLanguage();
    this.contentLanguagesProvider.contentLanguageUpdated.subscribe((newLang) => {
      if (this.selectedLang !== newLang) {
        this.selectedLang = newLang;
        this.sources = this.serviceClient.getFeedSources(this.selectedLang);
        this.selectedSources = this.getAllAvailableSources();
        this.selectedSourcesUpdated.next(this.getSelectedSources());
      }
    }, error => console.error(error));
    if (this.selectedLang) {
      this.sources = this.serviceClient.getFeedSources(this.selectedLang);
      this.getSelectedSourcesFromStorage().then((selectedSourcesUrls) => {

        this.formatSelectedSources(selectedSourcesUrls ? selectedSourcesUrls.split(',') : []);
        this.selectedSources = (this.selectedSources.length > 0) ? this.selectedSources : this.getAllAvailableSources();
        this.selectedSourcesUpdated.next(this.getSelectedSources());
      });
    }
  }
*/
  public getAllAvailableSources(): Array<any> {
    return this.sources.slice(0);
  }

  public getSelectedSources(): Array<any> {
    return this.selectedSources.slice(0);
  }

  public getSelectedSourcesUrls(): Array<any> {
    return (this.sources.length === this.selectedSources.length) ?
      ['ALL'] : this.selectedSources.map(s => s.sFeedLink);
  }

  /*public setSelectedSources(selectedSources: Array<any>) {
    this.selectedSources = selectedSources;
    this.selectedSourcesUpdated.next(this.getSelectedSources());
    this.appStorage.set('selected-sources', this.getSelectedSourcesUrls().join())
  }

  private getSelectedSourcesFromStorage(): Promise<any> {
    return this.appStorage.get('selected-sources');
  }*/

  private formatSelectedSources(selectedSourcesUrls: Array<string>) {
    let allSourcesUrls = this.sources.map(source => source.sFeedLink);
    this.selectedSources = [];
    for (let i = 0; i < selectedSourcesUrls.length; i++) {
      let foundInPosition = allSourcesUrls.indexOf(selectedSourcesUrls[i]);
      if (foundInPosition >= 0) {
        this.selectedSources.push(this.sources[foundInPosition]);
      }
    }
  }
}
