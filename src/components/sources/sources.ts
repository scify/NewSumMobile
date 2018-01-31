import {Component, Input} from '@angular/core';

/**
 * Generated class for the SourcesComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'sources',
  templateUrl: 'sources.html'
})
export class SourcesComponent {

  @Input('sentence') sentence: any;
  public allSources: Array<any> = [];

  constructor() {}

  ngOnChanges() {
    this.allSources = [];
    this.allSources = this.allSources.concat([this.sentence.Source], this.sentence.AlternateSources);
  }
}
