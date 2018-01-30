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
    let result = this.invokeSOAPClient(methodToInvoke, parameters, false);
    try {
      return JSON.parse(result);
    } catch(error) {
      this.storeEndpointSwitchValueAndDisplayErrorMessage(error);
      return [];
    }
  }

  public getResourceAsync(methodToInvoke, parameters): Promise<any> {
    return new Promise((resolve, reject) => {
      let result = this.invokeSOAPClient(methodToInvoke, parameters, false);
      if (result) {
        resolve(result);
      } else {
        reject();
      }
    }).then(result => {
      return JSON.parse(result as any);
    }).catch((error) => {
      this.storeEndpointSwitchValueAndDisplayErrorMessage(error);
      return [];
    });
  }


  private async getEndpointUsageSwitch(): Promise<boolean> {
    return await this.appStorage.get("use-backup-endpoint");
  }

  private setEndpointUsageSwitch(endpointSwitch: boolean): Promise<any> {
    return this.appStorage.set("use-backup-endpoint", endpointSwitch);
  }

  private invokeSOAPClient(methodToInvoke, parameters, async): any {
    return this.soapClient.invoke(this.apiEndpoint + APP_CONFIG.wsdlPath, methodToInvoke, parameters, async, null);
  }

  private storeEndpointSwitchValueAndDisplayErrorMessage(error) {
    // when the main api endpoint fails, switch to true to use the backup server the next time the app starts,
    // else switch to false and use the main server
    this.setEndpointUsageSwitch(this.apiEndpoint === APP_CONFIG.apiEndpoint).then(() => {
      this.errorHandler.handleError(error);
    });
  }
}
