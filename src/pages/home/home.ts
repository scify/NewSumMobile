import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {ServiceClientProvider} from "../../providers/service-client/service-client";


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(private navCtrl: NavController,
              private newSumService: ServiceClientProvider
  ) {
    this.newSumService = newSumService;
  }



}

