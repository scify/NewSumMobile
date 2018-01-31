import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {SettingsPage} from "./settings";
import {ComponentsModule} from "../../components/components.module";
import {TranslateModule} from "@ngx-translate/core";
import {translationServiceConfig} from "../../app/translation-module-config";

@NgModule({
  declarations: [SettingsPage],
  imports: [
    IonicPageModule.forChild(SettingsPage),
    ComponentsModule,
    TranslateModule.forChild(translationServiceConfig)
  ],
})
export class SettingsPageModule { }
