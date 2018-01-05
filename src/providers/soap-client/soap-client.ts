import { Injectable } from '@angular/core';
import { SOAPClient } from '../../lib/soapclient';

@Injectable()
export class SoapClientProvider {

  private serverUrl:string = "http://main.newsumservice.scify.org:60500";
  private wsdlPath:string = "/NewSumFreeService/NewSumFreeService";//?wsdl";
  private namespace:string = "http://NewSumFreeService.Server.NewSumServer.scify.org/";
  // private soap:string = "http://main.newsumservice.scify.org:60500/NewSumFreeService/NewSumFreeService";
  private soapClient:SOAPClient;

  constructor() {
    this.soapClient = new SOAPClient(this.namespace);
    // this.serverUrl, this.wsdlPath, this.namespace);
    // this.soapClient.envelopeBuilder = this.envelopeBuilder;
    // this.soapClient.jsoResponseHandler = (response:{}) => {this.responseJso = response};
    // this.soapClient.localNameMode = true;
  }

  public getResource(methodToInvoke, parameters) {
    return this.soapClient.invoke(this.serverUrl + this.wsdlPath, methodToInvoke, parameters, false, (data) => {
      console.log(data);
      return data;
    });
  }
}
