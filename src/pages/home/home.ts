import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SoapClientProvider } from "../../providers/soap-client/soap-client";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, public soapClient: SoapClientProvider) {
    soapClient.getAvailableLanguages();
  }


}

