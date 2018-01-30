import {GoogleAnalytics} from "@ionic-native/google-analytics";
import {AlertController, ToastController} from "ionic-angular";
import {LoaderProvider} from "../loader/loader";
import {ErrorHandler, Injectable} from "@angular/core";
import {SplashScreen} from "@ionic-native/splash-screen";
import {Network} from "@ionic-native/network";

@Injectable()
export class CustomErrorHandler implements ErrorHandler {

  constructor(private ga: GoogleAnalytics,
              private loader: LoaderProvider,
              private toastCtrl: ToastController,
              private alertCtrl: AlertController,
              private splashScreen: SplashScreen,
              private network: Network) {}

  handleError(err: any): void {
    this.loader.hideLoader();
    this.splashScreen.hide();
    this.presentError(err);
    this.ga.trackException(err, false);
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
    } else if (err && err.name === 'NetworkError') {
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
