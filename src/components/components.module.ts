import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { AnchorComponent } from './anchor/anchor';
import { CommonModule } from '@angular/common';
import { ArticlesListComponent } from './articles-list/articles-list';
import {NetworkProvider} from "../providers/network/network";
import {TranslateModule} from "@ngx-translate/core";
import { SourcesComponent } from './sources/sources';

@NgModule({
	declarations: [AnchorComponent,
    ArticlesListComponent,
    SourcesComponent],
	imports: [CommonModule, IonicModule, TranslateModule],
	exports: [AnchorComponent,
    ArticlesListComponent,
    SourcesComponent],
	providers: [NetworkProvider]
})

export class ComponentsModule {}
