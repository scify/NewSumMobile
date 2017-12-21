import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {AlertProvider} from "../alert/alert";

/*
  Generated class for the NotificationsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class NotificationsProvider {

  constructor( private http: HttpClient,
              private alertProvider :AlertProvider ) {

  }

  hasNotification():boolean {
      return true;
  }

  displayNotification():void {
      this.alertProvider.displayMessage("hello");
  }
}
