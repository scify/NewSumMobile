import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {AlertController} from "ionic-angular";
import {APP_CONFIG} from "../../app/app-config";
import {Storage} from "@ionic/storage";
import {ApplicationSettingsProvider} from "../applicationSettings/applicationSettings";
import {ApplicationSettings} from "../../models/applicationSettings";


@Injectable()
export class NotificationsProvider {

  constructor(private http: HttpClient,
              private appStorage: Storage,
              private alert: AlertController,
              private applicationSettingsProvider: ApplicationSettingsProvider) {
  }

  startCheckingForNotifications() {
    window.setInterval(this.displayAnyNewNotifications.bind(this), 5 * 60 * 1000); //check every 5 minutes
  }


  announcementIsLessThan30DaysOld(lastModified) {
    let currentDate = (new Date()).getTime();
    let daysDiff = (currentDate - lastModified) / 24 * 60 * 60 * 1000;
    return daysDiff < 30;
  }

  checkIfItsAlreadyDisplayedAndShow(language, announcementDate, url) {
    this.appStorage.get(language + "notificationsDate").then((lastSavedDate) => {
      if (
        lastSavedDate === null || // if we dont have a notification saved
        lastSavedDate != announcementDate //or the the one we have is another one
      ) {
        this.http.get(url, {observe: 'response', "responseType": "text"}).subscribe(html => {
          this.appStorage.set(language + "notificationsDate", announcementDate);
          let doc = (new DOMParser()).parseFromString(html.body, 'text/html');
          let alert = this.alert.create({
            title: doc.querySelector("title").innerText,
            subTitle: doc.querySelector("body").innerHTML,
            buttons: [{text: 'Ok'}]
          });
          alert.present();
        });
      }
    });
  }

  displayAnyNewNotifications(): void {
    this.applicationSettingsProvider.getApplicationSettings()
      .then((applicationSettings: ApplicationSettings) => {
          let url = APP_CONFIG.notificationsURL + (applicationSettings.language == "EL" ? "GR.html" : "EN.html");
          this.http
            .head(url, {observe: 'response', "responseType": "text"})
            .subscribe(headResponse => {
              let announcementDate = Date.parse(headResponse.headers.get("Last-modified"));
              //if it was modified the past 1 month, it is elligible to be displayed
              if (this.announcementIsLessThan30DaysOld(announcementDate))
                this.checkIfItsAlreadyDisplayedAndShow(applicationSettings.language, announcementDate, url);
            });
        }
      );
  }
}
