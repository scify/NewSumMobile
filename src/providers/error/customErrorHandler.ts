import {GoogleAnalytics} from "@ionic-native/google-analytics";
import {IonicErrorHandler, ToastController} from "ionic-angular";
import {LoaderProvider} from "../loader/loader";
import {Injectable} from "@angular/core";

@Injectable()
export class CustomErrorHandler extends IonicErrorHandler {

  constructor(private ga: GoogleAnalytics,
              private loader: LoaderProvider,
              private toastCtrl: ToastController) {
    super();
  }

  handleError(err: any): void {
    //hide any open loaders
    this.loader.hideLoader();
    this.presentErrorToast();
    this.ga.trackException(err, false);
    super.handleError(err);
  }

  presentErrorToast() {
    let toast = this.toastCtrl.create({
      message: 'An error occurred!',
      duration: 8000,
      position: 'middle'
    });

    toast.present();
  }
}
