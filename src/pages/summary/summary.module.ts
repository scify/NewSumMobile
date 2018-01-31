import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {SummaryPage} from "./summary";
import {ComponentsModule} from "../../components/components.module";
import {TranslateModule} from "@ngx-translate/core";
import {translationServiceConfig} from "../../app/translation-module-config";


@NgModule({
  declarations: [SummaryPage],
  imports: [IonicPageModule.forChild(SummaryPage),
    ComponentsModule,
    TranslateModule.forChild(translationServiceConfig)],
})
export class SummaryPageModule { }
