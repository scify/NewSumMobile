import {ErrorHandler, Injectable} from '@angular/core';
import {SOAPClient} from '../../lib/soapclient';
import {APP_CONFIG} from "../../app/app-config"
import {Storage} from "@ionic/storage";

@Injectable()
export class SoapApiCaller{

  private soapClient: SOAPClient;
  private apiEndpoint: string;

  constructor(private errorHandler: ErrorHandler, private appStorage: Storage) {
    this.soapClient = new SOAPClient();
    this.getEndpointUsageSwitch().then((endpointSwitch: boolean) => {
      this.apiEndpoint = (endpointSwitch) ? APP_CONFIG.apiEndpointBackup : APP_CONFIG.apiEndpoint;
    });
  }

  public getResource(methodToInvoke, parameters): Array<any> {
    let result = this.invokeSOAPClient(methodToInvoke, parameters, false, null);
    try {
      return JSON.parse(result);
    } catch(error) {
      this.setEndpointUsageSwitch(this.calculateEndpointSwitchValueForStorage());
      throw error;
    }
  }

  public getResourceAsync(methodToInvoke, parameters): Promise<any> {
    return new Promise((resolve, reject) => {
      this.invokeSOAPClient(methodToInvoke, parameters, true, (result) => {
        if (result) {
          resolve(JSON.parse(result));
        } else {
          reject();
        }
      });
    }).catch((error) => {
      this.setEndpointUsageSwitch(this.calculateEndpointSwitchValueForStorage());
      throw error;
    });
  }


  private async getEndpointUsageSwitch(): Promise<boolean> {
    return await this.appStorage.get("use-backup-endpoint");
  }

  private setEndpointUsageSwitch(endpointSwitch: boolean): Promise<any> {
    return this.appStorage.set("use-backup-endpoint", endpointSwitch);
  }

  private invokeSOAPClient(methodToInvoke, parameters, async, callback): any {
    return this.soapClient.invoke(this.apiEndpoint + APP_CONFIG.wsdlPath, methodToInvoke, parameters, async, callback);
  }

  private calculateEndpointSwitchValueForStorage() {
    // when the main api endpoint fails, switch to true to use the backup server the next time the app starts,
    // else switch to false and use the main server
    return this.apiEndpoint === APP_CONFIG.apiEndpoint;
  }
}
