import { Injectable } from '@angular/core';
import { SOAPClient } from '../../lib/soapclient';

@Injectable()
export class SoapClientProvider {

  private serverUrl:string = "http://main.newsumservice.scify.org:60500";
  private wsdlPath:string = "/NewSumFreeService/NewSumFreeService";
  private soapClient:SOAPClient;

  constructor() {
    this.soapClient = new SOAPClient();
  }

  public getResource(methodToInvoke, parameters): string {
    return this.soapClient.invoke(this.serverUrl + this.wsdlPath, methodToInvoke, parameters, false, (data) => {
      console.log('Response: ', data);
      return data;
    });
  }
}
