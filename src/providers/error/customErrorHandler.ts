import {GoogleAnalytics} from "@ionic-native/google-analytics";
import {AlertController, Platform, ToastController} from "ionic-angular";
import {LoaderProvider} from "../loader/loader";
import {ErrorHandler, Injectable} from "@angular/core";
import {SplashScreen} from "@ionic-native/splash-screen";
import {Network} from "@ionic-native/network";
import Raven from 'raven-js';
import {APP_CONFIG} from "app/app-config"



@Injectable()
export class CustomErrorHandler implements ErrorHandler {

  constructor(private loader: LoaderProvider,
              private toastCtrl: ToastController,
              private alertCtrl: AlertController,
              private splashScreen: SplashScreen,
              private network: Network,
              private platform: Platform) {

    Raven
      .config(APP_CONFIG.sentryUrl)
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
      let alert = this.alertCtrl.create({
        title: 'Connection lost!',
        message: 'It seems you don\'t have an internet connection. Try to connect and click restart',
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
    } else if (err && err.rejection && err.rejection.name === 'NetworkError') {
      let alert = this.alertCtrl.create({
        title: 'Couldn\'t connect to server!',
        message: 'Please try again by clicking the button below.',
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
    window.location.reload();
  }
}
