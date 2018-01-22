import {Injectable} from '@angular/core';
import {SOAPClient} from '../../lib/soapclient';
import {APP_CONFIG} from "../../app/app-config"

@Injectable()
export class SoapClientProvider {

  private soapClient: SOAPClient;

  constructor() {
    this.soapClient = new SOAPClient();
  }

  public getResource(methodToInvoke, parameters): Array<any> {
    return JSON.parse(this.soapClient.invoke(APP_CONFIG.apiEndpoint + APP_CONFIG.wsdlPath, methodToInvoke, parameters, false, null));
  }

  public getResourceAsync(methodToInvoke, parameters): Promise<any> {
    return new Promise((resolve, reject) => {
      const results = JSON.parse(this.soapClient.invoke(APP_CONFIG.apiEndpoint + APP_CONFIG.wsdlPath, methodToInvoke, parameters, false, null));

      resolve(results);
      //window.setTimeout(()=>resolve(results), 2000);

    });
  }
}
