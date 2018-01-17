import { Injectable } from '@angular/core';
import { SOAPClient } from '../../lib/soapclient';
import {APP_CONFIG} from "../../app/app-config"

@Injectable()
export class SoapClientProvider {

  private soapClient:SOAPClient;

  constructor() {
    this.soapClient = new SOAPClient();
  }

  public getResource(methodToInvoke, parameters): string {

    return this.soapClient.invoke(APP_CONFIG.apiEndpoint+ APP_CONFIG.wsdlPath, methodToInvoke, parameters, false, (data) => {
      //console.log('Response: ', data);
      return data;
    });
  }
}
