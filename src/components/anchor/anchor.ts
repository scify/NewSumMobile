import {Component, Input} from '@angular/core';
import {Platform} from "ionic-angular";
import {InAppBrowser} from "@ionic-native/in-app-browser";

/**
 * Generated class for the AnchorComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'anchor',
  templateUrl: 'anchor.html',
  providers:[InAppBrowser]
})
export class AnchorComponent {

  @Input('href') href: string;
  @Input('text') text: string;
  constructor(private platform: Platform, private iab: InAppBrowser) {

  }

  openLink(){
    this.iab.create(this.href, "_blank", "location=yes");
  }

}
