import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {SearchResultsPage} from "./search-results";
import { TranslateModule } from '@ngx-translate/core';
import {ComponentsModule} from "../../components/components.module";
import {translationServiceConfig} from "../../app/translation-module-config";

@NgModule({
  declarations: [SearchResultsPage],
  imports: [IonicPageModule.forChild(SearchResultsPage),
    ComponentsModule,
    TranslateModule.forChild(translationServiceConfig
    )],
})
export class SearchResultsPagePageModule { }
