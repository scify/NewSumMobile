import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {AboutPage} from "./about";
import {ComponentsModule} from "../../components/components.module";
import {TranslateModule} from "@ngx-translate/core";
import {translationServiceConfig} from "../../app/translation-module-config";


@NgModule({
  declarations: [AboutPage],
  imports: [
    IonicPageModule.forChild(AboutPage),
    ComponentsModule,
    TranslateModule.forChild(translationServiceConfig)]
})
export class AboutPageModule { }
