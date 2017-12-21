import { Component } from '@angular/core';

import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
//import {SoapService} from "autopulous-angular2-soap/soap.service";

@Component({
  templateUrl: 'tabs.html',
    providers: []
})
export class TabsPage {
    private servicePort:string = 'http://172.16.62.111:8091';
    private servicePath:string = '/your-application-ws/ws/';
    private targetNamespace:string = '';

    private responseJso:{} = null;
  tab1Root = HomePage;
  tab2Root = AboutPage;
  tab3Root = ContactPage;
  constructor() {
      //this.soapService = new SoapService(this.servicePort, this.servicePath, this.targetNamespace);
  }
}
