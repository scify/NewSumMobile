import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {ServiceClientProvider} from "../../providers/service-client/service-client";


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  private newSumService:ServiceClientProvider;
  constructor(public navCtrl: NavController,
              public newSumService: ServiceClientProvider
  ) {
    this.newSumService = newSumService;
  }



}

