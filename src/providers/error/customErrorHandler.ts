import {AlertController, Platform, ToastController} from "ionic-angular";
import {LoaderProvider} from "../loader/loader";
import {ErrorHandler, Injectable} from "@angular/core";
import {SplashScreen} from "@ionic-native/splash-screen";
import {Network} from "@ionic-native/network";
import Raven from 'raven-js';
import {APP_CONFIG} from "../../app/app-config"



@Injectable()
export class CustomErrorHandler implements ErrorHandler {

  private isConnectionLostAlertDisplayed: boolean = false;
  private isServerConnectionFailedAlertDisplayed: boolean = false;
  private initLocation: string;

  constructor(private loader: LoaderProvider,
              private toastCtrl: ToastController,
              private alertCtrl: AlertController,
              private splashScreen: SplashScreen,
              private network: Network,
              private platform: Platform) {
    // save initial window location to use when restarting the app
    this.initLocation = window.location.href;
    Raven
      .config(APP_CONFIG.sentryUrl,
        {release: APP_CONFIG.sentryProjectRelease,
          dataCallback: data => {

            if (data.culprit) {
              data.culprit = data.culprit.substring(data.culprit.lastIndexOf('/'));
            }

            let stacktrace = data.stacktrace ||
              data.exception &&
              data.exception.values[0].stacktrace;

            if (stacktrace) {
              stacktrace.frames.forEach(function (frame) {
                frame.filename = frame.filename.substring(frame.filename.lastIndexOf('/'));
              });
            }
          }
        })
      .install();
  }

  handleError(err: any): void {
    console.log(err);
    this.platform.ready().then(() => {
      this.loader.hideLoader();
      this.splashScreen.hide();
      this.presentError(err);
      Raven.captureException(err.originalError || err);
    });
  }

  presentError(err = undefined) {

    if (this.network.type === 'none') {
      if (!this.isConnectionLostAlertDisplayed) {
        this.isConnectionLostAlertDisplayed = true;
        let alert = this.alertCtrl.create({
          title: 'Connection lost!',
          message: 'It seems you don\'t have an internet connection. Try to connect and click restart',
          enableBackdropDismiss: false,
          buttons: [
            {
              text: 'Restart',
              handler: () => {
                this.loader.showLoader();
                this.restartApplication();
              }
            }
          ]
        });
        alert.present();
      }
    } else if (err && err.rejection && err.rejection.name === 'NetworkError') {
      if (!this.isServerConnectionFailedAlertDisplayed) {
        this.isServerConnectionFailedAlertDisplayed = true;
        let alert = this.alertCtrl.create({
          title: 'Couldn\'t connect to server!',
          message: 'Please try again by clicking the button below.',
          enableBackdropDismiss: false,
          buttons: [
            {
              text: 'Retry',
              handler: () => {
                this.loader.showLoader();
                this.restartApplication();
              }
            }
          ]
        });
        alert.present();
      }
    } else {
      //if not connectivity here change the error message
      let toast = this.toastCtrl.create({
        message: 'An error occurred!',
        duration: 4000,
        position: 'middle'
      });

      toast.present();
    }

  }

  private restartApplication() {
    window.location.href = this.initLocation;
  }
}
