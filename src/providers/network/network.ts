import { Network } from '@ionic-native/network';
import { Injectable } from '@angular/core';
import {Subject} from "rxjs/Subject";
import {Platform} from "ionic-angular";

/*
  Generated class for the NetworkProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class NetworkProvider {
  public networkConnectionChanged: Subject<any>;

  constructor(public network: Network, private platform: Platform) {
    this.networkConnectionChanged = new Subject<any>();
    if (this.platform.is('cordova')) {
      this.network.onchange().subscribe(() => {
        this.networkConnectionChanged.next(this.network.type);
      }, error => console.error('Could not observe network changes', error));
    } else {
      console.error('Network connection could not be set (need an emulator or device to work properly).');
    }
  }
}
