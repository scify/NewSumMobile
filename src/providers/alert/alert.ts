import { Injectable } from '@angular/core';
import {AlertController} from "ionic-angular";

/*
  Generated class for the AlertProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AlertProvider {

  constructor(private alertCtrl: AlertController) {

  }

  displayMessage(message: String):Promise<any> {
   /* let alert = this.alertCtrl.create({
      title: message,
      subTitle: message
    });
    return alert.present();*/
   return null;
  }

}
