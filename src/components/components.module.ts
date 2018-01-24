import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { AnchorComponent } from './anchor/anchor';
import { CommonModule } from '@angular/common';
import { ArticlesListComponent } from './articles-list/articles-list';
import {NetworkProvider} from "../providers/network/network";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
	declarations: [AnchorComponent,
    ArticlesListComponent],
	imports: [CommonModule, IonicModule, TranslateModule],
	exports: [AnchorComponent,
    ArticlesListComponent],
	providers: [NetworkProvider]
})

export class ComponentsModule {}
